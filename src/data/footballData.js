export const CATEGORIAS = [
  'Sub-5','Sub-7','Sub-9','Sub-11','Sub-13','Sub-15','Sub-17','Sub-20','Adulto/Amador'
];

export const GRUPOS_CATEGORIA = {
  'Sub-5': 'iniciacao',
  'Sub-7': 'iniciacao',
  'Sub-9': 'iniciacao',
  'Sub-11': 'desenvolvimento',
  'Sub-13': 'desenvolvimento',
  'Sub-15': 'aperfeicoamento',
  'Sub-17': 'aperfeicoamento',
  'Sub-20': 'alto_rendimento',
  'Adulto/Amador': 'alto_rendimento',
};

export const GRUPOS_LABEL = {
  iniciacao: 'Iniciação (Sub-5 a Sub-9)',
  desenvolvimento: 'Desenvolvimento (Sub-11 a Sub-13)',
  aperfeicoamento: 'Aperfeiçoamento (Sub-15 a Sub-17)',
  alto_rendimento: 'Alto Rendimento (Sub-20 e Adulto)',
};

export const BLOCOS_TREINO = [
  { id: 'aquecimento',          nome: 'Aquecimento',                icone: 'Flame',    corHex: '#f97316', percentual: 0.10 },
  { id: 'prep_fisica',          nome: 'Preparação Física e Motora', icone: 'Dumbbell', corHex: '#8b5cf6', percentual: 0.10 },
  { id: 'tecnica',              nome: 'Técnica',                    icone: 'Target',   corHex: '#3b82f6', percentual: 0.18 },
  { id: 'tatica',               nome: 'Tática',                     icone: 'Map',      corHex: '#1d4ed8', percentual: 0.18 },
  { id: 'mini_jogos',           nome: 'Mini Jogos',                 icone: 'Gamepad2', corHex: '#ca8a04', percentual: 0.12 },
  { id: 'jogos_condicionados',  nome: 'Jogos Condicionados',        icone: 'Shuffle',  corHex: '#dc2626', percentual: 0.12 },
  { id: 'jogo',                 nome: 'Jogo',                       icone: 'Trophy',   corHex: '#16a34a', percentual: 0.15 },
  { id: 'volta_calma',          nome: 'Volta à Calma',              icone: 'Wind',     corHex: '#0891b2', percentual: 0.05 },
];

export const FASES_MACRO = [
  { id: 'pre_temporada',  label: 'Pré-Temporada',      cor: '#ca8a04' },
  { id: 'competitiva',    label: 'Competitiva',         cor: '#16a34a' },
  { id: 'transicao',      label: 'Transição',           cor: '#6b7280' },
  { id: 'ferias',         label: 'Férias / Recesso',    cor: '#0891b2' },
];

export const MESES_ANO = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export const EQUIPAMENTOS_TATICOS = [
  { id: 'cone',        label: 'Cone',          forma: 'triangle',  cor: '#f97316' },
  { id: 'bola',        label: 'Bola',          forma: 'circle',    cor: '#92400e' },
  { id: 'prato',       label: 'Prato Chinês',  forma: 'disc',      cor: '#ca8a04' },
  { id: 'manequim',    label: 'Manequim',      forma: 'person',    cor: '#dc2626' },
  { id: 'mini_gol',    label: 'Mini Gol',      forma: 'goal',      cor: '#1d4ed8' },
  { id: 'barreira',    label: 'Barreira',      forma: 'barrier',   cor: '#6b7280' },
  { id: 'bandeirinha', label: 'Bandeirinha',   forma: 'flag',      cor: '#dc2626' },
  { id: 'estaca',      label: 'Estaca',        forma: 'stake',     cor: '#15803d' },
];

export const FORMACOES = {
  '4-3-3': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'LAD', x: 15, y: 72 }, { pos: 'ZAG', x: 35, y: 75 }, { pos: 'ZAG', x: 65, y: 75 }, { pos: 'LAE', x: 85, y: 72 },
    { pos: 'MED', x: 25, y: 52 }, { pos: 'VOL', x: 50, y: 55 }, { pos: 'MED', x: 75, y: 52 },
    { pos: 'PD',  x: 20, y: 28 }, { pos: 'CA',  x: 50, y: 22 }, { pos: 'PE',  x: 80, y: 28 },
  ],
  '4-4-2': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'LAD', x: 15, y: 72 }, { pos: 'ZAG', x: 35, y: 75 }, { pos: 'ZAG', x: 65, y: 75 }, { pos: 'LAE', x: 85, y: 72 },
    { pos: 'MD',  x: 15, y: 50 }, { pos: 'MCD', x: 38, y: 53 }, { pos: 'MCE', x: 62, y: 53 }, { pos: 'ME',  x: 85, y: 50 },
    { pos: 'CA',  x: 35, y: 25 }, { pos: 'CA',  x: 65, y: 25 },
  ],
  '3-5-2': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'ZAG', x: 25, y: 75 }, { pos: 'ZAG', x: 50, y: 78 }, { pos: 'ZAG', x: 75, y: 75 },
    { pos: 'LAD', x: 10, y: 52 }, { pos: 'VOL', x: 30, y: 55 }, { pos: 'MCD', x: 50, y: 52 }, { pos: 'MED', x: 70, y: 55 }, { pos: 'LAE', x: 90, y: 52 },
    { pos: 'CA',  x: 35, y: 25 }, { pos: 'CA',  x: 65, y: 25 },
  ],
  '4-2-3-1': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'LAD', x: 15, y: 72 }, { pos: 'ZAG', x: 35, y: 75 }, { pos: 'ZAG', x: 65, y: 75 }, { pos: 'LAE', x: 85, y: 72 },
    { pos: 'VOL', x: 35, y: 57 }, { pos: 'VOL', x: 65, y: 57 },
    { pos: 'ME',  x: 15, y: 40 }, { pos: 'MAT', x: 50, y: 38 }, { pos: 'MD',  x: 85, y: 40 },
    { pos: 'CA',  x: 50, y: 22 },
  ],
  '5-3-2': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'LAD', x: 10, y: 70 }, { pos: 'ZAG', x: 28, y: 75 }, { pos: 'ZAG', x: 50, y: 78 }, { pos: 'ZAG', x: 72, y: 75 }, { pos: 'LAE', x: 90, y: 70 },
    { pos: 'MED', x: 25, y: 50 }, { pos: 'VOL', x: 50, y: 52 }, { pos: 'MED', x: 75, y: 50 },
    { pos: 'CA',  x: 35, y: 25 }, { pos: 'CA',  x: 65, y: 25 },
  ],
  '1-2-1 (futsal)': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'FIX', x: 50, y: 70 },
    { pos: 'ALE', x: 15, y: 45 }, { pos: 'ALE', x: 85, y: 45 },
    { pos: 'PVO', x: 50, y: 22 },
  ],
  '2-2 (society)': [
    { pos: 'GOL', x: 50, y: 92 },
    { pos: 'ZAG', x: 30, y: 68 }, { pos: 'ZAG', x: 70, y: 68 },
    { pos: 'MEI', x: 30, y: 42 }, { pos: 'MEI', x: 70, y: 42 },
    { pos: 'ATA', x: 50, y: 20 },
  ],
};

