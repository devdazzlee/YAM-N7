/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        champagne: 'rgb(var(--color-champagne) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          foreground: 'rgb(var(--color-on-primary) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-muted-subtle) / <alpha-value>)',
          foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        input: 'rgb(var(--color-input) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
        destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
        subtle: {
          DEFAULT: 'rgb(var(--color-subtle) / <alpha-value>)',
          strong: 'rgb(var(--color-subtle-strong) / <alpha-value>)',
        },
        navy: 'rgb(var(--color-foreground) / <alpha-value>)',
        blue: 'rgb(var(--color-primary) / <alpha-value>)',
        beige: 'rgb(var(--color-surface-muted) / <alpha-value>)',
        green: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        grey: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-primary-dark) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      letterSpacing: {
        luxury: '0.28em',
        editorial: '0.12em',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      backgroundSize: {
        shimmer: '200% auto',
      },
    },
  },
  plugins: [],
};
