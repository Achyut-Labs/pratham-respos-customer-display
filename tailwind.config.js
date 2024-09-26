/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--q-primary)',
        dark: 'var(--q-dark)'
      },
      boxShadow: {
        dropdown: ' 0px 2px 10px rgba(0, 0, 0, .1)',
        // card: '0 2px 10px 0 rgba(94, 86, 105, 0.1)'
        card: '0px 0px 20px 0px rgba(76, 87, 125, 0.1)'
      }
    }
  },
  plugins: []
}
