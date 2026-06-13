# 🎯 ROADMAP COMPLETO — FRONTEIRA VELHO OESTE ÉPICO

## 📋 FASES DE DESENVOLVIMENTO

---

# FASE 1: SALOON (Semanas 1-2)

## 🍺 Sistema de Saloon

```javascript
'saloon': {
  nome: '🍺 The Golden Nugget Saloon',
  tipo: 'estrutura_especial',
  tamanho: {x: 8, z: 12, y: 5},
  
  // CONSTRUÇÃO
  recipe: {
    'tábua': 200,
    'vidro': 40,
    'madeira': 100,
    'pregos': 200,
    'ouro': 50  // Valor especial!
  },
  tempo: 120,
  durabilidade: 500,
  
  // INTERIOR AUTO-GERADO
  interior: {
    'barra_drinks': {
      posição: {x: 1, y: 0, z: 10},
      itens_disponiveis: [
        'whiskey (recupera 30 stamina)',
        'cerveja (recupera 20 stamina)',
        'vinho (recupera 15 stamina)',
        'shot_ouro (recupera 50 stamina, caro)'
      ],
      preços: {
        'whiskey': 5,
        'cerveja': 3,
        'vinho': 4,
        'shot_ouro': 25
      }
    },
    
    'mesas_poker': {
      quantidade: 4,
      posições: [
        {x: 3, z: 3},
        {x: 6, z: 3},
        {x: 3, z: 7},
        {x: 6, z: 7}
      ],
      slots_por_mesa: 6,
      aposta_mínima: 10,
      aposta_máxima: 1000,
      npc_jogadores_por_mesa: 3
    },
    
    'palco_banda': {
      posição: {x: 4, z: 0},
      tamanho: {x: 4, z: 2, y: 2},
      músicos: 3,
      música: {
        'morning': 'folk_suave',
        'tarde': 'rock_ocidental',
        'noite': 'blues_triste'
      },
      dança: true  // Players podem dançar
    },
    
    'quartos_segundo_andar': {
      quantidade: 6,
      posição: 'andar_2',
      ocupantes: 'prostitutas',
      funcionalidade: {
        'alugar_quarto': true,
        'encontro': true,
        'dormir': true
      },
      preço_hora: 20,
      preço_noite: 100
    },
    
    'espelhos_parede': {
      quantidade: 4,
      posições: 'distribuído',
      funcionalidade: 'cosmético'
    }
  },
  
  // NPCs FIXOS
  npcs_fixos: [
    {nome: 'Buck', profissão: 'Barman', trabalho: 'servir drinks', salário: 30},
    {nome: 'Sally', profissão: 'Garçonete', trabalho: 'servir mesas', salário: 20},
    {nome: 'The Pianist', profissão: 'Músico', trabalho: 'tocar música', salário: 25},
    {nome: 'Red Liz', profissão: 'Prostituta', trabalho: 'companhia', salário: 40}
  ],
  
  // ATIVIDADES
  atividades: {
    'beber': {
      efeito: 'recupera stamina',
      risco: 'embriagar (visão turva)',
      custo: '3-25 moeda'
    },
    'jogar_poker': {
      tipo: 'jogo_azar',
      aposta: '10-1000 moeda',
      risco: 'perder dinheiro',
      recompensa: 'ganhar muito'
    },
    'dançar': {
      com: 'garçonetes/prostitutas',
      custo: '5-50 moeda',
      efeito: 'aumenta felicidade'
    },
    'contratar': {
      para: 'quests/trabalhos',
      npcs: 'todos no saloon',
      custo: 'negociável'
    },
    'dormir': {
      quarto: 'segundo_andar',
      custo: '100 moeda/noite',
      efeito: 'recupera saúde e stamina'
    },
    'ouvir_boatos': {
      com: 'barman/NPCs',
      informação: 'sobre mundo, crimes, ouro',
      custo: 'gratuito (ou beber)'
    }
  }
}
```

## Fluxo de Jogador no Saloon

