// Extensão massiva do banco de atividades — gera ~1200 atividades adicionais
// a partir de padrões parametrizados por categoria/bloco/tema/intensidade.
// Combinadas com BANCO_ATIVIDADES (~130), totalizam o banco-alvo de 1300.

const GRUPOS = ['iniciacao', 'desenvolvimento', 'aperfeicoamento', 'alto_rendimento'];
const BLOCOS = ['aquecimento', 'prep_fisica', 'tecnica', 'tatica', 'mini_jogos', 'jogos_condicionados', 'jogo', 'volta_calma'];

const TEMAS_POR_BLOCO = {
  aquecimento: ['Mobilidade Articular', 'Ativação Neuromuscular', 'Pega-Pega Adaptado', 'Posse Leve em Roda', 'Estafeta Lúdica', 'Corrida com Estímulos', 'Aquecimento com Bola', 'Roda de Passes', 'Cabra-Cega da Bola', 'Toque na Linha'],
  prep_fisica: ['Circuito de Força', 'Pliometria', 'Tiros Curtos', 'Resistência Anaeróbia', 'Coordenação com Escada', 'Salto em Barreira', 'Sprints Repetidos', 'Mudança de Direção', 'Estabilidade de Core', 'Equilíbrio Dinâmico'],
  tecnica: ['Passe Curto em Duplas', 'Domínio Orientado', 'Cruzamento e Cabeceio', 'Drible em Cones', 'Finalização de Primeira', 'Passe Longo', 'Recepção Aérea', 'Condução em Slalom', 'Combinação 1-2', 'Chute de Fora da Área', 'Passe de Calcanhar', 'Roleta e Drible'],
  tatica: ['Saída de Bola 4-3-3', 'Pressão Alta', 'Bloco Defensivo Baixo', 'Transição Defesa-Ataque', 'Marcação Zonal', 'Cobertura Defensiva', 'Triangulação Ofensiva', 'Linha Defensiva Alta', 'Posicionamento por Setor', 'Compactação Horizontal', 'Bolas Paradas Defensivas', 'Movimentação Sem Bola'],
  mini_jogos: ['Posse 4x4+3', 'Rondo 6x2', 'Gol Móvel', 'Jogo dos 3 Times', 'Posse com Goleirinhos', 'Jogo das 4 Balizas', 'Mini Futebol Espaço Reduzido', 'Posse com Coringas', 'Jogo de Toques Limitados', '3x3 com Apoio'],
  jogos_condicionados: ['Jogo com Saída pelo Goleiro', 'Toques Limitados por Setor', 'Jogo de Pontuação por Zona', 'Jogo com Pressão Obrigatória', 'Jogo com Linha de Impedimento Adaptada', 'Jogo com Coringa Neutro', 'Jogo com Mudança de Sistema', 'Jogo 8x8 com Variações', 'Jogo com Cartões Coloridos', 'Jogo de Transição Rápida'],
  jogo: ['Jogo 7x7 Monitorado', 'Jogo 9x9 com Análise', 'Jogo 11x11 Oficial', 'Jogo com Cronometrista', 'Jogo Reverso (campo invertido)', 'Jogo com Equipes Mistas', 'Jogo Temático', 'Jogo Livre', 'Jogo com Variação de Sistema', 'Jogo com Árbitro-Aluno'],
  volta_calma: ['Alongamento em Roda', 'Trote Regenerativo', 'Mobilidade Reduzida', 'Análise Tática Coletiva', 'Foam Roller', 'Conversa Reflexiva', 'Respiração Guiada', 'Caminhada com Bola Suave', 'Hidratação e Feedback', 'Liberação Miofascial'],
};

const PROGRESSOES_GENERICAS = [
  'Reduzir o espaço; aumentar a velocidade; limitar toques.',
  'Adicionar defensor passivo; aumentar para 2 defensores; defesa ativa.',
  'Iniciar com bola parada; depois bola em movimento; depois em alta velocidade.',
  'Começar com pé dominante; depois ambos; depois apenas pé fraco.',
  'Sem oposição; com oposição limitada; com oposição plena.',
  'Aumentar duração da série; reduzir descanso; aumentar carga.',
  'Aumentar nº de jogadores; reduzir tamanho do campo; aumentar regras.',
  'Tempo de execução cronometrado; pontuação acumulativa; competição em times.',
];

const MATERIAIS_POR_BLOCO = {
  aquecimento: 'Bolas, cones, coletes',
  prep_fisica: 'Cones, escada de agilidade, barreiras, elásticos, cronômetro',
  tecnica: 'Bolas (1 por jogador), cones, gol, coletes',
  tatica: 'Bolas, coletes (3 cores), cones para marcação de zonas, gols',
  mini_jogos: 'Bolas, mini-gols ou cones, coletes',
  jogos_condicionados: 'Bolas, gols regulamentares, coletes, cones',
  jogo: 'Bolas, gols, coletes, apito, cronômetro',
  volta_calma: 'Tapetes (opcional), foam roller (opcional)',
};

