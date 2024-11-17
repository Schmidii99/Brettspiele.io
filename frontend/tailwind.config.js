/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'player-red': '#D22B2B',
        'player-blue': '#0096FF',
      },
    },
  },
  plugins: [],
}
