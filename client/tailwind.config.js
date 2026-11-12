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
          dark: '#0A0A0A',      // Fundo preto ultra escuro
          cardDark: '#121212',  // Fundo dos cards
          primary: '#DC2626',   // Vermelho principal (destaques, agendar)
          accentBlue: '#2563EB',// Azul moderno para detalhes e botões secundários
        }
      }
    },
  },
  plugins: [],
}