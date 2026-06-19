/**
 * Bulk migration v2: hardcoded light/white colors → dark theme semantic tokens.
 * Run: node scripts/apply-theme-tokens.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, '..', 'app');

// Order matters — longest / most specific patterns first.
const replacements = [
  // ── Gradients (cream/white leftovers) ──
  ['bg-gradient-to-b from-white to-[#FBF6EC]/50', 'bg-gradient-to-b from-background to-surface-muted/50'],
  ['bg-gradient-to-b from-white to-[#FBF6EC]', 'bg-gradient-to-b from-background to-surface-muted'],
  ['bg-gradient-to-b from-[#FBF6EC]/30 to-card', 'bg-gradient-to-b from-surface-muted/30 to-background'],
  ['from-[#FBF6EC]/60 to-background', 'from-surface-muted/60 to-background'],
  ['from-[#FBF6EC]/50 to-background', 'from-surface-muted/50 to-background'],
  ['from-[#FBF6EC]/30 to-card', 'from-surface-muted/30 to-background'],
  ['from-[#FBF6EC] to-background', 'from-surface-muted to-background'],
  ['from-[#FBF6EC] to-surface-muted', 'from-surface-muted to-surface'],
  ['from-[#F5EDD8] to-background', 'from-surface to-background'],
  ['from-[#F5EDD8] to-card', 'from-surface to-card'],
  ['from-[#FEF3CD] to-card', 'from-primary/10 to-card'],
  ['from-white to-transparent', 'from-background to-transparent'],
  ['from-white to-card', 'from-background to-card'],
  ['from-white to-background', 'from-background to-background'],
  ['to-[#C5A059]', 'to-primary'],
  ['from-[#C5A059] via-[#1A1A1A] to-[#C5A059]', 'from-primary via-surface-elevated to-primary'],
  ['from-[#C5A059] to-[#1A1A1A]', 'from-primary to-surface-elevated'],
  ['from-[#1A1A1A] to-[#C5A059]', 'from-surface-elevated to-primary'],
  ['from-[#1A1A1A] via-[#C5A059] to-[#1A1A1A]', 'from-surface-elevated via-primary to-surface-elevated'],
  ['from-[#FBF6EC]/60 to-card', 'from-surface-muted/60 to-background'],
  ['from-[#FBF6EC]/50 to-card', 'from-surface-muted/50 to-background'],
  ['from-[#FBF6EC] to-card', 'from-surface-muted to-background'],
  ['from-[#F5EDD8]/40 to-card', 'from-surface/40 to-card'],
  ['from-[#F5EDD8] to-surface-muted', 'from-surface to-surface-muted'],
  ['from-gray-100 to-gray-200', 'from-subtle-strong to-border'],
  ['to-[#A67C3D]', 'to-primary-dark'],
  ['to-[#8E6D31]', 'to-primary-dark'],
  ['via-[#C5A059]', 'via-primary'],
  ['via-[#1A1A1A]', 'via-surface-elevated'],
  ['from-primary-dark to-[#C5A059]', 'from-primary-dark to-primary'],
  ['from-[#e53e3e] to-primary-dark', 'from-destructive to-primary-dark'],
  ['to-[#e53e3e]', 'to-destructive'],

  // ── Light-tinted surfaces ──
  ['bg-[#FFF5F5]', 'bg-destructive/10'],
  ['bg-[#F0F7FF]', 'bg-primary/5'],
  ['bg-[#FEF3CD]', 'bg-primary/10'],
  ['border-[#FEF3CD]', 'border-primary/20'],
  ['border-[#FBF6EC]', 'border-border'],
  ['border-[#F5EDD8]', 'border-border'],
  ['border-[#8E6D31]', 'border-primary-dark'],
  ['border-[#e53e3e]/60', 'border-destructive/60'],
  ['border-[#e53e3e]/40', 'border-destructive/40'],
  ['border-[#e53e3e]/20', 'border-destructive/20'],
  ['text-[#e53e3e]', 'text-destructive'],
  ['bg-[#e53e3e]', 'bg-destructive'],
  ['fill-[#8E6D31]', 'fill-primary-dark'],

  // ── Green / red / yellow light UI ──
  ['bg-green-50 border-green-300', 'bg-emerald-950/30 border-emerald-800/40'],
  ['bg-green-50', 'bg-emerald-950/30'],
  ['border-green-300', 'border-emerald-800/40'],
  ['text-green-700', 'text-emerald-400'],
  ['text-green-500', 'text-emerald-400'],
  ['from-red-50 to-card', 'from-destructive/10 to-card'],
  ['from-red-50', 'from-destructive/10'],
  ['border-red-100', 'border-destructive/20'],
  ['border-red-200', 'border-destructive/30'],
  ['hover:bg-red-50', 'hover:bg-destructive/10'],
  ['bg-red-50', 'bg-destructive/10'],
  ['hover:bg-yellow-50', 'hover:bg-surface-muted'],
  ['bg-yellow-50', 'bg-primary/10'],

  // ── Hex with opacity ──
  ['border-[#C5A059]/40', 'border-primary/40'],
  ['border-[#C5A059]/30', 'border-primary/30'],
  ['border-[#C5A059]/20', 'border-primary/20'],
  ['border-[#C5A059]/15', 'border-primary/15'],
  ['hover:border-[#C5A059]/40', 'hover:border-primary/40'],
  ['hover:border-[#C5A059]/30', 'hover:border-primary/30'],
  ['hover:border-[#C5A059]/15', 'hover:border-primary/15'],
  ['bg-[#C5A059]/10', 'bg-primary/10'],
  ['text-[#C5A059]/90', 'text-primary/90'],
  ['ring-[#C5A059]/20', 'ring-primary/20'],
  ['focus:ring-[#C5A059]/20', 'focus:ring-primary/20'],
  ['focus:border-[#C5A059]', 'focus:border-primary'],
  ['focus:ring-[#C5A059]', 'focus:ring-primary'],

  // ── Solid hex ──
  ['text-[#1A1A1A]', 'text-foreground'],
  ['bg-[#1A1A1A]', 'bg-surface-elevated'],
  ['text-[#6B7280]', 'text-muted'],
  ['text-[#9CA3AF]', 'text-muted-subtle'],
  ['text-[#4B5563]', 'text-muted'],
  ['text-[#C5A059]', 'text-primary'],
  ['bg-[#C5A059]', 'bg-primary'],
  ['text-[#8E6D31]', 'text-primary-dark'],
  ['bg-[#8E6D31]', 'bg-primary-dark'],
  ['text-[#A67C3D]', 'text-primary-dark'],
  ['bg-[#A67C3D]', 'bg-primary-dark'],
  ['text-[#E8D5A3]', 'text-primary-light'],
  ['bg-[#FBF6EC]', 'bg-surface-muted'],
  ['bg-[#F5EDD8]', 'bg-surface'],
  ['text-[#F5EDD8]', 'text-primary-light'],
  ['bg-[#25D366]', 'bg-[#25D366]'], // WhatsApp brand — keep
  ['hover:text-[#C5A059]', 'hover:text-primary'],
  ['hover:text-[#1A1A1A]', 'hover:text-foreground'],
  ['hover:bg-[#C5A059]', 'hover:bg-primary'],
  ['hover:bg-[#1A1A1A]', 'hover:bg-surface-elevated'],
  ['hover:bg-[#F5EDD8]', 'hover:bg-surface'],
  ['hover:from-[#F5EDD8]', 'hover:from-surface'],
  ['hover:to-[#FBF6EC]', 'hover:to-surface-muted'],
  ['group-hover:text-[#C5A059]', 'group-hover:text-primary'],
  ['group-hover:from-[#C5A059]', 'group-hover:from-primary'],
  ['group-hover:to-[#1A1A1A]', 'group-hover:to-surface-elevated'],

  // ── Inline style gradients ──
  ["background: 'linear-gradient(135deg, #C5A059, #8E6D31)'", "background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-primary-dark)))'"],
  ["background: 'linear-gradient(90deg, #C5A059, #8E6D31)'", "background: 'linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-primary-dark)))'"],
  ["background: 'linear-gradient(135deg, #8E6D31, #C5A059)'", "background: 'linear-gradient(135deg, rgb(var(--color-primary-dark)), rgb(var(--color-primary)))'"],
  ["background: 'linear-gradient(90deg, #8E6D31, #C5A059)'", "background: 'linear-gradient(90deg, rgb(var(--color-primary-dark)), rgb(var(--color-primary)))'"],
  ["background: 'linear-gradient(135deg, #1A1A1A, #C5A059)'", "background: 'linear-gradient(135deg, rgb(var(--color-surface-elevated)), rgb(var(--color-primary)))'"],
  ["background: 'linear-gradient(90deg, #1A1A1A, #C5A059)'", "background: 'linear-gradient(90deg, rgb(var(--color-surface-elevated)), rgb(var(--color-primary)))'"],
  ["background: 'linear-gradient(135deg, #C5A059, #1A1A1A)'", "background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-surface-elevated)))'"],
  ["background: 'linear-gradient(90deg, #C5A059, #1A1A1A)'", "background: 'linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-surface-elevated)))'"],
  ["background: 'linear-gradient(135deg, #059669, #0D9488)'", "background: 'linear-gradient(135deg, #059669, #0D9488)'"],
  ["background: 'linear-gradient(135deg, #8E6D31, #ea580c)'", "background: 'linear-gradient(135deg, rgb(var(--color-primary-dark)), #ea580c)'"],
  ["background: 'linear-gradient(135deg, #8E6D31, #EA580C)'", "background: 'linear-gradient(135deg, rgb(var(--color-primary-dark)), #ea580c)'"],
  ["background: 'linear-gradient(135deg, #C5A059, #1A1A1A)'", "background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-surface-elevated)))'"],

  // ── Gray scale → semantic ──
  ['placeholder-gray-400', 'placeholder-muted-subtle'],
  ['disabled:bg-gray-400', 'disabled:bg-muted-subtle'],
  ['hover:bg-gray-300', 'hover:bg-border-strong'],
  ['hover:bg-gray-200', 'hover:bg-border'],
  ['bg-gray-300', 'bg-border-strong'],
  ['bg-gray-200', 'bg-border'],
  ['fill-gray-200', 'fill-border'],
  ['text-gray-300', 'text-muted-subtle'],
  ['text-gray-200', 'text-border'],
  ['hover:bg-gray-100', 'hover:bg-subtle-strong'],
  ['hover:bg-gray-50', 'hover:bg-surface-muted'],
  ['bg-gray-100', 'bg-subtle-strong'],
  ['bg-gray-50', 'bg-surface-muted'],
  ['border-gray-300', 'border-border-strong'],
  ['border-gray-200', 'border-border'],
  ['border-gray-100', 'border-border'],
  ['text-gray-900', 'text-foreground'],
  ['text-gray-800', 'text-foreground'],
  ['text-gray-700', 'text-foreground/90'],
  ['text-gray-600', 'text-muted'],
  ['text-gray-500', 'text-muted'],
  ['text-gray-400', 'text-muted-subtle'],

  // ── White utilities ──
  ['bg-white/95', 'bg-background/95'],
  ['bg-white/90', 'bg-background/90'],
  ['bg-white/80', 'bg-background/80'],
  ['bg-white/75', 'bg-background/75'],
  ['bg-white/10', 'bg-foreground/10'],
  ['border-white/30', 'border-foreground/20'],
  ['border-white/10', 'border-foreground/10'],
  ['hover:bg-white', 'hover:bg-surface-muted'],
  ['bg-white', 'bg-card'],
  ['to-white', 'to-background'],
  ['from-white', 'from-background'],

  ['hover:bg-red-100', 'hover:bg-destructive/20'],
  ['bg-green-100 text-green-800', 'bg-emerald-950/40 text-emerald-400'],
  ['bg-red-100 text-red-800', 'bg-destructive/15 text-destructive'],
  ['bg-yellow-100 text-yellow-800', 'bg-amber-950/40 text-amber-400'],
  ['bg-green-100', 'bg-emerald-950/40'],
  ['bg-red-100', 'bg-destructive/15'],
  ['ring-white', 'ring-border'],
  ['border-white', 'border-foreground'],
  ['focus:ring-white/20', 'focus:ring-foreground/20'],
  ['text-white/90', 'text-foreground/90'],
  ['text-white/80', 'text-foreground/80'],
  ['text-white/40', 'text-foreground/40'],
  ['hover:text-white', 'hover:text-foreground'],
  ['group-hover:text-white', 'group-hover:text-foreground'],

  // Primary buttons — gold bg needs dark text
  ['bg-primary hover:bg-surface-elevated text-foreground', 'bg-primary hover:bg-surface-elevated text-primary-foreground'],
  ['bg-primary text-foreground', 'bg-primary text-primary-foreground'],
  ['bg-gradient-to-r from-primary to-surface-elevated text-foreground', 'bg-gradient-to-r from-primary to-surface-elevated text-primary-foreground'],
  ['bg-surface-elevated text-foreground border-surface-elevated', 'bg-surface-elevated text-primary-foreground border-surface-elevated'],
  ['bg-primary-dark text-foreground', 'bg-primary-dark text-primary-foreground'],

  // Remaining text-white (heroes, icons on dark fills)
  ['text-white', 'text-foreground'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let total = 0;
let totalReplacements = 0;

for (const file of walk(appDir)) {
  let content = fs.readFileSync(file, 'utf8');
  let fileChanged = false;
  let fileCount = 0;

  for (const [from, to] of replacements) {
    if (from === to) continue;
    const parts = content.split(from);
    if (parts.length > 1) {
      const count = parts.length - 1;
      content = parts.join(to);
      fileChanged = true;
      fileCount += count;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(file, content);
    total++;
    totalReplacements += fileCount;
    console.log(`Updated: ${path.relative(appDir, file)} (${fileCount} replacements)`);
  }
}

console.log(`\nDone. ${total} files updated, ${totalReplacements} total replacements.`);
