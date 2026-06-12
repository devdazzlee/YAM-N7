/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1A1A1A',
        blue: '#C5A059',
        white: '#FFFFFF',
        beige: '#FBF6EC',
        green: '#F5EDD8',
        grey: '#6B7280',
        accent: '#8E6D31',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
