<!-- Socket.io Configuration for Fronteira Game -->
<!-- Adicione isto no fronteira-game.html antes do </head> -->

<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>

<script>
// ============= FRONTEIRA MULTIPLAYER CONFIG =============

// Detectar servidor da URL ou usar default
const urlParams = new URLSearchParams(window.location.search);
const SERVER_URL = urlParams.get('server') || 'http://localhost:3000';
const PLAYER_NAME = urlParams.get('player') || ('Player' + Math.floor(Math.random() * 10000));

console.log(`🎮 Servidor: ${SERVER_URL}`);
console.log(`👤 Jogador: ${PLAYER_NAME}`);

// ============= SOCKET.IO CLIENT =============

let socket = null;
let remotePlayer = new Map();

function initSocket() {
  try {
    socket = io(SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // ===== CONEXÃO =====
    socket.on('connect', () => {
      console.log('✅ Conectado ao backend!');
      
      socket.emit('player:join', {
        username: PLAYER_NAME,
        x: 0,
        z: 0
      });
    });

    socket.on('connect_error', (error) => {
      console.warn('⚠️ Erro de conexão:', error.message);
    });

    // ===== RECEBER JOGADORES =====
    socket.on('player:list', (players) => {
      console.log(`📊 ${players.length} jogadores online:`, players);
      players.forEach(p => {
        if (p.username !== PLAYER_NAME) {
          spawnRemotePlayer(p.id, p.username, p.x, p.z);
        }
      });
    });

    socket.on('player:joined', (data) => {
      console.log(`👤 ${data.username} entrou!`);
      if (data.username !== PLAYER_NAME) {
        spawnRemotePlayer(data.id, data.username, data.x, data.z);
      }
    });

    socket.on('player:moved', (data) => {
      const remote = remotePlayer.get(data.id);
      if (remote) {
        remote.x = data.x;
        remote.z = data.z;
        // Atualizar posição no Three.js
        if (remote.mesh) {
          remote.mesh.position.set(data.x, 0, data.z);
        }
      }
    });

    socket.on('player:left', (data) => {
      const remote = remotePlayer.get(data.id);
      if (remote && remote.mesh) {
        // scene.remove(remote.mesh); // Descomentar quando tiver scene disponível
        remotePlayer.delete(data.id);
        console.log('👋 Jogador saiu');
      }
    });

    // ===== TERRAFORMING =====
    socket.on('terrain:modified', (data) => {
      console.log(`🌍 Terreno modificado em (${data.x}, ${data.z})`);
      // Aplicar mudança localmente também
      // modifyTerrainLocal(data.x, data.z, data.delta, data.radius);
    });

    // ===== ANIMAIS =====
    socket.on('animal:spawned', (data) => {
      console.log(`🐎 Novo animal: ${data.species}`);
      // Spawn animal remoto
    });

    // ===== DISCONNECTION =====
    socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar Socket.io:', error);
  }
}

// ============= FUNÇÕES DE SYNC =============

function emitPlayerMove(x, z) {
  if (socket && socket.connected) {
    socket.emit('player:move', { x, z });
  }
}

function emitTerrainModify(x, z, delta, radius) {
  if (socket && socket.connected) {
    socket.emit('terraform:modify', {
      x, z, delta, radius
    });
  }
}

function emitAnimalSpawn(species, x, z, genetics) {
  if (socket && socket.connected) {
    socket.emit('animal:spawn', {
      species, x, z, genetics
    });
  }
}

function emitChat(message) {
  if (socket && socket.connected) {
    socket.emit('chat:message', message);
  }
}

// ============= REMOTE PLAYERS (Three.js) =============

function spawnRemotePlayer(id, username, x, z) {
  // Placeholder: quando integrar com Three.js, criar mesh aqui
  remotePlayer.set(id, {
    id, username, x, z,
    mesh: null // Será preenchido quando tiver Three.js
  });
  
  console.log(`✅ Player remoto: ${username}`);
}

// ============= INICIALIZAR =============

// Iniciar Socket.io quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando Fronteira Multiplayer...');
  initSocket();
  
  // Sincronizar movimento a cada 100ms
  setInterval(() => {
    if (socket && socket.connected && window.player) {
      emitPlayerMove(window.player.x, window.player.z);
    }
  }, 100);
});

// Expor globalmente para debug
window.socket = socket;
window.remotePlayer = remotePlayer;
window.emitPlayerMove = emitPlayerMove;
window.emitTerrainModify = emitTerrainModify;
window.emitAnimalSpawn = emitAnimalSpawn;
window.emitChat = emitChat;

</script>
