---
name: fronteira-backend
description: Backend multiplayer em Node.js + TypeScript para o jogo Fronteira. Cobre arquitetura Socket.io, PostgreSQL + Redis, terraforming persistente, sincronização multiplayer, deploy AWS EC2, PM2, Docker e integração com cliente. Use esta skill sempre que o usuário mencionar: backend Fronteira, Socket.io multiplayer, terraforming persistente, deploy em AWS, RDS PostgreSQL, ElastiCache Redis, PM2, ou integração backend-game. Também use quando discussão envolve sincronização de dados (players, animais, terreno) entre múltiplos clientes ou persistência de mundo.
---

# Fronteira Backend — Multiplayer Architecture

Backend profissional para o jogo Fronteira v1.7+, com suporte a terraforming persistente, multiplayer real-time e scaling até ~10k players.

## 🏗️ Stack & Tecnologias

| Componente | Tecnologia | Versão | Porta |
|-----------|-----------|--------|-------|
| **Backend** | Node.js + Express | 18+ | 3000 |
| **Real-time** | Socket.io | 4.6+ | WS/3000 |
| **Database** | PostgreSQL | 15+ | 5432 |
| **Cache** | Redis | 7+ | 6379 |
| **Process Manager** | PM2 | latest | — |
| **Containerização** | Docker Compose | — | — |

---

## 📁 Estrutura de Código

```
fronteira-backend/
├── src/
│   ├── config.ts           # Variáveis de ambiente centralizadas
│   ├── server.ts           # Express + Socket.io principal (2.0.0+)
│   ├── database.ts         # Pool PostgreSQL + schema initialization
│   ├── terrain.ts          # Lógica heightmap chunks + compressão gzip
│   ├── migrate.ts          # Migrations automáticas (init database)
│   └── seed.ts             # Dados iniciais de teste
├── dist/                   # Output compilado (após npm run build)
├── package.json            # Dependencies
├── tsconfig.json           # Config TypeScript
├── .env.example            # Template de configuração
├── docker-compose.yml      # PostgreSQL + Redis stack
├── README.md               # Documentação completa
├── CLIENTE_INTEGRATION.md  # Guia Socket.io para cliente
└── BACKEND_SETUP.md        # Quick start (5 min)
```

---

## 🔧 Configuração (ENV)

```bash
# .env template (copiar para .env e editar)
NODE_ENV=production
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fronteira_dev
PG_HOST=localhost
PG_PORT=5432
PG_USER=usuario
PG_PASSWORD=senha
PG_DATABASE=fronteira_dev

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Terrain
TERRAIN_WIDTH=1024
TERRAIN_HEIGHT=1024
CHUNK_SIZE=64
HEIGHTMAP_CACHE_TTL=3600
```

---

## 📡 Socket.io API

### Client → Server Events

#### `player:join`
```javascript
socket.emit('player:join', {
  username: string,
  x: number,
  z: number
});
```
Jogador entra no servidor. Broadcast para others: `player:joined`

#### `player:move`
```javascript
socket.emit('player:move', { 
  x: number, 
  z: number 
});
```
Sincroniza movimento (~100ms). Broadcast: `player:moved`

#### `terraform:modify`
```javascript
socket.emit('terraform:modify', {
  x: number,           // centro
  z: number,           // centro
  delta: number,       // altura (-2 a +2)
  radius: number       // área (1-5)
});
```
Cava/levanta terreno. Validação no servidor. Broadcast: `terrain:modified`

#### `animal:spawn`
```javascript
socket.emit('animal:spawn', {
  species: string,           // 'cavalo', 'ovelha', etc
  x: number, z: number,
  genetics: {
    vel: number,             // 1-100
    forca: number,
    vida: number,
    stam: number,
    peso: number,
    leite: number            // opcional (gado)
  }
});
```
Novo animal (breeding, captura). Broadcast: `animal:spawned`

#### `chat:message`
```javascript
socket.emit('chat:message', text: string);
```
Mensagem de chat compartilhada.

---

### Server → Client Events

#### `player:list`
```javascript
socket.on('player:list', (players: Array) => {
  // { id, username, x, z }[]
  // Enviado ao conectar com lista de outros jogadores
});
```

#### `player:joined`
```javascript
socket.on('player:joined', (data) => {
  // { id, username, x, z }
  // Novo jogador entrou (broadcast)
});
```

#### `player:moved`
```javascript
socket.on('player:moved', (data) => {
  // { id, x, z }
  // Outro jogador se moveu
});
```

#### `player:left`
```javascript
socket.on('player:left', (data) => {
  // { id }
  // Jogador desconectou
});
```

#### `terrain:modified`
```javascript
socket.on('terrain:modified', (data) => {
  // { x, z, delta, radius, playerId }
  // Terreno foi alterado por outro player
});
```

#### `animal:spawned`
```javascript
socket.on('animal:spawned', (data) => {
  // { id, playerId, species, x, z, genetics }
  // Novo animal remoto
});
```

---

## 🗄️ PostgreSQL Schema

### `heightmap` (chunks persistidos)
```sql
chunk_x INT, chunk_z INT          -- Chave composta
heights BYTEA                      -- Float32Array gzip
version INT                        -- Para invalidação
updated_at TIMESTAMP
```

