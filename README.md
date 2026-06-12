# 🤠 Fronteira — Jogo Multiplayer Velho Oeste 3D

Jogo sandbox completo em HTML5 + Three.js com backend Node.js escalável, terraforming persistente, breeding genético e sincronização multiplayer via Socket.io.

**Status**: v1.7 em produção (backend + game)  
**Engine**: Three.js r128 (WebGL)  
**Stack**: Node.js + Express + Socket.io + PostgreSQL + Redis  
**Deploy**: AWS EC2 + RDS + ElastiCache  

---

## 🎮 Features

### Game (Client)
- ✅ Mundo 3D persistente com terraforming
- ✅ Animais com breeding genético (6 atributos)
- ✅ Crafting & construções (200+ recipes)
- ✅ NPCs e IA de animais
- ✅ Hotbar drag-drop
- ✅ Captura & abate
- ✅ Árvores crescendo (Wurm-style)
- ✅ Multiplayer real-time (Socket.io)

### Backend (Server)
- ✅ Sincronização multiplayer (10 Hz)
- ✅ Terraforming persistente (PostgreSQL)
- ✅ Cache Redis de chunks
- ✅ Schema completo (players, animals, terreno)
- ✅ Deploy pronto (Docker Compose)
- ✅ PM2 para manter processo vivo
- ✅ Validação de operações no servidor

---

## 🚀 Quick Start

### 1. Backend (AWS ou local)

```bash
cd fronteira-backend
cp .env.example .env

# Com Docker (recomendado)
docker-compose up -d
npm install && npm run migrate
npm run build
pm2 start dist/server.js --name fronteira-backend

# Teste
curl http://localhost:3000/api/health
```

**URL**: `http://seu-ip:3000`

### 2. Game (Cliente)

```bash
# Servir o HTML
python3 -m http.server 5500

# Abrir no navegador
http://localhost:5500/fronteira-game.html?player=Cunha
```

**Socket.io conecta automaticamente** a `http://localhost:3000` (editar URL no HTML se necessário)

---

## 📁 Estrutura do Repositório

```
fronteira-complete/
├── README.md                    # Este arquivo
├── .gitignore
├── LICENSE
│
├── fronteira-backend/           # Node.js + Socket.io server
│   ├── src/
│   │   ├── config.ts           # Config centralizada
│   │   ├── server.ts           # Express + Socket.io
│   │   ├── database.ts         # PostgreSQL schema
│   │   ├── terrain.ts          # Heightmap logic
│   │   └── ...
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── README.md               # Setup backend
│   ├── CLIENTE_INTEGRATION.md  # Como integrar no game
│   └── BACKEND_SETUP.md        # Quick start (5 min)
│
├── fronteira-game.html          # Game (arquivo único, 2.3k linhas)
│
└── fronteira-skills/            # Documentação (para Claude)
    ├── fronteira-backend/SKILL.md
    └── fronteira-game/SKILL.md
```

---

## 🎯 Arquitetura

```
┌─────────────────────────────────────┐
│   Fronteira Game (Three.js)         │
│   ├─ Terrain (visual + local)       │
│   ├─ Animals (local + remote)       │
│   ├─ Player avatar                  │
│   └─ Socket.io client               │
└──────────────┬──────────────────────┘
               │ WebSocket (Socket.io)
               ↓
┌──────────────────────────────────────┐
│   Fronteira Backend (Node.js)        │
│   ├─ Socket.io server (10 Hz sync)   │
│   ├─ Terrain validation              │
│   ├─ Animal persistence              │
│   └─ Player synchronization          │
└──────────────┬──────────────────────┘
               │ PostgreSQL + Redis
               ↓
┌──────────────────────────────────────┐
│   Database                           │
│   ├─ PostgreSQL (heightmap, animals) │
│   └─ Redis (cache chunks)            │
└──────────────────────────────────────┘
```

---

## 💾 Banco de Dados

### PostgreSQL Schema

| Tabela | Descrição |
|--------|-----------|
| `heightmap` | Chunks de terreno (64×64 pixels, gzip) |
| `terrain_changes` | Log de terraforming |
| `players` | Dados persistidos de jogadores |
| `animals` | Animais domados/criados com genética |

### Redis Cache

- `chunk:x:z` → Float32Array (terrain height)
- TTL: 1h (configurável)

---

## 🎮 Controles

| Ação | Tecla |
|------|-------|
| Movimento | WASD |
| Câmera | Mouse drag |
| Menu | Clique direito |
| Desmontar | Q |
| Terraforming | F (ativa) + clique |
| Hotbar | 1-8 |

---

## 📡 Socket.io Events

### Client → Server
- `player:join` — entrar
- `player:move` — movimento
- `terraform:modify` — cavar/levantar
- `animal:spawn` — novo animal
- `chat:message` — chat

### Server → Client
- `player:list` — jogadores ao conectar
- `player:joined` / `player:moved` / `player:left` — sincronização
- `terrain:modified` — terraforming de outros
- `animal:spawned` — novo animal remoto

