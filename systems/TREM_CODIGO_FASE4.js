// 🚂 FASE 4: SISTEMA DE TREM COMPLETO
// Cole isto no seu fronteira-game.html

// ============= TREM =============

const TRENS = new Map();

class Trem {
  constructor() {
    this.id = `trem_${Date.now()}`;
    this.nome = '🚂 Transcontinental Express';
    
    // Rota
    this.rota = [
      {cidade: 'Dusty Gulch', hora: 6, parada: 60},
      {cidade: 'Copper Creek', hora: 10, parada: 45},
      {cidade: 'Silver City', hora: 14, parada: 30},
      {cidade: 'Gold Town', hora: 18, parada: 0}
    ];
    
    this.posição_atual = 0;
    this.hora_atual = 6;
    this.velocidade = 20;  // m/s
    this.emMovimento = true;
    
    // Cargas
    this.cargas = [
      {item: 'ouro_puro', quantidade: 50, valor: 50000, segurança: 'máxima'},
      {item: 'diamantes', quantidade: 30, valor: 30000, segurança: 'máxima'},
      {item: 'armas', quantidade: 100, valor: 20000, segurança: 'alta'},
      {item: 'álcool', quantidade: 500, valor: 10000, segurança: 'média'}
    ];
    
    // Segurança
    this.guardas = 2;
    this.xerife_escolta = true;
    this.guarda_metralhadora = true;
    
    // Passageiros
    this.passageiros = 20;
    
    // Mesh 3D
    this.mesh = null;
    this.criar_mesh();
  }
  
  criar_mesh() {
    // Grupo para o trem
    this.mesh = new THREE.Group();
    
    // Locomotiva
    const locomotiva = new THREE.Mesh(
      new THREE.BoxGeometry(3, 2.5, 8),
      new THREE.MeshPhongMaterial({color: 0x333333})
    );
    locomotiva.position.z = -4;
    this.mesh.add(locomotiva);
    
    // Vagões
    for (let i = 0; i < 3; i++) {
      const vagao = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 6),
        new THREE.MeshPhongMaterial({color: 0x8B4513})
      );
      vagao.position.z = 6 + (i * 6);
      this.mesh.add(vagao);
    }
    
    scene.add(this.mesh);
  }
  
  atualizar(dt) {
    // Simular movimento do trem
    if (this.emMovimento) {
      this.posição_atual += this.velocidade * dt;
      
      // Atualizar posição mesh
      if (this.mesh) {
        this.mesh.position.x += this.velocidade * dt * 0.01;
      }
    }
  }
  
  // Pegar informações de segurança
  obterSegurança() {
    return {
      guardas: this.guardas,
      xerife: this.xerife_escolta,
      metralhadora: this.guarda_metralhadora,
      nível_ameaça_total: this.guardas + (this.xerife_escolta ? 2 : 0) + (this.guarda_metralhadora ? 3 : 0)
    };
  }
}

function criarTrem() {
  const trem = new Trem();
  TRENS.set(trem.id, trem);
  return trem;
}

// ============= MENU TREM (Estação) =============

