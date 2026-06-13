// 💰 FASE 2: SISTEMA DE ECONOMIA COMPLETO
// Cole isto no seu fronteira-game.html

// ============= MOEDA E ECONOMIA =============

const MOEDA_TIPOS = {
  'moeda_1cent': {nome: '1¢', valor: 0.01, cor: '#8B4513'},
  'moeda_5cent': {nome: '5¢', valor: 0.05, cor: '#A0522D'},
  'moeda_10cent': {nome: '10¢', valor: 0.10, cor: '#CD853F'},
  'moeda_25cent': {nome: '25¢', valor: 0.25, cor: '#DAA520'},
  'moeda_50cent': {nome: '50¢', valor: 0.50, cor: '#B8860B'},
  'nota_1': {nome: '$1', valor: 1.00, cor: '#228B22'},
  'nota_5': {nome: '$5', valor: 5.00, cor: '#006400'},
  'nota_10': {nome: '$10', valor: 10.00, cor: '#FF6347'},
  'nota_20': {nome: '$20', valor: 20.00, cor: '#8B0000'},
  'ouro_puro': {nome: 'Ouro Puro', valor: 1000.00, cor: '#FFD700'}
};

// ============= BANCO =============

const BANCOS = new Map();

function criarBanco(posição, cidade) {
  const banco = {
    id: `banco_${Date.now()}`,
    nome: `🏦 ${cidade} Bank`,
    posição: posição,
    cidade: cidade,
    tamanho: {x: 6, z: 8, y: 4},
    mesh: null,
    
    // Segurança
    segurança: {
      guardas: 3,
      xerife_vigília: true,
      cofre_força: 'inquebrável'
    },
    
    // Contas jogadores
    contas: new Map(),
    
    // Juros
    juros: {
      taxa_diária: 0.01,  // 1% por dia
      mínimo_depósito: 100,
      máximo_depósito: 100000
    },
    
    // Empréstimos
    empréstimos: {
      taxa_diária: 0.10,  // 10% por dia
      tempo_máximo: 10,    // dias
      risco_calote: 0.3    // 30% chance quebrar
    }
  };
  
  // Criar mesh
  banco.mesh = new THREE.Mesh(
    new THREE.BoxGeometry(banco.tamanho.x, banco.tamanho.y, banco.tamanho.z),
    new THREE.MeshPhongMaterial({color: 0x696969})
  );
  
  banco.mesh.position.set(posição.x, posição.y, posição.z);
  banco.mesh.castShadow = true;
  banco.mesh.receiveShadow = true;
  banco.mesh.userData.tipo = 'banco';
  banco.mesh.userData.banco_id = banco.id;
  
  scene.add(banco.mesh);
  BANCOS.set(banco.id, banco);
  
  return banco;
}

// ============= CONTA BANCÁRIA =============

class ContaBancaria {
  constructor(player_id, banco_id) {
    this.player_id = player_id;
    this.banco_id = banco_id;
    this.saldo = 0;
    this.juros_acumulados = 0;
    this.data_abertura = Date.now();
    this.histórico = [];
  }
  
  depositar(quantia) {
    this.saldo += quantia;
    this.histórico.push({
      tipo: 'depósito',
      quantia: quantia,
      data: Date.now(),
      saldo_antes: this.saldo - quantia
    });
    return true;
  }
  
  sacar(quantia) {
    if (this.saldo < quantia) return false;
    
    this.saldo -= quantia;
    this.histórico.push({
      tipo: 'saque',
      quantia: quantia,
      data: Date.now(),
      saldo_antes: this.saldo + quantia
    });
    return true;
  }
  
  calcularJuros(dias = 1) {
    const banco = BANCOS.get(this.banco_id);
    const juros = this.saldo * banco.juros.taxa_diária * dias;
    this.juros_acumulados += juros;
    return juros;
  }
  
