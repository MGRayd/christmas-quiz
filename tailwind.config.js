/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#D42426',
          green: '#165B33',
          gold: '#F8B229',
        }
      }
    },
  },
  plugins: [],
}

