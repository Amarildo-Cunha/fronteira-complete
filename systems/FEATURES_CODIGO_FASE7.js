// ⚡ FASE 7+: FEATURES ADICIONAIS COMPLETAS
// Cole isto no seu fronteira-game.html

// ============= DUELOS PVP =============

const DUELOS = {
  ativo: false,
  local: {x: 0, y: 0, z: 0},
  horário_desafiador: 12,  // Meio-dia
  
  desafiar(player2_id) {
    if (DUELOS.ativo) return notif('❌ Duelo já em andamento');
    
    notif(`⚔️ DUELO DESAFIADO!\n${player.nome} vs ${player2_id}`);
    notif('Posicionem-se face a face...');
    
    DUELOS.ativo = true;
    DUELOS.preparar_duelo(player.id, player2_id);
  },
  
  preparar_duelo(p1_id, p2_id) {
    notif('3...');
    setTimeout(() => notif('2...'), 1000);
    setTimeout(() => notif('1...'), 2000);
    setTimeout(() => DUELOS.executar_duelo(p1_id, p2_id), 3000);
  },
  
  executar_duelo(p1_id, p2_id) {
    // Duelo baseado em velocidade de reação
    const velocidade_p1 = Math.random();
    const velocidade_p2 = Math.random();
    
    let vencedor = velocidade_p1 > velocidade_p2 ? p1_id : p2_id;
    let perdedor = velocidade_p1 > velocidade_p2 ? p2_id : p1_id;
    
    notif(`⚔️ SAQUE! ${vencedor.toUpperCase()} é MAIS RÁPIDO!`);
    
    // Vencedor rouba $500 + itens
    setTimeout(() => {
      inv['moeda'] = {q: (inv['moeda']?.q || 0) + 500};
      notif(`✅ ${vencedor} VENCEU!\n+\$500`);
      
      DUELOS.ativo = false;
    }, 500);
  }
};

// ============= GARIMPO / MINERAÇÃO =============

const MINERAÇÃO = {
  locais: [
    {nome: 'Copper Creek Mine', recurso: 'cobre', valor_base: 5},
    {nome: 'Gold Mountain', recurso: 'ouro', valor_base: 100},
    {nome: 'Silver River', recurso: 'prata', valor_base: 10},
    {nome: 'Diamond Pit', recurso: 'diamante', valor_base: 500}
  ],
  
  minerar(local_idx) {
    const local = MINERAÇÃO.locais[local_idx];
    if (!local) return;
    
    notif(`⛏️ Minerando em ${local.nome}...`);
    
    const resultados = {
      'raro': {chance: 0.1, multiplicador: 10},
      'médio': {chance: 0.4, multiplicador: 3},
      'comum': {chance: 0.5, multiplicador: 1}
    };
    
    let resultado = 'comum';
    const rand = Math.random();
    
    if (rand < resultados.raro.chance) resultado = 'raro';
    else if (rand < resultados.raro.chance + resultados.médio.chance) resultado = 'médio';
    
    const valor = local.valor_base * resultados[resultado].multiplicador;
    inv[local.recurso] = {q: (inv[local.recurso]?.q || 0) + 1};
    
    notif(`✅ Encontrou ${resultado.toUpperCase()}!\n+1x ${local.recurso} (valor: \$${valor})`);
    
    // Riscos
    const risco = Math.random();
    
    if (risco < 0.05) {
      // Desabamento
      notif('💥 DESABAMENTO!\n-30 saúde');
      player.saude -= 30;
    } else if (risco < 0.1) {
      // Gás tóxico
      notif('☠️ GÁS TÓXICO!\n-20 saúde');
      player.saude -= 20;
    }
  }
};

// ============= CLIMA DINÂMICO =============

