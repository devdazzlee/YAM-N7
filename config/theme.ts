/**
 * YAM-N7 Design Tokens
 * ────────────────────
 * CANONICAL SOURCE: app/globals.css `:root` CSS variables.
 * This file mirrors values for use in TypeScript (inline styles, etc.).
 * To retheme the site, edit globals.css first, then sync values here.
 *
 * Tailwind classes: bg-background, text-foreground, bg-primary, text-muted, etc.
 */
export const theme = {
  colors: {
    background: '#0a0a0a',
    foreground: '#f0ebe0',
    surface: '#141414',
    surfaceElevated: '#1c1c1c',
    surfaceMuted: '#222222',
    primary: '#c5a059',
    primaryDark: '#8e6d31',
    primaryLight: '#e8d5a3',
    onPrimary: '#0a0a0a',
    muted: '#9a958c',
    mutedSubtle: '#6b6760',
    border: '#2e2a26',
    borderStrong: '#3d3830',
    card: '#161616',
    input: '#1a1a1a',
    ring: '#c5a059',
    destructive: '#ef4444',
  },
} as const;

export type ThemeColors = typeof theme.colors;
