// ─── Categorias ───────────────────────────────────────────────────────────────

export const CATEGORIAS = [
  'Sub-5', 'Sub-7', 'Sub-9', 'Sub-11', 'Sub-13',
  'Sub-15', 'Sub-17', 'Sub-20', 'Adulto/Amador',
];

export const GRUPOS_CATEGORIA = {
  'Sub-5':  'iniciacao',
  'Sub-7':  'iniciacao',
  'Sub-9':  'iniciacao',
  'Sub-11': 'desenvolvimento',
  'Sub-13': 'desenvolvimento',
  'Sub-15': 'aperfeicoamento',
  'Sub-17': 'aperfeicoamento',
  'Sub-20': 'alto_rendimento',
  'Adulto/Amador': 'alto_rendimento',
};

export const GRUPOS_LABEL = {
  iniciacao: 'Iniciação (Sub-5 a Sub-9)',
  desenvolvimento: 'Desenvolvimento (Sub-11 e Sub-13)',
  aperfeicoamento: 'Aperfeiçoamento (Sub-15 e Sub-17)',
  alto_rendimento: 'Alto Rendimento (Sub-20 e Adulto)',
};

// ─── Blocos de Treino ─────────────────────────────────────────────────────────

export const BLOCOS_TREINO = [
  { id: 'aquecimento',          nome: 'Aquecimento',                icone: 'Flame',      corHex: '#f97316', percentualDefault: 0.10 },
  { id: 'prep_fisica',          nome: 'Preparação Física e Motora', icone: 'Dumbbell',   corHex: '#8b5cf6', percentualDefault: 0.10 },
  { id: 'tecnica',              nome: 'Técnica',                    icone: 'Target',     corHex: '#3b82f6', percentualDefault: 0.18 },
  { id: 'tatica',               nome: 'Tática',                     icone: 'Map',        corHex: '#1d4ed8', percentualDefault: 0.18 },
  { id: 'mini_jogos',           nome: 'Mini Jogos',                 icone: 'Gamepad2',   corHex: '#ca8a04', percentualDefault: 0.12 },
  { id: 'jogos_condicionados',  nome: 'Jogos Condicionados',        icone: 'Shuffle',    corHex: '#dc2626', percentualDefault: 0.12 },
  { id: 'jogo',                 nome: 'Jogo',                       icone: 'Trophy',     corHex: '#16a34a', percentualDefault: 0.15 },
  { id: 'volta_calma',          nome: 'Volta à Calma',              icone: 'Wind',       corHex: '#0891b2', percentualDefault: 0.05 },
];

// ─── Objetivos por Bloco ──────────────────────────────────────────────────────

export const OBJETIVOS_POR_BLOCO = {
  aquecimento: [
    'Elevar a temperatura corporal gradualmente',
    'Ativar musculatura e articulações',
    'Preparar o sistema cardiovascular',
    'Estimular a coordenação motora',
    'Criar engajamento e foco para o treino',
    'Trabalhar familiarização com a bola',
  ],
  prep_fisica: [
    'Desenvolver resistência aeróbia',
    'Fortalecer musculatura dos membros inferiores',
    'Trabalhar velocidade de reação',
    'Melhorar agilidade e mudança de direção',
    'Desenvolver equilíbrio e propriocepção',
    'Aprimorar coordenação motora fina e grossa',
    'Desenvolver força explosiva (pliometria)',
  ],
  tecnica: [
    'Aperfeiçoar controle e domínio de bola',
    'Desenvolver passe curto e longo',
    'Trabalhar condução com ambos os pés',
    'Aprimorar finalização ao gol',
    'Desenvolver drible e 1x1',
    'Trabalhar cabeceio',
    'Aprimorar cruzamento e recepção',
    'Desenvolver passe de calcanhar e fintas',
  ],
  tatica: [
    'Trabalhar posicionamento defensivo',
    'Desenvolver saída de bola estruturada',
    'Treinar marcação em bloco baixo e alto',
    'Trabalhar transição defesa-ataque',
    'Desenvolver movimento sem bola',
    'Treinar pressão e contrapressão',
    'Trabalhar formações e sistemas de jogo',
    'Desenvolver jogadas ensaiadas (bolas paradas)',
  ],
  mini_jogos: [
    'Aplicar conceitos técnicos em situação de jogo',
    'Desenvolver tomada de decisão rápida',
    'Trabalhar cooperação e comunicação',
    'Estimular criatividade e jogo espontâneo',
    'Desenvolver visão de jogo',
    'Treinar pressão e espaço reduzido',
  ],
  jogos_condicionados: [
    'Aplicar conceitos táticos em jogo real',
    'Trabalhar situações específicas de jogo',
    'Desenvolver leitura de jogo coletiva',
    'Treinar tomada de decisão sob pressão',
    'Consolidar padrões ofensivos e defensivos',
    'Estimular intensidade próxima ao jogo oficial',
  ],
  jogo: [
    'Aplicar todos os conceitos trabalhados',
    'Desenvolver mentalidade competitiva saudável',
    'Praticar jogo em espaço e número real',
    'Observar evolução individual e coletiva',
    'Estimular liderança e trabalho em equipe',
    'Consolidar automatismos táticos',
  ],
  volta_calma: [
    'Reduzir frequência cardíaca gradualmente',
    'Realizar alongamento ativo e passivo',
    'Prevenir lesões musculares',
    'Fazer revisão pedagógica do treino',
    'Estimular reflexão sobre aprendizado',
    'Promover bem-estar e recuperação',
  ],
};

// ─── Meses do Ano ────────────────────────────────────────────────────────────

export const MESES_ANO = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

// ─── Fases da Temporada ───────────────────────────────────────────────────────

export const FASES_MACRO = [
  { id: 'pre_temporada', nome: 'Pré-temporada',        cor: '#f97316' },
  { id: 'competitiva',   nome: 'Temporada Competitiva', cor: '#16a34a' },
  { id: 'transicao',     nome: 'Transição',              cor: '#8b5cf6' },
  { id: 'sem_atividade', nome: 'Sem Atividade',          cor: '#9ca3af' },
];

// ─── Equipamentos para Lousa Tática ──────────────────────────────────────────

export const EQUIPAMENTOS_TATICOS = [
  { id: 'cone',         nome: 'Cone',         emoji: '🔺', cor: '#f97316' },
  { id: 'bola',         nome: 'Bola',         emoji: '⚽', cor: '#1f2937' },
  { id: 'prato_chines', nome: 'Prato Chinês', emoji: '🟡', cor: '#ca8a04' },
  { id: 'manequim',     nome: 'Manequim',     emoji: '🧍', cor: '#6b7280' },
  { id: 'mini_gol',     nome: 'Mini Gol',     emoji: '🥅', cor: '#374151' },
  { id: 'barreira',     nome: 'Barreira',     emoji: '🚧', cor: '#dc2626' },
  { id: 'bandeirinha',  nome: 'Bandeirinha',  emoji: '🚩', cor: '#dc2626' },
  { id: 'estaca',       nome: 'Estaca',       emoji: '📍', cor: '#7c3aed' },
];

// ─── Formações Táticas ────────────────────────────────────────────────────────
// coordenadas em % do SVG viewBox (0-100 x, 0-65 y)
// Time A ataca para cima (y menor), goleiro em y alto

