import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  socketPort: parseInt(process.env.SOCKET_PORT || '3001'),
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fronteira',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'user',
    password: process.env.PG_PASSWORD || 'password',
    database: process.env.PG_DATABASE || 'fronteira',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },

  // Terrain
  terrain: {
    width: parseInt(process.env.TERRAIN_WIDTH || '1024'),
    height: parseInt(process.env.TERRAIN_HEIGHT || '1024'),
    chunkSize: parseInt(process.env.CHUNK_SIZE || '64'),
    cacheTtl: parseInt(process.env.HEIGHTMAP_CACHE_TTL || '3600'),
  },

  // Terraforming
  terraform: {
    workers: parseInt(process.env.TERRAFORM_JOB_WORKERS || '4'),
    erosionIterations: parseInt(process.env.EROSION_ITERATIONS || '10'),
  },
};

export default config;
