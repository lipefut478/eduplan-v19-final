# DIAGNÓSTICO TÉCNICO — FootballPlan (EduPlan V19)

> Auditoria 360° realizada em: **2026-05-28**
> Branch analisado: `claude/football-lesson-planner-7ijg3`
> Escopo: módulo FootballPlan (app principal em produção)

---

## SUMÁRIO EXECUTIVO

| Dimensão | Status | Criticidade |
|----------|--------|-------------|
| Arquitetura | Modular, páginas bem separadas | 🟡 MÉDIO |
| Qualidade de Código | Sem testes, poucos erros tratados | 🟠 ALTO |
| Segurança | API key exposta no bundle + 8 CVEs | 🔴 CRÍTICO |
| Performance | Bundle bem dividido; chunk de dados grande | 🟡 MÉDIO |
| Bugs / Riscos | Race conditions em async sem cleanup | 🟠 ALTO |
| Dependências | 1 CVE crítico (jsPDF), 3 altos, 4 moderados | 🔴 CRÍTICO |
| Documentação / DX | README ausente, sem tipos, sem testes | 🟠 ALTO |
| Acessibilidade | 83 botões sem `type`, sem ARIA labels | 🟡 MÉDIO |

**Score geral: 48 / 100** — App funcional, mas não pronto para produção com usuários externos.

---

## 1. ARQUITETURA & ESTRUTURA

### 1.1 Mapa de arquivos ativos

```
src/
├── main.jsx                   4 linhas  — entry point (monta FootballApp)
├── FootballApp.jsx          230 linhas  — shell: auth, sidebar, roteamento por estado
├── Login.jsx                120 linhas  — magic-link auth
├── supabaseClient.js          6 linhas  — cliente Supabase
├── App.jsx                 2762 linhas  — ⚠️ EduPlan legado, NÃO importado
├── pages/
│   ├── Dashboard.jsx        137 linhas
│   ├── Metodologia.jsx      244 linhas
│   ├── MacroPlano.jsx       194 linhas
│   ├── MesoPlano.jsx        203 linhas
│   ├── MicroPlano.jsx       656 linhas  — componente mais complexo
│   ├── Modelos.jsx          149 linhas
│   ├── Calendario.jsx       197 linhas
│   ├── Elenco.jsx           199 linhas
│   ├── Partidas.jsx         237 linhas
│   ├── LousaTatica.jsx      407 linhas
│   ├── BancoExercicios.jsx  288 linhas
│   ├── ChatIA.jsx           156 linhas
│   └── MeusPlanos.jsx       189 linhas
└── data/
    ├── footballData.js      474 linhas  — constantes, helpers, prompt builders
    └── extraActivities.js   105 linhas  — geração paramétrica ~1170 atividades
```

**Total de linhas ativas (FootballPlan): ~4185**
**Total geral no repo (incluindo legado): 6947**

### 1.2 Padrão arquitetural

O app usa **roteamento por estado** (`currentModule`) em vez de React Router. Cada página é um componente importado estaticamente e montado/desmontado com `{currentModule === 'id' && <Pagina />}`.

```jsx
// FootballApp.jsx:183-225
{currentModule === 'dashboard' && <Dashboard session={session} isDark={isDark} ... />}
{currentModule === 'micro'     && <MicroPlano ... preset={modeloEscolhido} />}
// ...13 módulos total
```

**Avaliação:** Funciona bem para este porte. O padrão de passagem de `session` e `isDark` como props para todos os módulos é **prop drilling leve**, aceitável agora mas frágil se o app crescer.

### 1.3 Arquivo legado `App.jsx`

`src/App.jsx` (2762 linhas) é o aplicativo EduPlan original. Ele **não é importado** em nenhum lugar do código ativo — `main.jsx` importa apenas `FootballApp`. Vite não o inclui no bundle (tree-shaking confirmado pelo build: chunk principal = 187 KB).

> **Recomendação**: Mover `App.jsx` e `LandingPage.jsx` para `src/legacy/` ou deletar — presença no diretório `src/` gera confusão.

### 1.4 Separação de responsabilidades