export const FORMACOES = {
  futebol: {
    '4-3-3':   [[50,60],[15,45],[33,45],[67,45],[85,45],[25,30],[50,28],[75,30],[20,12],[50,8],[80,12]],
    '4-4-2':   [[50,60],[15,45],[33,45],[67,45],[85,45],[15,28],[38,28],[62,28],[85,28],[33,12],[67,12]],
    '3-5-2':   [[50,60],[22,45],[50,43],[78,45],[10,30],[30,28],[50,26],[70,28],[90,30],[35,12],[65,12]],
    '4-2-3-1': [[50,60],[15,45],[33,45],[67,45],[85,45],[35,33],[65,33],[20,20],[50,18],[80,20],[50,8]],
    '5-3-2':   [[50,60],[10,45],[27,43],[50,42],[73,43],[90,45],[25,28],[50,26],[75,28],[33,12],[67,12]],
    '4-1-4-1': [[50,60],[15,45],[33,45],[67,45],[85,45],[50,35],[15,23],[35,21],[65,21],[85,23],[50,8]],
  },
  society: {
    '3-3':   [[50,60],[20,42],[50,40],[80,42],[20,20],[50,18],[80,20]],
    '2-3-1': [[50,60],[25,42],[75,42],[15,28],[50,26],[85,28],[50,10]],
    '3-2-1': [[50,60],[20,42],[50,40],[80,42],[30,25],[70,25],[50,10]],
  },
  futsal: {
    '1-2-1': [[50,58],[25,40],[75,40],[50,22],[50,8]],
    '2-2':   [[50,58],[25,40],[75,40],[25,18],[75,18]],
    '3-1':   [[50,58],[20,38],[50,36],[80,38],[50,12]],
  },
};

// ─── Banco de Atividades ──────────────────────────────────────────────────────

const act = (titulo, descricao, objetivos, materiais, organizacao, progressao, duracao_sugerida, tags = []) => ({
  titulo, descricao, objetivos, materiais, organizacao, progressao, duracao_sugerida, tags,
});

