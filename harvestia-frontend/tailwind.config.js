/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          DEFAULT: '#04100a',
          50:  '#0d1f12',
          100: '#071409',
          200: '#060e09',
          300: '#040c07',
        },
        border: {
          DEFAULT: 'rgba(74,222,128,0.12)',
          hover: 'rgba(74,222,128,0.35)',
          focus: 'rgba(74,222,128,0.6)',
        },
      },
      fontFamily: {
        display: ['Familjen Grotesk', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease both',
        'fade-in':   'fadeIn 0.4s ease both',
        'float':     'float 4s ease-in-out infinite',
        'glow':      'glow 3s ease-in-out infinite',
        'pulse-dot': 'pulseDot 1.4s ease-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        glow:     { '0%,100%': { boxShadow: '0 0 20px rgba(74,222,128,0.2)' }, '50%': { boxShadow: '0 0 50px rgba(74,222,128,0.5)' } },
        pulseDot: { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.4)', opacity: 0 } },
      },
      backgroundImage: {
        'grid-green': `linear-gradient(rgba(74,222,128,.03) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(74,222,128,.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
}
