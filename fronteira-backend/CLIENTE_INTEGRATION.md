# Integração Socket.io no Cliente Fronteira

Guia para conectar o jogo Fronteira ao backend multiplayer.

## 1️⃣ Adicionar Socket.io ao HTML

No `velho-oeste-3d.html`, antes do `<script>` principal:

```html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
```

## 2️⃣ Inicializar Conexão (no `<script>` do jogo)

No início da seção `/* ================= INIT GAME ================= */`, adicione:

```javascript
// ============= SOCKET.IO MULTIPLAYER =============
let socket = null;
let remotePlayer = new Map(); // {id -> {username, x, z, mesh}}

function initSocket(serverUrl = 'http://localhost:3000') {
  socket = io(serverUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('✅ Conectado ao backend');
    socket.emit('player:join', {
      username: playerName || 'Visitor',
      x: player.x,
      z: player.z,
    });
  });

  // Recebe lista de jogadores existentes
  socket.on('player:list', (players) => {
    for (const p of players) {
      spawnRemotePlayer(p.id, p.username, p.x, p.z);
    }
    console.log(`📊 ${players.length} jogadores online`);
  });

  // Novo jogador entrou
  socket.on('player:joined', (data) => {
    console.log(`👤 ${data.username} entrou`);
    spawnRemotePlayer(data.id, data.username, data.x, data.z);
  });

  // Outro jogador se moveu
  socket.on('player:moved', (data) => {
    const remote = remotePlayer.get(data.id);
    if (remote) {
      remote.x = data.x;
      remote.z = data.z;
      remote.mesh.position.set(data.x, groundY(data.x, data.z), data.z);
    }
  });

  // Jogador saiu
  socket.on('player:left', (data) => {
    const remote = remotePlayer.get(data.id);
    if (remote) {
      scene.remove(remote.mesh);
      remotePlayer.delete(data.id);
      console.log(`👋 Jogador saiu`);
    }
  });

  // Terreno foi modificado (por outro player)
  socket.on('terrain:modified', (data) => {
    if (data.playerId !== socket.id) {
      // Aplica mudança localmente também
      modifyTerrain(data.x, data.z, data.delta, data.radius);
      console.log(`🌍 ${data.playerId} terraformou em (${data.x}, ${data.z})`);
    }
  });

  // Animal novo (breeding, captura)
  socket.on('animal:spawned', (data) => {
    if (data.playerId !== socket.id) {
      // Spawn animal remotamente
      const a = spawnAnimal(data.species, data.x, data.z, { tamed: true });
      a.name = `${data.playerId.slice(0, 8)}'s ${data.species}`;
      console.log(`🐎 Novo animal de outro player`);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Desconectado do servidor');
  });
}

// Cria mesh de jogador remoto
function spawnRemotePlayer(id, username, x, z) {
  const g = new THREE.Group();
  
  // Corpo simples (cilindro = corpo + cabeça)
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.6, 8),
    new THREE.MeshLambertMaterial({color: 0x8a6a4a}));
  body.position.y = 0.8;
  g.add(body);
  
  // Cabeça
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8),
    new THREE.MeshLambertMaterial({color: 0xc9b59a}));
  head.position.y = 2;
  g.add(head);
  
  // Label nome
  const label = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(makeNameCanvas(username)),
  }));
  label.position.y = 2.8;
  g.add(label);
  
  g.position.set(x, groundY(x, z), z);
  scene.add(g);
  
  remotePlayer.set(id, {
    id, username, x, z, mesh: g
  });
}

// Canvas para label nome
function makeNameCanvas(text) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f4f0de';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, 128, 40);
  return c;
}
```

## 3️⃣ Sincronizar Movimento do Player

No `animate()`, dentro do loop principal, adicione:

```javascript
// ============= SYNC MOVIMENTO (a cada 100ms) =============
let lastSyncTime = 0;
function updateGameLoop(dt) {
  // ... código existente ...
  
  // Sincroniza posição a cada 100ms
  if (socket && simT - lastSyncTime > 0.1) {
    socket.emit('player:move', { x: player.x, z: player.z });
    lastSyncTime = simT;
  }
  
  // Atualiza meshes remotos
  for (const [id, remote] of remotePlayer) {
    // Caminhada simples (bobbing)
    const bob = Math.sin(simT * 3) * 0.05;
    remote.mesh.position.y = groundY(remote.x, remote.z) + bob;
  }
}
```

## 4️⃣ Terraforming (Opcional)

Se quiser terraforming multiplayer, adicione ao performTarget:

```javascript
// Quando player cava/levanta terra:
if (terraformAction) {
  const pt = aimGround(100);
  const deltaH = isRaising ? 0.3 : -0.3;
  
  // Envia para servidor
  socket?.emit('terraform:modify', {
    x: pt.x,
    z: pt.z,
    delta: deltaH,
    radius: 2
  });
  
  // Aplica localmente de imediato (feedback instant)
  modifyTerrain(pt.x, pt.z, deltaH, 2);
}
```

## 5️⃣ Sincronizar Animais (Breeding)

Ao nascer filhote ou capturar animal:

```javascript
if (baby) {
  socket?.emit('animal:spawn', {
    species: baby.sp,
    x: baby.x,
    z: baby.z,
    genetics: {
      vel: baby.gen.vel,
      forca: baby.gen.forca,
      vida: baby.gen.vida,
      stam: baby.gen.stam,
      peso: baby.gen.peso,
      leite: baby.gen.leite
    }
  });
}
```

## 6️⃣ Variáveis de Ambiente

Criar `.env` no mesmo nível do HTML ou usar parâmetro na URL:

```javascript
// No inicio do <script>, antes de initSocket():
const SERVER_URL = new URL(location.href).searchParams.get('server') || 'http://localhost:3000';
const playerName = new URL(location.href).searchParams.get('player') || 'Player' + Math.floor(Math.random()*1000);

// Chama na inicialização:
initSocket(SERVER_URL);
```

Uso:
```
https://seu-site.com/jogo.html?server=https://backend.com&player=Cunha
```

## 7️⃣ Teste Local

1. **Start do backend:**
```bash
cd fronteira-backend
npm install
npm run dev
```

2. **Abrir jogo em 2 abas:**
```
http://localhost:8000/fronteira-velho-oeste-3d.html?player=Player1
http://localhost:8000/fronteira-velho-oeste-3d.html?player=Player2
```

3. **Ver sincronização:**
- P1 se move → aparece em P2
- P1 ativa terraforming → P2 vê mudança
- P1 faz breeding → filhote aparece em P2

## ⚠️ Notas

- **Cada player roda seu próprio jogo** (client-side simulation)
- **Servidor apenas sincroniza** estado (não é autoridade total, típico de casual games)
- **Terraforming precisa de validação** no servidor (anti-cheat)
- **Latência**: 50-200ms típico (aceito para casual)
- **Escalabilidade**: socket.io suporta ~10k conexões por servidor

---

Pronto! Seu Fronteira agora é multiplayer! 🎮