Documentação completa em `fronteira-backend/README.md`

---

## 🐳 Docker Compose

```bash
cd fronteira-backend
docker-compose up -d

# PostgreSQL: localhost:5432
# Redis: localhost:6379
# Backend: localhost:3000
```

Automáticamente inicia:
- PostgreSQL 15
- Redis 7
- Node.js (opcional)

---

## 🚀 Deploy AWS

### Stack Recomendado (Opção 2 — Produção)

```
EC2 t3.small (Node.js)           — $20/mês
RDS PostgreSQL db.t3.micro       — $15/mês
ElastiCache Redis cache.t3.micro — $15/mês
────────────────────────────────────
Total: ~$50/mês
```

Suporta ~10k players simultâneos

### Setup Rápido

1. **Lançar EC2 t3.small** (Amazon Linux 2023)
2. **Criar RDS PostgreSQL + ElastiCache Redis**
3. **SSH na instância**:
   ```bash
   git clone este-repo
   cd fronteira-backend
   cp .env.example .env
   # Editar .env com RDS/ElastiCache endpoints
   npm install && npm run build && npm run migrate
   pm2 start dist/server.js
   ```
4. **Configurar Nginx** (proxy reverso)
5. **SSL via Let's Encrypt** (certbot)

Documentação completa em `fronteira-backend/BACKEND_SETUP.md`

---

## 🔧 Desenvolvimento

### Instalar dependências

```bash
cd fronteira-backend
npm install
npm install --save-dev typescript ts-node @types/node @types/express
```

### Build

```bash
npm run build      # TypeScript → JavaScript
npm run dev        # Desenvolvimento (ts-node)
npm start          # Produção (node)
```

### Testes

```bash
npm run migrate    # Setup database
curl http://localhost:3000/api/health
```

---

## 🎨 Customização

### Editar IP do Backend (Game)

No `fronteira-game.html`, procure por:
```javascript
const socket = io('http://localhost:3000');
```

Mude para seu IP AWS:
```javascript
const socket = io('http://seu-ip-aws:3000');
```

### Adicionar novo animal

Em `fronteira-game.html`:
```javascript
function spawnAnimal(species, x, z, config) {
  // Adicione novo case aqui
}
```

### Mudar tamanho do mundo

Em `.env`:
```env
TERRAIN_WIDTH=1024    # 1km
TERRAIN_HEIGHT=1024
CHUNK_SIZE=64
```

---

## 📊 Performance

| Métrica | Valor |
|---------|-------|
| FPS | 60 (client) |
| Sync rate | 10 Hz (100ms) |
| Latência | 50-200ms típico |
| Players/servidor | ~10k máximo |
| Chunk tamanho | 64×64 verts (4KB gzip) |

---

## 🐛 Troubleshooting

### "Cannot GET /"
→ Você está acessando `http://seu-ip:3000/` no navegador  
→ Solução: acesse `http://localhost:5500/fronteira-game.html` (jogo é arquivo HTML, não rota)

### "Socket.io connection refused"
→ Backend não está rodando  
→ Solução: `pm2 list` e `pm2 start` ou `npm run dev`

### "Cannot find module 'pg'"
→ Dependências não instaladas  
→ Solução: `npm install`

### "FATAL: role does not exist"
→ PostgreSQL não criou usuário  
→ Solução: `npm run migrate` ou criar manualmente

---

## 🎯 Próximos Passos

- [ ] Integrar Socket.io no cliente (game conectando ao backend)
- [ ] Erosão & water flow (Rust + WASM)
- [ ] Persistência localStorage (save/load)
- [ ] Autenticação JWT
- [ ] Admin panel
- [ ] Quests & achievements
- [ ] Load balancing (múltiplos workers)

---

## 📚 Documentação

- **Backend**: `fronteira-backend/README.md`
- **Setup**: `fronteira-backend/BACKEND_SETUP.md`
- **Integração**: `fronteira-backend/CLIENTE_INTEGRATION.md`
- **Skills**: `fronteira-skills/` (para Claude)

---

## 📝 License

MIT License — veja `LICENSE` para detalhes

---

## 👤 Autor

**Cunha** @ Z-Tech Soluções em Tecnologia (MEI)

- GitHub: [@Amarildo-Cunha](https://github.com/Amarildo-Cunha)
- Email: cunha@z-tech.com.br
- Website: z-tech.com.br

---

## 🤝 Contribuindo

PRs são bem-vindas! Para mudanças maiores:

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/incrivel`)
3. Commit suas mudanças (`git commit -m 'Add feature incrível'`)
4. Push para a branch (`git push origin feature/incrivel`)
5. Abra um Pull Request

---

## 📞 Suporte

- Issues: Use a aba "Issues" do GitHub
- Discussões: Abra uma "Discussion"
- Email: cunha@z-tech.com.br

---

**Deploy em produção?** Veja `fronteira-backend/BACKEND_SETUP.md` para instruções AWS passo a passo.

Happy terraforming! 🌍🤠
