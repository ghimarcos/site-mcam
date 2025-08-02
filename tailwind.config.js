/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'mcam-green': {
          50: '#f0f4ef',
          100: '#d0dad0',
          200: '#a9b6a9',
          300: '#829382',
          400: '#5c705c',
          500: '#354d35',
          600: '#2a3e2a',
          700: '#1f2f1f', // Cor principal
          800: '#152015',
          900: '#0a100a',
        },
        'accent-green': '#4CAF50', // Um verde mais claro para detalhes (opcional)
        'accent-green-light': '#81c784', // Outro tom de verde mais claro (opcional)
      },
    },
  },
  plugins: [],
}