function abrirMenuEstacaoTrem(nome_cidade) {
  const trem_id = Array.from(TRENS.keys())[0];
  const trem = TRENS.get(trem_id);
  
  const html = `
    <div style="background: linear-gradient(to bottom, #3a3a3a, #2a2a2a); color: #FFD700; padding: 20px; border: 3px solid #8B7500;">
      
      <h2 style="text-align: center;">🚂 ESTAÇÃO DE TREM</h2>
      <div style="text-align: center; color: #AAA; margin-bottom: 20px;">${nome_cidade}</div>
      
      <!-- INFORMAÇÕES DO TREM -->
      <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; border: 2px solid #8B7500;">
        <h3 style="color: #FFD700; margin-top: 0;">${trem.nome}</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
          <div>
            <div style="color: #AAA; font-size: 12px;">Próxima parada</div>
            <div style="font-weight: bold; color: #FFD700;">${trem.rota[1]?.cidade || 'Fim da linha'}</div>
          </div>
          <div>
            <div style="color: #AAA; font-size: 12px;">Segurança</div>
            <div style="font-weight: bold; color: #FF6347;">${trem.obterSegurança().nível_ameaça_total}/8 ⭐</div>
          </div>
        </div>
      </div>
      
      <!-- CARGAS -->
      <div style="background: #1a1a1a; padding: 15px; margin: 15px 0; border: 2px solid #228B22;">
        <h3 style="color: #228B22; margin-top: 0;">📦 CARGAS</h3>
        ${trem.cargas.map(carga => `
          <div style="background: #0a0a0a; padding: 8px; margin: 5px 0; border-left: 3px solid #228B22;">
            <div style="font-weight: bold; color: #FFD700;">${carga.item}</div>
            <div style="color: #AAA; font-size: 12px;">
              ${carga.quantidade}x | \$${carga.valor} | Segurança: ${carga.segurança}
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- OPÇÕES -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
        
        <button onclick="comprarPassagemTrem('${trem_id}')" style="padding: 12px; background: #1a4d1a; border: 2px solid #228B22; color: #228B22; cursor: pointer; font-weight: bold;">
          🎫 COMPRAR PASSAGEM
          <br/>
          <small>\$50</small>
        </button>
        
        <button onclick="abrirMenuAssaltoTrem('${trem_id}')" style="padding: 12px; background: #4d0000; border: 2px solid #FF6347; color: #FF6347; cursor: pointer; font-weight: bold;">
          💰 ASSALTAR TREM
          <br/>
          <small>⚠️ Muito perigoso</small>
        </button>
        
      </div>
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; padding: 10px; background: #1a1a1a; border: 2px solid #8B7500; color: #FFD700; cursor: pointer; margin-top: 15px;">
        ❌ SAIR
      </button>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

// ============= COMPRAR PASSAGEM =============

function comprarPassagemTrem(trem_id) {
  const custo = 50;
  
  if ((inv['moeda']?.q || 0) < custo) {
    return notif('❌ Saldo insuficiente! Precisa $50');
  }
  
  inv['moeda'].q -= custo;
  inv['passagem_trem'] = {q: (inv['passagem_trem']?.q || 0) + 1};
  
  notif('✅ Comprou passagem! Suba no trem');
  abrirMenuEstacaoTrem('Estação');
}

// ============= MENU ASSALTO =============

function abrirMenuAssaltoTrem(trem_id) {
  const trem = TRENS.get(trem_id);
  
  const html = `
    <div style="background: #2a0a0a; color: #FF6347; padding: 20px; border: 3px solid #8B0000;">
      
      <h2 style="text-align: center;">💰 ASSALTAR TREM</h2>
      
      <div style="background: #1a0a0a; padding: 15px; margin: 15px 0; border: 2px solid #FF6347;">
        <h3 style="color: #FF6347; margin-top: 0;">⚠️ AVISO</h3>
        <p style="color: #AAA;">
          Assaltar um trem é MUITO perigoso!
          <br/>
          Risco de morte: 60%
          <br/>
          Risco de prisão: 90%
          <br/>
          Recompensa: até $70.000
        </p>
      </div>
      
      <!-- MÉTODOS -->
      <div style="margin: 20px 0;">
        
        <button onclick="iniciarAssaltoMetodo('pular', '${trem_id}')" style="width: 100%; padding: 15px; margin: 10px 0; background: #3a1a0a; border: 2px solid #FF6347; color: #FF6347; cursor: pointer; font-weight: bold; text-align: left;">
          <div style="font-weight: bold;">🏃 Método 1: PULAR NO TREM</div>
          <small style="color: #AAA;">
            Pula no trem em movimento, derrota guardas, rouba cargas
            <br/>
            Dificuldade: EXTREMA | Chance: 30%
          </small>
        </button>
        
        <button onclick="iniciarAssaltoMetodo('dinamitar', '${trem_id}')" style="width: 100%; padding: 15px; margin: 10px 0; background: #3a1a0a; border: 2px solid #FF6347; color: #FF6347; cursor: pointer; font-weight: bold; text-align: left;">
          <div style="font-weight: bold;">💥 Método 2: DINAMITAR TRILHOS</div>
          <small style="color: #AAA;">
            Coloca dinamite na trilha, trem descarrila, rouba vagões
            <br/>
            Dificuldade: EXTREMA | Chance: 40%
          </small>
        </button>
        
        <button onclick="iniciarAssaltoMetodo('passageiro', '${trem_id}')" style="width: 100%; padding: 15px; margin: 10px 0; background: #3a1a0a; border: 2px solid #FF6347; color: #FF6347; cursor: pointer; font-weight: bold; text-align: left;">
          <div style="font-weight: bold;">🎫 Método 3: COMPRAR PASSAGEM + ROUBAR</div>
          <small style="color: #AAA;">
            Entra disfarçado, mata guardas, rouba cargas por dentro
            <br/>
            Dificuldade: MUITO ALTA | Chance: 35%
          </small>
        </button>
        
      </div>
      
      <button onclick="document.getElementById('menuPanel').innerHTML = ''" style="width: 100%; padding: 10px; margin-top: 15px; background: #1a0a0a; border: 2px solid #FF6347; color: #FF6347; cursor: pointer;">
        ❌ CANCELAR
      </button>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

// ============= INICIAR ASSALTO =============

function iniciarAssaltoMetodo(método, trem_id) {
  const trem = TRENS.get(trem_id);
  
  notif(`🔫 INICIANDO ASSALTO (${método.toUpperCase()})`);
  
  // Chance de sucesso por método
  const chances = {
    'pular': 0.30,
    'dinamitar': 0.40,
    'passageiro': 0.35
  };
  
  const chance = chances[método] || 0.25;
  
  // Simular assalto
  setTimeout(() => {
    if (Math.random() < chance) {
      // Sucesso!
      const ouro = Math.floor(Math.random() * 30000) + 40000;
      inv['ouro_puro'] = {q: (inv['ouro_puro']?.q || 0) + ouro};
      
      notif(`✅ ASSALTO BEM-SUCEDIDO!\n+${ouro} de ouro!`);
      notif('🚨 XERIFE ALERTADO! Nível crime: 4.5');
      SISTEMA_CRIME.nível_crime_player = 4.5;
      XERIFE.responder();
    } else {
      // Falhou
      notif('❌ Assalto fracassado!');
      
      if (Math.random() < 0.6) {
        // Capturado
        notif('🔒 Capturado pelo xerife!');
        PRISÃO.prender(player.id, 7, 'Assalto de Trem');
      } else {
        // Ferido
        player.saude -= 40;
        notif('💔 Ferido em fuga. -40 saúde');
      }
    }
  }, 2000);
  
  document.getElementById('menuPanel').innerHTML = '';
}

// ============= VIAJAR DE TREM =============

function viajarDeTrem(trem_id, destino) {
  const trem = TRENS.get(trem_id);
  
  if (!inv['passagem_trem'] || inv['passagem_trem'].q === 0) {
    return notif('❌ Precisa de passagem!');
  }
  
  inv['passagem_trem'].q -= 1;
  
  notif(`🚂 Viajando para ${destino}...`);
  notif('Você entra no trem como passageiro');
  
  // Simular viagem
  setTimeout(() => {
    notif(`✅ Chegou em ${destino}!`);
    // TODO: Teleportar player para nova cidade
  }, 3000);
}

// ============= COMBATE NO TREM =============

function combarNaTrem() {
  notif('🔫 Combate contra guardas do trem!');
  
  // TODO: Sistema de combate
  // Por enquanto, simulação
  const chance_vitória = 0.4;
  
  if (Math.random() < chance_vitória) {
    notif('✅ Venceu os guardas!');
  } else {
    notif('❌ Derrotado! Ejetado do trem');
    player.saude -= 50;
  }
}

// ============= EXPORT =============

window.Trem = Trem;
window.TRENS = TRENS;
window.criarTrem = criarTrem;
window.abrirMenuEstacaoTrem = abrirMenuEstacaoTrem;
window.comprarPassagemTrem = comprarPassagemTrem;
window.abrirMenuAssaltoTrem = abrirMenuAssaltoTrem;
window.iniciarAssaltoMetodo = iniciarAssaltoMetodo;
window.viajarDeTrem = viajarDeTrem;
window.combarNaTrem = combarNaTrem;