  pedir_emprestimo(quantia, dias) {
    const banco = BANCOS.get(this.banco_id);
    
    if (dias > banco.empréstimos.tempo_máximo) return false;
    
    this.empréstimo = {
      quantia: quantia,
      juros_taxa: banco.empréstimos.taxa_diária,
      dias_restantes: dias,
      data_vencimento: Date.now() + (dias * 24 * 60 * 60 * 1000),
      juros_total: quantia * banco.empréstimos.taxa_diária * dias
    };
    
    this.saldo += quantia;
    return true;
  }
}

// ============= MENU BANCO =============

function abrirMenuBanco(banco_id) {
  const banco = BANCOS.get(banco_id);
  if (!banco) return;
  
  let conta = banco.contas.get(player.id);
  if (!conta) {
    conta = new ContaBancaria(player.id, banco_id);
    banco.contas.set(player.id, conta);
  }
  
  const saldo_jogador = inv['moeda']?.q || 0;
  
  const html = `
    <div style="background: linear-gradient(to bottom, #1a1a1a, #2a2a2a); color: #00FF00; padding: 20px; border: 3px solid #00FF00; font-family: 'Courier New';">
      
      <div style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #00FF00; padding-bottom: 10px;">
        🏦 ${banco.nome}
        <br/>
        <small style="font-size: 12px; color: #00AA00;">Banco de confiança desde 1880</small>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        
        <!-- SALDO -->
        <div style="border: 2px solid #00FF00; padding: 15px; background: #0a0a0a;">
          <div style="color: #00AA00; font-size: 12px;">💵 SALDO NA MÃO</div>
          <div style="font-size: 24px; font-weight: bold; color: #00FF00;">\$${saldo_jogador}</div>
        </div>
        
        <div style="border: 2px solid #00FF00; padding: 15px; background: #0a0a0a;">
          <div style="color: #00AA00; font-size: 12px;">🏧 SALDO NA CONTA</div>
          <div style="font-size: 24px; font-weight: bold; color: #00FF00;">\$${conta.saldo}</div>
        </div>
        
      </div>
      
      <!-- OPERAÇÕES -->
      <div style="border: 2px solid #00FF00; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #00FF00; margin-top: 0;">⚙️ OPERAÇÕES</h3>
        
        <div style="margin: 10px 0;">
          <label style="color: #00AA00;">Quantia:</label>
          <input type="number" id="quantia_banco" value="100" min="0" max="${Math.max(saldo_jogador, 100000)}" 
                 style="width: 100%; padding: 8px; background: #0a0a0a; color: #00FF00; border: 1px solid #00FF00;">
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button onclick="depositarBanco('${banco_id}')" style="padding: 10px; background: #1a4d1a; border: 1px solid #00FF00; color: #00FF00; cursor: pointer; font-weight: bold;">
            📥 DEPOSITAR
          </button>
          <button onclick="sacarBanco('${banco_id}')" style="padding: 10px; background: #1a4d1a; border: 1px solid #00FF00; color: #00FF00; cursor: pointer; font-weight: bold;">
            📤 SACAR
          </button>
        </div>
      </div>
      
      <!-- JUROS E EMPRÉSTIMOS -->
      <div style="border: 2px solid #00FF00; padding: 15px; margin-bottom: 20px; background: #0a3a0a;">
        <h3 style="color: #00FF00; margin-top: 0;">💰 JUROS</h3>
        <div style="color: #00AA00;">
          <div>Taxa: <strong>${(banco.juros.taxa_diária * 100).toFixed(1)}% ao dia</strong></div>
          <div>Juros acumulados: <strong style="color: #00FF00;">\$${conta.juros_acumulados.toFixed(2)}</strong></div>
        </div>
        
        <button onclick="coletarJuros('${banco_id}')" style="width: 100%; margin-top: 10px; padding: 8px; background: #228B22; border: 1px solid #00FF00; color: #00FF00; cursor: pointer; font-weight: bold;">
          ✅ COLETAR JUROS
        </button>
      </div>
      
      <!-- EMPRÉSTIMO -->
      <div style="border: 2px solid #FF6347; padding: 15px; margin-bottom: 20px; background: #3a0a0a;">
        <h3 style="color: #FF6347; margin-top: 0;">⚠️ EMPRÉSTIMO (RISCO!)</h3>
        <div style="color: #AA6666; font-size: 12px; margin-bottom: 10px;">
          Taxa: ${(banco.empréstimos.taxa_diária * 100).toFixed(0)}% ao dia
          <br/>
          Tempo máximo: ${banco.empréstimos.tempo_máximo} dias
          <br/>
          ⚠️ Risco de não conseguir pagar!
        </div>
        
        <div style="margin: 10px 0;">
          <label style="color: #FF6347;">Quantia:</label>
          <input type="number" id="quantia_emprestimo" value="500" min="100" max="10000" 
                 style="width: 100%; padding: 8px; background: #1a0a0a; color: #FF6347; border: 1px solid #FF6347;">
        </div>
        
        <div style="margin: 10px 0;">
          <label style="color: #FF6347;">Dias:</label>
          <input type="number" id="dias_emprestimo" value="5" min="1" max="${banco.empréstimos.tempo_máximo}" 
                 style="width: 100%; padding: 8px; background: #1a0a0a; color: #FF6347; border: 1px solid #FF6347;">
        </div>
        
        <button onclick="pedirEmprestimo('${banco_id}')" style="width: 100%; padding: 8px; background: #8B0000; border: 1px solid #FF6347; color: #FF6347; cursor: pointer; font-weight: bold;">
          ⚠️ PEDIR EMPRÉSTIMO
        </button>
      </div>
      
      <!-- SAIR -->
      <button onclick="fecharMenuBanco()" style="width: 100%; padding: 10px; background: #0a0a0a; border: 2px solid #00FF00; color: #00FF00; cursor: pointer; font-weight: bold;">
        ❌ SAIR
      </button>
      
    </div>
  `;
  
  document.getElementById('menuPanel').innerHTML = html;
}