### `terrain_changes` (log)
```sql
player_id UUID
chunk_x, chunk_z INT
delta FLOAT, radius FLOAT
timestamp TIMESTAMP
```

### `players` (sincronização)
```sql
id UUID PRIMARY KEY
username VARCHAR(50) UNIQUE
x FLOAT, z FLOAT
inventory JSON
last_seen TIMESTAMP
```

### `animals` (breeding)
```sql
id UUID PRIMARY KEY
player_id UUID (FK)
species VARCHAR(30)
x FLOAT, z FLOAT
genetics JSON                      -- {vel, forca, vida, stam, peso, leite}
sex VARCHAR(1)
adult BOOLEAN
tamed BOOLEAN
created_at TIMESTAMP
```

---

## 🚀 Deployment AWS

### Opção 1: EC2 t3.micro (Barato, começar)

```bash
# EC2 Amazon Linux 2023 + Docker
# Security Group: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (backend)

ssh -i FT.pem ec2-user@seu-ip-elastico

# Setup automático (ver script em BACKEND_SETUP.md)
docker-compose up -d
npm install && npm run migrate
pm2 start dist/server.js --name fronteira-backend
```

**Custo**: ~$10/mês (ou grátis free tier 12 meses)  
**Capacity**: ~200-500 players

### Opção 2: EC2 + RDS + ElastiCache (Produção)

```
EC2 t3.small (Node.js) — $20/mês
RDS PostgreSQL db.t3.micro — $15/mês
ElastiCache Redis cache.t3.micro — $15/mês
Total: ~$50/mês
```

**Capacity**: ~5k-10k players

---

## 🔄 Arquitetura Terraforming

```
Cliente (Three.js)
  ↓
Clica para cavar/levantar
  ↓
modifyTerrain(x, z, delta, radius)
  ↓
socket.emit('terraform:modify', {...})
  ↓
Backend (Node.js)
  ├─ Valida delta (-2 a +2)
  ├─ Carrega chunk de Redis/PostgreSQL
  ├─ Aplica gaussiana 2D
  ├─ Salva em PostgreSQL (gzip)
  └─ Invalida cache Redis
  ↓
io.emit('terrain:modified', {...})
  ↓
TODOS os clientes recebem mudança
  ↓
Aplicam localmente (feedback instant)
```

---

## 🎮 Integração com Cliente (Fronteira Game)

### Instalação Socket.io no HTML

```html
<!-- No <head> do velho-oeste-3d.html -->
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>

<script>
const socket = io('http://seu-backend-ip:3000');

socket.on('connect', () => {
  console.log('✅ Conectado ao backend');
  socket.emit('player:join', {
    username: playerName,
    x: player.x,
    z: player.z
  });
});

// Sincronizar movimento a cada 100ms
setInterval(() => {
  socket?.emit('player:move', { x: player.x, z: player.z });
}, 100);

// Receber mudanças de terreno de outros
socket.on('terrain:modified', (data) => {
  modifyTerrainLocal(data.x, data.z, data.delta, data.radius);
});
</script>
```

---

## 🔍 Troubleshooting

### "FATAL: role does not exist"
```bash
sudo -u postgres createuser fronteira
sudo -u postgres createdb fronteira_dev
```

### "Connection refused on port 3000"
```bash
pm2 list                # Ver status
pm2 logs fronteira      # Ver erros
npm run build           # Recompilar TypeScript
pm2 restart all         # Reiniciar
```

### "Redis connection failed"
```bash
# Docker
docker-compose up redis -d

# Local
redis-server
```

### "CORS/Socket.io não conecta do cliente"
```bash
# Verificar Security Group (AWS) permite porta 3000
# Verificar firewall local permite porta 3000
curl http://seu-ip:3000/api/health
```

---

## 📊 Monitoramento

```bash
# Ver status PM2
pm2 list
pm2 logs fronteira-backend --lines 100

# Verificar banco
psql -U usuario -d fronteira_dev -c "SELECT COUNT(*) FROM players;"

# Ver Redis
redis-cli PING

# Verificar chunks em cache
redis-cli KEYS "chunk:*" | wc -l
```

---

## 🎯 Performance & Scaling

| Métrica | Valor |
|---------|-------|
| **Latência rede** | 50-200ms típico |
| **Sync rate** | 10 Hz (100ms) |
| **Chunk size** | 64×64 (4KB gzip) |
| **Cache TTL** | 1h padrão |
| **Players/servidor** | ~10k máximo |

Para escalar além: load balancing, sharding por region, BullMQ para jobs pesados.

---

## 📚 Ver também

- **CLIENTE_INTEGRATION.md** — Como integrar Socket.io no jogo
- **BACKEND_SETUP.md** — Setup rápido (5 min)
- **README.md** — Documentação completa com exemplos

---

## 🔗 Próximos passos

1. **Deploy AWS**: BACKEND_SETUP.md
2. **Integração cliente**: CLIENTE_INTEGRATION.md
3. **Erosão/água**: Rust + WASM workers
4. **Load balancing**: Docker Swarm ou Kubernetes