export const OBJETIVOS_POR_BLOCO = {
  aquecimento: [
    'Elevar a temperatura corporal progressivamente',
    'Ativar os principais grupos musculares',
    'Promover a familiarização com a bola',
    'Estimular coordenação e equilíbrio',
    'Preparar mentalmente para o treino',
    'Trabalhar mobilidade articular',
  ],
  prep_fisica: [
    'Desenvolver resistência aeróbica',
    'Trabalhar força muscular específica',
    'Aprimorar velocidade e aceleração',
    'Desenvolver agilidade e mudança de direção',
    'Aperfeiçoar coordenação motora',
    'Fortalecer core e estabilidade',
  ],
  tecnica: [
    'Aprimorar controle e domínio de bola',
    'Trabalhar passe curto com precisão',
    'Desenvolver passe longo e cruzamento',
    'Aperfeiçoar condução e drible',
    'Melhorar finalização ao gol',
    'Trabalhar cabeceio',
    'Aprimorar saída de bola pelo goleiro',
  ],
  tatica: [
    'Compreender e aplicar a formação tática',
    'Trabalhar movimentação sem bola',
    'Desenvolver marcação pressão/bloco',
    'Aprimorar transição defesa-ataque',
    'Trabalhar linha defensiva e ofensiva',
    'Desenvolver bola parada (escanteio, falta, lateral)',
    'Aprimorar posse de bola e triangulações',
  ],
  mini_jogos: [
    'Aplicar técnica em situação real de jogo',
    'Desenvolver tomada de decisão rápida',
    'Estimular criatividade e improviso',
    'Trabalhar superioridade numérica',
    'Desenvolver comunicação em campo',
  ],
  jogos_condicionados: [
    'Reforçar conceitos táticos com regras específicas',
    'Aumentar intensidade e ritmo de jogo',
    'Desenvolver inteligência tática situacional',
    'Trabalhar pressão em espaços reduzidos',
    'Aplicar padrões de jogo da metodologia',
  ],
  jogo: [
    'Consolidar o aprendizado em situação real',
    'Desenvolver competitividade saudável',
    'Avaliar desempenho individual e coletivo',
    'Aplicar a identidade de jogo da escola',
    'Estimular tomada de decisão autônoma',
  ],
  volta_calma: [
    'Reduzir frequência cardíaca gradualmente',
    'Alongar os principais grupos musculares',
    'Fazer reflexão coletiva sobre o treino',
    'Prevenir lesões com alongamento adequado',
    'Trabalhar aspectos emocionais e psicológicos',
  ],
};