```
1. ENTRA no Saloon
   └─ Abre menu interior: "Bem-vindo ao The Golden Nugget!"

2. ESCOLHE ATIVIDADE
   ├─ [🍺 Beber]
   │  ├─ Escolhe bebida
   │  ├─ Paga (3-25 moeda)
   │  └─ Recupera stamina, fica embriagado?
   │
   ├─ [♠️ Poker]
   │  ├─ Senta em mesa
   │  ├─ Aposta (10-1000)
   │  ├─ Joga rodadas (fold/call/raise/all-in)
   │  ├─ Melhor mão ganha
   │  └─ Ganha/perde dinheiro
   │
   ├─ [💃 Dançar]
   │  ├─ Escolhe garçonete/prostituta
   │  ├─ Paga (5-50)
   │  └─ Conversa, relacionamento aumenta
   │
   ├─ [🎤 Ouvir Música]
   │  ├─ Banda toca ao vivo
   │  └─ Ambiente imersivo
   │
   ├─ [🛏️ Alugar Quarto]
   │  ├─ Sobe para 2º andar
   │  ├─ Escolhe quarto
   │  ├─ Paga (20/hora ou 100/noite)
   │  └─ Pode dormir ou encontro
   │
   └─ [💼 Contratar]
      ├─ Fala com NPCs
      ├─ Recebe quest
      └─ Vai executar missão

3. SAIR
   └─ Volta ao mundo principal
```

---

# FASE 2: ECONOMIA REAL (Semanas 3-4)

## 💰 Sistema de Moeda e Banco

```javascript
'sistema_moeda': {
  nome: 'Dólares Americanos 1880s',
  
  tipos: [
    {nome: 'Moeda 1¢', valor: 0.01, abundância: 'extrema'},
    {nome: 'Moeda 5¢', valor: 0.05, abundância: 'muita'},
    {nome: 'Moeda 10¢', valor: 0.10, abundância: 'muita'},
    {nome: 'Moeda 25¢', valor: 0.25, abundância: 'normal'},
    {nome: 'Moeda 50¢', valor: 0.50, abundância: 'rara'},
    {nome: 'Nota $1', valor: 1.00, abundância: 'normal'},
    {nome: 'Nota $5', valor: 5.00, abundância: 'rara'},
    {nome: 'Nota $10', valor: 10.00, abundância: 'rara'},
    {nome: 'Nota $20', valor: 20.00, abundância: 'muito_rara'},
    {nome: 'Ouro Puro', valor: 1000.00, abundância: 'lendária'}
  ],
  
  // Conversão rápida
  conversão: {
    'ouro_puro': 1000,
    'pepita_ouro': 100,
    'prata': 10,
    'moeda_antiga': 0.50
  }
}

'banco': {
  nome: '🏦 First National Bank',
  tamanho: {x: 6, z: 8, y: 4},
  
  recipe: {
    'cimento': 100,
    'pedra': 200,
    'vidro': 20,
    'porta_reforçada': 2,
    'aço': 50
  },
  
  // Funcionalidades
  servicos: {
    'depositar': {
      função: 'guardar dinheiro seguro',
      taxa: '0%',
      velocidade: 'instantâneo'
    },
    'sacar': {
      função: 'retirar dinheiro',
      taxa: '0%',
      velocidade: 'instantâneo'
    },
    'juros': {
      taxa: '1% por dia game',
      mínimo: 100,
      máximo: 100000,
      calcula_automático: true
    },
    'empréstimo': {
      juros: '10% por dia',
      tempo_máximo: 10,
      risco_calote: true
    },
    'cofre_pessoal': {
      slot_armazenamento: 50,
      segurança: 'máxima',
      custo: '50 moeda/dia'
    }
  },
  
  // Roubo
  roubo: {
    'dificuldade': 'muito_alta',
    'guarda_banco': 3,
    'xerife_responde': true,
    'dinamite': 'necessária',
    'tempo_cofre': '15 segundos',
    'recompensa_roubo': 'até 50000',
    'risco_morte': '80%',
    'risco_prisão': '90%'
  }
}
```

## Economia Dinâmica

