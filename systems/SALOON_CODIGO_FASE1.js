// 🍺 SISTEMA SALOON — Implementação Fase 1
// Cole isto no seu fronteira-game.html

// ============= ARMAZENAMENTO =============

const SALOONS = new Map();
let saloon_aberta = null;
let poker_em_andamento = null;

// ============= ESTRUTURA SALOON =============

const SALOON_TEMPLATE = {
  'golden_nugget': {
    nome: '🍺 The Golden Nugget Saloon',
    posição: {x: 0, y: 0, z: 0},  // Será colocado pelo jogador
    tamanho: {x: 8, z: 12, y: 5},
    recipe: {
      'tábua': 200,
      'vidro': 40,
      'madeira': 100,
      'pregos': 200,
      'ouro': 50
    },
    tempo: 120,
    durabilidade: 500,
    
    // Preços
    preços: {
      'whiskey': 5,
      'cerveja': 3,
      'vinho': 4,
      'shot_ouro': 25,
      'quarto_hora': 20,
      'quarto_noite': 100
    },
    
    // NPCs FIXOS
    npcs: [
      {
        nome: 'Buck',
        profissão: 'Barman',
        diálogo: 'Que vai ser, parceiro?',
        posição: {x: 1, z: 10},
        função: 'barman'
      },
      {
        nome: 'Sally',
        profissão: 'Garçonete',
        diálogo: 'Oi, querido! Quer algo?',
        posição: {x: 2, z: 5},
        função: 'garçonete'
      },
      {
        nome: 'Red Liz',
        profissão: 'Prostituta',
        diálogo: 'Procurando diversão, cowboy?',
        posição: {x: 1, z: 8},
        função: 'prostituta'
      },
      {
        nome: 'The Pianist',
        profissão: 'Músico',
        diálogo: 'Toco pra quem dança...',
        posição: {x: 4, z: 1},
        função: 'músico'
      }
    ]
  }
};

// ============= MENU SALOON =============