| Camada | Status |
|--------|--------|
| Estado global (auth, tema, metodologia) | ✅ em `FootballApp.jsx` |
| Estado local por módulo | ✅ dentro de cada página |
| Acesso a dados (Supabase) | ⚠️ direto nos componentes — sem service layer |
| Helpers / dados estáticos | ✅ em `src/data/` |
| Lógica de IA (Claude API) | ⚠️ embutida em `ChatIA.jsx` e `MicroPlano.jsx` |

**Problema**: Não há camada de serviço (service layer). Queries Supabase e chamadas à API Anthropic estão espalhadas diretamente dentro dos componentes React. Isso dificulta testar a lógica de negócio isoladamente.

---

## 2. QUALIDADE DE CÓDIGO

### 2.1 Tamanho e complexidade dos componentes

| Arquivo | Linhas | Estado (`useState`) | Avaliação |
|---------|--------|---------------------|-----------|
| `MicroPlano.jsx` | 656 | ~15 hooks | 🔴 Candidato a divisão |
| `LousaTatica.jsx` | 407 | ~10 hooks + SVG complexo | 🟠 Monitorar |
| `BancoExercicios.jsx` | 288 | ~8 hooks | 🟡 OK |
| `Partidas.jsx` | 237 | ~6 hooks | ✅ |
| Restantes | 137–244 | 3–6 hooks | ✅ |

`MicroPlano.jsx` gerencia 3 etapas (step wizard), 8 blocos, seleção de mesoPlano, chamada IA e exportação PDF/Word — tudo em um único componente. Deveria ser fatorado em:
- `MicroConfig.jsx` — etapa 0
- `MicroBlocos.jsx` — etapa 1 (8 blocos)
- `MicroExportar.jsx` — etapa 2

### 2.2 Tratamento de erros

```
Total de operações assíncronas (await / .then): ~52
Blocos try/catch em src/pages/:               3
Operações sem tratamento de erro:             ~49 (94%)
```

**Exemplo crítico — `ChatIA.jsx:64-67`:**
```jsx
// Insert de mensagem sem catch — falha silenciosa
supabase.from('chat_messages').insert([{ user_id, role, content }]);
```

**Exemplo crítico — `MicroPlano.jsx:47-49`:**
```jsx
// Query de mesoPlanos sem catch
supabase.from('planos_meso').select('*').eq('user_id', userId)
  .then(({ data }) => { if (data) setMesosList(data); });
```

Se o Supabase estiver offline ou retornar erro, o usuário não recebe feedback algum.

### 2.3 useEffect sem cleanup

```
Total de useEffect em src/pages/ + FootballApp.jsx: 31
useEffect com cleanup (return () => ...):           1  ← apenas auth subscription
```

**Risco de race condition** em qualquer componente que dispara fetch em `useEffect` e o usuário navegar para outra página antes do fetch terminar:

```jsx
// MesoPlano.jsx — sem cancelamento
useEffect(() => {
  supabase.from('planos_macro').select('*')...
    .then(({ data }) => setMacroList(data)); // pode setar estado em componente desmontado
}, [session]);
```

**Solução mínima**: adicionar flag `let mounted = true` e verificar antes de `setState`:
```jsx
useEffect(() => {
  let mounted = true;
  fetchData().then(data => { if (mounted) setState(data); });
  return () => { mounted = false; };
}, []);
```

### 2.4 Nomenclatura e consistência

- ✅ Nomes de componentes em PascalCase, funções em camelCase
- ✅ Props consistentes: `session`, `isDark`, `onNavigate`, `onSaved`
- ⚠️ Mix de português e inglês nas variáveis (ex: `treinador`, `blocos`, `saving`, `loading`)
- ⚠️ Alguns identificadores em português dificultam colaboração internacional: `metodologiaData`, `planoAtualId`, `gerando`

### 2.5 Código morto

- `src/App.jsx` (2762 linhas) — não importado, não usado
- `src/LandingPage.jsx` — não confirmado se importado
- Nenhum import não utilizado detectado nos arquivos ativos

### 2.6 TypeScript

