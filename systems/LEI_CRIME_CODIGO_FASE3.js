// 🤠 FASE 3: SISTEMA DE LEI E CRIME COMPLETO
// Cole isto no seu fronteira-game.html

// ============= XERIFE =============

const XERIFE = {
  nome: '🤠 Sheriff John Law',
  nível: 3,
  
  posição: {x: 0, y: 0, z: 0},  // Centro cidade
  patrulha: {
    rota: [],
    velocidade: 8,
    ativo: true
  },
  
  estatísticas: {
    pessoas_presas: 0,
    crimes_resolvidos: 0,
    mortos: 0
  }
};

// ============= SISTEMA DE CRIME =============

const SISTEMA_CRIME = {
  nível_crime_player: 0,
  
  crimes: {
    'roubo_banco': {
      nível_ameaça: 5.0,
      recompensa_captura: 5000,
      prisão_dias: 10,
      tempo_fuga_necessário: 300,
      descrição: 'Roubo de Banco'
    },
    'assalto_trem': {
      nível_ameaça: 4.5,
      recompensa_captura: 3000,
      prisão_dias: 7,
      tempo_fuga_necessário: 250,
      descrição: 'Assalto de Trem'
    },
    'roubo_carroça': {
      nível_ameaça: 2.0,
      recompensa_captura: 500,
      prisão_dias: 3,
      tempo_fuga_necessário: 120,
      descrição: 'Roubo de Carroça'
    },
    'homicídio': {
      nível_ameaça: 4.0,
      recompensa_captura: 2000,
      prisão_dias: 14,
      pena_morte: 0.5,
      descrição: 'Homicídio'
    },
    'agressão': {
      nível_ameaça: 1.5,
      recompensa_captura: 300,
      prisão_dias: 2,
      descrição: 'Agressão'
    }
  },
  
  // Registrar crime
  registrarCrime(tipo) {
    if (!SISTEMA_CRIME.crimes[tipo]) return;
    
    const crime = SISTEMA_CRIME.crimes[tipo];
    SISTEMA_CRIME.nível_crime_player += crime.nível_ameaça;
    
    notif(`🚨 CRIME: ${crime.descrição}!\nNível crime: ${SISTEMA_CRIME.nível_crime_player.toFixed(1)}`);
    
    // Xerife responde baseado no nível
    XERIFE.responder();
  }
};

// ============= RESPOSTA DO XERIFE =============

XERIFE.responder = function() {
  const nível = SISTEMA_CRIME.nível_crime_player;
  
  if (nível < 1) {
    notif('👮 Xerife ignora');
    return;
  }
  
  if (nível < 2) {
    notif('👮 Xerife avisa: "Não quero confusão aqui!"');
    return;
  }
  
  if (nível < 3) {
    notif('🤠 XERIFE PERSEGUE!');
    XERIFE.iniciar_perseguição();
    return;
  }
  
  if (nível < 4) {
    notif('🔫 XERIFE DISPARA!');
    XERIFE.disparar_aviso();
    return;
  }
  
  // Nível 4+: Atira para matar
  notif('💀 XERIFE ATIRA PARA MATAR!');
  XERIFE.combate_mortal();
};

XERIFE.iniciar_perseguição = function() {
  const dist = 30; // Distância perseguição
  const velocidade = 10;
  
  notif('🐴 Xerife em seu encalço!');
  
  // TODO: IA perseguição
  // Por enquanto, aumentar ameaça
  SISTEMA_CRIME.nível_crime_player += 0.5;
};

XERIFE.disparar_aviso = function() {
  notif('💥 Tiro de aviso! Próximo mata!');
  player.saude -= 5;
};

XERIFE.combate_mortal = function() {
  // Chance de morte baseada em nível crime
  const chance_morte = Math.min(0.9, SISTEMA_CRIME.nível_crime_player / 10);
  
  if (Math.random() < chance_morte) {
    notif('💀 VOCÊ FOI MORTO PELO XERIFE!');
    player.morto = true;
    player.respawnar_prisão();
  } else {
    // Player consegue escapar
    notif('Você conseguiu escapar do xerife!');
  }
};

// ============= SISTEMA DE FUGA =============

