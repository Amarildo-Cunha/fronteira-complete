// 🏘️ FASE 5+6: CIDADES INTEIRAS E QUESTS
// Cole isto no seu fronteira-game.html

// ============= CIDADES =============

const CIDADES = {
  'dusty_gulch': {
    nome: 'Dusty Gulch',
    tipo: 'hub_principal',
    população: 200,
    posição: {x: 0, y: 0, z: 0},
    importância: 'máxima',
    
    locais: [
      {id: 'saloon_golden', nome: 'The Golden Nugget Saloon', tipo: 'saloon', npc_count: 8},
      {id: 'banco_primeiro', nome: 'First National Bank', tipo: 'banco', npc_count: 5},
      {id: 'delegacia', nome: 'Sheriff Office', tipo: 'delegacia', npc_count: 4},
      {id: 'estacao_trem', nome: 'Train Station', tipo: 'estação_trem', npc_count: 3},
      {id: 'mina_cobre', nome: 'Copper Mine', tipo: 'mina', npc_count: 15},
      {id: 'loja_geral', nome: 'General Store', tipo: 'loja', npc_count: 3},
      {id: 'igreja', nome: 'Church', tipo: 'igreja', npc_count: 2},
      {id: 'cemiterio', nome: 'Cemetery', tipo: 'cemiterio', npc_count: 1},
      {id: 'bordel', nome: 'Red Light District', tipo: 'bordel', npc_count: 6},
      {id: 'cassino', nome: 'Golden Casino', tipo: 'cassino', npc_count: 8}
    ],
    
    dinâmica: {
      crimes_noturnos: true,
      bares_abertos_noite: true,
      patrulha_dia: true,
      eventos_semanais: true
    },
    
    economia: {
      preço_alimento: 10,
      preço_bebida: 3,
      preço_quarto: 50,
      salário_médio: 50
    }
  },
  
  'copper_creek': {
    nome: 'Copper Creek',
    tipo: 'minério',
    população: 80,
    posição: {x: 200, y: 0, z: 200},
    especialidade: 'cobre/minério',
    
    locais: [
      {id: 'mina_grande', nome: 'Copper Pit', tipo: 'mina', npc_count: 20},
      {id: 'fundição', nome: 'Copper Foundry', tipo: 'fundição', npc_count: 10},
      {id: 'taverna', nome: 'Miner\'s Tavern', tipo: 'taverna', npc_count: 5},
      {id: 'hotel', nome: 'Copper Hotel', tipo: 'hotel', npc_count: 3}
    ],
    
    economia: {
      preço_cobre: 5,
      preço_alimento: 15,
      preço_quarto: 30,
      salário_mineiro: 40
    }
  },
  
  'silver_city': {
    nome: 'Silver City',
    tipo: 'riqueza',
    população: 150,
    posição: {x: -300, y: 0, z: 150},
    especialidade: 'prata/luxo',
    
    locais: [
      {id: 'banco_grande', nome: 'Silver Reserve Bank', tipo: 'banco', npc_count: 8},
      {id: 'cassino_luxo', nome: 'Diamond Palace Casino', tipo: 'cassino', npc_count: 12},
      {id: 'resort', nome: 'Grand Hotel', tipo: 'resort', npc_count: 10},
      {id: 'teatro', nome: 'Opera House', tipo: 'teatro', npc_count: 5}
    ],
    
    economia: {
      preço_luxo: 200,
      preço_alimento: 20,
      preço_quarto: 150,
      salário_máximo: 100
    }
  },
  
  'gold_town': {
    nome: 'Gold Town',
    tipo: 'terminal',
    população: 100,
    posição: {x: 400, y: 0, z: -300},
    especialidade: 'ouro/exportação',
    
    locais: [
      {id: 'porto_ouro', nome: 'Gold Port', tipo: 'porto', npc_count: 10},
      {id: 'armazém', nome: 'Warehouse', tipo: 'armazém', npc_count: 8},
      {id: 'escritório', nome: 'Export Office', tipo: 'escritório', npc_count: 3}
    ]
  },
  
  'tombstone': {
    nome: 'Tombstone',
    tipo: 'lendária',
    população: 50,
    posição: {x: -400, y: 0, z: -400},
    especialidade: 'duelos/perigos',
    
    locais: [
      {id: 'saloon_ok', nome: 'The OK Corral Saloon', tipo: 'saloon', npc_count: 8},
      {id: 'cemiterio_grande', nome: 'Boot Hill Cemetery', tipo: 'cemiterio', npc_count: 0},
      {id: 'arena_duelo', nome: 'Dueling Arena', tipo: 'arena', npc_count: 1}
    ],
    
    evento_especial: 'local_duelos_épicos'
  }
};