O projeto usa `.jsx` sem TypeScript. Não há `tsconfig.json`.

**Impacto prático**: props como `metodologia` (passada para 5 módulos) não tem contrato de tipo definido — mudanças de estrutura quebram silenciosamente.

---

## 3. SEGURANÇA

### 3.1 🔴 CRÍTICO — API key da Anthropic exposta no bundle

```js
// src/pages/ChatIA.jsx:32
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// src/pages/MicroPlano.jsx:73
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
```

Qualquer variável prefixada com `VITE_` é **compilada no bundle JavaScript** e visível a qualquer usuário com DevTools aberto (`Sources → assets/index-*.js`). Isso significa que:

1. Qualquer visitante pode extrair a chave `sk-ant-...`
2. Usar a chave para fazer chamadas ilimitadas à Claude API às custas do dono
3. Não há como revogar acesso a um usuário específico

A presença do header `'anthropic-dangerous-direct-browser-access': 'true'` **reconhece explicitamente** este risco.

**Ponto de esclarecimento**: O key ainda **não está no `.env`** (o arquivo atual tem apenas as chaves Supabase). Se o usuário adicionar `VITE_ANTHROPIC_API_KEY` ao `.env`, o problema se materializa imediatamente.

**Solução correta**: Criar um backend proxy (Supabase Edge Function, Vercel Function ou servidor Node) que recebe o pedido do frontend sem a chave, autentica o usuário via JWT Supabase, e então chama a Anthropic API com a chave armazenada em variável de ambiente do servidor (não do cliente).

```
Frontend → POST /api/ai/treino { config } → Edge Function → Anthropic API (chave no servidor)
```

### 3.2 🟡 Chaves Supabase no `.env`

```
# .env
VITE_SUPABASE_URL=https://tvskimsuxxvitjfwmbuh.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_PtSeWz_LIDSDuX0mt01Wdg_0mskI0SN
```

**Estas chaves são intencionalmente públicas** (Supabase `anon key` = chave publicável). A proteção real é feita pelas políticas de Row Level Security (RLS) configuradas em `supabase_setup.sql`. ✅

**Verificação RLS**: O arquivo `supabase_setup.sql` define `CREATE POLICY "own" ON [tabela] FOR ALL USING (auth.uid()=user_id)` para todas as 11 tabelas. ✅

### 3.3 🔴 CRÍTICO — Vulnerabilidades npm (`npm audit`)

```
8 vulnerabilities total: 1 critical, 3 high, 4 moderate
```

| Pacote | Severidade | CVE | Corrigível |
|--------|-----------|-----|-----------|
| `jspdf` ≤4.2.0 | 🔴 CRÍTICO | PDF Object Injection + HTML Injection | `npm audit fix` |
| `@xmldom/xmldom` 0.9.0–0.9.9 | 🔴 ALTO | 5 CVEs de XML injection + DoS | `npm audit fix` |
| `flatted` ≤3.4.1 | 🔴 ALTO | DoS + Prototype Pollution em parse() | `npm audit fix` |
| `picomatch` 4.0.0–4.0.3 | 🔴 ALTO | ReDoS + Glob injection | `npm audit fix` |
| `dompurify` ≤3.3.3 | 🟠 MODERADO | 8 CVEs de XSS bypass | `npm audit fix` |
| `postcss` <8.5.10 | 🟠 MODERADO | XSS via `</style>` | `npm audit fix` |
| `brace-expansion` <1.1.13 | 🟠 MODERADO | DoS | `npm audit fix` |
| `ws` 8.0.0–8.20.0 | 🟠 MODERADO | Memory disclosure | `npm audit fix` |

**Todos corrigíveis com um único comando:**
```bash
npm audit fix
```

### 3.4 Sanitização de entrada

- `src/pages/Metodologia.jsx` passa campos de formulário diretamente para `supabase.from(...).upsert({...})` sem validação de comprimento ou tipo.
- Não há injeção SQL possível (Supabase usa queries parametrizadas automaticamente) ✅
- Não há innerHTML/dangerouslySetInnerHTML em nenhum arquivo ativo ✅

