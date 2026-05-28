-- Tabela de uso da IA (rate limiting + custo estimado)
CREATE TABLE IF NOT EXISTS ai_usage (
  id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model              TEXT        DEFAULT 'claude-sonnet-4-6',
  input_tokens       INTEGER     DEFAULT 0,
  output_tokens      INTEGER     DEFAULT 0,
  estimated_cost_usd NUMERIC(10, 6) DEFAULT 0,
  endpoint           TEXT        DEFAULT 'ai-proxy',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Usuário pode ver apenas o próprio histórico
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_read" ON ai_usage FOR SELECT USING (auth.uid() = user_id);

-- Índice para queries de rate limiting (user_id + created_at)
CREATE INDEX IF NOT EXISTS ai_usage_user_created
  ON ai_usage (user_id, created_at DESC);
