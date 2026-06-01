import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        '#151718',
        card:      '#1E2122',
        'card-2':  '#252729',
        border:    '#2D3235',
        muted:     '#4A5258',
        secondary: '#9BA1A6',
        primary:   '#ECEDEE',
        accent:    '#0a7ea4',
      },
    },
  },
  plugins: [],
};

export default config;
