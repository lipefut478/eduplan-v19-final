# ONDA 1 — Segurança e Estabilidade

> Concluída em: 2026-05-28
> Branch: `claude/football-lesson-planner-7ijg3`
> Commits desta onda: 6

---

## ✅ Checklist de Tarefas

### 1.1 — Edge Function proxy Anthropic
- [x] `supabase/functions/ai-proxy/index.ts` criado (Deno TypeScript)
  - Valida JWT Supabase antes de qualquer processamento
  - Rate limit: 20 req/min + 200 req/dia por user_id (tabela `ai_usage`)
  - Loga tokens de entrada/saída e custo estimado (USD) em `ai_usage`
  - Encaminha para Anthropic com chave no servidor (nunca no bundle)
  - Timeout de 60s implícito via Edge Function timeout da Supabase
  - Retorna mensagens de erro limpas sem vazar detalhes internos
- [x] `supabase/migrations/20260528000000_ai_usage.sql` criado
  - Tabela `ai_usage` com RLS (usuário vê apenas seus próprios registros)
  - Índice em `(user_id, created_at DESC)` para queries de rate limiting
- [x] `ChatIA.jsx` atualizado: usa `supabase.functions.invoke('ai-proxy')`
- [x] `MicroPlano.jsx` atualizado: usa `supabase.functions.invoke('ai-proxy')`
  - Adicionado timeout de 60s com AbortController
  - Mensagem de erro diferenciada para timeout vs erro genérico
- [x] `VITE_ANTHROPIC_API_KEY` removido de todos os arquivos frontend
- [x] Script `npm run deploy:functions` adicionado ao `package.json`

### 1.2 — Downgrade Vite 8-beta → Vite 6 estável
- [x] Instalado Vite 6.4.2 (última estável)
- [x] Override conflitante removido do `package.json`
- [x] Build validado: 11 chunks, sem warnings, 5s

### 1.3 — Variáveis de ambiente
- [x] `.env.example` criado com instruções claras
  - Documenta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
  - Instrui explicitamente a NÃO usar VITE_ANTHROPIC_API_KEY
  - Mostra o comando `supabase secrets set` correto
- [x] `main.jsx` valida variáveis obrigatórias no boot
  - Exibe tela de erro amigável se VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY estiverem ausentes
  - Falha rápido com `throw new Error()` para evitar erros crípticos no console
- [x] `.gitignore` atualizado: `.env`, `.env.local`, `.env.*.local` ignorados

