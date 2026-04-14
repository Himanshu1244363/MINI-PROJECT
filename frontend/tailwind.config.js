/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dark: {
          bg:      '#0f0f0f',
          surface: '#1a1a1a',
          card:    '#242424',
          border:  '#2e2e2e',
        }
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Clash Display', 'Plus Jakarta Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease forwards',
        'slide-up':    'slideUp 0.4s ease forwards',
        'slide-down':  'slideDown 0.3s ease forwards',
        'scale-in':    'scaleIn 0.2s ease forwards',
        'shimmer':     'shimmer 1.5s infinite linear',
        'float':       'float 3s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown:{ from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:  { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      boxShadow: {
        'glow':       '0 0 30px rgba(249,115,22,0.2)',
        'glow-lg':    '0 0 60px rgba(249,115,22,0.3)',
        'card':       '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: { xs: '2px' },
      screens: { xs: '480px' },
    },
  },
  plugins: [],
}
