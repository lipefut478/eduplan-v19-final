#!/usr/bin/env node
/**
 * security:check — Verifica se o bundle de produção contém segredos indesejados.
 *
 * O que verifica:
 *   - Chaves Anthropic (sk-ant-*)
 *   - Chamadas diretas à API Anthropic (api.anthropic.com)
 *   - Cabeçalhos perigosos (anthropic-dangerous-direct-browser-access)
 *   - Padrões de API key genéricos
 *
 * Uso: npm run security:check
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const DIST_DIR = './dist';
const PATTERNS = [
  { name: 'Anthropic API Key (sk-ant-)', regex: /sk-ant-[A-Za-z0-9\-_]{10,}/, severity: 'CRÍTICO' },
  { name: 'Anthropic API direta (api.anthropic.com)', regex: /api\.anthropic\.com/, severity: 'CRÍTICO' },
  { name: 'Header perigoso Anthropic', regex: /anthropic-dangerous-direct-browser-access/, severity: 'CRÍTICO' },
  { name: 'Supabase service_role key', regex: /service_role[._]key|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[^"']{50,}/, severity: 'ALTO' },
  { name: 'OpenAI API Key', regex: /sk-[A-Za-z0-9]{32,}/, severity: 'ALTO' },
  { name: 'ANTHROPIC_API_KEY literal', regex: /ANTHROPIC_API_KEY/, severity: 'MÉDIO' },
];

// Cores ANSI
const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YEL   = '\x1b[33m';
const BOLD  = '\x1b[1m';
const RESET = '\x1b[0m';

async function getJsFiles(dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { recursive: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const s = await stat(fullPath).catch(() => null);
      if (s?.isFile() && (extname(entry) === '.js' || extname(entry) === '.mjs')) {
        files.push(fullPath);
      }
    }
  } catch {
    // recursive readdir não disponível em Node < 18 — fallback
    const entries = await readdir(dir);
    for (const e of entries) {
      const full = join(dir, e);
      const s = await stat(full);
      if (s.isDirectory()) {
        files.push(...await getJsFiles(full));
      } else if (extname(e) === '.js' || extname(e) === '.mjs') {
        files.push(full);
      }
    }
  }
  return files;
}

async function main() {
  console.log(`\n${BOLD}🔒 FootballPlan — Security Check do Bundle${RESET}`);
  console.log('─'.repeat(50));

  // Garantir que o build existe
  let distExists = false;
  try {
    await stat(DIST_DIR);
    distExists = true;
  } catch { /* ok */ }

  if (!distExists) {
    console.log('📦 dist/ não encontrado — rodando npm run build primeiro...\n');
    execSync('npm run build', { stdio: 'inherit' });
  }

  const files = await getJsFiles(DIST_DIR);
  console.log(`📂 Arquivos JS analisados: ${files.length}`);

  const findings = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const shortPath = file.replace(process.cwd() + '/', '');

    for (const pattern of PATTERNS) {
      const match = content.match(pattern.regex);
      if (match) {
        findings.push({
          file: shortPath,
          pattern: pattern.name,
          severity: pattern.severity,
          // Truncar o match para não exibir o segredo completo
          preview: match[0].slice(0, 20) + (match[0].length > 20 ? '...' : ''),
        });
      }
    }
  }

  console.log('');

  if (findings.length === 0) {
    console.log(`${GREEN}${BOLD}✅ PASSOU — Nenhum segredo encontrado no bundle.${RESET}`);
    console.log('\nVerificações realizadas:');
    for (const p of PATTERNS) {
      console.log(`  ${GREEN}✓${RESET} ${p.name}`);
    }
    console.log('');
    process.exit(0);
  } else {
    console.log(`${RED}${BOLD}❌ FALHOU — ${findings.length} problema(s) encontrado(s)!${RESET}\n`);
    for (const f of findings) {
      const color = f.severity === 'CRÍTICO' ? RED : YEL;
      console.log(`  ${color}[${f.severity}]${RESET} ${f.pattern}`);
      console.log(`           Arquivo: ${f.file}`);
      console.log(`           Preview: "${f.preview}"\n`);
    }
    console.log(`${RED}${BOLD}AÇÃO NECESSÁRIA:${RESET} Remova os segredos acima antes de fazer deploy!`);
    console.log('Consulte .env.example para ver quais variáveis são permitidas no frontend.\n');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Erro no security:check:', e.message);
  process.exit(1);
});
