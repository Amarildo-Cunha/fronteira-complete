---
name: fronteira-game
description: Jogo 3D Velho Oeste "Fronteira" em HTML5 + Three.js r128 (arquivo único 2.3k+ linhas). Cobre game loop, sistemas de gameplay (breeding genético, terraforming, crafting, construções, animais), controles (WASD/mouse), HUD/UI draggable, multiplayer Socket.io integration e otimizações visuais. Use esta skill sempre que o usuário mencionar: Fronteira game, Three.js gameplay, velho oeste 3D, breeding animals, terraforming client, crafting tree, construções (casas/cercas), hotbar, multiplayer integration, ou qualquer modificação no arquivo HTML principal do jogo.
---

# Fronteira Game — Three.js Velho Oeste 3D

Jogo 3D sandbox em arquivo único HTML5 + Three.js r128, com sistemas complexos de gameplay, multijogador e persistência de terreno.

## 📋 Visão Geral

**Arquivo**: `velho-oeste-3d.html` (v1.7, ~2.3k linhas)  
**Engine**: Three.js r128 (WebGL)  
**Stack**: Vanilla JavaScript + HTML/CSS  
**Multiplayer**: Socket.io (integrado)  
**Deploy**: GitHub Pages ou servidor HTTP local

---

## 🎮 Sistemas de Gameplay (v1.7)

### 1. Breeding Genético (v1.7)
```javascript
// 6 atributos por animal
gen = {
  vel: 1-100,        // velocidade sprint
  forca: 1-100,      // dano/força
  vida: 1-100,       // HP max
  stam: 1-100,       // stamina (sprint)
  peso: 1-100,       // peso (movimento)
  leite: 1-100       // produção (gado)
}

// Fluxo: laçar fêmea → chegar perto de macho → menu "💞 Cruzar"
// Validações: mesma espécie, sexo oposto, dist<14m, fêmea não prenha
// Resultado: filhote herda genes + mutação ±8 por atributo
// Crescimento: adult=0 até 240s, depois adult=1 e escala 1.0x
```

### 2. Árvores Crescendo (Wurm-style, v1.7)
```javascript
// Plantio: mudinha (escala 0.18) cresce ao longo do tempo
plantTree(x, z, genParent)
  ├─ age=0, escala gradual
  ├─ Coletor: pega mudinha → inv['muda']._treeGen capturada
  └─ Re-plantar: genCross(genMae, ...) com speed/density ±8

// Resultado: floresta dinâmica com propriedades herdáveis
```

### 3. Terraforming (v1.7)
```javascript
// Modo: F = ativa terraform mode
// Ação: clique = gaussiana suave 2D (raio ~2-3m)
// Delta: -0.5 (cava) ou +0.3 (levanta)
// Rotação: R = 45° incremento, G = snap grade 1m
// Validação: altura -20 a +150m

// Persistência: sincroniza com backend via Socket.io
socket.emit('terraform:modify', {x, z, delta, radius})
```

### 4. Crafting & Construções (v1.7)
```javascript
// Recipes: 200+ (madeira, tábuas, móveis, etc)
// Construções: casas, cercas, fogueiras, canteiros, placas
// UI: verde (tem ingrediente) / vermelho (falta)
// Rotação build: R (45°), G (snap)
// Telhado: gableRoof(w, d, h, mat) com overhang real

// Exemplo: casa 4x4
craft 'madeira' 20 → 'tábua' 40 → 'parede' → 'porta' → 'telhado'
```

### 5. Hotbar Drag-Drop (v1.6+)
```javascript
// 8 slots fixos (não muda automaticamente)
// Drag from inventory → hotbar slot
// Double-click slot → remove
// Inicializa com equipados

// Implementação: data-ikey, ondrop, dataTransfer
```

### 6. Captura & Abate (v1.6)
```javascript
// Capturable: galinha, coelho, porco, ovelha
// "Capturar" → 55% + doma% success
// Inv: galinha_viva, coelho_vivo, etc
// Botão 🔪 Abater → drops automáticos

LIVE map: {
  galinha_viva: [['carne_crua', 2], ['pena', 3]],
  ...
}
```

### 7. Animais & Comportamento
```javascript
// Espécies: cavalo, ovelha, bisão, lobo, galinha, coelho, porco, vaca, boi
// Stats: HP, energia, fome, sanidade (opcionais)
// IA simples: pastar, dormir, fugir (lobo/bisão enraged)
// Montar: Shift/E para subir, Q para descer
// Lead (corda): animal segue sem domar, soltar = libera

// Comportamento específico:
Lobo: enraged se HP>25% (persegue 1.3x speed)
Bisão: enraged se HP>25% (persegue 1.5x speed)
Cavalo: montável, sprint com stamina
Gado: produz leite (genética)
```