// ============= SISTEMA DE NPCS =============

class NPC {
  constructor(nome, profissão, cidade, tipo) {
    this.id = `npc_${Date.now()}_${Math.random()}`;
    this.nome = nome;
    this.profissão = profissão;
    this.cidade = cidade;
    this.tipo = tipo;
    
    // Relacionamento
    this.relacionamento = 0;  // -100 a +100
    this.amigo = false;
    this.inimigo = false;
    
    // Rotina
    this.rotina = this.gerarRotina();
    this.hora_atual = 6;
    
    // Posição
    this.posição = {x: Math.random() * 100, y: 0, z: Math.random() * 100};
    
    // Salário
    this.salário_diário = {
      'vendedor': 30,
      'ferreiro': 50,
      'chef': 40,
      'barman': 30,
      'garçonete': 20,
      'xerife': 100,
      'mineiro': 40,
      'prostituta': 45
    }[profissão] || 25;
  }
  
  gerarRotina() {
    return {
      '6:00': 'acordar',
      '7:00': 'trabalhar',
      '12:00': 'almoçar',
      '13:00': 'trabalhar',
      '18:00': 'jantar',
      '19:00': 'lazer',
      '22:00': 'dormir'
    };
  }
  
  atualizar(hora) {
    this.hora_atual = hora;
    
    // Afetos relacionamento
    if (this.relacionamento > 50) this.amigo = true;
    if (this.relacionamento < -50) this.inimigo = true;
  }
  
  conversar() {
    const diálogos = {
      'vendedor': 'Quer comprar algo? Tenho de tudo!',
      'ferreiro': 'Precisa de algo forjado? Sou o melhor!',
      'chef': 'Que tal uma boa comida?',
      'barman': 'Que vai ser, parceiro?',
      'prostituta': 'Procurando diversão?',
      'mineiro': 'Esse trabalho é cansativo demais',
      'xerife': 'Comporta-se bem por aqui'
    };
    
    return diálogos[this.profissão] || 'Opa, tudo bem?';
  }
  
  receberQuest(tipo, recompensa) {
    return {
      id: `quest_${this.id}`,
      npc_giver: this.id,
      tipo: tipo,
      recompensa: recompensa,
      status: 'disponível'
    };
  }
}

// ============= GERADOR DE NPCS =============

function gerarNPCsCidade(cidade_nome) {
  const cidade = CIDADES[cidade_nome];
  const npcs = [];
  
  const profissões = ['vendedor', 'ferreiro', 'chef', 'barman', 'garçonete', 'mineiro', 'prostituta'];
  
  for (let i = 0; i < cidade.população; i++) {
    const prof = profissões[Math.floor(Math.random() * profissões.length)];
    const nome = gerarNomeAleatorio();
    
    const npc = new NPC(nome, prof, cidade_nome, prof);
    npcs.push(npc);
  }
  
  return npcs;
}

function gerarNomeAleatorio() {
  const nomes = [
    'John', 'Samuel', 'William', 'Benjamin', 'Charles',
    'Mary', 'Elizabeth', 'Jane', 'Sarah', 'Martha',
    'Buck', 'Red', 'Doc', 'Wild', 'Jesse'
  ];
  
  const sobrenomes = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
    'Miller', 'Davis', 'Wilson', 'Moore', 'Taylor'
  ];
  
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  
  return `${nome} ${sobrenome}`;
}

// ============= SISTEMA DE QUESTS =============