const CLIMA = {
  tipos: ['céu_limpo', 'nublado', 'chuva_leve', 'chuva_forte', 'tempestade_poeira', 'neve', 'nevoeiro'],
  atual: 'céu_limpo',
  próximo_em: 300, // segundos
  
  ciclo_dia: 48 * 60,  // 48 minutos = 1 dia game
  hora_atual: 6,
  
  atualizar(dt) {
    CLIMA.próximo_em -= dt;
    CLIMA.hora_atual = (CLIMA.hora_atual + (dt / CLIMA.ciclo_dia)) % 24;
    
    if (CLIMA.próximo_em <= 0) {
      CLIMA.mudar_clima();
      CLIMA.próximo_em = 300 + Math.random() * 300;
    }
  },
  
  mudar_clima() {
    const novo_clima = CLIMA.tipos[Math.floor(Math.random() * CLIMA.tipos.length)];
    CLIMA.atual = novo_clima;
    
    // Aplicar efeitos
    const efeitos = {
      'céu_limpo': {visibilidade: 1.0, velocidade: 1.0, iluminação: 1.0, dano: false},
      'nublado': {visibilidade: 0.8, velocidade: 1.0, iluminação: 0.8, dano: false},
      'chuva_leve': {visibilidade: 0.6, velocidade: 0.9, iluminação: 0.6, dano: false},
      'chuva_forte': {visibilidade: 0.4, velocidade: 0.7, iluminação: 0.5, dano: true},
      'tempestade_poeira': {visibilidade: 0.2, velocidade: 0.5, iluminação: 0.3, dano: true},
      'neve': {visibilidade: 0.5, velocidade: 0.8, iluminação: 0.7, dano: true},
      'nevoeiro': {visibilidade: 0.3, velocidade: 0.9, iluminação: 0.4, dano: false}
    };
    
    const efeito = efeitos[novo_clima];
    
    notif(`🌦️ Clima mudou: ${novo_clima}`);
    
    if (efeito.dano) {
      player.saude -= 5;
    }
  }
};

// ============= BOUNTY HUNTING =============

const BOUNTIES = [
  {
    id: 'billy_kid',
    nome: 'Billy the Kid',
    crime: 'Roubo de Banco',
    recompensa_vivo: 7500,
    recompensa_morto: 5000,
    dificuldade: 'extrema',
    localização_última: 'Deserto Norte',
    saúde: 100,
    armas: ['rifle', 'pistola']
  },
  {
    id: 'jesse_james',
    nome: 'Jesse James',
    crime: 'Assalto de Trem',
    recompensa_vivo: 4500,
    recompensa_morto: 3000,
    dificuldade: 'muito_difícil',
    localização_última: 'Floresta',
    saúde: 80,
    armas: ['pistola', 'dinamite']
  },
  {
    id: 'wild_bill',
    nome: 'Wild Bill Hickok',
    crime: 'Homicídio',
    recompensa_vivo: 3000,
    recompensa_morto: 2000,
    dificuldade: 'difícil',
    localização_última: 'Saloon',
    saúde: 70,
    armas: ['pistola_dupla']
  }
];

function procurarBounty(bounty_id) {
  const bounty = BOUNTIES.find(b => b.id === bounty_id);
  if (!bounty) return;
  
  notif(`🎯 Procurando ${bounty.nome}...`);
  notif(`Localização: ${bounty.localização_última}`);
  notif(`Dificuldade: ${bounty.dificuldade}`);
  
  // Simular combate
  const chance_vitória = Math.max(0.2, Math.min(0.8, (player.nível_experiência || 50) / 100));
  
  setTimeout(() => {
    if (Math.random() < chance_vitória) {
      // Capturou
      const recompensa = bounty.recompensa_vivo;
      inv['moeda'] = {q: (inv['moeda']?.q || 0) + recompensa};
      
      notif(`✅ CAPTUROU ${bounty.nome}!`);
      notif(`+\$${recompensa}`);
      
      // Remover da lista
      BOUNTIES.splice(BOUNTIES.indexOf(bounty), 1);
    } else {
      // Falhou
      player.saude -= 40;
      notif(`❌ ${bounty.nome} conseguiu escapar`);
      notif(`-40 saúde`);
    }
  }, 2000);
}

// ============= TRIBOS INDÍGENAS =============

