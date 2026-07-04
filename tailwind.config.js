/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        hand: ['Caveat', 'cursive'],
        note: ['Patrick Hand', 'cursive'],
      },
      colors: {
        ink: {
          50: '#f6f2ea',
          100: '#e6dabd',
          200: '#c2b28c',
          300: '#8a7a5e',
          400: '#6b5d46',
          500: '#4a3d28',
          600: '#3a2f1f',
          700: '#241c10',
          800: '#180f08',
          900: '#0d0904',
        },
        saffron: {
          DEFAULT: '#d6870f',
          deep: '#a85e12',
          tint: '#f3ddac',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