const QUESTS = {
  tipos: {
    'delivery': {
      nome: 'Entrega',
      descrição: 'Leva algo para alguém',
      recompensa_base: 50,
      dificuldade: 'fácil'
    },
    'escolta': {
      nome: 'Escolta',
      descrição: 'Protege pessoa ou carroça',
      recompensa_base: 200,
      dificuldade: 'média',
      risco: 'assaltantes'
    },
    'caça_recompensa': {
      nome: 'Caça Recompensa',
      descrição: 'Procura e captura criminoso',
      recompensa_base: 1000,
      dificuldade: 'difícil',
      risco: 'morte'
    },
    'exploração': {
      nome: 'Exploração',
      descrição: 'Descobre novo local/recurso',
      recompensa_base: 500,
      dificuldade: 'média'
    },
    'construção': {
      nome: 'Construção',
      descrição: 'Constrói algo para alguém',
      recompensa_base: 300,
      dificuldade: 'média'
    },
    'resgate': {
      nome: 'Resgate',
      descrição: 'Salva refém de bandidos',
      recompensa_base: 2000,
      dificuldade: 'muito_difícil',
      risco: 'morte'
    },
    'roubo': {
      nome: 'Roubo Coordenado',
      descrição: 'Rouba algo para alguém',
      recompensa_base: 3000,
      dificuldade: 'extrema',
      risco: 'prisão'
    }
  },
  
  ativas: new Map(),
  concluídas: new Map()
};

// ============= MENU QUESTS =============