const TRIBOS = {
  'apache': {
    nome: 'Apache',
    localização: {x: -500, y: 0, z: -500},
    população: 30,
    relação_jogador: 0,  // -100 a +100
    
    produtos: [
      {item: 'medicinas_naturais', quantidade: 10, valor: 100},
      {item: 'peles_raras', quantidade: 5, valor: 500},
      {item: 'cavalos_selvagens', quantidade: 3, valor: 1000},
      {item: 'conhecimento_terra', função: '+10% mineração', valor: 500}
    ],
    
    eventos: ['dança_ritual', 'caça_coletiva', 'ataque_soldados', 'negociação_paz'],
    
    comércie: true,
    combate_possível: true
  }
};

function visitarTribo(nome_tribo) {
  const tribo = TRIBOS[nome_tribo];
  if (!tribo) return;
  
  const html = `
    <div style="background: linear-gradient(to bottom, #4a3a2a, #3a2a1a); color: #DEB887; padding: 20px; border: 3px solid #8B4513;">
      
      <h2 style="text-align: center;">🏹 ${tribo.nome}</h2>
      
      <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; border: 2px solid #8B4513;">
        <div style="color: #AAA; font-size: 12px;">RELAÇÃO</div>
        <div style="font-size: 18px; font-weight: bold; color: #DEB887;">
          ${tribo.relação_jogador > 50 ? '❤️' : tribo.relação_jogador > 0 ? '😊' : '😠'}
          ${tribo.relação_jogador}/100
        </div>
      </div>
      
      <div style="border: 2px solid #8B4513; padding: 15px; margin: 15px 0;">
        <h3 style="color: #DEB887;">📦 PRODUTOS</h3>
        ${tribo.produtos.map(prod => `
          <div style="background: #0a0a0a; padding: 8px; margin: 5px 0; border-left: 3px solid #8B4513;">
            <strong style="color: #DEB887;">${prod.item}</strong>
            <br/>
            <small style="color: #AAA;">Valor: \$${prod.valor}</small>
          </div>
        `).join('')}
      </div>
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; padding: 10px; background: #1a1a1a; border: 2px solid #8B4513; color: #DEB887; cursor: pointer;">
        ❌ VOLTAR
      </button>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

// ============= RODEO / COMPETIÇÕES =============

const RODEO = {
  eventos: [
    {
      nome: 'Montaria em Vaca Selvagem',
      descrição: 'Mante-se no dorso pelo máximo de tempo',
      tempo_máximo: 10,
      recompensa: 1000
    },
    {
      nome: 'Lasso de Velocidade',
      descrição: 'Pegue animais com lasso o mais rápido possível',
      tempo: 60,
      recompensa: 800
    },
    {
      nome: 'Corrida de Cavalos',
      descrição: 'Vença a corrida',
      distância: 1000,
      recompensa: 1200
    },
    {
      nome: 'Montaria em Touro Mecânico',
      descrição: 'Equilíbrio perfeito',
      tempo_máximo: 8,
      recompensa: 900
    }
  ],
  
  participar(evento_idx) {
    const evento = RODEO.eventos[evento_idx];
    if (!evento) return;
    
    notif(`🤠 Iniciando: ${evento.nome}`);
    
    // Simulação simples
    const sucesso = Math.random() > 0.4;
    
    if (sucesso) {
      inv['moeda'] = {q: (inv['moeda']?.q || 0) + evento.recompensa};
      notif(`✅ VENCEU!\n+\$${evento.recompensa}`);
    } else {
      notif(`❌ Falhou nesta competição`);
      player.saude -= 20;
    }
  }
};

function abrirMenuRodeo() {
  const html = `
    <div style="background: #3a2a1a; color: #DAA520; padding: 20px; border: 3px solid #8B4513;">
      <h2 style="text-align: center;">🤠 RODEO</h2>
      
      ${RODEO.eventos.map((evt, idx) => `
        <button onclick="RODEO.participar(${idx})" style="width: 100%; padding: 12px; margin: 10px 0; background: #1a1a1a; border: 2px solid #8B4513; color: #DAA520; cursor: pointer; text-align: left;">
          <strong>${evt.nome}</strong>
          <br/>
          <small style="color: #AAA;">${evt.descrição} | \$${evt.recompensa}</small>
        </button>
      `).join('')}
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; margin-top: 15px; padding: 10px; background: #1a1a1a; border: 2px solid #8B4513; color: #DAA520; cursor: pointer;">
        ❌ SAIR
      </button>
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

// ============= CAVALOS E MONTARIA =============

class Cavalo {
  constructor(tipo) {
    this.tipo = tipo;  // 'selvagem', 'domesticado', 'de_guerra'
    this.velocidade = tipo === 'de_guerra' ? 15 : tipo === 'domesticado' ? 10 : 5;
    this.resistência = 100;
    this.felicidade = 50;
    
    this.tipos_info = {
      'selvagem': {cor: 0xFF6347, velocidade: 5, domesticação: true},
      'domesticado': {cor: 0x8B4513, velocidade: 10, domesticação: false},
      'de_guerra': {cor: 0x000000, velocidade: 15, domesticação: false}
    };
  }
  
  montar() {
    player.em_cavalo = true;
    player.velocidade_base = this.velocidade;
    notif(`🐴 Montou no cavalo!`);
  }
  
  desmontar() {
    player.em_cavalo = false;
    player.velocidade_base = 5;
    notif(`🐴 Desmontou`);
  }
}

// ============= CORRIDA DE CAVALOS =============

function abrirMenuCorrida() {
  const cavalos = [
    {nome: 'Lightning', odds: 1.5},
    {nome: 'Midnight', odds: 2.0},
    {nome: 'Thunder', odds: 3.0},
    {nome: 'Spirit', odds: 4.0},
    {nome: 'Golden', odds: 5.0},
    {nome: 'Black Stallion', odds: 6.0},
    {nome: 'Wild Heart', odds: 8.0},
    {nome: 'Dark Knight', odds: 10.0}
  ];
  
  const html = `
    <div style="background: #2a2a1a; color: #DAA520; padding: 20px; border: 3px solid #8B7500;">
      <h2 style="text-align: center;">🏇 CORRIDA DE CAVALOS</h2>
      
      <div style="background: #1a1a1a; padding: 12px; margin: 15px 0; text-align: center; color: #AAA;">
        Escolha um cavalo e aposte dinheiro
      </div>
      
      ${cavalos.map((cavalo, idx) => `
        <button onclick="apostarCorrida('${cavalo.nome}', ${cavalo.odds})" style="width: 100%; padding: 12px; margin: 8px 0; background: #1a1a1a; border: 1px solid #8B7500; color: #DAA520; cursor: pointer; text-align: left;">
          🐎 ${cavalo.nome}
          <span style="float: right; color: #FFD700;">Odds: ${cavalo.odds}x</span>
        </button>
      `).join('')}
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; margin-top: 15px; padding: 10px; background: #1a1a1a; border: 2px solid #8B7500; color: #DAA520; cursor: pointer;">
        ❌ SAIR
      </button>
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function apostarCorrida(cavalo, odds) {
  const aposta = 100; // Aposta padrão
  
  if ((inv['moeda']?.q || 0) < aposta) {
    return notif('❌ Saldo insuficiente!');
  }
  
  inv['moeda'].q -= aposta;
  
  notif(`🏇 Apostando $${aposta} em ${cavalo}...`);
  
  setTimeout(() => {
    const vencedor = Math.random();
    
    if (vencedor < (1 / odds)) {
      // Ganhou!
      const ganho = aposta * odds;
      inv['moeda'] = {q: (inv['moeda']?.q || 0) + ganho};
      
      notif(`✅ ${cavalo} VENCEU!\n+\$${ganho.toFixed(0)}`);
    } else {
      notif(`❌ ${cavalo} perdeu`);
    }
  }, 2000);
}

// ============= EXPORT =============

window.DUELOS = DUELOS;
window.MINERAÇÃO = MINERAÇÃO;
window.CLIMA = CLIMA;
window.BOUNTIES = BOUNTIES;
window.procurarBounty = procurarBounty;
window.TRIBOS = TRIBOS;
window.visitarTribo = visitarTribo;
window.RODEO = RODEO;
window.abrirMenuRodeo = abrirMenuRodeo;
window.Cavalo = Cavalo;
window.abrirMenuCorrida = abrirMenuCorrida;
window.apostarCorrida = apostarCorrida;
