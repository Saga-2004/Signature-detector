export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FAF6F0',
          100: '#FFF8F0',
          200: '#E8D5C0',
          300: '#C8956C',
          400: '#A0714F',
          500: '#8B5E3C',
          600: '#6B4C35',
          700: '#4A3020',
          900: '#2C1A0E',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Lato', 'sans-serif'],
      }
    }
  },
  plugins: []
}
