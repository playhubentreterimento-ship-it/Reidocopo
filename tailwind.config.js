/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0D',
          2: '#101015',
        },
        surface: {
          DEFAULT: '#15151B',
          2: '#1D1D25',
          3: '#24242F',
        },
        accent: {
          DEFAULT: '#FF2E93',
          deep: '#C9106F',
        },
        gold: {
          DEFAULT: '#D9B777',
          light: '#F3E1B0',
          deep: '#A8884A',
        },
        text: {
          DEFAULT: '#F6F2EA',
          2: '#A9A4B2',
          3: '#6E6A78',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-magenta': '0 0 60px rgba(255, 46, 147, 0.25)',
        'glow-gold': '0 0 40px rgba(217, 183, 119, 0.2)',
        'glow-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 46, 147, 0.1)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '26px',
        '4xl': '32px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        levitate: {
          '0%, 100%': { transform: 'translateY(0px) rotate(3deg)' },
          '50%': { transform: 'translateY(-12px) rotate(5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        }
      },
      animation: {
        levitate: 'levitate 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 8s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
      }
    },
  },
  plugins: [],
}