---

## 🖱️ Controles

| Ação | Tecla/Botão |
|------|-----------|
| **Movimento** | WASD (relativo câmera) |
| **Câmera** | Mouse esquerdo drag (zona morta 7px) |
| **Menu** | Clique direito em target |
| **Desmontar** | Q |
| **Terraforming** | F (ativa), clique |
| **Rotação build** | R (45°), G (snap) |
| **Hotbar** | 1-8 (ou clique) |
| **Menu** | ESC (close all) |
| **Zoom** | Mouse wheel (scroll) |

---

## 🎨 HUD & UI (v1.7)

```
┌─────────────────────────────────┐
│ #hud (draggable)                │
│  ├─ VIDA (red bar)              │
│  ├─ FOME (orange bar)           │
│  ├─ Inventário (grid)           │
│  ├─ Hotbar (8 slots)            │
│  └─ Skills panel                │
│                                 │
│ #minimapWrap (draggable)        │
│  ├─ Minimapa (canvas)           │
│  └─ Coordenadas                 │
│                                 │
│ #breedbar (pink, ao acasalar)  │
│ #mountbars (montaria + fôlego) │
│ #notif (notificações)           │
│ #tooltips (item info, 0.5s)     │
└─────────────────────────────────┘
```

**Tooltips**: 18 itens com notas (ITEM_NOTES map)  
**Colors**: Dark navy `#060b18`, neon accents, green farm, orange crafting

---

## 🗺️ Terreno & Mundo (v1.2+)

```javascript
// Geração:
groundMesh = PlaneGeometry(2048×2048, 256×256 verts)
  ├─ Vertex colors: smooth 2D noise (2 oitavas)
  ├─ Anti-tiling: macro texture sampling (0.0937×)
  └─ Ripas, fios, flores texturizados (512px)

// Instâncias:
210 arbustos (random variants)
3400 tufos grass (scattered)
Ruas com sulcos + bordas esfumadas
Água refletida (Plane refraction, se ativo)

// Colisão simples: raycast to ground, getHeight(x, z)
```

---

## 🏗️ Construções (v1.2+)

### Casa (gableRoof)
```javascript
gableRoof(width, depth, height, material)
  ├─ Overhang real (não só visual)
  ├─ Cume (ridge)
  └─ Empenas (ShapeGeometry)
```

### Cerca (split-rail)
```javascript
cerca(x, z, length, rot)
  ├─ Mourões (±0.1 variation)
  └─ Varas CylinderGeometry
```

### Fogueira
```javascript
fogueira(x, z)
  ├─ 8 pedras DodecahedronGeometry (círculo)
  └─ 4 troncos cruzados
```

### Canteiro
```javascript
canteiro(x, z)
  ├─ Sulcos de terra
  └─ Moldura de tábuas
```

### Placa
```javascript
placa(x, z, text)
  ├─ Tabuleta pendurada (braço)
  └─ Traços de texto
```

---

## 🐴 NPCs (v1.3+)

```javascript
// 45% bigode, 35% suspensórios
// Ação: npcTick_mount() 
//   → procura animal domado
//   → monta e cavalga pra casa
//   → npcMounted=true
//   → cooldown 180s

// Tipos: vaqueiro, comerciante, mineiro (skin variants)
```

---

## 💾 Inventário & Equip

```javascript
_eq = [item_id, item_id, ...]       // 6 slots equipados
inv[key] = {q: count, ...}          // Stacks genéricos
inv['muda'] = {_treeGen: {...}}     // Mudinha com genes
inv['galinha_viva'] = {q: 3}        // Stack de vivos

// Equip: drag to hotbar, clique para equipar
// Uso: ícone + descrição, tooltips ao hover 0.5s
```

---

## 🔄 Game Loop (animate)

```javascript
function animate() {
  requestAnimationFrame(animate)
  
  dt = (now - lastTime) / 1000
  simT += dt
  
  // Input
  handleKeyboard(dt)
  handleMouseInteraction()
  
  // Logic
  updatePlayer(dt)
  updateAnimals(dt)
  updateNPCs(dt)
  updateTerrain(dt)
  updateWeather(dt)
  
  // Render
  renderer.render(scene, camera)
  updateHUD()
  updateMinimap()
  
  // Sync multiplayer
  if (simT - lastSync > 0.1) {
    socket?.emit('player:move', {x: player.x, z: player.z})
    lastSync = simT
  }
}
```

**FPS Target**: 60 (capped by requestAnimationFrame)  
**Update rate**: ~20ms per frame (50 Hz)  
**Sync**: 100ms (10 Hz) para multiplayer

---

## 🧬 Genética & Mutação