const BANCO_ATIVIDADES = {
  iniciacao: {
    aquecimento: [
      {
        titulo: 'Pega-Pega com Bola',
        descricao: 'Cada criança conduz sua bola pelo espaço delimitado enquanto tenta tocar (pegar) os colegas sem perder o controle da bola. Quem é tocado congela até ser salvo por um colega.',
        objetivos: ['Familiarização com a bola', 'Coordenação em movimento', 'Aquecimento lúdico'],
        materiais: 'Bolas (1 por criança), cones para delimitar área',
        organizacao: 'Área delimitada por cones. Todos com bola exceto o pegador.',
        progressao: 'Aumentar número de pegadores; reduzir espaço; usar apenas o pé fraco.',
        duracao_sugerida: 10,
        tags: ['lúdico', 'coordenação', 'bola'],
      },
      {
        titulo: 'Circuito de Cones',
        descricao: 'Percurso em zigue-zague com cones espaçados 1,5m. As crianças conduzem a bola pelo percurso e voltam trotando.',
        objetivos: ['Controle de bola em movimento', 'Equilíbrio', 'Aquecimento progressivo'],
        materiais: '10 cones, 1 bola por criança',
        organizacao: 'Fila única. Um de cada vez parte ao sinal. Os demais fazem domínio parados.',
        progressao: 'Aumentar velocidade; alternar pés; adicionar obstáculos.',
        duracao_sugerida: 8,
        tags: ['condução', 'controle', 'circuito'],
      },
      {
        titulo: 'Bicho-Papão da Bola',
        descricao: 'Um jogador sem bola (o "bicho-papão") tenta roubar a bola dos demais. Quem perde a bola vira o bicho-papão.',
        objetivos: ['Proteção de bola', 'Reação rápida', 'Diversão e engajamento'],
        materiais: 'Bolas (1 por criança exceto o bicho-papão), área delimitada',
        organizacao: 'Espaço reduzido. 1 pegador para cada 5 jogadores.',
        progressao: 'Mais pegadores; espaço menor; dois contatos máximo na bola.',
        duracao_sugerida: 10,
        tags: ['lúdico', 'proteção de bola', 'reação'],
      },
      {
        titulo: 'Estátua com Bola',
        descricao: 'Música toca enquanto as crianças conduzem a bola. Quando a música para, todos param e equilibram a bola no pé.',
        objetivos: ['Equilíbrio', 'Atenção', 'Controle de bola parada'],
        materiais: 'Bolas, caixa de som',
        organizacao: 'Espaço livre, todos conduzindo ao mesmo tempo.',
        progressao: 'Quem não equilibrar sai por uma rodada e faz domínio à parte.',
        duracao_sugerida: 8,
        tags: ['lúdico', 'equilíbrio', 'atenção'],
      },
    ],
    prep_fisica: [
      {
        titulo: 'Circuito Coordenativo',
        descricao: 'Estações: pular bambolês com os dois pés, contornar cones lateralmente, passar por baixo de barreira, subir e descer de step. Rotação a cada 2 minutos.',
        objetivos: ['Coordenação motora ampla', 'Agilidade', 'Equilíbrio dinâmico'],
        materiais: 'Bambolês, cones, barreiras baixas, step ou caixote',
        organizacao: '4 estações, grupos de 3-4 crianças por estação.',
        progressao: 'Adicionar bola em cada estação; cronometrar.',
        duracao_sugerida: 12,
        tags: ['coordenação', 'agilidade', 'circuito'],
      },
      {
        titulo: 'Corrida dos Animais',
        descricao: 'Treinador grita um animal e as crianças imitam o movimento: caranguejo (quadrupede lateral), sapo (agachamento com salto), coelho (saltos à frente).',
        objetivos: ['Força de membros inferiores', 'Coordenação', 'Divertimento'],
        materiais: 'Nenhum',
        organizacao: 'Espaço aberto. Todos juntos, treinador na frente.',
        progressao: 'Incluir bola equilibrada nas costas (caranguejo); cronometrar distâncias.',
        duracao_sugerida: 8,
        tags: ['força', 'coordenação', 'lúdico'],
      },
      {
        titulo: 'Pega Rabo',
        descricao: 'Cada criança tem um "rabo" (colete ou fita preso na calça). O objetivo é pegar o rabo dos outros sem perder o próprio. Quem perder o rabo continua tentando pegar dos outros.',
        objetivos: ['Velocidade de reação', 'Agilidade', 'Mudança de direção'],
        materiais: 'Coletes ou fitas (1 por criança)',
        organizacao: 'Área delimitada por cones. Todos juntos.',
        progressao: 'Adicionar bola na condução; reduzir espaço.',
        duracao_sugerida: 10,
        tags: ['agilidade', 'velocidade', 'reação'],
      },
    ],
    tecnica: [
      {
        titulo: 'Domínio com a Solinha',
        descricao: 'Crianças em duplas. Uma rola a bola, a outra para com a sola do pé. Alternar após 10 repetições. Foco em travar a bola com calma e controle.',
        objetivos: ['Controle de bola parada', 'Confiança com a bola', 'Coordenação básica'],
        materiais: '1 bola por dupla',
        organizacao: 'Duplas espalhadas pelo campo. Distância de 3-4 metros.',
        progressao: 'Rodar mais forte; usar o pé fraco; parar e já passar de volta.',
        duracao_sugerida: 12,
        tags: ['domínio', 'controle', 'pé fraco'],
      },
      {
        titulo: 'Passe em Duplas',
        descricao: 'Primeiros contatos de passe com a parte interna do pé. Duplas frente a frente. Foco na postura: pé de apoio ao lado da bola, pé de contato aberto.',
        objetivos: ['Passe curto com precisão', 'Postura correta', 'Noção espacial'],
        materiais: '1 bola por dupla, 2 cones por dupla (marcam a posição)',
        organizacao: 'Duplas com 5m de distância.',
        progressao: 'Aumentar distância; passar em movimento; usar o pé fraco.',
        duracao_sugerida: 12,
        tags: ['passe', 'técnica básica', 'pé interno'],
      },
      {
        titulo: 'Condução Livre com Desafios',
        descricao: 'Espaço livre para exploração. Treinador lança desafios a cada 30s: "conduz devagar", "conduz rápido", "muda de direção ao apito", "para a bola e recomeça".',
        objetivos: ['Exploração corporal com a bola', 'Atenção auditiva', 'Controle em diferentes velocidades'],
        materiais: '1 bola por criança',
        organizacao: 'Espaço amplo. Todos conduzindo ao mesmo tempo.',
        progressao: 'Conduzir apenas com o pé fraco; olhar para cima enquanto conduz.',
        duracao_sugerida: 10,
        tags: ['condução', 'controle', 'atenção'],
      },
      {
        titulo: 'Chute ao Gol',
        descricao: 'Crianças em fila. Treinador coloca a bola parada a 6-8m do gol. Cada criança corre, chuta e pega sua bola. Foco na aproximação e no contato com o peito do pé.',
        objetivos: ['Finalização básica', 'Contato com peito do pé', 'Confiança'],
        materiais: 'Mini gol ou gol pequeno, 5 bolas',
        organizacao: 'Fila lateral ao gol. Um por vez.',
        progressao: 'Bola em rolamento; chute de movimento; goleiro na frente.',
        duracao_sugerida: 12,
        tags: ['finalização', 'chute', 'gol'],
      },
    ],
    tatica: [
      {
        titulo: 'Passador e Finalizador',
        descricao: 'Dois grupos: passadores (na lateral) e finalizadores (no ataque). O passador serve e o finalizador chuta. Simples introdução ao conceito de passe + finalização.',
        objetivos: ['Noção de passe e finalização em sequência', 'Posicionamento básico', 'Comunicação'],
        materiais: 'Gol, bolas, cones',
        organizacao: '2 grupos, 5 por grupo. Alternando funções a cada 3 minutos.',
        progressao: 'Adicionar goleiro; troca de passe antes da finalização.',
        duracao_sugerida: 12,
        tags: ['tática básica', 'passe', 'finalização'],
      },
      {
        titulo: 'Quadrado da Posse',
        descricao: 'Grupo de 4 em quadrado. 3 passam entre si, 1 no meio tenta interceptar. Quem errar vai pro meio. Foco na movimentação para receber.',
        objetivos: ['Posse de bola básica', 'Movimentação para receber', 'Pressão e intercepção'],
        materiais: '4 cones (delimitam o quadrado), 1 bola',
        organizacao: 'Quadrados de 6×6m. Grupos de 4.',
        progressao: '2 no meio; reduzir o quadrado; 2 toques máximo.',
        duracao_sugerida: 12,
        tags: ['posse de bola', 'rondo', 'movimentação'],
      },
    ],
    mini_jogos: [
      {
        titulo: 'Jogo dos Gols Múltiplos',
        descricao: 'Campo pequeno com 4-6 mini gols espalhados. Cada equipe pode marcar em qualquer mini gol adversário. Estimula movimentação, visão de jogo e criatividade.',
        objetivos: ['Visão de jogo', 'Decisão rápida', 'Movimentação sem bola'],
        materiais: '4-6 mini gols ou pares de cones, 1 bola',
        organizacao: '3×3 ou 4×4. Campo 20×15m.',
        progressao: 'Reduzir número de gols; exigir passe antes do gol.',
        duracao_sugerida: 12,
        tags: ['mini jogo', 'visão de jogo', 'decisão'],
      },
      {
        titulo: 'Jogo da Bola na Linha',
        descricao: 'Marcar ponto ao parar a bola sobre a linha adversária (linha de fundo). Proibido chutar forte — apenas conduções e passes. Foco na progressão com bola.',
        objetivos: ['Condução com objetivo', 'Trabalho em equipe', 'Posse de bola lúdica'],
        materiais: 'Bola, área delimitada por cones',
        organizacao: '3×3. Campo 15×10m.',
        progressao: 'Obrigar passe antes de pontuar; passe e receba com o pé fraco.',
        duracao_sugerida: 12,
        tags: ['lúdico', 'condução', 'equipe'],
      },
    ],
    jogos_condicionados: [
      {
        titulo: '3×3 Todos Tocam',
        descricao: 'Jogo 3×3 com a regra: todos os jogadores do time devem tocar na bola antes de marcar gol. Estimula participação de todos e noção de equipe.',
        objetivos: ['Participação coletiva', 'Passe e movimentação', 'Noção de equipe'],
        materiais: 'Bola, mini gols, cones',
        organizacao: 'Campo 20×15m. Times de 3.',
        progressao: 'Exigir 2 passes antes do gol; incluir jogador coringa neutro.',
        duracao_sugerida: 15,
        tags: ['condicionado', 'equipe', 'passe obrigatório'],
      },
    ],
    jogo: [
      {
        titulo: 'Jogo Livre 4×4',
        descricao: 'Jogo livre em campo reduzido. Mínima interferência do treinador. Tempo para a criança jogar por prazer e aplicar o que aprendeu.',
        objetivos: ['Aplicação livre do aprendizado', 'Prazer no jogo', 'Autonomia'],
        materiais: 'Bolas, mini gols',
        organizacao: 'Times de 4. Campo 25×20m. Treinador como árbitro leve.',
        progressao: 'Nenhuma — deixar o jogo fluir livremente.',
        duracao_sugerida: 20,
        tags: ['jogo livre', 'autonomia', 'prazer'],
      },
    ],
    volta_calma: [
      {
        titulo: 'Roda de Alongamento',
        descricao: 'Grupo em roda. Treinador guia alongamentos de panturrilha, coxa, quadril e ombros. Cada posição por 20-30 segundos. Momento de conversa sobre o treino.',
        objetivos: ['Recuperação muscular', 'Flexibilidade', 'Reflexão coletiva'],
        materiais: 'Nenhum',
        organizacao: 'Roda em pé. Treinador no centro demonstrando.',
        progressao: 'Crianças se revezam para propor o próximo alongamento.',
        duracao_sugerida: 8,
        tags: ['alongamento', 'recuperação', 'reflexão'],
      },
    ],
  },

  desenvolvimento: {
    aquecimento: [
      {
        titulo: 'Rondo 3×1 Aquecimento',
        descricao: 'Posse de bola em círculo: 3 jogadores mantêm a posse e 1 no meio tenta interceptar. Alta intensidade e demanda técnica para aquecer de forma específica.',
        objetivos: ['Aquecimento específico com bola', 'Qualidade do passe', 'Pressão e intercepção'],
        materiais: '1 bola, 4 cones (delimitam área de 6×6m)',
        organizacao: 'Grupos de 4. Rodízio automático quando intercepta.',
        progressao: '2 no meio (rondo 4×2); reduzir área; 2 toques máximo.',
        duracao_sugerida: 10,
        tags: ['rondo', 'passe', 'pressão'],
      },
      {
        titulo: 'Corrida com Variações',
        descricao: 'Progressão de corrida: trote leve → sprint 70% → retrocesso → lateral → joelho alto → calcanhar. Treinador sinaliza cada variação com gestos ou apito.',
        objetivos: ['Aquecimento progressivo sem bola', 'Ativação neuromuscular', 'Preparação atlética'],
        materiais: 'Cones (marcas para sprint)',
        organizacao: 'Fila ou grupos. Em linha, percurso de 20m de ida e volta.',
        progressao: 'Adicionar mudança de direção ao sinal; sprint 90% no final.',
        duracao_sugerida: 8,
        tags: ['corrida', 'ativação', 'velocidade'],
      },
      {
        titulo: 'Passe e Corre',
        descricao: 'Em dois grupos opostos. Jogador passa para o colega à frente, corre para trás do grupo adversário. Sequência contínua e ritmo crescente.',
        objetivos: ['Qualidade do passe em movimento', 'Aquecimento dinâmico', 'Sincronia'],
        materiais: '2 bolas, 2 grupos de 5-6',
        organizacao: 'Dois grupos frente a frente. 15m de distância.',
        progressao: 'Aumentar velocidade; passe com 1 toque; incluir tiro na sequência.',
        duracao_sugerida: 8,
        tags: ['passe', 'movimento', 'ritmo'],
      },
    ],
    prep_fisica: [
      {
        titulo: 'Escada de Agilidade com Bola',
        descricao: 'Ladder (escada de agilidade) com variações: dois pés em cada quadrado, alternado, lateral. Ao terminar a escada, conduzir até o cone e voltar.',
        objetivos: ['Agilidade e coordenação de pés', 'Velocidade de reação', 'Controle de bola após esforço'],
        materiais: 'Escada de agilidade (ou fitas no chão), cones, 1 bola por jogador',
        organizacao: 'Fila. 1 por vez na escada, os demais fazem domínio.',
        progressao: 'Aumentar velocidade; finalizar com chute ao gol após condução.',
        duracao_sugerida: 12,
        tags: ['agilidade', 'escada', 'coordenação'],
      },
      {
        titulo: 'Circuito Físico-Técnico',
        descricao: '5 estações: (1) sprint 15m, (2) bambolê + controle, (3) abdominais com bola, (4) agachamento com bola, (5) lateral em cones + passe. 2 min cada.',
        objetivos: ['Condicionamento físico geral', 'Força funcional', 'Integração técnica'],
        materiais: 'Bambolês, cones, bolas, espaço aberto',
        organizacao: 'Grupos de 3 por estação. Rotação ao apito.',
        progressao: 'Reduzir tempo de descanso; aumentar intensidade das estações.',
        duracao_sugerida: 15,
        tags: ['circuito', 'físico', 'funcional'],
      },
    ],
    tecnica: [
      {
        titulo: 'Domínio e Passe em Movimento',
        descricao: 'Em duplas: jogador A passa, jogador B amorteça orientado (controle direcionado) e passa para A já em movimento. Foco no controle que já prepara o próximo passe.',
        objetivos: ['Controle orientado', 'Passe em movimento', 'Antecipação'],
        materiais: '1 bola por dupla, cones de referência',
        organizacao: 'Duplas. Distância de 8-10m. Movendo-se em paralelo.',
        progressao: 'Aumentar velocidade; adicionar um defensor passivo; exigir 1 toque.',
        duracao_sugerida: 15,
        tags: ['controle orientado', 'passe', 'movimento'],
      },
      {
        titulo: 'Cruzamento e Finalização',
        descricao: 'Ala cruza da linha de fundo e atacante chega para finalizar. Foco no timing da corrida, posicionamento e conexão de contato.',
        objetivos: ['Cruzamento com qualidade', 'Finalização de primeira', 'Timing de chegada'],
        materiais: 'Gol, bolas, cones',
        organizacao: 'Fila de alas e fila de atacantes. Alternando lados.',
        progressao: 'Adicionar goleiro; marcar defensor; exigir gol de cabeça.',
        duracao_sugerida: 15,
        tags: ['cruzamento', 'finalização', 'timing'],
      },
      {
        titulo: 'Drible e Mudança de Direção',
        descricao: 'Percurso com cones em slalom. Ao fim do percurso, executar um drible trabalhado (pedalada, corte, chapeuzinho) antes de chutar ao gol.',
        objetivos: ['Drible efetivo', 'Mudança de direção', 'Finalização após drible'],
        materiais: '8 cones (slalom), mini gol, bolas',
        organizacao: 'Fila única. 1 por vez. Variação de dribles definida pelo treinador.',
        progressao: 'Adicionar defensor após o slalom; aumentar velocidade.',
        duracao_sugerida: 12,
        tags: ['drible', 'condução', 'finalização'],
      },
    ],
    tatica: [
      {
        titulo: 'Saída de Bola 3×2',
        descricao: '3 jogadores na defesa (GOL+2 zagueiros) constroem saída contra 2 marcadores. Objetivo: progredir até a linha do meio-campo. Foco em linhas de passe e movimentação.',
        objetivos: ['Saída de bola organizada', 'Triangulação defensiva', 'Pressão adversária'],
        materiais: 'Bolas, cones, coletes',
        organizacao: 'Metade de campo. Trocam funções a cada 5 min.',
        progressao: '3×3 com mais pressão; incluir mediocampo como opção de saída.',
        duracao_sugerida: 15,
        tags: ['saída de bola', 'triangulação', 'construção'],
      },
      {
        titulo: 'Linha de 4 e Pressão',
        descricao: 'Defesa de 4 trabalha linha defensiva: recuam e avançam juntos. Atacantes tentam romper. Foco em comunicação, linha e momento de pressão.',
        objetivos: ['Organização defensiva em linha', 'Comunicação tática', 'Pressão e cobertura'],
        materiais: 'Coletes, cones, bolas',
        organizacao: 'Meio campo. 4 defensores vs 3-4 atacantes.',
        progressao: 'Adicionar mediocampo aos defensores; adicionar saída de contra-ataque.',
        duracao_sugerida: 15,
        tags: ['defesa', 'linha defensiva', 'comunicação'],
      },
    ],
    mini_jogos: [
      {
        titulo: 'Posse 4×4+2 Coringas',
        descricao: 'Posse de bola 4×4 com 2 jogadores coringa sempre ao lado de quem tem a bola (superioridade numérica permanente de 6×4). Ponto por X passes consecutivos.',
        objetivos: ['Posse de bola sob pressão', 'Movimentação de apoio', 'Tomada de decisão'],
        materiais: 'Bola, coletes (3 cores), cones delimitando área',
        organizacao: 'Campo 25×20m. 2 coringas com coletes neutros.',
        progressao: '1 toque máximo para os coringas; reduzir área; aumentar passes para pontuar.',
        duracao_sugerida: 15,
        tags: ['posse de bola', 'coringa', 'superioridade'],
      },
    ],
    jogos_condicionados: [
      {
        titulo: '6×6 com Transição Rápida',
        descricao: 'Ao recuperar a bola, o time tem 5 segundos para chegar ao campo adversário (transição rápida). Gol em transição vale 2 pontos. Foco na velocidade após recuperação.',
        objetivos: ['Transição defesa-ataque', 'Velocidade após recuperação', 'Pressão alta'],
        materiais: 'Bolas, gols, coletes',
        organizacao: 'Campo reduzido (2/3 do campo). Times de 6.',
        progressao: 'Reduzir tempo da transição para 3s; obrigar cruzar linha do meio com a bola.',
        duracao_sugerida: 18,
        tags: ['transição', 'condicionado', 'velocidade'],
      },
    ],
    jogo: [
      {
        titulo: 'Jogo Formal 7×7',
        descricao: 'Jogo com regras normais, formação definida pelo treinador. Pausa a cada 10 min para feedback coletivo rápido (30s) e retoma.',
        objetivos: ['Aplicação da identidade de jogo', 'Desempenho coletivo', 'Feedback em tempo real'],
        materiais: 'Gols, bolas, coletes',
        organizacao: 'Campo society ou equivalente. Times de 7.',
        progressao: 'Definir missão tática específica para cada jogador antes do jogo.',
        duracao_sugerida: 25,
        tags: ['jogo formal', 'formação', 'feedback'],
      },
    ],
    volta_calma: [
      {
        titulo: 'Alongamento em Duplas',
        descricao: 'Duplas se ajudam nos alongamentos: panturrilha apoiada no ombro do colega, quadríceps com suporte, isquiotibiais com resistência leve do parceiro.',
        objetivos: ['Flexibilidade', 'Recuperação ativa', 'Confiança entre colegas'],
        materiais: 'Nenhum',
        organizacao: 'Duplas espalhadas. Treinador circulando e corrigindo postura.',
        progressao: 'Incluir respiração guiada (4 tempos inspiração / 4 expiração).',
        duracao_sugerida: 8,
        tags: ['alongamento', 'duplas', 'recuperação'],
      },
    ],
  },

  aperfeicoamento: {
    aquecimento: [
      {
        titulo: 'Rondo 5×2 Intenso',
        descricao: 'Rondo clássico com 5 fora e 2 dentro. Área de 8×8m. Obrigatório 1 toque. Alta demanda técnica e cognitiva como aquecimento de elite.',
        objetivos: ['Qualidade técnica sob pressão', 'Visão periférica', 'Tomada de decisão rápida'],
        materiais: 'Bola, cones',
        organizacao: 'Grupos de 7. Rodízio automático.',
        progressao: 'Área reduzida; 3 no meio; passe com pé fraco obrigatório.',
        duracao_sugerida: 10,
        tags: ['rondo', 'pressão', '1 toque'],
      },
      {
        titulo: 'Ativação Dinâmica Completa',
        descricao: 'Protocolo FIFA 11+: corrida em linha, lunges, agachamentos laterais, joelho ao peito, calcanhar ao glúteo, saltos, sprint progressivo.',
        objetivos: ['Prevenção de lesões', 'Ativação muscular completa', 'Aquecimento progressivo'],
        materiais: 'Cones de marcação',
        organizacao: 'Todos juntos em linha. Treinador na frente.',
        progressao: 'Aumentar amplitude dos movimentos; adicionar resistência elástica.',
        duracao_sugerida: 12,
        tags: ['FIFA 11+', 'prevenção', 'ativação'],
      },
    ],
    prep_fisica: [
      {
        titulo: 'Sprints Intervalados (HIIT)',
        descricao: '8 séries de 20m de sprint máximo + 30s de recuperação ativa (trote). Cada sprint deve ter 100% de intensidade. Monitora-se o tempo e a consistência.',
        objetivos: ['Velocidade máxima', 'Potência anaeróbica', 'Resistência à velocidade'],
        materiais: 'Cones (marcação dos 20m), cronômetro',
        organizacao: 'Grupos de 4-5 para facilitar controle. Alternam entre sprint e recuperação.',
        progressao: 'Aumentar para 30m; reduzir recuperação para 20s; adicionar mudança de direção.',
        duracao_sugerida: 15,
        tags: ['sprint', 'HIIT', 'velocidade'],
      },
      {
        titulo: 'Força Funcional Futebol',
        descricao: 'Circuito: agachamento unilateral (pistol squat assistido), salto horizontal (broad jump), corrida lateral em cones, flexão com rotação, prancha dinâmica.',
        objetivos: ['Força de membros inferiores', 'Core e estabilidade', 'Prevenção de lesões'],
        materiais: 'Cones, colchonete (prancha)',
        organizacao: '5 estações de 40s cada, 15s de transição. 2-3 voltas.',
        progressao: 'Adicionar carga (colete com peso); aumentar intensidade.',
        duracao_sugerida: 18,
        tags: ['força', 'funcional', 'core'],
      },
    ],
    tecnica: [
      {
        titulo: 'Passe Longo e Variações',
        descricao: 'Trabalho de passe longo com o peito do pé e o lado externo. Duplas a 25-30m. Foco na superfície de contato, postura e elevação da bola.',
        objetivos: ['Passe longo preciso', 'Uso do peito do pé', 'Envio aéreo controlado'],
        materiais: 'Bolas, cones',
        organizacao: 'Duplas. Distância variando de 20-35m.',
        progressao: 'Passe em movimento; alvo delimitado por cones; passe com curva.',
        duracao_sugerida: 15,
        tags: ['passe longo', 'peito do pé', 'precisão'],
      },
      {
        titulo: 'Finalização de Primeira',
        descricao: 'Servidor cruza ou serve alto, finalizador conclui de primeira (sem domínio). Variações: lado direito, esquerdo, cruzamento rasteiro, bola aérea.',
        objetivos: ['Finalização de primeira', 'Ajuste de corpo', 'Eficiência ofensiva'],
        materiais: 'Gol, bolas, cones',
        organizacao: 'Duplas servidor-finalizador. Alternando posições.',
        progressao: 'Adicionar goleiro real; defensor passivo; marcar ponto por acertar zonas do gol.',
        duracao_sugerida: 15,
        tags: ['finalização', 'de primeira', 'eficiência'],
      },
    ],
    tatica: [
      {
        titulo: 'Bloco Baixo e Saída Rápida',
        descricao: 'Equipe se organiza em bloco defensivo baixo. Ao recuperar, inicia transição rápida com passes progressivos. Repetição de padrão tático definido pelo treinador.',
        objetivos: ['Organização defensiva em bloco', 'Transição ofensiva', 'Padrões de jogo'],
        materiais: 'Coletes, bolas, gols, cones',
        organizacao: '8×8 em 3/4 do campo. Funções fixas por 10 min.',
        progressao: 'Aumentar pressão ofensiva; limitar toques na saída; contra-ataque em 4 passes.',
        duracao_sugerida: 18,
        tags: ['bloco', 'transição', 'padrão tático'],
      },
      {
        titulo: 'Posse de Bola com Progressão',
        descricao: 'Posse de bola em campo dividido em 3 zonas. Para pontuar, deve-se progredir a bola pelas 3 zonas sem perder. Estimula paciência e verticalidade.',
        objetivos: ['Progressão com a bola', 'Paciência tática', 'Ocupação de espaço'],
        materiais: 'Coletes, bolas, cones dividindo zonas',
        organizacao: '8×8. Campo 50×35m dividido em 3 faixas.',
        progressao: 'Limitar a 2 toques por zona; adicionar pressing triggers definidos.',
        duracao_sugerida: 18,
        tags: ['posse', 'progressão', 'zonas'],
      },
    ],
    mini_jogos: [
      {
        titulo: '5×5 Pressing Alto',
        descricao: 'Times treinam pressing alto coordenado. Ao perder a bola, todo time pressiona imediatamente (gegenpressing). Pontuação dupla se recuperar em 6s após perda.',
        objetivos: ['Pressing coordenado', 'Intensidade e reação', 'Compactação defensiva'],
        materiais: 'Coletes, bolas, cones, gols',
        organizacao: 'Campo 35×25m. Treinador conta tempo de pressing.',
        progressao: 'Reduzir espaço; 3 toques máximo; gegenpressing obrigatório.',
        duracao_sugerida: 15,
        tags: ['pressing', 'intensidade', 'gegenpressing'],
      },
    ],
    jogos_condicionados: [
      {
        titulo: '8×8 com Missão Tática',
        descricao: 'Jogo 8×8 com missão específica para cada time: um joga com posse e outro com transição rápida. Após 10 min, invertem as missões.',
        objetivos: ['Identidade tática dupla', 'Adaptação situacional', 'Aplicação de princípios'],
        materiais: 'Gols, bolas, coletes',
        organizacao: '3/4 de campo. Treinador faz paradas pedagógicas rápidas.',
        progressao: 'Definir formações específicas; missão individual por posição.',
        duracao_sugerida: 20,
        tags: ['missão', '8×8', 'tática aplicada'],
      },
    ],
    jogo: [
      {
        titulo: 'Jogo 11×11 com Análise',
        descricao: 'Jogo completo com filmagem ou observação estruturada. Pausa no intervalo para feedback com dados (posições, erros de passe, pressões executadas).',
        objetivos: ['Performance em jogo real', 'Avaliação e feedback', 'Consolidação tática'],
        materiais: 'Gols regulamentares, bolas, coletes, câmera/tablet (opcional)',
        organizacao: 'Campo completo ou 3/4 com gols normais.',
        progressao: 'Missão tática pós-análise para o 2º tempo.',
        duracao_sugerida: 30,
        tags: ['jogo 11x11', 'análise', 'performance'],
      },
    ],
    volta_calma: [
      {
        titulo: 'Protocolo de Recuperação Ativa',
        descricao: 'Trote leve 3 min + alongamento dinâmico lento + rolo de espuma nos principais grupos + roda de feedback: o que foi bem? o que melhorar?',
        objetivos: ['Recuperação ativa', 'Prevenção muscular', 'Feedback reflexivo'],
        materiais: 'Rolo de espuma (foam roller) se disponível',
        organizacao: 'Grupo junto. Treinador facilita o feedback coletivo.',
        progressao: 'Cada jogador apresenta 1 ponto de melhoria individual.',
        duracao_sugerida: 10,
        tags: ['recuperação', 'foam roller', 'feedback'],
      },
    ],
  },

  alto_rendimento: {
    aquecimento: [
      {
        titulo: 'Rondo 6×3 Compacto',
        descricao: 'Rondo de alta intensidade com 6 fora e 3 dentro em área de 10×10m. 1 toque obrigatório. Quem perde a bola vai para o meio. Alta exigência técnica e física.',
        objetivos: ['Qualidade técnica em alta intensidade', 'Resistência anaeróbica', 'Tomada de decisão instantânea'],
        materiais: 'Bola, cones',
        organizacao: 'Grupos de 9. Alta rotatividade.',
        progressao: 'Área 8×8m; 2 no meio; sem contato com as linhas.',
        duracao_sugerida: 12,
        tags: ['rondo', 'alta intensidade', 'elite'],
      },
      {
        titulo: 'Ativação Específica por Posição',
        descricao: 'Goleiros: ativação de reflexos e saídas. Defensores: duelos 1×1 leve. Meias: rondo e passe. Atacantes: finalização leve. Cada grupo aquece conforme sua demanda.',
        objetivos: ['Ativação específica por posição', 'Preparação neuromuscular', 'Foco mental'],
        materiais: 'Bolas, cones, gols',
        organizacao: 'Grupos por posição. 12 min simultâneos.',
        progressao: 'Integração: defensores+atacantes em duelos; goleiro integrado.',
        duracao_sugerida: 12,
        tags: ['posição específica', 'ativação', 'goleiro'],
      },
    ],
    prep_fisica: [
      {
        titulo: 'RSA (Repeated Sprint Ability)',
        descricao: '10 sprints de 30m com apenas 20s de recuperação passiva. Mede e treina capacidade de repetir esforços máximos. Essencial para jogadores de alto nível.',
        objetivos: ['Resistência à velocidade', 'Potência máxima repetida', 'Fadiga resistida'],
        materiais: 'Cones (30m), cronômetro, GPS (se disponível)',
        organizacao: 'Individual ou duplas alternando. Treinador registra tempos.',
        progressao: '15 sprints; reduzir recuperação; adicionar mudança de direção no meio.',
        duracao_sugerida: 18,
        tags: ['RSA', 'sprint repetido', 'alta intensidade'],
      },
    ],
    tecnica: [
      {
        titulo: 'Combinações de 3 Passes + Finalização',
        descricao: 'Padrões pré-definidos: triângulo (passe-passe-finalização), diagonal (cruzado-lateral-gol), corredor (1-2 de parede-chute). Repetição de padrões em alta velocidade.',
        objetivos: ['Automatização de padrões técnico-táticos', 'Sincronização', 'Finalização de qualidade'],
        materiais: 'Bolas, gol, cones',
        organizacao: 'Trios. Alternando padrões a cada 3 min.',
        progressao: 'Adicionar defensor passivo; exigir 1 toque em todas as combinações.',
        duracao_sugerida: 18,
        tags: ['padrões', 'automatização', 'finalização'],
      },
    ],
    tatica: [
      {
        titulo: 'Posicionamento e Ocupação de Espaço',
        descricao: 'Jogo de sombras: time ofensivo se movimenta sem bola seguindo sinais do treinador (posição, transição, bola parada). Time defensivo imita. Visualização de padrões.',
        objetivos: ['Posicionamento tático automático', 'Princípios ofensivos e defensivos', 'Organização de equipe'],
        materiais: 'Coletes, cones, campo marcado',
        organizacao: 'Campo inteiro. Time completo. Treinador dirige os movimentos.',
        progressao: 'Adicionar bola ao padrão; adversário real de baixa intensidade.',
        duracao_sugerida: 20,
        tags: ['posicionamento', 'padrões', 'organização'],
      },
    ],
    mini_jogos: [
      {
        titulo: 'Posse + Transição 7×7+2',
        descricao: 'Dois times de 7 com 2 coringas neutros. Posse de bola no campo dividido em 2 zonas. Ao recuperar, o time tem 3 passes para chegar na zona adversária e pontuam.',
        objetivos: ['Posse e transição integradas', 'Velocidade de circulação', 'Padrão de jogo completo'],
        materiais: 'Coletes (3 cores), bolas, cones',
        organizacao: 'Campo 50×35m. Coringas sempre se posicionam na zona da bola.',
        progressao: 'Remover coringas; 2 toques máximo; transição em 2 passes.',
        duracao_sugerida: 18,
        tags: ['posse', 'transição', 'padrão'],
      },
    ],
    jogos_condicionados: [
      {
        titulo: '10×10 com Regras do Modelo de Jogo',
        descricao: 'Jogo condicionado com as regras específicas do modelo de jogo da equipe: pressing triggers, linhas de pressão, padrões de saída, momentos de pressing alto/bloco.',
        objetivos: ['Aplicação do modelo de jogo', 'Automatização coletiva', 'Alta intensidade tática'],
        materiais: 'Gols, bolas, coletes',
        organizacao: '3/4 do campo. Times de 10. Paradas pedagógicas do treinador.',
        progressao: 'Sem paradas — jogo contínuo com avaliação posterior por vídeo.',
        duracao_sugerida: 25,
        tags: ['modelo de jogo', 'automatização', 'alta intensidade'],
      },
    ],
    jogo: [
      {
        titulo: 'Jogo-Treino com Análise em Tempo Real',
        descricao: 'Jogo oficial ou amistoso com posicionamento analítico: 1 assistente observa defensores, outro observa atacantes, treinador centraliza. Feedback estruturado no intervalo e pós-jogo.',
        objetivos: ['Performance competitiva', 'Análise de jogo', 'Melhoria individual e coletiva'],
        materiais: 'Campo, gols, bolas, câmera, tablets para análise',
        organizacao: 'Jogo completo. Equipe técnica com funções divididas.',
        progressao: 'Apresentação em vídeo após o jogo (clips táticos).',
        duracao_sugerida: 40,
        tags: ['análise', 'competitivo', 'vídeo'],
      },
    ],
    volta_calma: [
      {
        titulo: 'Recuperação Pós-Treino Intenso',
        descricao: 'Imersão em gelo (se disponível), trote regenerativo 5 min, alongamento profundo (20-30s por grupo muscular), hidratação e feedback individual com treinador.',
        objetivos: ['Recuperação otimizada', 'Prevenção de lesões', 'Relação treinador-atleta'],
        materiais: 'Banheira de gelo (opcional), foam roller',
        organizacao: 'Individual / pequenos grupos.',
        progressao: 'Incluir técnicas de respiração e mindfulness (2 min de atenção plena).',
        duracao_sugerida: 12,
        tags: ['recuperação', 'gelo', 'individual'],
      },
    ],
  },
};

