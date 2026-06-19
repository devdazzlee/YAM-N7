/**
 * Audit every page/component for leftover light-theme colors.
 * Run: node scripts/audit-theme-colors.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SCAN_DIRS = ['app', 'lib', 'components', 'config'].map((d) => path.join(root, d));

const PATTERNS = [
  { id: 'bg-white', re: /\bbg-white\b/ },
  { id: 'from-white', re: /\bfrom-white\b/ },
  { id: 'to-white', re: /\bto-white\b/ },
  { id: 'text-white', re: /\btext-white\b/ },
  { id: 'border-white', re: /\bborder-white\b/ },
  { id: 'gray-*', re: /\b(?:text|bg|border|fill|ring|divide|placeholder)-gray-\d+/ },
  { id: 'slate/zinc/neutral/stone', re: /\b(?:text|bg|border)-(?:slate|zinc|neutral|stone)-\d+/ },
  { id: 'cream-hex', re: /#(?:FBF6EC|F5EDD8|FEF3CD|FFF5F5|F0F7FF)/i },
  { id: 'brand-hex-old', re: /#(?:1A1A1A|C5A059|8E6D31|6B7280|9CA3AF)/i },
  { id: 'light-yellow/red/green', re: /\b(?:bg|hover:bg|from|to)-(?:yellow|red|green)-(?:50|100)\b/ },
];

const ALLOWLIST = [
  /config\/theme\.ts/, // canonical theme source
  /globals\.css/, // comments only
  /#25D366/, // WhatsApp
  /#4285F4|#34A853|#FBBC05|#EA4335/, // Google logo SVG
  /#FBBC04/, // star rating
  /#059669|#047857|#0D9488/, // emerald accent icons
  /#ea580c|#EA580C/, // orange accent
  /#e53e3e/, // sale red (if any left)
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') walk(full, files);
    else if (/\.(tsx|ts|jsx|js|css)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = [...new Set(SCAN_DIRS.flatMap((d) => walk(d)))];
const findings = [];

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    if (ALLOWLIST.some((a) => a.test(rel))) return;

    for (const { id, re } of PATTERNS) {
      if (!re.test(line)) continue;
      if (ALLOWLIST.some((a) => a.test(line))) continue;

      findings.push({ file: rel, line: i + 1, pattern: id, snippet: line.trim().slice(0, 120) });
    }
  });
}

if (findings.length === 0) {
  console.log('✓ No leftover light-theme colors found across', files.length, 'files.');
  process.exit(0);
}

console.log(`Found ${findings.length} issue(s) in ${new Set(findings.map((f) => f.file)).size} file(s):\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line} [${f.pattern}]`);
  console.log(`    ${f.snippet}\n`);
}
process.exit(1);
