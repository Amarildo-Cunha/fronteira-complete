import { createClient, RedisClient } from 'redis';
import { query } from './database';
import config from './config';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const redis = createClient(config.redis);

export interface Chunk {
  x: number;
  z: number;
  heights: Float32Array; // altura de cada ponto no chunk
}

const CHUNK_SIZE = config.terrain.chunkSize; // 64x64 pontos por chunk
const HEIGHT_BYTES = Float32Array.BYTES_PER_ELEMENT * (CHUNK_SIZE * CHUNK_SIZE);

/**
 * Carrega um chunk de terreno (do cache ou banco)
 */
export async function loadChunk(chunkX: number, chunkZ: number): Promise<Chunk> {
  // Tenta cache Redis primeiro
  const cacheKey = `chunk:${chunkX}:${chunkZ}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    const decompressed = await gunzip(Buffer.from(cached, 'base64'));
    const heights = new Float32Array(decompressed.buffer);
    return { x: chunkX, z: chunkZ, heights };
  }

  // Busca no banco de dados
  const result = await query(
    `SELECT heights FROM heightmap WHERE chunk_x = $1 AND chunk_z = $2`,
    [chunkX, chunkZ]
  );

  if (result.rows.length > 0) {
    const decompressed = await gunzip(result.rows[0].heights);
    const heights = new Float32Array(decompressed.buffer);
    
    // Recarrega no cache
    await redis.setex(cacheKey, config.terrain.cacheTtl, Buffer.from(decompressed).toString('base64'));
    
    return { x: chunkX, z: chunkZ, heights };
  }

  // Gera novo chunk (com ruído inicial)
  return generateNewChunk(chunkX, chunkZ);
}

/**
 * Salva um chunk modificado
 */
export async function saveChunk(chunk: Chunk): Promise<void> {
  const buffer = Buffer.from(chunk.heights.buffer);
  const compressed = await gzip(buffer);

  // Salva no banco
  await query(
    `INSERT INTO heightmap (chunk_x, chunk_z, heights, version)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (chunk_x, chunk_z)
     DO UPDATE SET heights = $3, version = version + 1, updated_at = CURRENT_TIMESTAMP`,
    [chunk.x, chunk.z, compressed]
  );

  // Invalida cache
  const cacheKey = `chunk:${chunk.x}:${chunk.z}`;
  await redis.del(cacheKey);
}

/**
 * Modifica altura em um local (terraforming simples)
 */
export async function modifyTerrain(
  worldX: number,
  worldZ: number,
  deltaHeight: number,
  radius: number
): Promise<void> {
  // Calcula chunk afetado
  const chunkX = Math.floor(worldX / CHUNK_SIZE);
  const chunkZ = Math.floor(worldZ / CHUNK_SIZE);

  const chunk = await loadChunk(chunkX, chunkZ);
  
  // Índice local dentro do chunk
  const localX = Math.floor((worldX % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE);
  const localZ = Math.floor((worldZ % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE);

  // Aplica gaussiana suave ao redor do ponto
  for (let dz = -Math.ceil(radius); dz <= Math.ceil(radius); dz++) {
    for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
      const px = localX + dx;
      const pz = localZ + dz;

      if (px >= 0 && px < CHUNK_SIZE && pz >= 0 && pz < CHUNK_SIZE) {
        const dist = Math.sqrt(dx * dx + dz * dz);
        const falloff = Math.max(0, 1 - (dist / radius)); // gaussiana simples
        const idx = pz * CHUNK_SIZE + px;

        chunk.heights[idx] = Math.max(-20, Math.min(150, chunk.heights[idx] + deltaHeight * falloff));
      }
    }
  }

  await saveChunk(chunk);
}

/**
 * Gera novo chunk com ruído Perlin simples (ou altura base)
 */
function generateNewChunk(chunkX: number, chunkZ: number): Chunk {
  const heights = new Float32Array(CHUNK_SIZE * CHUNK_SIZE);
  
  for (let z = 0; z < CHUNK_SIZE; z++) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      // Ruído simples: combina altitude base com ruído local
      const worldX = chunkX * CHUNK_SIZE + x;
      const worldZ = chunkZ * CHUNK_SIZE + z;
      
      // Altura base (pode ser carregada do frontend, aqui é flat 0)
      const base = 0;
      
      // Ruído Perlin 2D simplificado (usa hash)
      const noise = Math.sin(worldX * 0.1) * Math.cos(worldZ * 0.1) * 5;
      
      heights[z * CHUNK_SIZE + x] = base + noise;
    }
  }

  return { x: chunkX, z: chunkZ, heights };
}

/**
 * Obtém altura em um ponto específico (interpolada entre chunks)
 */
export async function getHeight(worldX: number, worldZ: number): Promise<number> {
  const chunkX = Math.floor(worldX / CHUNK_SIZE);
  const chunkZ = Math.floor(worldZ / CHUNK_SIZE);
  
  const chunk = await loadChunk(chunkX, chunkZ);
  
  const localX = (worldX % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
  const localZ = (worldZ % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
  
  const ix = Math.floor(localX);
  const iz = Math.floor(localZ);
  const fx = localX - ix;
  const fz = localZ - iz;
  
  // Interpolação bilinear
  const idx00 = iz * CHUNK_SIZE + ix;
  const idx10 = iz * CHUNK_SIZE + ((ix + 1) % CHUNK_SIZE);
  const idx01 = ((iz + 1) % CHUNK_SIZE) * CHUNK_SIZE + ix;
  const idx11 = ((iz + 1) % CHUNK_SIZE) * CHUNK_SIZE + ((ix + 1) % CHUNK_SIZE);
  
  const h00 = chunk.heights[idx00];
  const h10 = chunk.heights[idx10];
  const h01 = chunk.heights[idx01];
  const h11 = chunk.heights[idx11];
  
  const h0 = h00 * (1 - fx) + h10 * fx;
  const h1 = h01 * (1 - fx) + h11 * fx;
  
  return h0 * (1 - fz) + h1 * fz;
}

/**
 * Exporta uma região do terreno (para sincronizar com client)
 */
export async function exportRegion(
  minX: number,
  minZ: number,
  maxX: number,
  maxZ: number
): Promise<Record<string, Float32Array>> {
  const minChunkX = Math.floor(minX / CHUNK_SIZE);
  const minChunkZ = Math.floor(minZ / CHUNK_SIZE);
  const maxChunkX = Math.floor(maxX / CHUNK_SIZE);
  const maxChunkZ = Math.floor(maxZ / CHUNK_SIZE);

  const regions: Record<string, Float32Array> = {};

  for (let cx = minChunkX; cx <= maxChunkX; cx++) {
    for (let cz = minChunkZ; cz <= maxChunkZ; cz++) {
      const chunk = await loadChunk(cx, cz);
      regions[`${cx},${cz}`] = chunk.heights;
    }
  }

  return regions;
}

export async function initTerrain() {
  await redis.connect();
  console.log('✅ Terrain system initialized');
}

export default {
  loadChunk,
  saveChunk,
  modifyTerrain,
  getHeight,
  exportRegion,
  initTerrain,
};