export function sugerirAtividades(groupKey, blocoId, n = 4, principios = []) {
  const pool = BANCO_ATIVIDADES[groupKey]?.[blocoId] ?? [];
  if (principios.length === 0) return pool.slice(0, n);
  const keywords = principios.flatMap(p => p.toLowerCase().split(/\s+/));
  const scored = pool.map(a => {
    const text = [a.titulo, a.descricao, ...(a.tags || [])].join(' ').toLowerCase();
    const score = keywords.filter(k => text.includes(k)).length;
    return { ...a, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, n);
}

export function calcularDuracoes(totalMinutos) {
  const result = {};
  BLOCOS_TREINO.forEach(b => {
    result[b.id] = Math.round(totalMinutos * b.percentual);
  });
  return result;
}

export function detectarRepeticao(blocosState) {
  const seen = new Map();
  const warnings = [];
  for (const bloco of blocosState) {
    for (const ativ of (bloco.atividadesSelecionadas || [])) {
      if (seen.has(ativ.titulo)) {
        warnings.push(`"${ativ.titulo}" aparece em "${seen.get(ativ.titulo)}" e "${bloco.nome}"`);
      } else {
        seen.set(ativ.titulo, bloco.nome);
      }
    }
  }
  return warnings;
}

export function buildMethodologyPrompt(metodologia) {
  if (!metodologia) return 'Escola de futebol sem metodologia definida.';
  return `Você é um assistente especialista em futebol e pedagogia esportiva.
A escola tem a seguinte metodologia de ensino:

NOME DA ESCOLA: ${metodologia.nome_escola || 'Não informado'}
ESTILO DE JOGO: ${metodologia.estilo_jogo || 'Não informado'}
PILARES: ${(metodologia.pilares || []).join(', ') || 'Não informado'}
VALORES: ${metodologia.valores || 'Não informado'}

Use sempre esta metodologia como referência para criar planos de treino alinhados com a identidade da escola.
Responda SEMPRE em português brasileiro.
Quando solicitado a gerar um plano de treino, retorne SOMENTE um JSON válido, sem markdown, sem explicações adicionais.`;
}

export function buildMicroPlanPrompt(macro, meso, config) {
  const macroInfo = macro
    ? `PLANO MACRO: ${macro.titulo} — Temporada ${macro.temporada}, Categoria ${macro.categoria}.`
    : '';
  const mesoInfo = meso
    ? `PLANO MESO: ${meso.titulo} — ${meso.mes_ref}. Objetivos do ciclo: ${JSON.stringify(meso.semanas?.[0]?.objetivos || [])}`
    : '';

  return `Crie um plano de treino completo para:
Escola: ${config.escola}
Treinador: ${config.treinador}
Categoria: ${config.categoria}
Grupo: ${config.grupo}
Data: ${config.data_treino}
Duração total: ${config.duracao_total} minutos
Objetivo do treino: ${config.objetivo}
Tema/Foco: ${config.tema}
${macroInfo}
${mesoInfo}

Retorne SOMENTE este JSON (sem markdown, sem explicações):
{
  "blocos": [
    {
      "id": "aquecimento",
      "nome": "Aquecimento",
      "duracao": <minutos>,
      "objetivos": ["objetivo 1", "objetivo 2"],
      "atividadesSelecionadas": [
        {
          "titulo": "Nome da Atividade",
          "descricao": "Descrição detalhada da atividade",
          "objetivos": ["objetivo 1"],
          "materiais": "materiais necessários",
          "organizacao": "como organizar os jogadores",
          "progressao": "como progredir a atividade",
          "duracao_sugerida": <minutos>,
          "tags": ["tag1", "tag2"]
        }
      ],
      "observacoes": ""
    }
  ]
}

Os 8 blocos devem ser (nesta ordem): aquecimento, prep_fisica, tecnica, tatica, mini_jogos, jogos_condicionados, jogo, volta_calma.
Adapte as atividades para a categoria ${config.categoria} e o tema "${config.tema}".
As durações devem somar ${config.duracao_total} minutos.
Inclua 1-2 atividades por bloco, exceto jogo (1 atividade) e volta_calma (1 atividade).`;
}
