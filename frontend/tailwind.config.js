/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gov-primary': '#1A5632', // Deep green suited for agriculture/government
        'gov-primary-dark': '#0f3c21',
        'gov-secondary': '#F48220', // Saffron/Orange accent
        'gov-bg': '#f8fafc', // Very light background
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
