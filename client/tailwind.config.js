/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          dark: '#0A0A0A',      // Fundo principal ultra escuro
          cardDark: '#121212',  // Cor dos cards e painéis
          primary: '#DC2626',   // Vermelho premium da barbearia
          light: '#F8F9FA'
        }
      }
    },
  },
  plugins: [],
}