```javascript
'economia_dinâmica': {
  // Preços variam por oferta/demanda
  oferta_demanda: {
    'ouro': {
      preço_base: 1000,
      quantidade_minerada_mês: 50,
      preço_múltiplo: 1000 / quantidade_minerada  // Sobe se pouco ouro
    },
    'alimento': {
      preço_base: 10,
      quantidade_colhida: 200,
      preço_múltiplo: 10 / quantidade_colhida
    },
    'madeira': {
      preço_base: 5,
      quantidade_cortada: 500,
      preço_múltiplo: 5 / quantidade_cortada
    }
  },
  
  // Eventos que afetam economia
  eventos_econômicos: [
    {nome: 'Roubo de Trem', efeito: 'preços sobem 20%', duração: 3},
    {nome: 'Safra Boa', efeito: 'alimentos caem 30%', duração: 7},
    {nome: 'Seca', efeito: 'tudo sobe 40%', duração: 14},
    {nome: 'Banco Quebrado', efeito: 'pânico, juros caem', duração: 21}
  ],
  
  // Salários NPCs
  salarios: {
    'vendedor': 30,
    'ferreiro': 50,
    'chef': 40,
    'barman': 30,
    'garçonete': 20,
    'xerife': 100,
    'xerife_adjunto': 60
  }
}
```

---

# FASE 3: LEI E CRIME (Semanas 5-6)

## 🤠 Sistema de Xerife e Criminalidade

```javascript
'xerife': {
  nome: '🤠 Sheriff John law',
  posição: 'delegacia',
  
  // Patrulha
  patrulha: {
    dia: {
      horário: '6:00-22:00',
      rota: 'ruas_principais',
      velocidade: 'lenta',
      ameaça: 'média'
    },
    noite: {
      horário: '22:00-6:00',
      rota: 'saloon_banco',
      velocidade: 'rápida',
      ameaça: 'alta'
    }
  },
  
  // Sistema de criminalidade
  criminalidade: {
    'roubo_banco': {
      nível_ameaça: 5.0,
      recompensa_captura: 5000,
      prisão_dias: 10,
      tempo_fuga_necessário: 300
    },
    'assalto_trem': {
      nível_ameaça: 4.5,
      recompensa_captura: 3000,
      prisão_dias: 7,
      tempo_fuga_necessário: 200
    },
    'matar_pessoa': {
      nível_ameaça: 4.0,
      recompensa_captura: 2000,
      prisão_dias: 5,
      pena_morte: '50% chance'
    },
    'roubar_carroça': {
      nível_ameaça: 2.0,
      recompensa_captura: 500,
      prisão_dias: 2
    },
    'matar_animal': {
      nível_ameaça: 0.5,
      recompensa_captura: 50,
      prisão_dias: 0
    }
  },
  
  // Resposta progressiva
  resposta: {
    'nível_0': 'sem crime',
    'nível_1': 'xerife avisa (mensagem)',
    'nível_2': 'xerife persegue (rápido)',
    'nível_3': 'xerife dispara (tiro de aviso)',
    'nível_4': 'xerife mata (sem hesitar)',
    'nível_5': 'xerife + deputados perseguem'
  }
}

'prisão': {
  nome: '🔒 Delegacia/Cadeia',
  
  // Preso
  quando_preso: {
    'tempo_prisão': 'depende crime',
    'itens_removidos': 'todos, exceto roupa',
    'armas_confiscadas': true,
    'dinheiro_confiscado': true,
    'respawn_local': 'cela'
  },
  
  // Atividades na prisão
  atividades: {
    'trabalho_forçado': {
      ganho: '10 moeda/hora',
      efeito: 'reduz tempo prisão 10%'
    },
    'quebra-quebra': {
      efeito: 'ganha bens, +2 nível crime',
      risco: 'espancamento'
    },
    'escapar': {
      dificuldade: 'muito_alta',
      risco: 'morte se pego',
      recompensa: 'liberdade'
    }
  },
  
  // Visitas
  visitas: {
    'amigos_podem_visitar': true,
    'trazer_itens': true,
    'pagar_fiança': 'custa 50% do valor crime'
  }
}
```

## Fluxo de Crime e Punição

```
ANTES DO CRIME:
1. Player planeja (vai roubar banco)
2. Reúne gangue (3-5 players)
3. Compra dinamite/ferramentas

DURANTE O CRIME:
4. Ataca banco (combate com guardas)
5. Abre cofre (15 segundos vulnerável)
6. Leva ouro (peso = movimento lento)
7. XERIFE VÊ (nível crime sobe para 5)

FUGA:
8. Xerife persegue a cavalo
9. Dispara (tiro de aviso)
10. Perseguição (combate ou fuga)

RESULTADO A:
11. Consegue escapar (500m+ longe)
12. Nível crime cai lentamente (1 ponto/hora)
13. SUCESSO: +50000 moeda!

RESULTADO B:
14. Capturado pelo xerife
15. PRISÃO: 10 dias, itens perdidos
16. Pode pagar fiança (25000) ou escapar

RESULTADO C:
17. Morto em combate
18. RESPAWNA na delegacia
19. Prisão automática (5 dias)
20. Tudo perdido
```