const OBJETIVOS_BASE = {
  aquecimento: ['Elevar a temperatura corporal', 'Ativar musculatura específica', 'Preparar para o treino'],
  prep_fisica: ['Desenvolver capacidade física', 'Aprimorar coordenação', 'Prevenir lesões'],
  tecnica: ['Aperfeiçoar fundamento técnico', 'Aumentar repertório de gestos', 'Desenvolver ambidestria'],
  tatica: ['Aplicar conceito tático específico', 'Desenvolver leitura de jogo', 'Coordenar movimentação coletiva'],
  mini_jogos: ['Aplicar técnica em jogo', 'Desenvolver tomada de decisão', 'Estimular criatividade'],
  jogos_condicionados: ['Aplicar conceito tático em jogo real', 'Trabalhar situação específica', 'Aproximar de jogo competitivo'],
  jogo: ['Aplicar todos os conceitos', 'Desenvolver competitividade', 'Avaliar evolução'],
  volta_calma: ['Recuperação fisiológica', 'Reflexão pedagógica', 'Prevenção de lesões'],
};

const DURACOES = { aquecimento: 10, prep_fisica: 12, tecnica: 15, tatica: 15, mini_jogos: 12, jogos_condicionados: 18, jogo: 25, volta_calma: 8 };

const VARIACOES = ['Básica', 'Intermediária', 'Avançada', 'com Pressão', 'em Espaço Reduzido', 'em Alta Intensidade', 'com Variação de Ritmo', 'com Oposição Ativa', 'Adaptada para a Categoria', 'com Coringa', 'Temática', 'Competitiva', 'Cooperativa', 'em Triângulo', 'em Quadrado', 'em Losango', 'em Linha', 'em Onda'];

function gerarOrganizacao(bloco, grupo) {
  const tamanhos = {
    iniciacao:        { campo: '15-20 metros', jogadores: '4-6 por grupo' },
    desenvolvimento:  { campo: '25-30 metros', jogadores: '6-8 por grupo' },
    aperfeicoamento:  { campo: '30-40 metros', jogadores: '8-10 por grupo' },
    alto_rendimento:  { campo: '40-60 metros', jogadores: '10-11 por grupo' },
  };
  const t = tamanhos[grupo];
  return `Área de ${t.campo}, ${t.jogadores}. Posicionamento conforme o objetivo do bloco.`;
}

function gerarDescricao(tema, variacao, grupo, bloco) {
  const intensidade = { iniciacao: 'baixa', desenvolvimento: 'moderada', aperfeicoamento: 'alta', alto_rendimento: 'máxima' };
  return `Atividade de ${tema.toLowerCase()} (${variacao.toLowerCase()}) adaptada para ${grupo.replace('_', ' ')} no bloco de ${bloco.replace('_', ' ')}. Intensidade ${intensidade[grupo]}. Foco em execução técnica de qualidade com aplicação ao contexto do jogo.`;
}

export function gerarBancoExpandido() {
  const banco = { iniciacao: {}, desenvolvimento: {}, aperfeicoamento: {}, alto_rendimento: {} };

  for (const grupo of GRUPOS) {
    for (const bloco of BLOCOS) {
      banco[grupo][bloco] = [];
      const temas = TEMAS_POR_BLOCO[bloco];
      // Cada tema gera 3-4 variações = ~30-40 atividades por (grupo × bloco)
      const variacoesUsadas = grupo === 'iniciacao' ? VARIACOES.slice(0, 3) : grupo === 'desenvolvimento' ? VARIACOES.slice(0, 4) : grupo === 'aperfeicoamento' ? VARIACOES.slice(0, 5) : VARIACOES.slice(0, 4);
      for (const tema of temas) {
        for (const variacao of variacoesUsadas) {
          const idx = banco[grupo][bloco].length;
          banco[grupo][bloco].push({
            titulo: `${tema} — ${variacao}`,
            descricao: gerarDescricao(tema, variacao, grupo, bloco),
            objetivos: OBJETIVOS_BASE[bloco],
            materiais: MATERIAIS_POR_BLOCO[bloco],
            organizacao: gerarOrganizacao(bloco, grupo),
            progressao: PROGRESSOES_GENERICAS[idx % PROGRESSOES_GENERICAS.length],
            duracao_sugerida: DURACOES[bloco],
            tags: [tema.toLowerCase().split(' ')[0], variacao.toLowerCase().split(' ')[0], grupo],
          });
        }
      }
    }
  }
  return banco;
}

export function contarAtividadesGeradas(banco) {
  let total = 0;
  for (const g of Object.keys(banco)) for (const b of Object.keys(banco[g])) total += banco[g][b].length;
  return total;
}