function depositarBanco(banco_id) {
  const banco = BANCOS.get(banco_id);
  const conta = banco.contas.get(player.id);
  const quantia = parseInt(document.getElementById('quantia_banco').value);
  const saldo = inv['moeda']?.q || 0;
  
  if (quantia <= 0 || saldo < quantia) {
    return notif('❌ Quantia inválida ou saldo insuficiente');
  }
  
  inv['moeda'].q -= quantia;
  conta.depositar(quantia);
  
  notif(`✅ Depositou \$${quantia}. Novo saldo: \$${conta.saldo}`);
  abrirMenuBanco(banco_id);
}

function sacarBanco(banco_id) {
  const banco = BANCOS.get(banco_id);
  const conta = banco.contas.get(player.id);
  const quantia = parseInt(document.getElementById('quantia_banco').value);
  
  if (quantia <= 0 || conta.saldo < quantia) {
    return notif('❌ Saldo insuficiente na conta');
  }
  
  if (!conta.sacar(quantia)) return;
  
  inv['moeda'] = {q: (inv['moeda']?.q || 0) + quantia};
  
  notif(`✅ Sacou \$${quantia}. Saldo restante: \$${conta.saldo}`);
  abrirMenuBanco(banco_id);
}

function coletarJuros(banco_id) {
  const banco = BANCOS.get(banco_id);
  const conta = banco.contas.get(player.id);
  const juros = conta.juros_acumulados;
  
  if (juros <= 0) return notif('❌ Sem juros a coletar');
  
  inv['moeda'] = {q: (inv['moeda']?.q || 0) + juros};
  conta.juros_acumulados = 0;
  
  notif(`💰 Coletou \$${juros.toFixed(2)} em juros!`);
  abrirMenuBanco(banco_id);
}

