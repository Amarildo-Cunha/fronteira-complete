# Fronteira Backend — Sistema Multiplayer com Terraforming

Backend Node.js + TypeScript para o jogo Fronteira, com suporte a:
- ✅ Terraforming persistente (modificação de altura do terreno)
- ✅ Sincronização multiplayer em tempo real (Socket.io)
- ✅ Persistência de mundo em PostgreSQL
- ✅ Cache Redis para performance
- ✅ Tracking de jogadores e animais

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker + Docker Compose (opcional, para dev rápido)

### Instalação Local

```bash
cd fronteira-backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Servidor roda em `http://localhost:3000`  
Socket.io em `ws://localhost:3000/socket.io`

### Com Docker

```bash
docker-compose up -d
npm run dev
```

Isto levanta PostgreSQL + Redis + Node automaticamente.

---

## 📡 API & Socket.io

### REST API

**GET /api/health**
```json
{ "status": "ok", "uptime": 123.45, "players": 3 }
```

**GET /api/terrain/region?minX=0&minZ=0&maxX=64&maxZ=64**
```json
{
  "success": true,
  "region": {
    "0,0": [Float32Array de 4096 alturas],
    "1,0": [...]
  }
}
```

### Socket.io Events

**Client → Server**

`player:join` — entrar no servidor
```javascript
socket.emit('player:join', {
  username: 'Player1',
  x: 100,
  z: 200
});
```

`player:move` — atualizar posição (enviado a cada tick)
```javascript
socket.emit('player:move', { x: 102, z: 201 });
```

`terraform:modify` — modificar terreno
```javascript
socket.emit('terraform:modify', {
  x: 100,
  z: 200,
  delta: -0.5,  // abaixar 0.5m
  radius: 3     // área de efeito
});
```

`animal:spawn` — novo animal (breeding, captura, etc)
```javascript
socket.emit('animal:spawn', {
  species: 'cavalo',
  x: 105,
  z: 205,
  genetics: { vel: 65, forca: 50, vida: 60, stam: 70, peso: 80 }
});
```

**Server → Client**

`player:joined` — novo jogador entrou
```javascript
socket.on('player:joined', (data) => {
  // { id, username, x, z }
});
```

`player:list` — lista de jogadores ao conectar
```javascript
socket.on('player:list', (players) => {
  // array de { id, username, x, z }
});
```

`player:moved` — outro jogador se moveu
```javascript
socket.on('player:moved', (data) => {
  // { id, x, z }
});
```

`terrain:modified` — terreno foi alterado
```javascript
socket.on('terrain:modified', (data) => {
  // { x, z, delta, radius, playerId }
  // Aplicar mudança no cliente também (para UI responsiva)
});
```

`animal:spawned` — novo animal apareceu
```javascript
socket.on('animal:spawned', (data) => {
  // { id, playerId, species, x, z, genetics }
});
```

---

## 🔧 Integração com Frontend (Fronteira)

### Exemplo: Inicializar Socket.io no Cliente

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('connect', () => {
  console.log('✅ Conectado ao backend');
  socket.emit('player:join', {
    username: playerName,
    x: player.x,
    z: player.z,
  });
});

socket.on('terrain:modified', (data) => {
  // Recebe mudanças de terraforming de outros players
  modifyTerrain(data.x, data.z, data.delta, data.radius);
});
```

### Exemplo: Terraforming (do Fronteira)

```typescript
// No performTarget do jogo, ao cavar/levantar:
if (terraformMode) {
  const pt = aimGround(100);
  
  // Envia para servidor
  socket.emit('terraform:modify', {
    x: pt.x,
    z: pt.z,
    delta: -0.5, // cava
    radius: 2
  });
  
  // Aplica visualmente de imediato (feedback instant)
  modifyTerrainLocal(pt.x, pt.z, -0.5, 2);
}
```

### Exemplo: Animal Breeding (sincronizar novo filhote)

```typescript
// Ao nascer filhote:
const baby = spawnAnimal(a.sp, x, z, { tamed: true, baby: true, gen: g });

// Notifica servidor
socket.emit('animal:spawn', {
  species: a.sp,
  x: baby.x,
  z: baby.z,
  genetics: g,
  parentIds: [a.id, mate.id],
});

// Servidor retorna em animal:spawned para sincronizar com outros players
```

---

## 📊 Estrutura do Banco

### Tabelas

**heightmap** — armazena chunks de terreno comprimidos
```sql
chunk_x, chunk_z | heights (BYTEA gzip) | version | updated_at
```

**terrain_changes** — log de modificações (para analytics/undo)
```sql
player_id | chunk_x, chunk_z | delta | radius | timestamp
```

**players** — dados persistidos de jogadores
```sql
id | username | x, z | inventory (JSON) | last_seen
```

**animals** — animais domados/criados
```sql
id | player_id | species | name | x, z | genetics (JSON) | sex | adult | tamed
```

---

## 🎯 Performance & Escalabilidade

### Caching
- Chunks de terreno em **Redis** (TTL 1h)
- Miss em Redis → busca PostgreSQL → recarrega cache

### Chunks
- Terreno dividido em **64×64 chunks**
- Compressão **gzip** para storage (4KB típico por chunk)
- Cliente sincroniza apenas chunks visíveis (frustum culling)

### Terraforming
- Modificações diretas em memória
- Salvo em PostgreSQL com compressão
- Job queue (BullMQ, não implementado ainda) para erosão/água pesada

### Conexões
- Socket.io com reconexão automática
- Keep-alive a cada 30s
- Timeout de desconexão: 60s

---

## 🚢 Deploy

### Vercel + Railway

```bash
# Railway: PostgreSQL + Redis + Node.js
# Vercel: Frontend estático

# Backend railway.json
{
  "builder": "nixpacks",
  "nixPackages": ["nodejs", "postgresql"],
  "startCommand": "npm run build && npm start"
}

# Frontend: build estático, deploy no Vercel
```

### Self-hosted (AWS EC2 / VPS)

```bash
# Ubuntu 22.04
sudo apt update && apt install nodejs postgresql redis-server

# Clone e setup
git clone <seu-repo>
cd fronteira-backend
npm install && npm run migrate
npm run build

# PM2 para manter alive
npm i -g pm2
pm2 start dist/server.js --name fronteira-backend
pm2 save
```

---

## 📝 Próximos Passos (TODO)

- [ ] BullMQ jobs para erosão/water flow (Rust/WASM backend)
- [ ] Chunk streaming (LOD para grandes distâncias)
- [ ] Persistência de animais (salvar banco após breeding)
- [ ] Autenticação JWT
- [ ] Admin panel (reset terreno, ban players)
- [ ] Metrics/logging (DataDog, Sentry)
- [ ] Load balancing (múltiplos workers)

---

## 📧 Suporte

Perguntas? Issues no GitHub ou contato direto.

Happy terraforming! 🌍