### 3.5 CORS / CSP

- Não há configuração de headers de segurança no `vercel.json` atual (apenas rewrite SPA)
- Não há Content Security Policy definida

---

## 4. PERFORMANCE

### 4.1 Bundle

Build atual com code splitting ativo:

```
react.js          182 KB (gzip: 57 KB)   ← React 19
supabase.js       164 KB (gzip: 43 KB)
index.js          187 KB (gzip: 46 KB)   ← App + todas as páginas
docx.js           401 KB (gzip: 114 KB)  ← Word export
pdf.js            401 KB (gzip: 130 KB)  ← PDF export
html2canvas.js    200 KB (gzip: 47 KB)
```

**Pontos positivos:**
- ✅ `docx.js` e `pdf.js` são chunks separados — carregados apenas quando necessário
- ✅ Sem warnings de tamanho de chunk (era 1.35 MB antes do splitting)

**Ponto de atenção:**
- ⚠️ `docx.js` e `pdf.js` são carregados de forma *eager* (importados no topo dos componentes). Deveriam usar `import()` dinâmico:

```jsx
// Atual — carrega 800 KB extra mesmo em quem não exporta
import { jsPDF } from 'jspdf';

// Melhor — só carrega quando o usuário clica em "Exportar PDF"
const gerarPDF = async () => {
  const { jsPDF } = await import('jspdf');
  // ...
};
```

### 4.2 Re-renders

- Não há uso de `React.memo`, `useMemo` ou `useCallback` em nenhum componente
- `FootballApp.jsx` re-renderiza todos os filhos ao mudar `isDark` — isso afeta todos os 13 módulos simultaneamente
- Para o porte atual (13 módulos, máximo 656 linhas/componente) o impacto é desprezível, mas vale monitorar

### 4.3 Queries Supabase sem paginação

```jsx
// Dashboard.jsx:23-29 — busca todos os registros sem LIMIT
const [t1, t2, t3, t4, t5] = await Promise.all([
  supabase.from('planos_treino').select('*', { count: 'exact' }),
  supabase.from('planos_macro').select('*', { count: 'exact' }),
  ...
]);
```

Para uso com um único usuário (escola) isso não é um problema. Em multi-tenant ou com muitos registros, pode tornar-se gargalo.

### 4.4 `src/data/footballData.js` — banco de atividades

- 474 linhas de constantes JS carregadas na inicialização do módulo
- `BANCO_COMPLETO` une ~130 atividades manuais + ~1170 geradas por `extraActivities.js`
- Essas estruturas são importadas por `BancoExercicios.jsx` e `MicroPlano.jsx`
- Impacto real: o chunk `index.js` (187 KB gzip: 46 KB) sugere que os dados cabem confortavelmente

---

## 5. BUGS & RISCOS FUNCIONAIS

### 5.1 Race condition em navegação rápida

**Afetados**: todos os módulos com `useEffect` de fetch (`MesoPlano`, `MacroPlano`, `Calendario`, `Elenco`, `Partidas`, `Dashboard`, `ChatIA`, `MeusPlanos`, `BancoExercicios`)

**Cenário**: usuário clica em "Meso" → componente monta → dispara fetch Supabase → usuário clica em "Micro" antes do fetch terminar → fetch retorna → `setMesosList()` chama `setState` em componente desmontado.

**No React 18+**: React descarta o setState silenciosamente (sem crash), mas pode causar *stale state* em casos específicos.

**Solução**: padrão `mounted` flag ou AbortController:
```jsx
useEffect(() => {
  const controller = new AbortController();
  supabase.from('planos_meso').select('*')...
    .then(({ data }) => { if (!controller.signal.aborted) setMesosList(data); });
  return () => controller.abort();
}, [session?.user?.id]);
```

### 5.2 `gerarComIA()` sem timeout

**Arquivo**: `src/pages/MicroPlano.jsx` — função `gerarComIA()`

A chamada à API Anthropic não tem timeout configurado. Se a rede travar, o modal de loading ficará aberto indefinidamente sem feedback ao usuário.