---

# FASE 4: TREM (Semanas 7-8)

## 🚂 Sistema de Trem

```javascript
'trem': {
  nome: '🚂 Transcontinental Express',
  
  // Rota e horário
  rota: [
    {cidade: 'Dusty Gulch', hora: '6:00', parada: 60},
    {cidade: 'Copper Creek', hora: '10:00', parada: 45},
    {cidade: 'Silver City', hora: '14:00', parada: 30},
    {cidade: 'Gold Town', hora: '18:00', parada: 0}  // Terminal
  ],
  
  velocidade: 20,  // m/s
  ciclo: '24 horas',
  frequência: 'uma vez por dia',
  
  // Cargas
  cargas: [
    {item: 'ouro_puro', quantidade: 50, valor: 50000, segurança: 'máxima'},
    {item: 'diamantes', quantidade: 30, valor: 30000, segurança: 'máxima'},
    {item: 'armas', quantidade: 100, valor: 20000, segurança: 'alta'},
    {item: 'álcool', quantidade: 500, valor: 10000, segurança: 'média'}
  ],
  
  // Segurança
  segurança: {
    'guardas_trem': 2,
    'xerife_escolta': true,
    'armamentos': 'rifles + pistolas',
    'metralhadora_turela': true  // Final opcional
  },
  
  // Passageiros
  passageiros: {
    'normais': 20,
    'bilionário': 1,  // Alto valor (roubo especial)
    'xerife': 1,
    'bandidos_ia': '30% chance de haver'
  }
}
```

## Assalto de Trem

```javascript
'assalto_trem': {
  // MÉTODO 1: Roubo em Movimento
  metodo_1: {
    nome: 'Pular no Trem',
    
    passos: [
      '1. Espera trem passar',
      '2. Pula na lateral (timing crítico)',
      '3. Derrota guardas (combate)',
      '4. Abre vagão de carga (10s)',
      '5. Rouba ouro (peso máximo)',
      '6. Pula fora (timing crítico)',
      '7. Escapa antes xerife (500m+)'
    ],
    
    dificuldade: 'extrema',
    risco_morte: '60%',
    recompensa: 'até 50000',
    tempo_execução: '3-5 minutos'
  },
  
  // MÉTODO 2: Descarrilamento
  metodo_2: {
    nome: 'Dinamitar Trilhos',
    
    passos: [
      '1. Coloca dinamite na trilha (seco)',
      '2. Corre para longe',
      '3. Trem descarrila (explosão)',
      '4. Saques vagões destruídos',
      '5. Xerife chega em 5 minutos'
    ],
    
    dificuldade: 'extrema',
    risco_morte: '50%',
    recompensa: 'até 70000 (mais ouro solto)',
    tempo_execução: '5-10 minutos'
  },
  
  // MÉTODO 3: Dentro do Trem
  metodo_3: {
    nome: 'Comprar Passagem + Roubar',
    
    passos: [
      '1. Compra passagem (50 moeda)',
      '2. Entra como passageiro normal',
      '3. Mata guardas (silencioso?)',
      '4. Rouba carga (1 minuto)',
      '5. Pula janela em movimento',
      '6. Consegue escapar'
    ],
    
    dificuldade: 'muito_alta',
    risco_morte: '40%',
    recompensa: 'até 50000',
    tempo_execução: '3-4 minutos'
  }
}
```

---

# FASE 5: CIDADES INTEIRAS (Semanas 9-12)

## 🏘️ Sistema de Cidades