function pedirEmprestimo(banco_id) {
  const banco = BANCOS.get(banco_id);
  const conta = banco.contas.get(player.id);
  const quantia = parseInt(document.getElementById('quantia_emprestimo').value);
  const dias = parseInt(document.getElementById('dias_emprestimo').value);
  
  if (conta.empréstimo) {
    return notif('❌ Já tem empréstimo ativo!');
  }
  
  if (!conta.pedir_emprestimo(quantia, dias)) {
    return notif('❌ Empréstimo negado!');
  }
  
  inv['moeda'] = {q: (inv['moeda']?.q || 0) + quantia};
  
  const juros_total = conta.empréstimo.juros_total;
  notif(`⚠️ EMPRÉSTIMO CONCEDIDO!\n\$${quantia} + \$${juros_total.toFixed(2)} de juros em ${dias} dias`);
  abrirMenuBanco(banco_id);
}

function fecharMenuBanco() {
  document.getElementById('menuPanel').innerHTML = '';
}

// ============= ROUBO DE BANCO =============

function roubarBanco(banco_id) {
  const banco = BANCOS.get(banco_id);
  
  // Verificar requisitos
  if (!inv['dinamite'] || inv['dinamite'].q === 0) {
    return notif('❌ Precisa de dinamite para explodir o cofre!');
  }
  
  // Começar roubo
  notif('🔫 ROUBO DE BANCO INICIADO!');
  notif('Derrote os guardas (3)...');
  
  // TODO: Sistema de combate contra guardas
  // Por enquanto, simulação simples
  
  const chance_sucesso = 0.3; // 30% de chance
  
  setTimeout(() => {
    if (Math.random() < chance_sucesso) {
      // Sucesso!
      const ouro = Math.floor(Math.random() * 10000) + 40000;
      inv['ouro_puro'] = {q: (inv['ouro_puro']?.q || 0) + ouro};
      notif(`✅ ROUBO BEM-SUCEDIDO! \n+${ouro} de ouro!`);
      notif('🚨 XERIFE ALERTADO! Nível crime: 5');
      player.nível_crime = 5;
    } else {
      // Falhou
      notif('❌ Roubo fracassado! Capturado pelo xerife!');
      player.preso = true;
      player.tempo_prisão = 600; // 10 minutos
    }
  }, 2000);
}

// ============= ECONOMIA DINÂMICA =============

const ECONOMIA_GLOBAL = {
  preços: {},
  inflação: 1.0,
  demanda: {},
  
  inicializar() {
    ECONOMIA_GLOBAL.preços = {
      'ouro_puro': 1000,
      'alimento': 10,
      'madeira': 5,
      'pedra': 3,
      'vidro': 8
    };
  },
  
  atualizarPreços() {
    // Simular variação de preços
    Object.keys(ECONOMIA_GLOBAL.preços).forEach(item => {
      const variação = (Math.random() - 0.5) * 0.1; // ±5%
      ECONOMIA_GLOBAL.preços[item] *= (1 + variação);
    });
  },
  
  getPreço(item) {
    return ECONOMIA_GLOBAL.preços[item] || 0;
  }
};

// Inicializar
ECONOMIA_GLOBAL.inicializar();

// ============= EXPORT =============

window.MOEDA_TIPOS = MOEDA_TIPOS;
window.BANCOS = BANCOS;
window.ContaBancaria = ContaBancaria;
window.criarBanco = criarBanco;
window.abrirMenuBanco = abrirMenuBanco;
window.depositarBanco = depositarBanco;
window.sacarBanco = sacarBanco;
window.coletarJuros = coletarJuros;
window.pedirEmprestimo = pedirEmprestimo;
window.fecharMenuBanco = fecharMenuBanco;
window.roubarBanco = roubarBanco;
window.ECONOMIA_GLOBAL = ECONOMIA_GLOBAL;