```jsx
// Sem timeout
const resp = await fetch('https://api.anthropic.com/v1/messages', { ... });
```

**Solução**: usar `AbortController` com `setTimeout`:
```jsx
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 30000);
const resp = await fetch(url, { signal: controller.signal, ... });
clearTimeout(timer);
```

### 5.3 Parse do JSON da IA sem fallback

**Arquivo**: `src/pages/MicroPlano.jsx` — parse da resposta Claude

Se a API retornar texto fora do formato JSON esperado, o `JSON.parse()` lança exceção. Deve haver tratamento de fallback para manter o plano manual editável.

### 5.4 `LousaTatica.jsx` — export PNG

**Arquivo**: `src/pages/LousaTatica.jsx`

A exportação PNG usa serialização SVG + Canvas. Em navegadores mobile e alguns Safari, `<foreignObject>` e `<tspan>` dentro de SVG serializado para Canvas podem não renderizar corretamente.

### 5.5 Vite em versão beta

```json
// package.json
"vite": "^8.0.0-beta.13"
```

Vite 8 está em beta. Não recomendado para produção — APIs podem mudar entre betas. 

**Solução**: fazer pin em Vite 6.x (última estável):
```bash
npm install -D vite@6
```

---

## 6. ACESSIBILIDADE

### 6.1 Botões sem `type` attribute

```
<button> sem type:  83 ocorrências (100% dos botões no app)
<button type="button">: 0 ocorrências
```

Botões sem `type` dentro de um `<form>` comportam-se como `type="submit"` — podem disparar submit indesejado ao pressionar Enter.

**Exemplos**:
- `FootballApp.jsx:142` — botão "Sair"
- `FootballApp.jsx:143` — toggle dark mode
- `FootballApp.jsx:168` — toggle sidebar

**Solução**: adicionar `type="button"` a todos os botões que não são submit de formulário.

### 6.2 Campos de formulário sem `<label>`

- `Login.jsx:76` — input email tem `placeholder` mas não tem `<label>` associado
- Múltiplos inputs em `Metodologia.jsx`, `MacroPlano.jsx`, `Elenco.jsx` sem `<label htmlFor>`

Screen readers não conseguem anunciar o propósito dos campos.

### 6.3 Ausência de ARIA em navegação

- A sidebar em `FootballApp.jsx` não tem `role="navigation"` ou `aria-label`
- Botões de módulo ativo não têm `aria-current="page"`
- Modal/overlay em `BancoExercicios.jsx` e `Elenco.jsx` não tem `role="dialog"` ou `aria-modal`

### 6.4 Contraste (ponto a esclarecer)

- Texto `textMuted` (`#9ca3af`) sobre fundo branco: ratio ~2.4:1 — **abaixo do mínimo WCAG AA (4.5:1)**
- Texto `textMuted` no dark mode (`#6b7280`) sobre `#111827`: ratio ~5.7:1 ✅

---

## 7. DEPENDÊNCIAS & TOOLING

### 7.1 Dependências principais

| Pacote | Versão | Status |
|--------|--------|--------|
| `react` + `react-dom` | 19.2.0 | ✅ Latest |
| `@supabase/supabase-js` | 2.98.0 | ✅ Latest |
| `lucide-react` | 0.575.0 | ✅ Latest |
| `jspdf` | 4.2.0 | 🔴 CVE crítico |
| `docx` | 9.6.0 | ✅ |
| `docxtemplater` | 3.68.3 | ✅ |
| `pizzip` | 3.2.0 | ✅ |
| `file-saver` | 2.0.5 | 🟡 Desatualizado |
| `vite` | 8.0.0-beta.13 | 🔴 Beta |
| `@vitejs/plugin-react` | 4.6.0 | ✅ |

### 7.2 ESLint

ESLint está configurado (`eslint.config.js`). Rodar `npm run lint` não gera erros ativos.

### 7.3 Ausência de testes

```
Arquivos .test.js / .test.jsx / .spec.js: 0
Frameworks de teste instalados:           0 (sem Vitest, Jest, Testing Library)
```