```javascript
'cidades': {
  total: 5,
  
  'dusty_gulch': {
    nome: 'Dusty Gulch (Hub Principal)',
    população: 200,
    importância: 'máxima',
    
    locais: [
      {nome: 'Saloon Golden Nugget', npc: 8, atividades: 'beber, poker'},
      {nome: 'First National Bank', npc: 5, atividades: 'banco, roubo'},
      {nome: 'Sheriff Office', npc: 4, atividades: 'lei, bounties'},
      {nome: 'Train Station', npc: 3, atividades: 'viajar, assalto'},
      {nome: 'Copper Mine', npc: 10, atividades: 'minerar'},
      {nome: 'General Store', npc: 3, atividades: 'comprar'},
      {nome: 'Church', npc: 2, atividades: 'religião'},
      {nome: 'Cemetery', npc: 1, atividades: 'explorar'},
      {nome: 'Bordel', npc: 4, atividades: 'encontro'},
      {nome: 'Cassino', npc: 6, atividades: 'jogos, apostas'}
    ],
    
    dinâmica: {
      'crimes_noturnos': true,
      'bares_abertos_noite': true,
      'patrulha_dia': true,
      'eventos_semanais': true
    }
  },
  
  'copper_creek': {
    nome: 'Copper Creek (Minério)',
    população: 80,
    especialidade: 'cobre/minério',
    locais: ['mina_principal', 'fundição', 'taverna_pequena', 'hotel']
  },
  
  'silver_city': {
    nome: 'Silver City (Riqueza)',
    população: 150,
    especialidade: 'prata/luxo',
    locais: ['banco_grande', 'cassino_luxo', 'resort', 'teatro']
  },
  
  'gold_town': {
    nome: 'Gold Town (Terminal)',
    população: 100,
    especialidade: 'ouro/exportação',
    locais: ['porto_minério', 'armazém_grande', 'escritório_exportação']
  },
  
  'tombstone': {
    nome: 'Tombstone (Legendária)',
    população: 50,
    especialidade: 'lendária/perigos',
    locais: ['saloon_famoso', 'cemitério_grande', 'duelo_local'],
    evento: 'local de duelos épicos'
  }
}
```

## Dinâmica de Cidades

```
DIA (6:00-18:00):
├─ Lojas abertas
├─ NPCs trabalham
├─ Xerife patrulha
├─ Menos atividades noturnas
└─ Músicos descansam

NOITE (18:00-6:00):
├─ Saloons abrem
├─ Cassinos vivos
├─ Crimes aumentam (roubos)
├─ Prostituição ativa
├─ Xerife em alerta
└─ Música ao vivo

EVENTOS SEMANAIS:
├─ Segunda: Entrega de suprimentos
├─ Quarta: Rodeo (competições)
├─ Sexta: Grande festa no Saloon
├─ Domingo: Serviço religioso
└─ Aleatório: Crime, motim, invasão
```

---

# FASE 6: QUESTS E MISSÕES (Semanas 13-14)

## 📋 Sistema de Quests

```javascript
'quests': {
  tipos: [
    {
      nome: 'Delivery',
      exemplo: 'Leva letra para vizinha',
      recompensa: '50 moeda',
      dificuldade: 'fácil'
    },
    {
      nome: 'Escolta',
      exemplo: 'Protege carroça até cidade',
      recompensa: '200 moeda',
      dificuldade: 'média',
      risco: 'assaltantes'
    },
    {
      nome: 'Bounty Hunting',
      exemplo: 'Captura Billy the Kid',
      recompensa: '5000 moeda',
      dificuldade: 'muito_difícil',
      risco: 'morte'
    },
    {
      nome: 'Exploração',
      exemplo: 'Descobre nova mina de ouro',
      recompensa: '1000 moeda',
      dificuldade: 'média'
    },
    {
      nome: 'Construção',
      exemplo: 'Constrói casa para NPC',
      recompensa: '500 moeda',
      dificuldade: 'média'
    },
    {
      nome: 'Resgate',
      exemplo: 'Salva refém de bandidos',
      recompensa: '2000 moeda',
      dificuldade: 'muito_difícil',
      risco: 'morte'
    },
    {
      nome: 'Assalto Coordenado',
      exemplo: 'Rouba banco com ajuda de NPC',
      recompensa: '30000 moeda',
      dificuldade: 'extrema',
      risco: 'prisão'
    }
  ],
  
  // Reputação com NPCs
  reputação: {
    escala: '-100 a +100',
    effects: {
      '-100': 'inimigo (ataca)',
      '-50': 'hostil (foge)',
      '0': 'neutro',
      '+50': 'amigo (desconto)',
      '+100': 'melhor amigo (quests especiais)'
    }
  }
}
```

---