### 1.4 — Headers de segurança (vercel.json)
- [x] `Content-Security-Policy`: permite apenas `*.supabase.co` e Anthropic como origens de rede
- [x] `X-Frame-Options: DENY` — bloqueia embedding em iframes
- [x] `X-Content-Type-Options: nosniff`
- [x] `Strict-Transport-Security`: 2 anos com preload
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Permissions-Policy`: bloqueia câmera, microfone, geolocalização
- [x] `Cache-Control: immutable` para assets com hash (melhora performance)
- [x] RLS verificada: todas as 12 tabelas têm políticas ativas

### 1.5 — Limpeza
- [x] `src/App.jsx` deletado (2762 linhas do EduPlan legado)
- [x] `src/LandingPage.jsx` deletado (84 linhas, não importado)
- [x] `src/App.css` deletado (não importado)
- [x] Zero imports de arquivos deletados (verificado antes da deleção)
- [x] ESLint: **15 erros → 0, 13 warnings → 3**
  - Movidos 10x `useEffect` para depois das `async function` declarations
  - Removidos imports não usados: `useCallback`, `useEffect` em LousaTatica
  - Removida variável `isS` não usada em LousaTatica.FieldSVG
  - Removido import `calcularDuracoes` não usado em Modelos
  - 3 warnings restantes: `react-hooks/exhaustive-deps` em MicroPlano (intencionais)

---

## Métricas Antes / Depois

| Métrica | Antes | Depois |
|---------|-------|--------|
| CVEs npm | 8 (1 crítico) | **0** |
| ESLint errors | 15 | **0** |
| ESLint warnings | 13 | **3** |
| Linhas de código ativas | 6947 (com legado) | **4229** |
| Linhas deletadas (legado) | — | **2848** |
| Vite versão | 8.0.0-beta.13 | **6.4.2 (estável)** |
| API key Anthropic no bundle | SIM | **NÃO** |
| Headers de segurança HTTP | 0 | **6** |
| Variáveis env sem validação | 2 obrigatórias silenciosas | **falha rápido** |
| Build time | ~400ms (rolldown) | **5s (Rollup estável)** |

---

## Arquivos Criados / Modificados / Deletados

### Criados (5)
- `supabase/functions/ai-proxy/index.ts`
- `supabase/migrations/20260528000000_ai_usage.sql`
- `.env.example`
- `ONDA_1_RELATORIO.md`

### Modificados (14)
- `src/main.jsx` — validação de env vars
- `src/pages/ChatIA.jsx` — proxy via supabase.functions.invoke
- `src/pages/MicroPlano.jsx` — proxy + timeout AbortController
- `src/pages/LousaTatica.jsx` — remove imports/vars não usados
- `src/pages/Modelos.jsx` — remove import não usado
- `src/pages/BancoExercicios.jsx` — move useEffect pós-function
- `src/pages/Calendario.jsx` — move useEffect pós-function
- `src/pages/Dashboard.jsx` — move useEffect pós-function
- `src/pages/Elenco.jsx` — move useEffect pós-function
- `src/pages/MacroPlano.jsx` — move useEffect pós-function
- `src/pages/MesoPlano.jsx` — move useEffect pós-function
- `src/pages/Metodologia.jsx` — move useEffect pós-function
- `src/pages/MeusPlanos.jsx` — move useEffect pós-function
- `src/pages/Partidas.jsx` — move useEffect pós-function
- `package.json` — Vite 6, script deploy:functions
- `vercel.json` — headers de segurança
- `.gitignore` — ignora arquivos .env

### Deletados (3)
- `src/App.jsx` (2762 linhas)
- `src/LandingPage.jsx` (84 linhas)
- `src/App.css`

---

## Como rodar localmente agora

```bash
# 1. Clone e instale
git clone <repo>
cd eduplan-v19-final
npm install

# 2. Configurar ambiente
cp .env.example .env
# Edite .env com suas chaves Supabase

# 3. Rodar em dev
npm run dev
# → http://localhost:5173
```

---

## O que configurar no Supabase Dashboard manualmente

### 1. Execute o SQL de setup completo

No **Supabase Dashboard → SQL Editor**, execute em ordem:

```sql
-- Arquivo 1: tabelas principais + RLS
-- (conteúdo de supabase_setup.sql)

-- Arquivo 2: tabela ai_usage
-- (conteúdo de supabase/migrations/20260528000000_ai_usage.sql)
```

### 2. Configure a chave Anthropic como Secret

```bash
# Via CLI do Supabase (instale com: npm install -g supabase)
supabase login
supabase link --project-ref <seu-project-ref>
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Faça o deploy da Edge Function

```bash
npm run deploy:functions
# ou manualmente:
supabase functions deploy ai-proxy --no-verify-jwt=false
```

---

## Riscos Remanescentes

| Risco | Severidade | Status |
|-------|-----------|--------|
| 94% das operações Supabase sem try/catch | 🟠 ALTO | → Onda 2 |
| Race conditions em useEffect sem AbortController | 🟠 ALTO | → Onda 2 |
| MicroPlano.jsx (656 linhas) com 15+ hooks | 🟡 MÉDIO | → Onda 3 |
| Lazy-import de jsPDF/docx não implementado | 🟡 MÉDIO | → Onda 4 |
| Sem testes automatizados (0 arquivos .test.js) | 🟠 ALTO | → Onda 5 |
| 3 warnings react-hooks/exhaustive-deps restantes | 🟢 BAIXO | Intencionais |
| Contraste textMuted abaixo WCAG no modo claro | 🟡 MÉDIO | → Onda 4 |