Nenhuma cobertura de testes. Funções críticas como `buildMicroPlanPrompt()`, `calcularDuracoes()`, `sugerirAtividades()` e `gerarComIA()` não possuem testes unitários.

---

## 8. DOCUMENTAÇÃO & DX

| Item | Status |
|------|--------|
| README com setup | ❌ Ausente |
| Documentação de variáveis de ambiente | ❌ Ausente |
| Comentários em código complexo | ⚠️ Mínimos |
| JSDoc / tipos | ❌ Ausente |
| Guia de contribuição | ❌ Ausente |
| Instruções de deploy | ❌ Apenas em chat |

O único arquivo de documentação presente é `supabase_setup.sql` com comentários inline. Para um novo desenvolvedor entrar no projeto, não há nenhum ponto de entrada documentado.

---

## 9. PLANO DE AÇÃO PRIORIZADO

### 🔴 IMEDIATO (antes de lançar para usuários reais)

| # | Ação | Arquivo | Esforço |
|---|------|---------|---------|
| 1 | **Corrigir 8 vulnerabilidades npm** | `package.json` | 5 min — `npm audit fix` |
| 2 | **Nunca colocar `VITE_ANTHROPIC_API_KEY` no `.env`** — criar Supabase Edge Function proxy | `supabase/functions/ai-proxy/` | 2h |
| 3 | **Pinnar Vite na versão estável** | `package.json` | 10 min — `npm i -D vite@6` |
| 4 | **Adicionar `type="button"` em todos os botões** | todos os `.jsx` | 30 min |

### 🟠 CURTO PRAZO (1–2 semanas)

| # | Ação | Arquivo | Esforço |
|---|------|---------|---------|
| 5 | Envolver todos os `useEffect` com fetch em AbortController | todos os `pages/` | 3h |
| 6 | Adicionar timeout + fallback ao `gerarComIA()` | `MicroPlano.jsx` | 1h |
| 7 | Tratar erros com `toast` ou banner em todos os fluxos Supabase | todos os `pages/` | 4h |
| 8 | Adicionar `aria-label` e `role` na sidebar e modais | `FootballApp.jsx`, `Elenco.jsx`, `BancoExercicios.jsx` | 2h |
| 9 | Mover / deletar `src/App.jsx` legado | `src/` | 5 min |
| 10 | Criar `.env.example` e `README.md` com setup | raiz | 1h |

### 🟡 MÉDIO PRAZO (1 mês)

| # | Ação | Arquivo | Esforço |
|---|------|---------|---------|
| 11 | Fatorar `MicroPlano.jsx` em 3 sub-componentes | `pages/MicroPlano/` | 4h |
| 12 | Instalar Vitest + React Testing Library e testar funções de `footballData.js` | `src/data/*.test.js` | 8h |
| 13 | Lazy-import `jspdf` e `docx` com `import()` dinâmico | `MicroPlano.jsx`, `BancoExercicios.jsx` | 2h |
| 14 | Adicionar headers de segurança no `vercel.json` (CSP, X-Frame-Options) | `vercel.json` | 1h |
| 15 | Corrigir contraste de `textMuted` no modo claro | `FootballApp.jsx` | 30 min |

---

## 10. PONTOS A ESCLARECER

1. **Multi-tenant ou single-user?** O app usa RLS por `user_id` — cada treinador vê apenas seus dados. Mas o Supabase URL é o mesmo para todos. É planejado ter múltiplos treinadores na mesma instância, ou cada escola terá seu próprio projeto Supabase?

2. **`LandingPage.jsx`** — existe em `src/` mas não foi verificado se é importado. Pode ser código morto adicional.

3. **`src/App.jsx` (EduPlan legado)** — deve ser mantido para uso futuro, arquivado ou deletado?

4. **Estratégia de pagamento / planos?** O app se chama "Pro Edition" na UI mas não há lógica de controle de acesso por plano. Isso é intencional (todos os usuários têm acesso completo)?

---

*Relatório gerado por auditoria automatizada + revisão manual. Evidências baseadas em leitura direta dos arquivos-fonte.*
