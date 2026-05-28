# Teste Manual — Onda 1 (Segurança e Estabilidade)

> Checklist para o dono do projeto validar a Onda 1 sem precisar de conhecimento técnico.
> Tempo estimado: 20–30 minutos.
> Pré-requisito: ter o `.env` configurado com as chaves do Supabase.

---

## 1. Preparar o ambiente

### 1.1 — Instalar dependências (só na primeira vez)

Abra o terminal na pasta do projeto (`eduplan-v19-final`) e execute:

```bash
npm install
```

Aguarde terminar. Você verá algo como "261 packages added".

### 1.2 — Verificar variáveis de ambiente

O arquivo `.env` na raiz do projeto deve ter:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Se não tiver, copie o arquivo `.env.example`:

```bash
cp .env.example .env
```

Depois edite `.env` com seus valores reais do Supabase Dashboard.

---

## 2. Rodar o app localmente

Execute no terminal:

```bash
npm run dev
```

Aguarde aparecer a mensagem:
```
  ➜  Local:   http://localhost:5173/
```

Abra o navegador em **http://localhost:5173**

**✅ Esperado:** Tela de login do FootballPlan aparecer (fundo verde com formulário branco à direita).

**❌ Se aparecer tela de erro "Configuração necessária":** seu `.env` está incompleto. Veja o passo 1.2.

---

## 3. Criar conta e fazer login

### 3.1 — Enviar magic link

1. Na tela de login, digite seu e-mail no campo
2. Clique em **"Enviar Link Mágico ✨"**
3. **✅ Esperado:** mensagem verde "✅ Link enviado! Verifique sua caixa de entrada."

### 3.2 — Acessar o link

1. Vá ao seu e-mail e clique no link recebido
2. O navegador vai abrir e redirecionar para o app
3. **✅ Esperado:** você é redirecionado para o Dashboard do FootballPlan com a sidebar lateral visível

---

## 4. Verificar que API key NÃO está no bundle

No terminal, com o app já buildado (o passo anterior fez o build), execute:

```bash
npm run security:check
```

**✅ Esperado:**
```
✅ PASSOU — Nenhum segredo encontrado no bundle.
```

**❌ Se aparecer "FALHOU":** há um segredo exposto — não faça deploy e reporte imediatamente.

---

## 5. Testar o fluxo de IA

> ⚠️ Pré-requisito: a Edge Function `ai-proxy` precisa estar deployada no Supabase.
> Se não estiver, o botão vai mostrar um erro — isso é esperado nesse caso.

### 5.1 — Assistente IA (Chat)

1. No sidebar, clique em **"Assistente IA"**
2. Digite uma pergunta, ex: *"Como ensinar passe curto para crianças?"*
3. Pressione Enter ou clique no botão de enviar
4. **✅ Esperado:** resposta aparecer em alguns segundos

### 5.2 — Gerar treino com IA (Micro)

1. No sidebar, clique em **"Micro (Treino)"**
2. Preencha os campos: escola, categoria, data
3. Clique em **"Gerar com IA"**
4. **✅ Esperado:** modal de loading aparecer, depois de alguns segundos o plano é preenchido automaticamente

---

## 6. Verificar ai_usage no Supabase

Após usar a IA, vá ao **Supabase Dashboard**:

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Vá em **Table Editor** → tabela `ai_usage`
3. **✅ Esperado:** ver uma ou mais linhas com:
   - `user_id` — seu ID de usuário
   - `model` — "claude-sonnet-4-6"
   - `input_tokens` e `output_tokens` — números positivos
   - `estimated_cost_usd` — valor pequeno como 0.000123
   - `created_at` — timestamp recente

Se a tabela não existir, execute o SQL da migration:
```sql
-- Copie o conteúdo de: supabase/migrations/20260528000000_ai_usage.sql
-- e execute no Supabase Dashboard → SQL Editor
```

---

## 7. Verificar Health Check

No navegador, acesse:

```
http://localhost:5173/?health
```

Ou no sidebar, no rodapé, clique em **"Health Check"**.

**✅ Esperado:** painel verde mostrando:
```
✅ Saudável
  ✓ Variáveis de ambiente
  ✓ Supabase (Auth/DB)
  ✓ Edge Function ai-proxy
```

**⚠️ Edge Function "degradada":** significa que a função ainda não foi deployada. Isso não impede o resto do app de funcionar.

---

## 8. Rodar os testes automáticos

Execute no terminal:

```bash
npm test
```

**✅ Esperado:**
```
Test Files  2 passed (2)
     Tests  33 passed (33)
```

---

## Troubleshooting

### "Sem conexão" ao usar IA
- Verifique se a Edge Function foi deployada: `supabase functions deploy ai-proxy`
- Verifique se o secret está configurado: `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`

### "Limite atingido" ao usar IA
- Você atingiu 20 requisições no último minuto. Aguarde 1 minuto.
- Ou atingiu 200 requisições no dia. Aguarde até amanhã (ou aumente o limite na Edge Function).

### Tela branca no navegador
- Abra o Console do navegador (F12 → Console) e procure pelo erro em vermelho
- Compartilhe o erro completo para diagnóstico

### Login não funciona
- Verifique se o e-mail está correto
- Verifique no Supabase Dashboard → Authentication → Users se o usuário existe
- Em "Authentication → Settings", confirme que "Enable Email confirmations" está configurado corretamente

### npm run dev dá erro
- Verifique se o Node.js está instalado: `node --version` (precisa ser v18 ou superior)
- Delete `node_modules/` e rode `npm install` novamente

---

## Resumo dos comandos

| Comando | O que faz |
|---------|-----------|
| `npm install` | Instala dependências |
| `npm run dev` | Inicia o app localmente |
| `npm run build` | Gera o build de produção |
| `npm test` | Roda todos os testes (33 testes) |
| `npm run security:check` | Verifica se há segredos no bundle |
| `npm run lint` | Verifica qualidade do código |
| `npm run deploy:functions` | Deploya a Edge Function no Supabase |