const FUGA = {
  ativa: false,
  tempo_necessário: 0,
  distância_segura: 500,
  tempo_decaimento: 3600, // 1 hora para crime decay
  
  iniciar() {
    if (SISTEMA_CRIME.nível_crime_player === 0) return;
    
    FUGA.ativa = true;
    FUGA.tempo_necessário = SISTEMA_CRIME.nível_crime_player * 50; // segundos
    
    notif(`🏃 FUGA INICIADA!\nPrecisa ficar ${FUGA.tempo_necessário}s longe do xerife`);
  },
  
  atualizar(dt) {
    if (!FUGA.ativa) return;
    
    // Verificar distância do xerife
    const distXerife = Math.hypot(
      player.x - XERIFE.posição.x,
      player.z - XERIFE.posição.z
    );
    
    if (distXerife > FUGA.distância_segura) {
      FUGA.tempo_necessário -= dt;
      
      if (FUGA.tempo_necessário <= 0) {
        FUGA.conseguiu_escapar();
      }
    } else {
      // Voltou perto do xerife
      FUGA.tempo_necessário = SISTEMA_CRIME.nível_crime_player * 50;
    }
  },
  
  conseguiu_escapar() {
    FUGA.ativa = false;
    notif('✅ Escapou do xerife! Crime decresce lentamente');
    
    // Decrecer crime lentamente
    setInterval(() => {
      SISTEMA_CRIME.nível_crime_player = Math.max(0, SISTEMA_CRIME.nível_crime_player - 0.1);
    }, 10000); // A cada 10 segundos
  }
};

// ============= PRISÃO =============

const PRISÃO = {
  localização: {x: 0, y: 0, z: 0},
  células: 5,
  
  prender(player_id, dias, crime) {
    player.preso = true;
    player.tempo_prisão = dias * 1440; // minutos
    player.crime_acusado = crime;
    player.nível_crime = 0; // Reset crime
    
    notif(`🔒 PRESO!\nCrime: ${crime}\nDias: ${dias}`);
    notif('Opções: Trabalhar para reduzir tempo ou Escapar (perigoso!)');
  },
  
  atualizar(dt) {
    if (!player.preso) return;
    
    player.tempo_prisão -= dt;
    
    if (player.tempo_prisão <= 0) {
      PRISÃO.liberar();
    }
  },
  
  liberar() {
    player.preso = false;
    player.tempo_prisão = 0;
    notif('✅ Liberado da prisão!');
  },
  
  trabalhar_prisão() {
    if (!player.preso) return;
    
    // Trabalho força reduz tempo
    player.tempo_prisão -= 60; // Reduz 1 hora
    inv['moeda'] = {q: (inv['moeda']?.q || 0) + 10};
    
    notif('⛏️ Trabalhou na prisão. -1 hora, +$10');
  },
  
  escapar() {
    const dificuldade = 0.3; // 30% chance
    
    if (Math.random() < dificuldade) {
      notif('✅ Escapou da prisão!');
      PRISÃO.liberar();
      SISTEMA_CRIME.nível_crime_player = 3; // Novo crime: evasão
    } else {
      notif('❌ Capturado tentando escapar! +2 dias');
      player.tempo_prisão += 2880;
    }
  }
};

// ============= MENU PRISÃO =============

