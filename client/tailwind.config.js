/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          dark: '#141414',
          gold: '#1a0261',
          light: '#F5F5F7'
        }
      }
    },
  },
  plugins: [],

  darkMode: 'class', // <--- ADICIONE ESTA LINHA
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          dark: '#121212',
          cardDark: '#1A1A1A',
          primary: '#DC2626', // Laranja estilo aplicativo da imagem
          light: '#F8F9FA'
        }
      }
    },
  },
  plugins: [],
}

