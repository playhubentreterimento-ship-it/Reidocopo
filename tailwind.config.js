/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0C0B0A',
          2: '#161514',
          3: '#1E1C1A',
        },
        ivory: {
          DEFAULT: '#F4EFE6',
          dark: '#EAE3D6',
          muted: '#DED5C5',
        },
        champagne: {
          DEFAULT: '#B8975A',
          light: '#CEB27E',
          dark: '#93753C',
        },
        textDark: {
          DEFAULT: '#1A1816',
          secondary: '#6B655C',
          muted: '#8C857B',
        },
        textLight: {
          DEFAULT: '#F4EFE6',
          secondary: '#A59E92',
          muted: '#6E675D',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}
