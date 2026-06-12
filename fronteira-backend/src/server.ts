import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import cors from 'cors';
import config from './config';
import { initDatabase, closeDatabase } from './database';
import { initTerrain, modifyTerrain, exportRegion } from './terrain';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

// Estado de jogadores conectados
interface Player {
  id: string;
  username: string;
  x: number;
  z: number;
  socket: Socket;
  lastUpdate: number;
}

const players = new Map<string, Player>();

// ============== ROTAS HTTP ==============

/**
 * GET /api/health — verificar saúde do servidor
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    players: players.size,
  });
});

/**
 * GET /api/terrain/region?minX=0&minZ=0&maxX=64&maxZ=64
 * Exporta terreno para o cliente (para sincronização inicial)
 */
app.get('/api/terrain/region', async (req, res) => {
  try {
    const { minX, minZ, maxX, maxZ } = req.query;
    const region = await exportRegion(
      parseInt(minX as string) || 0,
      parseInt(minZ as string) || 0,
      parseInt(maxX as string) || 64,
      parseInt(maxZ as string) || 64
    );
    res.json({ success: true, region });
  } catch (error) {
    console.error('Terrain export error:', error);
    res.status(500).json({ error: 'Failed to export terrain' });
  }
});

// ============== SOCKET.IO EVENTOS ==============

io.on('connection', (socket: Socket) => {
  console.log(`🔗 Player connected: ${socket.id}`);

  /**
   * player:join — jogador entra no servidor
   */
  socket.on('player:join', async (data: { username: string; x: number; z: number }) => {
    try {
      const player: Player = {
        id: socket.id,
        username: data.username,
        x: data.x,
        z: data.z,
        socket,
        lastUpdate: Date.now(),
      };

      players.set(socket.id, player);

      console.log(`👤 ${data.username} joined (${players.size} online)`);

      // Notifica outros jogadores
      socket.broadcast.emit('player:joined', {
        id: socket.id,
        username: data.username,
        x: data.x,
        z: data.z,
      });

      // Envia lista de jogadores existentes para o novo jogador
      const otherPlayers = Array.from(players.values())
        .filter((p) => p.id !== socket.id)
        .map((p) => ({ id: p.id, username: p.username, x: p.x, z: p.z }));

      socket.emit('player:list', otherPlayers);
    } catch (error) {
      console.error('Join error:', error);
      socket.emit('error', { message: 'Failed to join' });
    }
  });

  /**
   * player:move — sincroniza movimento do jogador
   */
  socket.on('player:move', (data: { x: number; z: number }) => {
    const player = players.get(socket.id);
    if (!player) return;

    player.x = data.x;
    player.z = data.z;
    player.lastUpdate = Date.now();

    // Broadcast para todos (ou implementar frustum culling depois)
    socket.broadcast.emit('player:moved', {
      id: socket.id,
      x: data.x,
      z: data.z,
    });
  });

  /**
   * terraform:modify — terraforming do cliente
   */
  socket.on('terraform:modify', async (data: { x: number; z: number; delta: number; radius: number }) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      // Validação básica
      if (Math.abs(data.delta) > 2) {
        socket.emit('error', { message: 'Terraforming delta muito grande' });
        return;
      }

      // Aplica mudança
      await modifyTerrain(data.x, data.z, data.delta, data.radius);

      // Notifica todos os jogadores da mudança
      io.emit('terrain:modified', {
        x: data.x,
        z: data.z,
        delta: data.delta,
        radius: data.radius,
        playerId: socket.id,
      });

      console.log(`🌍 Player ${player.username} terraformed at (${data.x}, ${data.z})`);
    } catch (error) {
      console.error('Terraform error:', error);
      socket.emit('error', { message: 'Terraforming failed' });
    }
  });

  /**
   * animal:spawn — sincroniza animal novo (breeding, captura, etc)
   */
  socket.on('animal:spawn', async (data: any) => {
    const player = players.get(socket.id);
    if (!player) return;

    // Aqui você persistiria o animal no banco
    // await saveAnimal({ playerId: player.id, ...data });

    io.emit('animal:spawned', {
      id: Math.random().toString(36),
      playerId: socket.id,
      species: data.species,
      x: data.x,
      z: data.z,
      genetics: data.genetics,
    });
  });

  /**
   * chat:message — chat simples (opcional)
   */
  socket.on('chat:message', (text: string) => {
    const player = players.get(socket.id);
    if (!player) return;

    io.emit('chat:message', {
      username: player.username,
      text,
      timestamp: new Date(),
    });
  });

  /**
   * Desconexão
   */
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      console.log(`👋 ${player.username} disconnected`);
      players.delete(socket.id);

      io.emit('player:left', { id: socket.id });
    }
  });
});

// ============== STARTUP ==============

async function start() {
  try {
    // Inicializa database e terrain
    await initDatabase();
    await initTerrain();

    // Inicia servidor
    httpServer.listen(config.port, () => {
      console.log(`\n🚀 Fronteira Backend running on port ${config.port}`);
      console.log(`📡 Socket.io listening on ws://localhost:${config.port}`);
      console.log(`🌍 Terrain system active\n`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n⏹️  Shutting down...');
      httpServer.close();
      await closeDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export { io, players };