function abrirMenuQuests() {
  const quests_lista = Array.from(QUESTS.ativas.values());
  
  const html = `
    <div style="background: #2a2a2a; color: #FFD700; padding: 20px; border: 3px solid #8B7500;">
      <h2 style="text-align: center;">📋 MISSÕES</h2>
      
      <div style="max-height: 400px; overflow-y: auto;">
        ${quests_lista.length === 0 ? `
          <div style="color: #AAA; text-align: center; padding: 20px;">
            Nenhuma missão ativa. Procure NPCs para receber quests!
          </div>
        ` : quests_lista.map(quest => `
          <div style="background: #1a1a1a; padding: 12px; margin: 10px 0; border-left: 3px solid #8B7500;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; color: #FFD700;">${quest.tipo}</div>
                <div style="color: #AAA; font-size: 12px;">De: ${quest.npc_giver}</div>
                <div style="color: #FFD700; font-weight: bold;">Recompensa: \$${quest.recompensa}</div>
              </div>
              <button onclick="aceitarQuest('${quest.id}')" style="padding: 8px 12px; background: #1a4d1a; border: 1px solid #228B22; color: #228B22; cursor: pointer;">
                ✅ ACEITAR
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; margin-top: 15px; padding: 10px; background: #1a1a1a; border: 2px solid #8B7500; color: #FFD700; cursor: pointer;">
        ❌ FECHAR
      </button>
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

// ============= ACEITAR E COMPLETAR QUESTS =============

function aceitarQuest(quest_id) {
  const quest = QUESTS.ativas.get(quest_id);
  if (!quest) return;
  
  quest.status = 'em_progresso';
  quest.data_aceita = Date.now();
  
  notif(`✅ Aceitou missão: ${quest.tipo}`);
  notif(`Recompensa: \$${quest.recompensa}`);
}

function completarQuest(quest_id) {
  const quest = QUESTS.ativas.get(quest_id);
  if (!quest) return;
  
  // Dar recompensa
  inv['moeda'] = {q: (inv['moeda']?.q || 0) + quest.recompensa};
  
  // Aumentar reputação com NPC
  const npc = obterNPCPorId(quest.npc_giver);
  if (npc) {
    npc.relacionamento += 10;
  }
  
  // Mover para concluídas
  QUESTS.ativas.delete(quest_id);
  QUESTS.concluídas.set(quest_id, quest);
  
  notif(`✅ Missão completa!\n+\$${quest.recompensa}`);
}

function obterNPCPorId(npc_id) {
  // Procura NPC em todas as cidades
  for (let cidade_nome of Object.keys(CIDADES)) {
    // TODO: Implementar armazenamento de NPCs por cidade
  }
  return null;
}

// ============= GERAR QUESTS ALEATÓRIAS =============

function gerarQuestAleatoria(npc) {
  const tipos = Object.keys(QUESTS.tipos);
  const tipo_escolhido = tipos[Math.floor(Math.random() * tipos.length)];
  const tipo_info = QUESTS.tipos[tipo_escolhido];
  
  const quest = {
    id: `quest_${Date.now()}`,
    npc_giver: npc.nome,
    tipo: tipo_escolhido,
    nome: tipo_info.nome,
    recompensa: tipo_info.recompensa_base + Math.floor(Math.random() * 100),
    dificuldade: tipo_info.dificuldade,
    status: 'disponível',
    data_criada: Date.now()
  };
  
  QUESTS.ativas.set(quest.id, quest);
  return quest;
}

// ============= CONVERSAR COM NPC =============

function conversar_npc(npc_id) {
  const npc = obterNPCPorId(npc_id);
  if (!npc) return;
  
  const html = `
    <div style="background: #2a2a2a; color: #FFD700; padding: 20px; border: 3px solid #DAA520;">
      
      <h2 style="text-align: center;">${npc.nome}</h2>
      <div style="text-align: center; color: #AAA; margin-bottom: 20px;">${npc.profissão}</div>
      
      <!-- RELACIONAMENTO -->
      <div style="background: #1a1a1a; padding: 12px; margin: 15px 0; border: 1px solid #DAA520; text-align: center;">
        <div style="color: #AAA; font-size: 12px;">RELACIONAMENTO</div>
        <div style="font-size: 24px; font-weight: bold;">
          ${npc.relacionamento > 50 ? '❤️' : npc.relacionamento > 0 ? '😊' : npc.relacionamento > -50 ? '😐' : '😠'}
          ${npc.relacionamento}/100
        </div>
      </div>
      
      <!-- DIÁLOGO -->
      <div style="background: #1a1a1a; padding: 12px; margin: 15px 0; border-left: 3px solid #DAA520; color: #AAA; font-style: italic;">
        "${npc.conversar()}"
      </div>
      
      <!-- OPÇÕES -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        
        <button onclick="ofereçerQuest('${npc.id}')" style="padding: 12px; background: #1a4d1a; border: 1px solid #228B22; color: #228B22; cursor: pointer; font-weight: bold;">
          📋 MISSÃO
        </button>
        
        <button onclick="darPresenteNPC('${npc.id}')" style="padding: 12px; background: #4d1a1a; border: 1px solid #FFD700; color: #FFD700; cursor: pointer; font-weight: bold;">
          🎁 PRESENTE
        </button>
        
      </div>
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; margin-top: 15px; padding: 10px; background: #1a1a1a; border: 2px solid #DAA520; color: #FFD700; cursor: pointer;">
        ❌ SAIR
      </button>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function ofereçerQuest(npc_id) {
  // TODO: Implementar
  notif('Sistema de quests detalhado em desenvolvimento!');
}

function darPresenteNPC(npc_id) {
  const npc = obterNPCPorId(npc_id);
  if (!npc) return;
  
  // Aumentar relacionamento
  npc.relacionamento += 10;
  
  notif(`❤️ ${npc.nome} gostou! +10 relacionamento`);
}

// ============= EVENTOS CIDADE =============

const EVENTOS_CIDADE = {
  'motim': {
    nome: 'Motim',
    descrição: 'Cidadãos se rebelam',
    consequências: 'preços sobem 20%, xerife fica ocupado'
  },
  'festa': {
    nome: 'Grande Festa',
    descrição: 'Festa no saloon',
    consequências: 'economia boosted, clima feliz'
  },
  'invasão': {
    nome: 'Invasão Bandidos',
    descrição: 'Bandidos atacam a cidade',
    consequências: 'perigo, chance de morte, possível roubo'
  },
  'roubo_banco': {
    nome: 'Roubo de Banco',
    descrição: 'Alguém rouba o banco',
    consequências: 'pânico, economia cai, xerife mobiliza'
  }
};

// ============= EXPORT =============

window.CIDADES = CIDADES;
window.NPC = NPC;
window.gerarNPCsCidade = gerarNPCsCidade;
window.gerarNomeAleatorio = gerarNomeAleatorio;
window.QUESTS = QUESTS;
window.abrirMenuQuests = abrirMenuQuests;
window.aceitarQuest = aceitarQuest;
window.completarQuest = completarQuest;
window.gerarQuestAleatoria = gerarQuestAleatoria;
window.conversar_npc = conversar_npc;
window.EVENTOS_CIDADE = EVENTOS_CIDADE;