```javascript
function genRand(species) {
  // Randomiza 5-6 atributos
  return {
    vel: rnd(30, 70),
    forca: rnd(40, 80),
    vida: rnd(50, 100),
    stam: rnd(60, 90),
    peso: rnd(70, 100),
    leite: rnd(10, 50) // se gado
  }
}

function genCross(gA, gB, criacao) {
  // 50/50 dominância + mutação ±8
  const resultado = {
    vel: (gA.vel + gB.vel) / 2 + rnd(-8, 8),
    // ... resto dos atributos
  }
  return resultado
}

// Expressão: filho herda traits + varia com ambiente
```

---

## 🌳 Skills & Progression (XP)

```javascript
skills = {
  coleta: {lvl, xp, max},       // catar, vasculhar
  criacao: {lvl, xp, max},      // breeding, montar
  construccao: {lvl, xp, max},  // craft, colocar
  combate: {lvl, xp, max},      // atacar, matar
  agricultura: {lvl, xp, max},  // plantar, colher
  florestamento: {lvl, xp, max} // plantar árvores
}

// Ganho: ação específica → +XP
// Level up: notificação visual + alerta
```

---

## 📡 Multiplayer Socket.io

### Integração no Cliente

```javascript
const socket = io('http://backend-ip:3000');

socket.on('connect', () => {
  socket.emit('player:join', {
    username: playerName,
    x: player.x,
    z: player.z
  });
});

// Receber jogadores remotos
socket.on('player:list', (players) => {
  players.forEach(p => spawnRemotePlayer(p));
});

socket.on('player:moved', (data) => {
  remotePlayer.get(data.id).position = {x: data.x, z: data.z};
});

// Terreno sincronizado
socket.on('terrain:modified', (data) => {
  modifyTerrainLocal(data.x, data.z, data.delta, data.radius);
});

// Animais sincronizados
socket.on('animal:spawned', (data) => {
  spawnAnimal(data.species, data.x, data.z, data.genetics);
});
```

---

## 🔍 Otimizações (v1.7)

| Técnica | Implementação |
|---------|--------------|
| **LOD** | Arbustos visíveis dentro de raio, distantes instância |
| **Instancing** | InstancedMesh para grass, arbustos |
| **Culling** | Frustum culling built-in Three.js |
| **Compressão terreno** | Backend gzip, client descomprime |
| **Draw calls** | Batch por material, MergeGeometry onde possível |
| **Memoria** | Lazy load assets, dispose quando fora de view |

**Performance**: 60 FPS em GPU média (RTX 2060+)

---

## 🐛 Debug & Console

```javascript
// Valores globais para debug
window.player           // Avatar principal
window.animals          // Mapa de animais
window.scene            // Three.js scene
window.camera           // Camera
window.remotePlayer     // Map de players remotos
window.socket           // Socket.io

// Comandos úteis no console
player.hp = 100                    // Heal
spawnAnimal('cavalo', 0, 0)       // Spawn animal
modifyTerrain(0, 0, -1, 5)        // Cavar
socket.emit('player:move', {x: 100, z: 100})  // Teleport
```

---

## 📁 Estrutura do HTML

```html
<html>
  <head>
    <style>
      /* HUD, canvas, CSS vars */
    </style>
  </head>
  <body>
    <canvas id="gameCanvas"></canvas>
    
    <div id="hud">...</div>
    <div id="minimapWrap">...</div>
    <div id="menu">...</div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
    
    <script>
      // Game code (~2300 linhas)
      // ├─ Init
      // ├─ Game loop
      // ├─ Systems (animals, terrain, etc)
      // ├─ UI
      // ├─ Multiplayer
      // └─ Utils
    </script>
  </body>
</html>
```

---

## 🎯 Melhorias Futuras

- [ ] Persistência localStorage (save/load)
- [ ] Quests NPCs
- [ ] Água dinâmica (erosão, flow)
- [ ] Combate PvP
- [ ] Bandidos com IA
- [ ] Aldeias geradas proceduralmente
- [ ] Weather system (chuva, neve)
- [ ] Dia/noite cíclico
- [ ] Minigames (pesca, caça)

---

## 📚 Ver também

- **GitHub**: `Amarildo-Cunha/fronteira-game`
- **Deploy**: GitHub Pages ou servidor HTTP
- **Backend**: fronteira-backend skill
- **SKILL.md**: Criado em v1.7, atualiza com cada feature

---

## 🔗 Referências Rápidas

**Arquivo principal**: `velho-oeste-3d.html` (v1.7, 2.3k linhas)  
**Engine**: Three.js r128 (WebGL)  
**Multiplayer**: Socket.io 4.6+  
**Colisão**: Raycasting simples  
**Física**: Gravidade básica (Y velocity)  

Tudo em **arquivo único** — sem imports, puro vanilla JS! 🚀