# FASE 7: FEATURES ADICIONAIS (Semanas 15-20)

## ⚔️ Duelos PvP

```javascript
'duelos': {
  tipo: 'pvp_skill',
  local: 'praça_central_cidades',
  horário: '12:00 (meio-dia)',
  
  // Mecânica
  mecanismo: {
    '1. Face a Face': 'players se posicionam (10m distância)',
    '2. Contagem': '3...2...1...SAQUE!',
    '3. Saque': 'primeiro tiro mais rápido ganha',
    '4. Vencedor': 'rouba $500 + itens'
  },
  
  resultado: {
    vencedor: {
      dinheiro: 500,
      itens: 'itens do perdedor',
      reputação: '+5',
      notoriedade: '+1'
    },
    perdedor: {
      morte: true,
      respawn: 'hospital',
      dinheiro: 'perdido',
      reputação: '-10'
    }
  }
}
```

## 🏹 Tribos Indígenas

```javascript
'tribos': {
  'apache': {
    nome: '🏹 Apache',
    localização: 'deserto_sul',
    população: 30,
    
    relação_player: {
      'amigo': 'compra/venda especial',
      'neutro': 'podem atacar',
      'inimigo': 'perseguição'
    },
    
    produtos: [
      'medicinas_naturais (recupera 50 saúde)',
      'peles_raras (valor 500)',
      'cavalos_selvagens (montar rápido)',
      'conhecimento_terra (bônus mineração)'
    ],
    
    eventos: [
      'dança_ritual (espetáculo)',
      'caça_coletiva (pode participar)',
      'ataque_soldados (ajudar = +reputação)',
      'negociação_paz (trégua com governo)'
    ]
  }
}
```

## 🎰 Jogos de Azar Completos

```javascript
'jogos_azar': {
  'poker': {
    local: 'saloon',
    jogadores: '4-6',
    aposta: '10-1000 moeda',
    rodadas: 'flop + turn + river'
  },
  
  'blackjack': {
    local: 'cassino',
    objetivo: '21 sem passar',
    aposta: '5-500 moeda'
  },
  
  'corrida_cavalos': {
    local: 'hipódromo',
    cavalos: 8,
    apostas: 'ganhador/segundo/terceiro',
    odds: 'dinâmicas'
  },
  
  'roulette': {
    local: 'cassino_luxo',
    números: '0-36',
    aposta: '1-100 moeda'
  }
}
```

## ⛏️ Garimpo Avançado

```javascript
'garimpo': {
  'ouro_puro': {
    chance: '30%',
    valor: 100,
    tempo: 30,
    esforço: 10
  },
  
  'ouro_misto': {
    chance: '50%',
    valor: 50,
    tempo: 15,
    esforço: 5
  },
  
  'perigos': [
    'desabamento (dano 30)',
    'água (luta contra)',
    'gás_tóxico (perda saúde)',
    'explosão (morte 1%)'
  ]
}
```

## 🌡️ Clima Dinâmico

```javascript
'clima': {
  tipos: [
    'céu_limpo',
    'nublado',
    'chuva_leve',
    'chuva_forte',
    'tempestade_poeira',
    'neve',
    'nevoeiro'
  ],
  
  efeitos: {
    'chuva': {
      durabilidade: '-1',
      visibilidade: '50%',
      velocidade: '-10%',
      iluminação: '60%'
    },
    'tempestade': {
      dano: true,
      visibilidade: '20%',
      velocidade: '-30%'
    }
  },
  
  ciclos: {
    'dia_noite': '48 min = 1 dia game',
    'estações': '1 semana game = estação',
    'lua_fases': true
  }
}
```

---

# 📊 CRONOGRAMA DETALHADO

