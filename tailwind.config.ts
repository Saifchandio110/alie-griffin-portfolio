import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#ffd6e8',
        bubblegum: '#ff3d9a',
        lavender: '#cdb4ff',
        orchid: '#8b5cf6',
        moon: '#fff7fb',
        midnight: '#1a0b2e',
        void: '#0b0614',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        script: ['var(--font-script)', 'cursive'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255, 61, 154, 0.55)',
        soft: '0 10px 40px -12px rgba(139, 92, 246, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
