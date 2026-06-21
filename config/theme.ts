/**
 * YAM-N7 Design Tokens — sync with app/globals.css `:root`
 */
export const theme = {
  colors: {
    background: '#f7f4ef',
    foreground: '#1f1b17',
    surface: '#ffffff',
    surfaceElevated: '#faf7f2',
    surfaceMuted: '#ede8e0',
    primary: '#5c4a32',
    primaryDark: '#3d3228',
    primaryLight: '#8b7355',
    onPrimary: '#ffffff',
    muted: '#6b6258',
    mutedSubtle: '#8c847a',
    border: '#ddd6cc',
    borderStrong: '#c4baac',
    card: '#ffffff',
    input: '#ffffff',
    ring: '#5c4a32',
    destructive: '#b93a3a',
    logoBg: '#ffffff',
  },
} as const;

export type ThemeColors = typeof theme.colors;