```
SEMANA 1-2: SALOON ✅
├─ Interior design
├─ NPCs barman, garçonete, prostitutas
├─ Sistema de drinks
├─ Poker básico
└─ Atividades (beber, dançar)

SEMANA 3-4: ECONOMIA ✅
├─ Sistema de moeda
├─ Banco (depositar, sacar, juros)
├─ Preços dinâmicos
├─ Roubo de banco
└─ Salários NPCs

SEMANA 5-6: LEI E CRIME ✅
├─ Xerife patrulha
├─ Sistema de crimes
├─ Níveis de ameaça
├─ Prisão
└─ Fuga

SEMANA 7-8: TREM ✅
├─ Rota e horários
├─ Cargas
├─ 3 métodos de assalto
├─ Perseguição
└─ Colisão/desabamento

SEMANA 9-12: CIDADES ✅
├─ 5 cidades inteiras
├─ 50+ NPCs com rotinas
├─ Dinâmica dia/noite
├─ Eventos semanais
└─ Economia local

SEMANA 13-14: QUESTS ✅
├─ 7 tipos de quests
├─ Sistema de reputação
├─ Givers distribuídos
└─ Recompensas

SEMANA 15-16: DUELOS + BOUNTIES ✅
├─ Sistema de duelo
├─ Bounty hunting
├─ Recompensas dinâmicas
└─ Combate PvP

SEMANA 17-18: JOGOS E GARIMPO ✅
├─ Poker avançado
├─ Blackjack
├─ Corrida cavalos
├─ Mineração
└─ Perigos

SEMANA 19-20: FINALIZAÇÕES ✅
├─ Clima dinâmico
├─ Tribos indígenas
├─ Rodeo/eventos
├─ Polimento
└─ Bugs e otimização

TOTAL: 20 Semanas = ~5 meses full-time
ou ~10 meses part-time (2h/dia)
```

---

# 🛠️ ARQUITETURA TÉCNICA

## Novo Backend Necessário

```javascript
// Node.js API Backend (expandido)

// Modelos
User → Player profile, stats, money, items
NPC → Rotinas, reputação, salário, comportamento
City → Dinâmica, preços, crimes, eventos
Crime → Registro, recompensa, status
Quest → Objetivos, recompensas, progresso
Economy → Preços dinâmicos, inflação
TownHall → Leis, eventos, notícias

// Endpoints novos
POST /api/crime/cometer
GET /api/xerife/procurados
POST /api/banco/depositar
GET /api/trem/horário
POST /api/quest/aceitar
GET /api/economia/preços
POST /api/duelo/desafiar
```

---

# 💾 DATABASE SCHEMA EXPANDIDO

```sql
-- Economia
CREATE TABLE moeda (
  player_id UUID,
  quantidade INT,
  data_atualização TIMESTAMP
);

CREATE TABLE banco (
  player_id UUID,
  saldo INT,
  juros_acumulados INT,
  empréstimo INT
);

-- Crimes
CREATE TABLE crimes (
  id UUID,
  player_id UUID,
  tipo VARCHAR,
  data TIMESTAMP,
  nível_ameaça FLOAT,
  status ('fugindo', 'preso', 'resolvido')
);

-- Quests
CREATE TABLE quests (
  id UUID,
  player_id UUID,
  tipo VARCHAR,
  npc_giver UUID,
  status ('pendente', 'em_progresso', 'completa'),
  recompensa INT,
  data_aceita TIMESTAMP
);

-- Cidades
CREATE TABLE cidades (
  id UUID,
  nome VARCHAR,
  população INT,
  segurança FLOAT,
  economia FLOAT,
  eventos JSONB
);

-- NPCs
CREATE TABLE npcs (
  id UUID,
  nome VARCHAR,
  profissão VARCHAR,
  cidade_id UUID,
  rotina JSONB,
  relacionamento INT,
  salário INT,
  posição JSONB
);
```

---

# ✨ RESULTADO FINAL

Após 20 semanas:

```
🎮 FRONTEIRA VELHO OESTE ÉPICO

✅ 5 cidades inteiras
✅ 200+ NPCs vivos
✅ Economia dinâmica real
✅ Saloon funcional (poker, bebidas, prostituição)
✅ Banco (depósito, roubo, juros)
✅ Trem (3 métodos assalto, perseguição)
✅ Lei e crime (xerife, prisão, recompensas)
✅ 50+ quests diferentes
✅ PvP duelos
✅ Garimpo/Mineração
✅ Jogos de azar (poker, blackjack, corrida)
✅ Tribos indígenas
✅ Bounty hunting
✅ Rodeo/Competições
✅ Clima dinâmico
✅ 100+ horas de gameplay
✅ Replayability infinita

NÃO É MAIS UM "GAME DE CONSTRUÇÃO"
É UM VERDADEIRO VELHO OESTE!
```

---

**Quer que eu detalhe AINDA MAIS alguma fase?** 🤠