export const BANCO_ATIVIDADES = {
  // ── INICIAÇÃO (Sub-5, Sub-7, Sub-9) ─────────────────────────────────────────
  iniciacao: {
    aquecimento: [
      act('Pega-Pega com Bola', 'Cada criança conduz uma bola. O pegador tenta tocar nas crianças sem largar a sua própria bola. Quem for tocado vira pegador.', ['Coordenação bola-corpo', 'Condução básica', 'Reação e esquiva'], 'Bolas (1 por criança)', 'Campo livre 20×15m. Todos com bola, 1 pegador sem bola.', 'Aumentar nº de pegadores; diminuir o espaço.', 10, ['lúdico', 'coordenação', 'condução']),
      act('Circuito de Cones Coloridos', 'As crianças percorrem um circuito de cones em zigue-zague conduzindo a bola. Cada cor de cone representa uma ação (parar, bater palma, girar).', ['Familiarização com a bola', 'Atenção e percepção', 'Agilidade básica'], 'Cones coloridos, bolas', 'Fila de 4 cones por lane, 2-3 lanes paralelas.', 'Adicionar ações nas cores; cronometrar; usar pé não-dominante.', 8, ['lúdico', 'coordenação', 'agilidade']),
      act('Bicho-Papão da Bola', 'Um "bicho-papão" sem bola persegue as crianças que conduzem bolas. Quem for tocado fica parado por 5 segundos. Colegas podem liberá-lo tocando na bola.', ['Condução sob pressão', 'Cooperação', 'Diversão e engajamento'], 'Bolas (1 por criança exceto bicho-papão)', 'Campo 25×20m. 1-2 bicho-papões dependendo do grupo.', 'Aumentar bicho-papões; reduzir tempo de liberação.', 10, ['lúdico', 'condução', 'cooperação']),
      act('Futebol dos Animais', 'Cada criança recebe um nome de animal e se locomove como aquele animal com a bola (pato = agachado, sapo = saltando). O professor chama um animal para correr até o gol.', ['Coordenação motora global', 'Familiarização com a bola', 'Atenção ao comando'], 'Bolas, cones', '2 times animais, campo pequeno 15×10m.', 'Combinações de animais; obstáculos no percurso.', 8, ['lúdico', 'coordenação', 'reação']),
      act('Bambolê com Bola', 'Cada criança tem um bambolê no chão como sua "casa". O professor dá um comando e as crianças conduzem a bola até outra casa vazia. Quem não achar fica de fora 1 rodada.', ['Condução direcional', 'Percepção espacial', 'Tomada de decisão rápida'], 'Bolas, bambolês', 'Bambolês espalhados, 1 a menos que o nº de crianças.', 'Reduzir bambolês progressivamente.', 8, ['lúdico', 'percepção espacial', 'condução']),
    ],
    prep_fisica: [
      act('Circuito Coordenativo Lúdico', 'Estações: 1) Pular bambolês, 2) Subir e descer degrau, 3) Contornar cones, 4) Equilibrar na bola. Troca de estação a cada 45 segundos.', ['Coordenação motora', 'Equilíbrio', 'Agilidade'], 'Bambolês, cones, bolas, degrau/banco', '4 estações em circuito, grupos de 3-4 crianças.', 'Aumentar velocidade; fechar os olhos no equilíbrio.', 12, ['coordenação', 'equilíbrio', 'circuito']),
      act('Corrida dos Animais', 'As crianças correm imitando animais: pato (agachado), urso (4 apoios), coelho (saltando), cavalo (galope). Cada 20 metros mudam o animal conforme comando.', ['Força de membros inferiores', 'Coordenação motora', 'Diversão'], 'Cones para marcação', 'Faixas de 20m, grupos lado a lado.', 'Variar sequência; inserir bola no retorno.', 10, ['físico', 'força', 'lúdico']),
      act('Ladrão de Rabo', 'Cada criança tem um colete/fita no short. Objetivo: pegar o rabo dos colegas sem perder o seu. Quem perder fica parado até o final da rodada.', ['Agilidade', 'Mudança de direção', 'Reação'], 'Coletes/fitas coloridas', 'Campo 15×15m. Todos dispersos.', 'Reduzir espaço; cronometrar.', 8, ['agilidade', 'reação', 'lúdico']),
      act('Salto em Bambolês', 'Bambolês deitados no chão em sequência. Crianças saltam com 1 pé, 2 pés, alternado, lateral. Ao terminar, rolar a bola de volta.', ['Força de salto', 'Coordenação', 'Equilíbrio dinâmico'], 'Bambolês, bolas', 'Sequência de 6-8 bambolês, 2 lanes.', 'Aumentar velocidade; diferentes padrões de salto.', 10, ['força', 'salto', 'coordenação']),
    ],
    tecnica: [
      act('Domínio com a Solinha', 'Em duplas, criança para a bola com a sola do pé repetidamente no lugar, depois passa ao colega. Foco na suavidade do toque.', ['Sensação de bola', 'Controle básico', 'Coordenação pé-olho'], 'Bolas (1 por dupla)', 'Duplas distribuídas, espaçamento 5m.', 'Alternar pés; com a bola em movimento; adicionar toque com borda interna.', 10, ['técnica', 'controle', 'bola parada']),
      act('Passe em Duplas Curto', 'Duplas passam a bola com a face interna do pé a 4-6 metros de distância. Ênfase na postura (pé de apoio, superfície de contato, direcionamento).', ['Passe curto', 'Recepção amortecida', 'Postura de passe'], 'Bolas (1 por dupla)', 'Duplas em linhas paralelas, 6m de distância.', 'Aumentar distância; realizar em movimento; 1 toque.', 12, ['técnica', 'passe', 'recepção']),
      act('Condução Livre pelo Campo', 'Cada criança conduz a bola livremente pelo campo durante 5 minutos, explorando diferentes formas: sola, borda interna, borda externa, alternando pés.', ['Familiarização livre com a bola', 'Confiança', 'Criatividade'], 'Bolas (1 por criança)', 'Campo livre 25×20m, sem obstáculos.', 'Adicionar movimentos (parar, virar, acelerar).', 8, ['técnica', 'condução', 'criatividade']),
      act('Finalização com Apoio', 'Crianças conduzem até cone, param a bola e chutam ao gol mini. Professor ou colega é o goleiro. Ênfase no contato com o peito do pé.', ['Finalização básica', 'Força de chute', 'Coragem de chutar'], 'Bolas, mini-gol, cones', 'Fila a 5m do gol, 1 criança por vez.', 'Aumentar distância; conduzir mais antes; introduzir goleiro real.', 10, ['técnica', 'finalização', 'chute']),
      act('Jogo de Cabeça na Mão', 'Professor lança a bola com a mão, criança cabeceia de volta. Trabalhar posicionamento do pescoço, olhar fixo na bola, contato na testa.', ['Introdução ao cabeceio', 'Coragem', 'Coordenação olho-bola'], 'Bolas', '1x1 com professor, depois em duplas (lança e cabeça).', 'Aumentar altura do lançamento; caminhar antes de cabecear.', 8, ['técnica', 'cabeceio', 'coordenação']),
    ],
    tatica: [
      act('3x2 em Espaço Pequeno', 'Time de 3 mantém posse contra 2 defensores. Ênfase em abrir espaço lateralmente e apoio ao portador.', ['Noção de superioridade numérica', 'Apoio e cobertura', 'Comunicação'], 'Bolas, cones', 'Quadrado 10×10m. Trios e duplas rodando.', 'Reduzir espaço; adicionar toque limitado.', 12, ['tática', 'posse', 'cooperação']),
      act('Lado Certo da Bola', 'Professor ensina conceito de "lado certo" (entre o adversário e o gol). Jogo 3x3 onde defensores acumulam pontos ao se posicionarem corretamente.', ['Posicionamento defensivo básico', 'Leitura do adversário', 'Consciência tática'], 'Bolas, cones, coletes', 'Campo 15×12m, gols pequenos.', 'Adicionar pressão; aumentar nº de jogadores.', 10, ['tática', 'defesa', 'posicionamento']),
      act('Jogar para o Lado Livre', 'Jogo 4x4. Pontuação extra se o time passa a bola para o lado onde tem mais jogadores livres. Professor interrompe para mostrar o "lado livre".', ['Visão de jogo básica', 'Ocupação de espaços', 'Tomada de decisão'], 'Bolas, cones, coletes', 'Campo 20×15m, gols de cone.', 'Toque limitado; aumentar espaço.', 12, ['tática', 'espaços', 'decisão']),
    ],
    mini_jogos: [
      act('Futebol dos Quadrados', '4 times em 4 mini-campos adjacentes. Cada equipe defende sua meta e ataca outras 3. Ponto ao entrar a bola no gol adversário.', ['Atenção dividida', 'Decisão rápida', 'Divertimento'], 'Bolas, cones (mini-gols)', '4 quadrantes de 8×8m. Times de 3.', 'Variar número de times; tamanho do campo.', 12, ['mini-jogo', 'decisão', 'lúdico']),
      act('Bobinho 4x1', '4 crianças em quadrado mantêm a bola contra 1 no meio. Quem errar vai para o meio.', ['Passe sob pressão', 'Recepção', 'Posicionamento'], 'Bolas', 'Quadrado 8×8m.', 'Reduzir toques; aumentar velocidade.', 10, ['mini-jogo', 'passe', 'pressão']),
      act('Futebol de Costas', 'Jogo 3x3 em campo pequeno. Quem recebe a bola deve virar antes de conduzir (treina giro e proteção de bola).', ['Proteção de bola', 'Giro com bola', 'Visão periférica'], 'Bolas, cones', 'Campo 15×12m.', 'Adicionar regra de toque limitado.', 10, ['mini-jogo', 'proteção', 'giro']),
    ],
    jogos_condicionados: [
      act('Jogo do Passe Obrigatório', 'Jogo 4x4. Para marcar, o time deve completar 5 passes antes de finalizar. Estimula a circulação de bola.', ['Posse de bola', 'Paciência tática', 'Passes em sequência'], 'Bolas, cones, coletes', 'Campo 20×15m, gols de cone.', 'Reduzir nº de passes exigidos; aumentar espaço.', 12, ['jogo condicionado', 'posse', 'passes']),
      act('Jogo com Zonas Proibidas', 'Campo dividido em 3 zonas. A zona do meio só pode ser atravessada com 2 toques. Estimula tomada de decisão e velocidade de jogo.', ['Velocidade de decisão', 'Mudança de ritmo', 'Leitura de espaços'], 'Bolas, cones, coletes', 'Campo 25×20m, 3 zonas marcadas.', 'Variar regras por zona.', 12, ['jogo condicionado', 'decisão', 'espaços']),
    ],
    jogo: [
      act('Jogo Livre 4x4 ou 5x5', 'Jogo sem regras especiais. O professor observa e anota situações para feedback. Estimular o jogo espontâneo e criativo.', ['Aplicação livre dos conceitos', 'Criatividade', 'Diversão'], 'Bolas, cones, coletes', 'Campo proporcional à categoria. Gols de cone.', 'Sem variações — jogo livre mesmo.', 15, ['jogo', 'livre', 'criatividade']),
      act('Jogo com Pontuação Especial', 'Ponto normal ao marcar gol. Ponto extra por: driblar antes do gol, gol de fora da área, cabeceio. Estimula habilidades específicas.', ['Habilidades técnicas em jogo', 'Motivação por pontuação', 'Criatividade'], 'Bolas, cones, coletes', 'Campo normal.', 'Variar os critérios de ponto extra.', 15, ['jogo', 'habilidade', 'motivação']),
    ],
    volta_calma: [
      act('Roda de Alongamento com Bola', 'Em roda, o professor guia alongamentos dos principais grupos musculares. A bola fica no centro como foco visual.', ['Flexibilidade', 'Recuperação', 'Atenção ao próprio corpo'], 'Bola (1 para referência)', 'Roda com todas as crianças.', 'Criança lidera o alongamento.', 8, ['volta à calma', 'alongamento', 'recuperação']),
      act('Conversa do Treino', 'Crianças sentadas em roda. Professor faz perguntas: "O que aprendemos hoje?", "O que foi difícil?", "O que posso melhorar?". Encerrar com palma coletiva.', ['Reflexão pedagógica', 'Comunicação', 'Senso de pertencimento'], 'Nenhum', 'Roda no centro do campo.', 'Criança mais nova responde primeiro.', 5, ['reflexão', 'pedagógico', 'grupo']),
    ],
  },

  // ── DESENVOLVIMENTO (Sub-11, Sub-13) ─────────────────────────────────────────
  desenvolvimento: {
    aquecimento: [
      act('Rondo 3x1 de Aquecimento', '3 jogadores mantêm a bola contra 1 no centro. Rotação rápida. Foco no passe de primeira e posicionamento triangular.', ['Passe de primeira', 'Posicionamento triangular', 'Comunicação'], 'Bolas', 'Círculos de 6m, grupos de 4.', 'Reduzir espaço; 2 toques máximo; 2 no centro.', 10, ['rondo', 'aquecimento', 'passe']),
      act('Corrida com Estímulos Visuais', 'Dois jogadores lado a lado correm em diferentes ritmos. Ao sinal do professor (cor, número, objeto), executam ação: sprint, mudança de direção, salto.', ['Reação', 'Velocidade de resposta', 'Ativação neuromuscular'], 'Cones coloridos', 'Faixas de 20m, duplas lado a lado.', 'Aumentar variedade de estímulos; incluir bola no retorno.', 8, ['aquecimento', 'reação', 'velocidade']),
      act('Passe e Corre', 'Em grupos de 3, jogadores passam e correm para a posição do próximo. Circulação contínua em triângulo.', ['Passe em movimento', 'Timing de corrida', 'Continuidade'], 'Bolas', 'Triângulo de 10m, grupos de 3.', 'Aumentar velocidade; 1 toque; 2 triângulos ligados.', 10, ['aquecimento', 'passe', 'movimento']),
      act('Gato e Rato com Bola', 'Em duplas, um conduz bola (rato), o outro persegue (gato) sem bola. Ao sinal, trocam os papéis. Foco em condução em alta velocidade.', ['Condução em velocidade', 'Reação à mudança', 'Aceleração'], 'Bolas', 'Campo livre 25×20m.', 'Diminuir intervalo dos sinais; espaço menor.', 8, ['aquecimento', 'condução', 'velocidade']),
    ],
    prep_fisica: [
      act('Circuito Físico-Técnico', '6 estações: 1) Sprints 15m, 2) Escada de agilidade, 3) Passe na parede, 4) Slalom com bola, 5) Saltos laterais, 6) Dribles em cones. 1min por estação.', ['Potência muscular', 'Agilidade', 'Condição física com bola'], 'Cones, escada, bolas', '6 estações em circuito, grupos de 3-4.', 'Aumentar intensidade; reduzir descanso entre estações.', 18, ['físico', 'circuito', 'técnico']),
      act('Tiro Curto e Longo', 'Duplas: sprint de 10m (tiro curto), caminhada 5m, sprint de 20m (tiro longo). Repetir 6 vezes. Treina velocidade e recuperação ativa.', ['Velocidade de sprint', 'Resistência anaeróbia', 'Recuperação'], 'Cones', 'Faixas de 30m.', 'Aumentar repetições; reduzir descanso.', 12, ['físico', 'velocidade', 'sprint']),
      act('Pliometria Básica', 'Saltos sobre mini-barreiras (ou cones deitados): 2 pés, 1 pé direito, 1 pé esquerdo. Foco em aterrissagem suave e explosão.', ['Força explosiva', 'Coordenação de salto', 'Propriocepção'], 'Mini-barreiras ou cones', '4-6 obstáculos em linha. Grupos de 3.', 'Aumentar altura; saltos com bola nas mãos.', 10, ['físico', 'pliometria', 'força']),
      act('Corrida com Bola e Estafeta', 'Relay race: conduz bola até cone, toques na bola 5x, retorna correndo. Time mais rápido vence.', ['Velocidade com bola', 'Trabalho em equipe', 'Competitividade'], 'Bolas, cones', 'Times de 4-5. Distância 20m.', 'Adicionar obstáculos; variação de movimentos.', 10, ['físico', 'velocidade', 'competição']),
    ],
    tecnica: [
      act('Domínio Orientado e Passe', 'Jogador recebe a bola, domina para o lado livre (orientado), e passa para o próximo. Trabalha o primeiro toque como vantagem tática.', ['Domínio orientado', 'Visão antes de receber', 'Passe na sequência'], 'Bolas', 'Trios: passador, receptor, alvo. Rotação.', 'Aumentar velocidade; defensor passivo; 2 opções de passe.', 15, ['técnica', 'domínio', 'orientado']),
      act('Cruzamento e Finalização', 'Jogador cruza da lateral e companheiro finaliza ao gol. Trabalho de timing de chegada e variedade de finalização.', ['Cruzamento', 'Timing de chegada', 'Finalização'], 'Bolas, gol, cones', '2 extremos alternando com 2 finalizadores. Fileiras.', 'Variar tipo de cruzamento; adicionar goleiro.', 15, ['técnica', 'cruzamento', 'finalização']),
      act('Slalom e Drible de Mudança de Direção', 'Slalom em cones espaçados 1,5m. Ao último cone, executar finta (elástico, corte de pé, roleta) e chutar ao gol.', ['Condução em slalom', 'Drible programado', 'Finalização após condução'], 'Bolas, cones, gol', 'Fila. 3 cones em slalom, gol a 8m do último.', 'Aumentar velocidade; usar pé não-dominante; goleiro.', 12, ['técnica', 'drible', 'condução']),
      act('Passe Longo com Precisão', 'Jogadores em duplas a 25-30m. Passam com a face interna (para precisão) e face externa (para curva). Contar acertos consecutivos.', ['Passe longo', 'Precisão', 'Força calibrada'], 'Bolas', 'Duplas em campo aberto, cones alvo.', 'Variar distância; cone alvo mais estreito; 1 toque.', 12, ['técnica', 'passe longo', 'precisão']),
      act('1x1 Direto com Goleiro', 'Duplas em diferentes posições. Defensor inicia com bola, passa para atacante que recebe e tenta driblar o defensor para finalizar.', ['Drible 1x1', 'Decisão de quando driblar', 'Finalização sob pressão'], 'Bolas, gol', 'Posições variadas no campo. Goleiro no gol.', 'Defensor mais ativo; diferentes posições de saída.', 15, ['técnica', '1x1', 'drible']),
    ],
    tatica: [
      act('Saída de Bola 4-3-3 Básica', 'Treinar a saída de bola pelo goleiro com posicionamento dos zagueiros, laterais abrindo e meio-campo dando opções.', ['Saída de bola estruturada', 'Posicionamento na saída', 'Posse sob pressão'], 'Bolas, coletes', 'Campo inteiro. Time completo + adversários passivos.', 'Adversários semi-ativos; com pressão real.', 18, ['tática', 'saída de bola', 'posicionamento']),
      act('Bloco Defensivo 4-4', 'Treinar o posicionamento do bloco de 4+4 quando o adversário tem a bola. Linhas compactas, cobertura e basculação.', ['Marcação em bloco', 'Comunicação defensiva', 'Compactação'], 'Bolas, coletes, cones', 'Campo inteiro. Time atacante conduz, defensores se posicionam.', 'Adicionar pressão à bola; jogo real.', 18, ['tática', 'defesa', 'bloco']),
      act('Transição Rápida Defesa-Ataque', 'Equipe recupera a bola e tem 5 segundos para chegar com vantagem numérica na área adversária. Treinar velocidade de transição.', ['Transição rápida', 'Ocupação de espaços em transição', 'Velocidade coletiva'], 'Bolas, coletes, cones', 'Campo 50×40m. Situações de recuperação de bola.', 'Reduzir tempo de transição; aumentar oponentes.', 15, ['tática', 'transição', 'velocidade coletiva']),
      act('Pressão Alta e Contrapressão', 'Time pressiona a saída de bola do adversário. Se perder a bola, pressiona imediatamente (contrapressão por 5 segundos).', ['Pressão alta', 'Contrapressão', 'Intensidade defensiva'], 'Bolas, coletes', 'Campo 2/3. Times de 8+goleiro.', 'Aumentar tempo de contrapressão; campo menor.', 15, ['tática', 'pressão', 'intensidade']),
    ],
    mini_jogos: [
      act('Posse de Bola 5x2 Rondo', '5 jogadores mantêm posse contra 2 no centro em espaço reduzido. Máximo 2 toques. Quem errar vai ao centro.', ['Passe preciso sob pressão', 'Movimento constante', 'Posicionamento'], 'Bolas', 'Quadrado 10×10m.', 'Reduzir toques; diminuir espaço; 3 no centro.', 12, ['mini-jogo', 'rondo', 'posse']),
      act('Jogo dos Gols Duplos', '3x3 em campo com 2 gols em cada extremidade. Time pode marcar em qualquer dos 2 gols adversários. Amplia visão de jogo.', ['Visão periférica', 'Decisão de qual gol atacar', 'Movimentação'], 'Bolas, cones (gols)', 'Campo 25×20m, 4 mini-gols.', 'Adicionar goleiros; toques limitados.', 12, ['mini-jogo', 'visão', 'decisão']),
      act('Futebol Americano de Bola', '4x4, para marcar deve completar 3 passes consecutivos na zona de ataque adversária (sem gol). Estimula passes em sequência.', ['Passes em sequência', 'Movimentação sem bola', 'Comunicação'], 'Bolas, coletes', 'Campo 25×20m, 2 zonas de ataque.', 'Reduzir nº de passes; zona menor.', 12, ['mini-jogo', 'passe', 'sequência']),
    ],
    jogos_condicionados: [
      act('Jogo com Saída Obrigatória pelo Goleiro', 'Após gol, jogo recomeça com o goleiro que deve sair jogando com os pés. Treina saída de bola em situação real.', ['Saída de bola', 'Posicionamento para receber', 'Jogo com pés do goleiro'], 'Bolas, coletes, gol', 'Campo 50×35m. Times de 7+goleiro.', 'Goleiro tem 5 segundos para sair; adversários pressionam.', 20, ['jogo condicionado', 'saída de bola', 'goleiro']),
      act('Jogo 7x7 com Toques Limitados', 'Jogo normal com regra de máximo 2 toques por jogador. Obriga circulação rápida e decisão veloz.', ['Velocidade de decisão', 'Passe de primeira', 'Circulação rápida'], 'Bolas, coletes', 'Campo 50×35m.', 'Reduzir para 1 toque em certas zonas.', 20, ['jogo condicionado', 'decisão', 'velocidade']),
      act('Jogo com Pontos por Zona', 'Campo dividido em 3 zonas. Gol marcado da zona de ataque vale 1 ponto; da zona média vale 2. Incentiva ocupação variada.', ['Ocupação de zonas', 'Variação de ataque', 'Risco calculado'], 'Bolas, cones, coletes', 'Campo 55×40m, 3 zonas marcadas.', 'Variar pontuações; adicionar zonas.', 20, ['jogo condicionado', 'zonas', 'estratégia']),
    ],
    jogo: [
      act('Jogo 7x7 ou 8x8 Monitorado', 'Jogo com árbitro (professor ou aluno). Professor observa e anota para feedback pós-treino sobre padrões táticos.', ['Aplicação dos conceitos', 'Competição saudável', 'Autonomia em campo'], 'Bolas, coletes, gol', 'Campo 55×40m.', 'Sem variação — jogo real.', 20, ['jogo', 'competição', 'aplicação']),
      act('Jogo com Árbitro-Aluno', 'Um jogador do grupo apita o jogo, tomando decisões. Rodízio de árbitros a cada 10 minutos. Desenvolve leitura de regras.', ['Conhecimento das regras', 'Liderança', 'Respeito ao árbitro'], 'Bolas, coletes, apito', 'Campo normal.', 'Feedback sobre decisões ao árbitro.', 20, ['jogo', 'regras', 'liderança']),
    ],
    volta_calma: [
      act('Mobilidade e Alongamento Guiado', 'Sequência de 8 exercícios de alongamento dinâmico e estático: quadríceps, isquiotibiais, panturrilha, adutores, ombros, pescoço.', ['Flexibilidade', 'Prevenção de lesões', 'Consciência corporal'], 'Nenhum (tapetes se disponível)', 'Linha ou círculo. Professor demonstra cada posição.', 'Tempo maior em músculos mais trabalhados.', 8, ['volta à calma', 'alongamento', 'prevenção']),
      act('Debriefing Tático', 'Jogadores sentados. Professor apresenta 2-3 situações do treino (positivas e a melhorar). Jogadores opinam. Encerrar com foco para o próximo treino.', ['Reflexão tática', 'Comunicação do grupo', 'Aprendizado contínuo'], 'Quadro ou tablet (opcional)', 'Círculo ou arquibancada.', 'Jogador apresenta a situação ao grupo.', 7, ['reflexão', 'tática', 'aprendizado']),
    ],
  },

  // ── APERFEIÇOAMENTO (Sub-15, Sub-17) ─────────────────────────────────────────
  aperfeicoamento: {
    aquecimento: [
      act('Rondo 5x2 com Transição', '5 mantêm posse, 2 tentam recuperar. Ao recuperar, os 2 passam para ser o grupo de posse. Ritmo alto.', ['Passe de primeira', 'Transição de papéis', 'Intensidade'], 'Bolas', 'Quadrado 12m, grupos de 7.', 'Reduzir espaço; 1 toque; 3 no centro.', 10, ['aquecimento', 'rondo', 'intensidade']),
      act('Ativação Dinâmica', 'Sequência de 8 movimentos dinâmicos: skipping, chutes ao glúteo, passada lateral, rotação de tronco, salto vertical, deslocamento com bola.', ['Ativação muscular completa', 'Mobilidade articular', 'Foco e concentração'], 'Bolas', 'Faixas de 20m, 2 colunas.', 'Aumentar velocidade de execução.', 8, ['aquecimento', 'ativação', 'dinâmico']),
      act('Jogo de Transição 4x4+2', '4x4 com 2 jogadores neutros que sempre jogam com o time da bola. Foco em transição rápida ao ganhar posse.', ['Transição rápida', 'Superioridade numérica', 'Decisão'], 'Bolas, coletes', 'Campo 25×20m.', 'Reduzir toques; aumentar campo; retirar neutros.', 10, ['aquecimento', 'transição', 'posse']),
    ],
    prep_fisica: [
      act('Intervalo de Alta Intensidade (HIIT)', '8 sprints de 20m com 30 segundos de descanso ativo (caminhada). Monitorar frequência cardíaca se possível.', ['Potência aeróbia', 'Resistência à fadiga', 'Velocidade máxima'], 'Cones', 'Faixas de 20m, grupos de 4.', 'Aumentar nº de sprints; reduzir descanso.', 15, ['físico', 'hiit', 'sprint']),
      act('Circuito de Força Funcional', '6 estações: 1) Agachamento com bola, 2) Prancha 45s, 3) Salto em caixas, 4) Agilidade escada, 5) Elástico lateral, 6) Core rotacional. 50s por estação.', ['Força funcional', 'Core', 'Prevenção de lesões'], 'Cones, escada, elásticos, caixas', 'Estações em circuito. Grupos de 3-4.', 'Aumentar carga; reduzir descanso.', 20, ['físico', 'força', 'core']),
      act('Velocidade com Bola — RSA', 'Repeated Sprint Ability: 6 sprints de 30m conduzindo bola, 20 segundos de descanso. Simula demanda de jogo real.', ['Velocidade com bola', 'Resistência ao sprint repetido', 'Aceleração'], 'Bolas, cones', 'Faixas de 30m, duplas alternando.', 'Aumentar distância; adicionar finalização.', 15, ['físico', 'velocidade', 'resistência']),
    ],
    tecnica: [
      act('Combinações 2x1 e Finalização', '2 atacantes x 1 defensor + goleiro. Executar combinações (parede, paralela, diagonal) para superar defensor e finalizar.', ['Combinações ofensivas', 'Timing de passe', 'Finalização 1x1'], 'Bolas, gol, coletes', 'Campo 30×20m. Rodízio de defensores.', 'Defensor mais ativo; 2 defensores.', 15, ['técnica', 'combinação', 'finalização']),
      act('Passe Longo com Mudança de Jogo', 'Jogador recebe, vira e executa passe longo para o lado oposto do campo. Receptor controla e segue o jogo. Foco em precisão e força.', ['Mudança de jogo', 'Passe longo preciso', 'Domínio orientado'], 'Bolas', 'Grupos de 4 em diagonal. Campo 40m.', 'Aumento de velocidade; bola em movimento.', 12, ['técnica', 'passe longo', 'mudança de lado']),
      act('Finalização por Zona', 'Atividades de finalização de diferentes posições: ângulo fechado, borda da área, cabeceio, pé esquerdo, de primeira. Pontuação por dificuldade.', ['Finalização variada', 'Técnica de chute por posição', 'Ambidestria'], 'Bolas, gol, cones', '5 zonas marcadas no campo. Fileiras por zona.', 'Goleiro mais ativo; defensor passivo.', 15, ['técnica', 'finalização', 'variação']),
      act('Drible e Ultrapassagem 1x1', 'Sequência de dribles programados (corpo falso, elástico, pedalada) em cone e depois situação 1x1 real. Ênfase no timing e explosão pós-drible.', ['Drible específico', 'Aceleração pós-drible', '1x1 real'], 'Bolas, cones', 'Slalom + área 1x1. Rodízio.', 'Defensor mais próximo; variação de dribles.', 15, ['técnica', 'drible', '1x1']),
    ],
    tatica: [
      act('Sistema 4-3-3 Completo — Fase Ofensiva', 'Treinar movimentação ofensiva no 4-3-3: abertura dos extremos, chegada do lateral, linhas de passe do meio-campo, flutuação do centroavante.', ['Posicionamento ofensivo 4-3-3', 'Linhas de passe', 'Movimentação de apoio'], 'Bolas, coletes, cones', 'Campo inteiro. Adversários passivos.', 'Adversários semi-ativos; com pressão.', 20, ['tática', '4-3-3', 'ofensivo']),
      act('Pressão Alta Organizada', 'Treinar a pressão alta coletiva: sinal de pressionamento, compressão por lado, cobertura. Adversários tentam sair jogando.', ['Pressão organizada', 'Gatilho de pressão', 'Compactação lateral'], 'Bolas, coletes', 'Campo 2/3. 8x8.', 'Adversários com 1 toque; campo menor.', 18, ['tática', 'pressão alta', 'coletivo']),
      act('Bolas Paradas — Escanteio e Falta', 'Treinar 3 variações de escanteio (1º pau, 2º pau, zona central) e 2 variações de falta (direta e indireta). Com e sem adversários.', ['Bolas paradas ofensivas', 'Timing de chegada', 'Bloqueios e movimentos'], 'Bolas, gol, cones', 'Campo inteiro. Times de 8+goleiro.', 'Adversários marcando; variações surpresa.', 20, ['tática', 'bola parada', 'escanteio', 'falta']),
    ],
    mini_jogos: [
      act('Jogo Posicional 3x3+3 Neutros', '3x3 com 3 neutros que nunca perdem a bola (apoios constantes). Obriga movimentação intensa e circulação rápida.', ['Velocidade de circulação', 'Apoios constantes', 'Posicionamento'], 'Bolas, coletes', 'Quadrado 15m.', 'Reduzir toques dos neutros; espaço menor.', 12, ['mini-jogo', 'posicional', 'neutros']),
      act('Jogo dos 3 Goleiros', 'Campo triangular com 3 mini-gols. 3 times de 3. Cada time defende 1 gol e ataca os outros 2. Criatividade e decisão.', ['Decisão em campo aberto', 'Criatividade', 'Visão de jogo'], 'Bolas, cones (3 gols)', 'Triângulo de 20m lados.', 'Alterar pontuações por gol.', 12, ['mini-jogo', 'criatividade', 'visão']),
    ],
    jogos_condicionados: [
      act('Jogo 9x9 com Zonas de Pressão', 'Em determinadas zonas do campo, o time sem bola deve pressionar. Em outras, pode recuar. Treina inteligência tática coletiva.', ['Variação de pressão', 'Leitura de espaços', 'Tomada de decisão coletiva'], 'Bolas, coletes, cones', 'Campo 60×45m. 3 zonas horizontais.', 'Reduzir tempo para pressionar; 1 toque nas zonas.', 25, ['jogo condicionado', 'pressão', 'zonas']),
      act('Jogo com Marcação Zonal', 'Times jogam com marcação zonal obrigatória. Cada jogador tem área de responsabilidade. Treina disciplina tática.', ['Marcação zonal', 'Responsabilidade de área', 'Comunicação defensiva'], 'Bolas, coletes, cones', 'Campo 60×45m com zonas marcadas.', 'Aumentar nº de zonas; tempo de jogo.', 25, ['jogo condicionado', 'marcação zonal', 'disciplina']),
    ],
    jogo: [
      act('Jogo 9x9 ou 11x11 com Análise', 'Jogo completo com árbitro. Professor registra dados: passes errados, duelos ganhos, posicionamentos incorretos para análise pós-jogo.', ['Aplicação total dos conceitos', 'Competição real', 'Desenvolvimento individual e coletivo'], 'Bolas, coletes, gol, apito', 'Campo completo.', 'Análise em vídeo se disponível.', 25, ['jogo', 'análise', 'competição']),
    ],
    volta_calma: [
      act('Regeneração Ativa com Bola', 'Troca de passes leves em duplas caminhando. Conversa técnica entre parceiros sobre o que observaram no jogo.', ['Recuperação ativa', 'Reflexão individual', 'Redução gradual da FC'], 'Bolas', 'Duplas espalhadas pelo campo.', 'Professor passa e conversa com cada dupla.', 8, ['volta à calma', 'regeneração', 'reflexão']),
      act('Análise Coletiva Curta', 'Grupo reunido. Professor apresenta 2 situações táticas do treino (positiva e a melhorar) com diagrama rápido no quadro ou no chão.', ['Análise tática', 'Foco no aprendizado', 'Planejamento do próximo treino'], 'Quadro/tablet (opcional)', 'Semicírculo ao redor do professor.', 'Jogador apresenta sua análise.', 7, ['reflexão', 'análise', 'tática']),
    ],
  },

  // ── ALTO RENDIMENTO (Sub-20, Adulto/Amador) ──────────────────────────────────
  alto_rendimento: {
    aquecimento: [
      act('Ativação Dinâmica de Alto Nível', 'Sequência de 12 movimentos funcionais: sprints curtos, deslocamentos laterais com bola, rotações, saltos, acelerações com mudança de direção.', ['Ativação neuromuscular completa', 'Prevenção de lesão', 'Foco pré-competição'], 'Bolas, cones', 'Faixas de 25m.', 'Aumentar intensidade gradualmente.', 12, ['aquecimento', 'ativação', 'alto nível']),
      act('Rondo 6x2 com Pressão Real', '6x2, toques limitados a 2. Ao recuperar, os 2 que recuperaram passam para o grupo de posse. Intensidade de jogo.', ['Posse sob pressão máxima', 'Transição rápida', 'Intensidade'], 'Bolas', 'Quadrado 12m, grupos de 8.', '1 toque; 3 no centro; campo menor.', 10, ['aquecimento', 'rondo', 'pressão']),
      act('Jogo de Posição 5x5+2', '5x5 com 2 neutros. Foco em posse de qualidade, linha de passe e movimentação. Pausa do professor para correções táticas rápidas.', ['Posicionamento', 'Qualidade de passe', 'Leitura de jogo'], 'Bolas, coletes', 'Campo 30×25m.', 'Sem neutros; toques limitados.', 12, ['aquecimento', 'posicional', 'qualidade']),
    ],
    prep_fisica: [
      act('RSA — Sprint Repetido Avançado', '10 sprints de 30m, 20s de descanso. Simula demanda de jogo. Monitor de frequência cardíaca se disponível.', ['Resistência ao sprint repetido', 'Velocidade máxima mantida', 'Capacidade aeróbia-anaeróbia'], 'Cones', 'Faixas de 30m.', 'Aumentar repetições; reduzir descanso; incluir mudança de direção.', 18, ['físico', 'RSA', 'velocidade']),
      act('Prevenção e Ativação Muscular', 'Protocolo FIFA 11+: aquecimento, corrida com variações, força, pliometria, equilíbrio. Séries controladas.', ['Prevenção de lesões', 'Força específica de futebol', 'Propriocepção'], 'Cones, elásticos', 'Em grupos de 2. Cada exercício 2-3 séries.', 'Progressão de carga por semana.', 20, ['físico', 'prevenção', 'FIFA 11+']),
      act('Circuito de Alta Intensidade com Bola', '5 estações de 1 minuto: sprint e finalização, 1x1, cabeceio em série, passe de velocidade, driblar e cruzar. 15s de descanso.', ['Condição física integrada', 'Técnica sob fadiga', 'Intensidade competitiva'], 'Bolas, cones, gol', '5 estações. Grupos de 4.', 'Reduzir descanso; aumentar volume.', 20, ['físico', 'circuito', 'intensidade']),
    ],
    tecnica: [
      act('Trabalho de Finalização Completo', 'Circuito de finalização: chute de 1ª, domínio e chute, cabeceio em cruzamento, finalização de costas para o gol. 3 séries por posição.', ['Finalização variada', 'Técnica de chute precisa', 'Frieza na finalização'], 'Bolas, gol', 'Circuito ao redor da área. Goleiro.', 'Aumentar velocidade; defensor passivo.', 18, ['técnica', 'finalização', 'precisão']),
      act('Passe e Movimento em Alta Velocidade', 'Grupos de 5 em padrão de diamante. Passe e corre para posição diferente em velocidade máxima. 1 toque obrigatório.', ['Passe de primeira em velocidade', 'Timing de movimento', 'Comunicação'], 'Bolas', 'Diamante de 12m. Grupos de 5.', 'Padrões variados de circulação.', 15, ['técnica', 'passe', 'velocidade']),
      act('Drible Aplicado — 1x1 e 2x1', 'Situações de 1x1 e 2x1 em diferentes zonas do campo. Ênfase em ler o defensor antes de decidir (driblar ou passar).', ['Leitura defensiva', 'Decisão de driblar ou passar', 'Qualidade de drible'], 'Bolas, coletes, gol', 'Zonas de 15×12m. Rodízio.', 'Defensor mais agressivo; tempo limite.', 15, ['técnica', 'drible', 'leitura']),
    ],
    tatica: [
      act('Sistema Tático Completo — Análise e Aplicação', 'Apresentar o sistema da semana com lousa/tablet. Depois aplicar em campo com movimentações programadas antes de abrir o jogo.', ['Sistema tático da equipe', 'Automatismos coletivos', 'Disciplina tática'], 'Bolas, coletes, lousa/tablet', 'Campo inteiro. Time completo.', 'Variações do sistema; adversário real.', 25, ['tática', 'sistema', 'automatismo']),
      act('Análise de Adversário e Adaptação', 'Baseado no scouting do adversário, treinar como explorar os pontos fracos e neutralizar os fortes. Situações simuladas.', ['Adaptação tática', 'Leitura de adversário', 'Flexibilidade coletiva'], 'Bolas, coletes, cones', 'Campo inteiro.', 'Aumentar realismo das situações.', 25, ['tática', 'scouting', 'adaptação']),
      act('Bolas Paradas Detalhadas', 'Ensaiar 4-6 variações de escanteio, falta, lateral longa, saída de goleiro. Repetição até automatização.', ['Bolas paradas ofensivas e defensivas', 'Sincronismo', 'Marcação de bola parada'], 'Bolas, gol, cones', 'Campo inteiro. Times completos.', 'Adversários com marcação real.', 20, ['tática', 'bola parada', 'automatismo']),
    ],
    mini_jogos: [
      act('Jogo Posicional de Elite 4x4+4', '4x4 com 4 neutros (2 em cada lateral + 2 no centro). Trabalha posicionamento em espaço comprimido com qualidade máxima.', ['Posicionamento de elite', 'Qualidade técnica sob pressão', 'Velocidade de circulação'], 'Bolas, coletes', 'Quadrado 18m.', 'Sem neutros; toque único.', 15, ['mini-jogo', 'posicional', 'elite']),
      act('Jogo de Finalização 3x3+GK', '3x3 em meia área com goleiro. Ênfase em chegada rápida e finalização. Múltiplas bolas para reiniciar rápido.', ['Finalização em espaço real', 'Tomada de decisão rápida', 'Pressão de tempo'], 'Bolas, gol', 'Meia área.', 'Adicionar lateral; tempo limite.', 12, ['mini-jogo', 'finalização', 'rapidez']),
    ],
    jogos_condicionados: [
      act('Jogo 9x9 Temático', 'Jogo com condição específica do treino: saída de bola obrigatória, pressão em zonas, 3 passes antes de cruzar. Cada condição desenvolve padrão tático.', ['Padrão tático específico', 'Automatismo em jogo', 'Competição com foco'], 'Bolas, coletes', 'Campo 65×50m.', 'Variar condição por bloco de 10min.', 25, ['jogo condicionado', 'padrão tático', 'competição']),
      act('Jogo 11x11 com Regra da Saída', 'Sempre que houver lateral ou tiro de meta, a equipe deve sair em jogo organizado (não pode chutar longo). Treina saída desde atrás.', ['Saída de bola organizada', 'Jogo desde trás', 'Paciência no passe'], 'Bolas, coletes, gol', 'Campo completo.', 'Pressão intensa na saída.', 25, ['jogo condicionado', 'saída de bola', 'organização']),
    ],
    jogo: [
      act('Jogo-Treino Completo 11x11', 'Jogo oficial com árbitro externo. Professor em silêncio durante o jogo para não interferir. Análise completa pós-jogo com dados e imagens.', ['Competição real', 'Autonomia dos jogadores', 'Aplicação total dos conceitos'], 'Bolas, coletes, gol, apito', 'Campo completo.', 'Análise em vídeo; feedback individual.', 30, ['jogo', 'competição', 'autônomo']),
      act('Jogo com Árbitro e Cronometrista', 'Jogo com tempos definidos (2x20min). Controle de infrações, escanteios, faltas. Simula ambiente de competição oficial.', ['Mentalidade competitiva', 'Respeito às regras', 'Pressão de resultado'], 'Bolas, coletes, gol, apito, cronômetro', 'Campo completo.', 'Introduzir público/torcida do grupo.', 30, ['jogo', 'competição', 'regras']),
    ],
    volta_calma: [
      act('Recuperação Ativa e Análise', 'Trote leve 5min + alongamento 10min. Durante o alongamento, professor e jogadores discutem pontos táticos do treino de forma informal.', ['Recuperação muscular', 'Análise informal', 'Clima de grupo'], 'Nenhum', 'Grupo junto no campo.', 'Jogador veterano lidera o alongamento.', 10, ['volta à calma', 'recuperação', 'análise']),
      act('Reunião de Análise Completa', 'Grupo reunido com lousa ou tablet. 3 positivos do treino + 2 pontos a melhorar. Cada jogador fala 1 coisa. Encerrar com motivação.', ['Análise profunda', 'Comunicação coletiva', 'Motivação e pertencimento'], 'Lousa/tablet', 'Sala de reunião ou campo (sentados).', 'Jogadores lideram a reunião.', 10, ['reflexão', 'análise', 'liderança']),
    ],
  },
};

