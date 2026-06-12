import { Pool, QueryResult } from 'pg';
import config from './config';

const pool = new Pool({
  connectionString: config.database.url,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query in ${duration}ms`, text.substring(0, 60));
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function initDatabase() {
  try {
    // Criar extensão UUID
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Tabela de heightmap (terreno persistido)
    await query(`
      CREATE TABLE IF NOT EXISTS heightmap (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        chunk_x INT NOT NULL,
        chunk_z INT NOT NULL,
        heights BYTEA NOT NULL,
        version INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(chunk_x, chunk_z)
      )
    `);

    // Tabela de mudanças (histórico de terraforming)
    await query(`
      CREATE TABLE IF NOT EXISTS terrain_changes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        player_id UUID NOT NULL,
        chunk_x INT NOT NULL,
        chunk_z INT NOT NULL,
        delta FLOAT NOT NULL,
        radius FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de jogadores
    await query(`
      CREATE TABLE IF NOT EXISTS players (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) UNIQUE NOT NULL,
        x FLOAT DEFAULT 0,
        z FLOAT DEFAULT 0,
        inventory JSON DEFAULT '{}',
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de animais persistidos
    await query(`
      CREATE TABLE IF NOT EXISTS animals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        player_id UUID REFERENCES players(id),
        species VARCHAR(30) NOT NULL,
        name VARCHAR(50),
        x FLOAT NOT NULL,
        z FLOAT NOT NULL,
        genetics JSON NOT NULL,
        sex VARCHAR(1),
        adult BOOLEAN DEFAULT false,
        tamed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
      )
    `);

    // Índices para performance
    await query(`CREATE INDEX IF NOT EXISTS idx_heightmap_chunks ON heightmap(chunk_x, chunk_z)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_terrain_changes_player ON terrain_changes(player_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_animals_player ON animals(player_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_players_username ON players(username)`);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function closeDatabase() {
  await pool.end();
  console.log('Database connection closed');
}

export default pool;