function abrirSaloon(saloon_id) {
  const saloon = SALOONS.get(saloon_id);
  if (!saloon) return `Saloon não existe`;
  
  saloon_aberta = saloon;
  
  const html = `
    <div style="background: linear-gradient(to bottom, #8B4513, #654321); color: #FFD700; padding: 20px; border: 3px solid #DAA520; font-family: 'Courier New';">
      
      <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
        🍺 ${saloon.nome} 🍺
        <br/>
        <small style="font-size: 12px; color: #FFA500;">♪ Som de música ao fundo ♪</small>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        
        <!-- BEBIDAS -->
        <div style="border: 2px solid #DAA520; padding: 10px;">
          <h3 style="color: #FFD700; text-align: center;">🍷 BEBIDAS</h3>
          ${criarBotaoBebida('whiskey', 'Whiskey', 5, 'recupera 30 stamina')}
          ${criarBotaoBebida('cerveja', 'Cerveja', 3, 'recupera 20 stamina')}
          ${criarBotaoBebida('vinho', 'Vinho', 4, 'recupera 15 stamina')}
          ${criarBotaoBebida('shot_ouro', 'Shot de Ouro', 25, 'recupera 50 stamina!')}
        </div>
        
        <!-- ATIVIDADES -->
        <div style="border: 2px solid #DAA520; padding: 10px;">
          <h3 style="color: #FFD700; text-align: center;">🎮 ATIVIDADES</h3>
          <button onclick="iniciarPoker()" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer; font-weight: bold;">
            ♠️ POKER (Aposta dinheiro!)
          </button>
          <button onclick="dançarComGarçonete()" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            💃 Dançar
          </button>
          <button onclick="ouvirBoatos()" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            👂 Ouvir Boatos
          </button>
          <button onclick="alugarQuarto()" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            🛏️ Alugar Quarto
          </button>
          <button onclick="contratar()" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            💼 Contratar (Quests)
          </button>
        </div>
        
      </div>
      
      <!-- NPCs -->
      <div style="border: 2px solid #DAA520; padding: 10px; margin-bottom: 20px;">
        <h3 style="color: #FFD700;">👥 PESSOAS NO SALOON</h3>
        ${saloon.npcs.map(npc => `
          <div style="background: #1a1a1a; padding: 8px; margin: 5px 0; border-left: 3px solid #FFD700;">
            <strong style="color: #FFA500;">${npc.nome}</strong> (${npc.profissão})
            <br/>
            <em style="color: #AAA; font-size: 12px;">"${npc.diálogo}"</em>
          </div>
        `).join('')}
      </div>
      
      <!-- FECHAR -->
      <button onclick="fecharSaloon()" style="width: 100%; padding: 10px; background: #8B0000; border: 2px solid #FFD700; color: #FFD700; font-weight: bold; cursor: pointer; font-size: 14px;">
        ❌ SAIR DO SALOON
      </button>
      
      <div style="margin-top: 15px; font-size: 11px; color: #AAA; border-top: 1px solid #DAA520; padding-top: 10px;">
        💵 Saldo: ${inv['moeda']?.q || 0} moeda
        <br/>
        Ambiente: Fumaça de charuto, som de piano, risos de jogadores
      </div>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function criarBotaoBebida(tipo, nome, preço, efeito) {
  return `
    <button onclick="beber('${tipo}')" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer; font-size: 12px;">
      ${nome} - $${preço}
      <br/>
      <small>${efeito}</small>
    </button>
  `;
}

function fecharSaloon() {
  saloon_aberta = null;
  document.getElementById('menuPanel').innerHTML = '';
  notif('Você saiu do saloon');
}

// ============= ATIVIDADES SALOON =============

function beber(tipo) {
  if (!saloon_aberta) return;
  
  const preços = saloon_aberta.preços;
  const custo = preços[tipo];
  
  if ((inv['moeda']?.q || 0) < custo) {
    return notif(`❌ Não tem dinheiro! Precisa $${custo}`);
  }
  
  // Remover dinheiro
  inv['moeda'].q -= custo;
  
  // Efeitos
  const efeitos = {
    'whiskey': {stamina: 30, embriaguez: 0.5},
    'cerveja': {stamina: 20, embriaguez: 0.3},
    'vinho': {stamina: 15, embriaguez: 0.4},
    'shot_ouro': {stamina: 50, embriaguez: 1.0, visão_turva: true}
  };
  
  const efeito = efeitos[tipo];
  player.stamina = Math.min(100, player.stamina + efeito.stamina);
  
  if (efeito.embriaguez > Math.random()) {
    notif(`🍺 ${tipo.toUpperCase()}! Visão fica turva...`);
    // TODO: Efeito visual de embriaguez
  } else {
    notif(`✅ Bebeu ${tipo}! Stamina +${efeito.stamina}`);
  }
  
  abrirSaloon(saloon_aberta.id);
}

// ============= POKER =============

function iniciarPoker() {
  if (!saloon_aberta) return;
  
  const html = `
    <div style="background: #1a1a1a; color: #FFD700; padding: 20px; border: 3px solid #228B22;">
      
      <h2 style="text-align: center;">♠️ TEXAS HOLD'EM POKER ♠️</h2>
      
      <div style="background: #0a4d0a; padding: 15px; margin: 10px 0; border: 2px solid #228B22;">
        <h3>Mesa de Poker - 6 jogadores</h3>
        <div style="margin: 10px 0;">
          <strong>Sua Mão:</strong> <span id="sua_mao" style="color: #FF6347;">🃏 🃏 (ainda não recebida)</span>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
        
        <div style="border: 1px solid #FFD700; padding: 10px;">
          <h4>Aposta Mínima:</h4>
          <input type="number" id="aposta" value="50" min="10" max="1000" style="width: 100%; padding: 8px; background: #2a2a2a; color: #FFD700; border: 1px solid #FFD700;">
        </div>
        
        <div style="border: 1px solid #FFD700; padding: 10px;">
          <h4>Seu Saldo:</h4>
          <div style="font-size: 18px; font-weight: bold;">$${inv['moeda']?.q || 0}</div>
        </div>
        
      </div>
      
      <div style="background: #2a2a2a; padding: 15px; margin: 10px 0; border: 1px solid #FFD700; text-align: center;">
        <h4>⚠️ ATENÇÃO!</h4>
        <p>Jogo com NPC. Risco de perder dinheiro!</p>
        <p>NPCs usam bluff e all-in.</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button onclick="jogarPoker()" style="padding: 10px; background: #228B22; border: 2px solid #FFD700; color: #FFD700; font-weight: bold; cursor: pointer; font-size: 14px;">
          ✅ JOGAR
        </button>
        <button onclick="abrirSaloon(saloon_aberta.id)" style="padding: 10px; background: #8B0000; border: 2px solid #FFD700; color: #FFD700; font-weight: bold; cursor: pointer;">
          ❌ VOLTAR
        </button>
      </div>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function jogarPoker() {
  const aposta = parseInt(document.getElementById('aposta').value);
  const saldo = inv['moeda']?.q || 0;
  
  if (aposta < 10 || aposta > 1000) {
    return notif('❌ Aposta inválida (10-1000)');
  }
  
  if (saldo < aposta) {
    return notif(`❌ Saldo insuficiente! Precisa $${aposta}`);
  }
  
  // Simular jogo de poker
  const suas_cartas = gerarMaoPoker();
  const npcs = [
    {nome: 'Bill', agressividade: 0.7},
    {nome: 'Kate', agressividade: 0.5},
    {nome: 'James', agressividade: 0.8}
  ];
  
  let pote = aposta * npcs.length;
  let sua_mao_valor = calcularValorMao(suas_cartas);
  
  // Simulação simples: chance baseada em valor da mão
  const chance_ganho = Math.min(0.9, Math.max(0.1, sua_mao_valor / 100));
  
  if (Math.random() < chance_ganho) {
    // Ganhou!
    const ganho = pote * 0.8;
    inv['moeda'].q += ganho;
    
    notif(`🎉 VOCÊ GANHOU! +$${Math.floor(ganho)}`);
  } else {
    // Perdeu
    inv['moeda'].q -= aposta;
    
    notif(`💔 Você perdeu esta rodada... -$${aposta}`);
  }
  
  // Voltar ao saloon
  setTimeout(() => abrirSaloon(saloon_aberta.id), 1500);
}

function gerarMaoPoker() {
  // Gera 2 cartas aleatórias
  const naipes = ['♠', '♥', '♦', '♣'];
  const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  const carta1 = valores[Math.floor(Math.random() * valores.length)] + naipes[Math.floor(Math.random() * naipes.length)];
  const carta2 = valores[Math.floor(Math.random() * valores.length)] + naipes[Math.floor(Math.random() * naipes.length)];
  
  return [carta1, carta2];
}

function calcularValorMao(cartas) {
  // Simplificado: A=14, K=13, Q=12, J=11, resto é valor numérico
  let valor = 0;
  
  cartas.forEach(carta => {
    const num = carta.substring(0, carta.length - 1);
    
    if (num === 'A') valor += 14;
    else if (num === 'K') valor += 13;
    else if (num === 'Q') valor += 12;
    else if (num === 'J') valor += 11;
    else valor += parseInt(num);
  });
  
  return valor;
}

// ============= OUTRAS ATIVIDADES =============

function dançarComGarçonete() {
  notif('💃 Você dança com a garçonete! Relacionamento +5');
  inv['moeda'].q -= 5;
  abrirSaloon(saloon_aberta.id);
}

function ouvirBoatos() {
  const boatos = [
    '👂 "Disseram que tem ouro na montanha norte..."',
    '👂 "O trem chegando amanhã traz diamantes!"',
    '👂 "Xerife está procurando Billy the Kid..."',
    '👂 "Banco vai estar desprotegido amanhã..."',
    '👂 "Indígenas se aproximando do vilarejo..."'
  ];
  
  notif(boatos[Math.floor(Math.random() * boatos.length)]);
}

function alugarQuarto() {
  const html = `
    <div style="background: #1a1a1a; color: #FFD700; padding: 20px; border: 3px solid #DAA520;">
      <h2>🛏️ ALUGAR QUARTO</h2>
      
      <div style="background: #2a2a2a; padding: 15px; margin: 10px 0; border: 1px solid #FFD700;">
        <h3>Red Liz's Room</h3>
        <p>Uma adorável prostituta oferece companhia...</p>
        
        <div style="margin: 15px 0;">
          <strong>Opções:</strong><br/>
          <button onclick="alugarQuartoOpcao('hora')" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            ⏰ 1 Hora - $20
          </button>
          <button onclick="alugarQuartoOpcao('noite')" style="width: 100%; padding: 8px; margin: 5px 0; background: #2a2a2a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            🌙 Noite Inteira - $100
          </button>
          <button onclick="abrirSaloon(saloon_aberta.id)" style="width: 100%; padding: 8px; margin: 5px 0; background: #8B0000; border: 1px solid #FFD700; color: #FFD700; cursor: pointer;">
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function alugarQuartoOpcao(tempo) {
  const custo = tempo === 'hora' ? 20 : 100;
  
  if ((inv['moeda']?.q || 0) < custo) {
    return notif(`❌ Saldo insuficiente! Precisa $${custo}`);
  }
  
  inv['moeda'].q -= custo;
  
  if (tempo === 'hora') {
    notif('🛏️ Você alugou o quarto por 1 hora... 😉');
    // TODO: Efeito visual, recupera stamina
    player.stamina = 100;
  } else {
    notif('🛏️ Você passou a noite no quarto! Acordou refreshed.');
    player.stamina = 100;
    player.saude = 100;
    // TODO: Avançar tempo (noite passa)
  }
  
  setTimeout(() => abrirSaloon(saloon_aberta.id), 2000);
}

function contratar() {
  notif('💼 Sistema de Quests virá na Fase 6!');
}

// ============= CONSTRUIR SALOON =============

function construirSaloon(posição) {
  const template = SALOON_TEMPLATE['golden_nugget'];
  
  // Validar ingredientes
  for (const [item, qtd] of Object.entries(template.recipe)) {
    if ((inv[item]?.q || 0) < qtd) {
      return `Faltam ${qtd - (inv[item]?.q || 0)}x ${item}`;
    }
  }
  
  // Remover ingredientes
  Object.entries(template.recipe).forEach(([item, qtd]) => {
    inv[item].q -= qtd;
    if (inv[item].q <= 0) delete inv[item];
  });
  
  // Criar saloon
  const saloon = {
    id: `saloon_${Date.now()}`,
    ...template,
    posição: posição,
    mesh: criarMeshSaloon(template),
    npcs: template.npcs.map(npc => ({...npc, saloon_id: `saloon_${Date.now()}`}))
  };
  
  saloon.mesh.position.set(posição.x, posição.y, posição.z);
  scene.add(saloon.mesh);
  
  SALOONS.set(saloon.id, saloon);
  
  notif(`🍺 SALOON CONSTRUÍDO! The Golden Nugget está open for business!`);
  return saloon;
}

function criarMeshSaloon(template) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(template.tamanho.x, template.tamanho.y, template.tamanho.z),
    new THREE.MeshPhongMaterial({color: 0x8B4513})
  );
  
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.tipo = 'saloon';
  
  return mesh;
}

// ============= EXPORT =============

window.SALOON_TEMPLATE = SALOON_TEMPLATE;
window.abrirSaloon = abrirSaloon;
window.fecharSaloon = fecharSaloon;
window.beber = beber;
window.iniciarPoker = iniciarPoker;
window.jogarPoker = jogarPoker;
window.dançarComGarçonete = dançarComGarçonete;
window.ouvirBoatos = ouvirBoatos;
window.alugarQuarto = alugarQuarto;
window.alugarQuartoOpcao = alugarQuartoOpcao;
window.contratar = contratar;
window.construirSaloon = construirSaloon;
window.SALOONS = SALOONS;
