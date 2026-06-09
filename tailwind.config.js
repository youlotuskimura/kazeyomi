/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b1424',
          800: '#101d33',
          700: '#1a2c49',
          600: '#27406a',
        },
        gold: {
          400: '#d8bd84',
          500: '#c8a96a',
          600: '#b08d4c',
        },
      },
      fontFamily: {
        sans: [
          '"Hiragino Kaku Gothic ProN"',
          '"Noto Sans JP"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