function abrirMenuPrisão() {
  if (!player.preso) return;
  
  const dias_restantes = Math.ceil(player.tempo_prisão / 1440);
  
  const html = `
    <div style="background: #2a2a2a; color: #FF6347; padding: 20px; border: 3px solid #8B0000;">
      <h2 style="text-align: center;">🔒 DELEGACIA/CADEIA</h2>
      
      <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; border: 2px solid #FF6347;">
        <div style="font-size: 18px; color: #FFD700;">⏱️ Tempo Restante</div>
        <div style="font-size: 24px; font-weight: bold; color: #FF6347;">${dias_restantes} dias</div>
        <div style="color: #AAA; font-size: 12px; margin-top: 10px;">Crime: ${player.crime_acusado}</div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
        
        <button onclick="PRISÃO.trabalhar_prisão()" style="padding: 15px; background: #4d4d0a; border: 2px solid #FFD700; color: #FFD700; cursor: pointer; font-weight: bold;">
          ⛏️ TRABALHAR
          <br/>
          <small>-1 hora, +\$10</small>
        </button>
        
        <button onclick="PRISÃO.escapar()" style="padding: 15px; background: #4d0000; border: 2px solid #FF6347; color: #FF6347; cursor: pointer; font-weight: bold;">
          🚪 ESCAPAR
          <br/>
          <small>30% chance (perigoso)</small>
        </button>
        
      </div>
      
      <div style="background: #1a1a1a; padding: 15px; border: 1px solid #FF6347; color: #AAA; font-size: 12px;">
        <strong>📋 Atividades na Prisão:</strong>
        <br/>
        • Trabalho Forçado: Reduz tempo, ganha moeda
        <br/>
        • Escapar: Risco de morte ou mais tempo
        <br/>
        • Fiança: Pagar para sair (${Math.floor(Math.random() * 5000) + 2500})
      </div>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

// ============= PROCURADOS =============

const PROCURADOS = [
  {
    id: 'billy_kid',
    nome: 'Billy the Kid',
    crime: 'Roubo de Banco',
    recompensa: 5000,
    dificuldade: 'extrema',
    localização_última: 'Deserto Norte',
    descrição: 'Perigoso e impiedoso'
  },
  {
    id: 'jesse_james',
    nome: 'Jesse James',
    crime: 'Assalto de Trem',
    recompensa: 3000,
    dificuldade: 'muito_difícil',
    localização_última: 'Floresta Oeste',
    descrição: 'Foragido há 2 meses'
  },
  {
    id: 'wild_bill',
    nome: 'Wild Bill Hickok',
    crime: 'Homicídio',
    recompensa: 2000,
    dificuldade: 'difícil',
    localização_última: 'Saloon',
    descrição: 'Armado e perigoso'
  }
];

function abrirMenuProcurados() {
  const html = `
    <div style="background: #3a2a1a; color: #DAA520; padding: 20px; border: 3px solid #8B4513;">
      <h2 style="text-align: center;">⚠️ PROCURADOS</h2>
      
      <div style="max-height: 400px; overflow-y: auto;">
        ${PROCURADOS.map(proc => `
          <div style="background: #1a1a1a; padding: 15px; margin: 10px 0; border: 2px solid #8B4513;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 16px; font-weight: bold; color: #FF6347;">${proc.nome}</div>
                <div style="color: #AAA; font-size: 12px;">Crime: ${proc.crime}</div>
                <div style="color: #AAA; font-size: 12px;">Dificuldade: ${proc.dificuldade}</div>
                <div style="color: #FFD700; font-weight: bold;">Recompensa: \$${proc.recompensa}</div>
              </div>
              <button onclick="iniciarCaptura('${proc.id}')" style="padding: 10px 15px; background: #8B4513; border: 2px solid #DAA520; color: #DAA520; cursor: pointer; font-weight: bold;">
                🎯 PROCURAR
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; margin-top: 15px; padding: 10px; background: #1a1a1a; border: 2px solid #8B4513; color: #DAA520; cursor: pointer; font-weight: bold;">
        ❌ FECHAR
      </button>
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function iniciarCaptura(criminal_id) {
  const criminal = PROCURADOS.find(p => p.id === criminal_id);
  notif(`🎯 Procurando ${criminal.nome}...`);
  notif(`Localização: ${criminal.localização_última}`);
  
  // TODO: Sistema completo de captura
  // Por enquanto, simulação
  const chance_sucesso = 0.5;
  
  setTimeout(() => {
    if (Math.random() < chance_sucesso) {
      inv['moeda'] = {q: (inv['moeda']?.q || 0) + criminal.recompensa};
      notif(`✅ CAPTUROU ${criminal.nome}!\n+\$${criminal.recompensa}`);
    } else {
      notif(`❌ ${criminal.nome} conseguiu escapar`);
      player.saude -= 20;
    }
  }, 2000);
}

// ============= DECAY CRIME (Desaparecer com tempo) =============

function atualizarDecayCrime(dt) {
  if (SISTEMA_CRIME.nível_crime_player > 0) {
    // Decresce 0.1 por segundo se não está cometendo crimes
    SISTEMA_CRIME.nível_crime_player = Math.max(0, SISTEMA_CRIME.nível_crime_player - (dt * 0.001));
  }
}

// ============= EXPORT =============

window.XERIFE = XERIFE;
window.SISTEMA_CRIME = SISTEMA_CRIME;
window.FUGA = FUGA;
window.PRISÃO = PRISÃO;
window.PROCURADOS = PROCURADOS;
window.abrirMenuPrisão = abrirMenuPrisão;
window.abrirMenuProcurados = abrirMenuProcurados;
window.iniciarCaptura = iniciarCaptura;
window.atualizarDecayCrime = atualizarDecayCrime;
