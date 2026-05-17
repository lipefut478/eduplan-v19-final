-- ────────────────────────────────────────────────────────────────────────────
-- FootballPlan — SQL Setup Completo
-- Execute este SQL no painel do Supabase Dashboard → SQL Editor
-- ────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Metodologia da escola (1 por usuário)
CREATE TABLE IF NOT EXISTS metodologia (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_escola TEXT DEFAULT '',
  estilo_jogo TEXT DEFAULT '',
  pilares     JSONB DEFAULT '[]',
  objetivos_por_categoria JSONB DEFAULT '{}',
  valores     TEXT DEFAULT '',
  arquivo_nome TEXT DEFAULT '',
  arquivo_texto TEXT DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Plano Macro (anual)
CREATE TABLE IF NOT EXISTS planos_macro (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo      TEXT DEFAULT '',
  categoria   TEXT DEFAULT '',
  temporada   TEXT DEFAULT '',
  meses       JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Plano Meso (ciclo mensal)
CREATE TABLE IF NOT EXISTS planos_meso (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  macro_id  UUID REFERENCES planos_macro(id) ON DELETE SET NULL,
  titulo    TEXT DEFAULT '',
  categoria TEXT DEFAULT '',
  mes_ref   TEXT DEFAULT '',
  semanas   JSONB DEFAULT '[]',
  justificativa_metodologica TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plano Micro (treino individual)
CREATE TABLE IF NOT EXISTS planos_treino (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meso_id       UUID REFERENCES planos_meso(id) ON DELETE SET NULL,
  escola        TEXT DEFAULT '',
  treinador     TEXT DEFAULT '',
  categoria     TEXT DEFAULT '',
  grupo         TEXT DEFAULT '',
  data_treino   DATE,
  duracao_total INTEGER DEFAULT 90,
  objetivo      TEXT DEFAULT '',
  tema          TEXT DEFAULT '',
  justificativa_metodologica TEXT DEFAULT '',
  blocos        JSONB DEFAULT '[]',
  gerado_por_ia BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Lousa Tática
CREATE TABLE IF NOT EXISTS lousa_tatica (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  treino_id  UUID REFERENCES planos_treino(id) ON DELETE SET NULL,
  titulo     TEXT DEFAULT '',
  tipo_campo TEXT DEFAULT 'futebol',
  estado     JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banco de Exercícios (personalizados do usuário + gerados por IA)
CREATE TABLE IF NOT EXISTS exercicios (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo           TEXT NOT NULL,
  descricao        TEXT DEFAULT '',
  objetivos        JSONB DEFAULT '[]',
  materiais        TEXT DEFAULT '',
  organizacao      TEXT DEFAULT '',
  progressao       TEXT DEFAULT '',
  duracao_sugerida INTEGER DEFAULT 15,
  tags             JSONB DEFAULT '[]',
  categoria_grupo  TEXT DEFAULT '',
  bloco_tipo       TEXT DEFAULT '',
  favorito         BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Novas tabelas: Dashboard, Calendário, Elenco, Chat IA, Modelos ──────────

-- Eventos do Calendário
CREATE TABLE IF NOT EXISTS eventos_calendario (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data       DATE NOT NULL,
  titulo     TEXT NOT NULL,
  descricao  TEXT DEFAULT '',
  tipo       TEXT DEFAULT 'reuniao',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jogadores (elenco)
CREATE TABLE IF NOT EXISTS jogadores (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  idade       INTEGER DEFAULT 10,
  posicao     TEXT DEFAULT 'Meia',
  numero      INTEGER DEFAULT 10,
  categoria   TEXT DEFAULT '',
  avaliacao   JSONB DEFAULT '{}',
  observacoes TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico do Chat IA
CREATE TABLE IF NOT EXISTS chat_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partidas (jogos e scouting)
CREATE TABLE IF NOT EXISTS partidas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adversario    TEXT NOT NULL,
  categoria     TEXT DEFAULT '',
  data          DATE,
  local         TEXT DEFAULT '',
  tipo          TEXT DEFAULT 'casa',
  gols_a_favor  INTEGER DEFAULT 0,
  gols_contra   INTEGER DEFAULT 0,
  resultado     TEXT DEFAULT 'pendente',
  observacoes   TEXT DEFAULT '',
  scouting      TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Modelos de Treino salvos pelo usuário
CREATE TABLE IF NOT EXISTS modelos_treino (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome       TEXT NOT NULL,
  categoria  TEXT DEFAULT '',
  duracao    INTEGER DEFAULT 90,
  tema       TEXT DEFAULT '',
  objetivo   TEXT DEFAULT '',
  blocos     JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE metodologia        ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_macro       ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_meso        ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_treino      ENABLE ROW LEVEL SECURITY;
ALTER TABLE lousa_tatica       ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicios         ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_calendario ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogadores          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos_treino     ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidas           ENABLE ROW LEVEL SECURITY;

-- Policies (usuário acessa só os próprios dados)
DROP POLICY IF EXISTS "own" ON metodologia;
DROP POLICY IF EXISTS "own" ON planos_macro;
DROP POLICY IF EXISTS "own" ON planos_meso;
DROP POLICY IF EXISTS "own" ON planos_treino;
DROP POLICY IF EXISTS "own" ON lousa_tatica;
DROP POLICY IF EXISTS "own" ON exercicios;
DROP POLICY IF EXISTS "own" ON eventos_calendario;
DROP POLICY IF EXISTS "own" ON jogadores;
DROP POLICY IF EXISTS "own" ON chat_messages;
DROP POLICY IF EXISTS "own" ON modelos_treino;
DROP POLICY IF EXISTS "own" ON partidas;

CREATE POLICY "own" ON metodologia        FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON planos_macro       FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON planos_meso        FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON planos_treino      FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON lousa_tatica       FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON exercicios         FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON eventos_calendario FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON jogadores          FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON chat_messages      FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON modelos_treino     FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "own" ON partidas           FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
