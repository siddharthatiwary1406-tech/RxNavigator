/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eef6',
          100: '#c5d4e8',
          500: '#2d5fa8',
          600: '#1e3a5f',
          700: '#162d4a',
          800: '#0e1f33',
          900: '#07111c'
        },
        accent: {
          400: '#14b8a6',
          500: '#0d9488',
          600: '#0b7a6f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
