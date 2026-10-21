import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A32D3B',
          hover: '#872430',
        },
        'soft-pink': '#FCEEEF',
        blush: {
          DEFAULT: '#F5D6D9',
          soft: '#FCEEEF',
        },
        surface: {
          canvas: '#FFFFFF',
          warm: '#FFFDF9',
          banner: '#F6EBE5',
        },
        canvas: '#FFFFFF',
        'warm-surface': '#FFFDF9',
        'banner-surface': '#F6EBE5',
        text: {
          main: '#1A1A1A',
          muted: '#666666',
        },
        'text-main': '#1A1A1A',
        'text-muted': '#666666',
        border: {
          subtle: '#ECE7E1',
        },
        'border-subtle': '#ECE7E1',
        footer: {
          DEFAULT: '#222222',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-manrope)',
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        display: [
          'var(--font-manrope)',
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      screens: {
        sm: '375px', // mobile-first breakpoint
        md: '768px', // tablet breakpoint
        lg: '1024px',
        xl: '1280px', // desktop breakpoint
      },
    },
  },
  plugins: [],
};

export default config;