// ─── Funções Helper ────────────────────────────────────────────────────────────

export function sugerirAtividades(groupKey, blocoId, n = 4, principios = []) {
  const pool = BANCO_ATIVIDADES[groupKey]?.[blocoId] ?? [];
  if (principios.length === 0) return pool.slice(0, n);
  // Ordenar por alinhamento com princípios da metodologia
  const kws = principios.map(p => p.toLowerCase());
  const scored = pool.map(a => {
    const text = (a.titulo + ' ' + a.descricao + ' ' + a.tags.join(' ')).toLowerCase();
    const score = kws.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    return { ...a, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, n);
}

export function calcularDuracoes(totalMinutos) {
  return Object.fromEntries(
    BLOCOS_TREINO.map(b => [b.id, Math.round(totalMinutos * b.percentualDefault)])
  );
}

export function detectarRepeticao(blocosState) {
  const seen = new Map();
  const warnings = [];
  for (const bloco of blocosState) {
    for (const ativ of (bloco.atividadesSelecionadas ?? [])) {
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
  if (!metodologia) return 'Nenhuma metodologia definida. Use boas práticas gerais de periodização esportiva.';
  return `
METODOLOGIA DA ESCOLA: ${metodologia.nome_escola || ''}
ESTILO DE JOGO: ${metodologia.estilo_jogo || 'Não definido'}
PILARES: ${Array.isArray(metodologia.pilares) ? metodologia.pilares.join(', ') : 'Não definido'}
VALORES: ${metodologia.valores || 'Não definido'}
OBJETIVOS POR CATEGORIA: ${JSON.stringify(metodologia.objetivos_por_categoria || {})}
`.trim();
}

export function buildMicroPlanPrompt(macro, meso, config, metodologiaPrompt) {
  return `
Você é um especialista em periodização esportiva para futebol. Crie um plano de micro treino completo em JSON.

CONTEXTO:
${metodologiaPrompt}

CONFIGURAÇÃO DO TREINO:
- Escola: ${config.escola}
- Categoria: ${config.categoria} (${GRUPOS_LABEL[GRUPOS_CATEGORIA[config.categoria]] || config.categoria})
- Grupo: ${config.grupo}
- Data: ${config.data_treino}
- Duração total: ${config.duracao_total} minutos
- Objetivo principal: ${config.objetivo}
- Tema/foco: ${config.tema}
${macro ? `
PLANO MACRO (referência anual):
- Título: ${macro.titulo}
- Temporada: ${macro.temporada}
- Fase atual: ${macro.meses ? JSON.stringify(macro.meses.find(m => m.fase)) : 'não informado'}
` : ''}
${meso ? `
PLANO MESO (referência mensal):
- Título: ${meso.titulo}
- Mês: ${meso.mes_ref}
- Semanas: ${JSON.stringify(meso.semanas)}
` : ''}

ESTRUTURA DE SAÍDA OBRIGATÓRIA (JSON puro, sem texto antes ou depois):
{
  "blocos": [
    {
      "id": "aquecimento",
      "nome": "Aquecimento",
      "duracao": <número em minutos>,
      "objetivosSugeridos": ["objetivo1", "objetivo2"],
      "atividadesSugeridas": [
        {
          "titulo": "Nome da atividade",
          "descricao": "Descrição detalhada de 2-3 frases",
          "objetivos": ["objetivo1", "objetivo2"],
          "materiais": "lista de materiais",
          "organizacao": "como organizar os jogadores",
          "progressao": "como aumentar a dificuldade",
          "duracao_sugerida": <minutos>,
          "tags": ["tag1", "tag2"]
        }
      ]
    }
  ]
}

Os 8 blocos obrigatórios (nesta ordem exata de IDs): aquecimento, prep_fisica, tecnica, tatica, mini_jogos, jogos_condicionados, jogo, volta_calma.
Crie 3 atividades por bloco, totalmente alinhadas com a metodologia e o objetivo do treino.
A soma das durações deve ser próxima de ${config.duracao_total} minutos.
Responda APENAS com o JSON válido, sem nenhum texto adicional.
`.trim();
}
