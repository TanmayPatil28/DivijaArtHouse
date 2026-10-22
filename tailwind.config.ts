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
          DEFAULT: '#781D2C', // Deep velvet wine from visiting card ribbons
          hover: '#5C131F',
          light: '#F9EBEF',
        },
        gold: {
          DEFAULT: '#C59A5A', // Elegant gold contour ribbon accent
          hover: '#B38847',
          light: '#FBF6EE',
          border: '#E8D5B7',
        },
        sage: {
          DEFAULT: '#657350', // Olive sage foliage from wreath
          light: '#F1F5EB',
        },
        'soft-pink': '#F7ECEE',
        blush: {
          DEFAULT: '#E8B8BC', // Soft dusty rose from category icon discs
          soft: '#F7ECEE',
        },
        surface: {
          canvas: '#FAF5F0', // Warm artisanal ivory card canvas
          warm: '#FAF5F0',
          banner: '#F4EAE1', // Soft bisque secondary panels
          card: '#FFFFFF',
        },
        canvas: '#FAF5F0',
        'warm-surface': '#FAF5F0',
        'banner-surface': '#F4EAE1',
        text: {
          main: '#2E1715', // Rich espresso mahogany from 'Divija' logo
          muted: '#6B5653', // Warm mocha secondary text
          subtle: '#917B77',
        },
        'text-main': '#2E1715',
        'text-muted': '#6B5653',
        border: {
          subtle: '#EDE2D8', // Warm artisanal border
          gold: '#E8D5B7',
        },
        'border-subtle': '#EDE2D8',
        footer: {
          DEFAULT: '#241514', // Deep velvet espresso footer
        },
      },
      boxShadow: {
        'gold-glow': '0 4px 20px rgba(197, 154, 90, 0.35)',
        'gold-soft': '0 4px 16px rgba(197, 154, 90, 0.18)',
        'wine-glow': '0 4px 20px rgba(120, 29, 44, 0.28)',
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
        serif: [
          'var(--font-playfair)',
          'Playfair Display',
          'Georgia',
          'serif',
        ],
        display: [
          'var(--font-playfair)',
          'Playfair Display',
          'Georgia',
          'serif',
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
