/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#F8F5F1',
          100: '#EDE6DD',
          200: '#D4C4B0',
          300: '#B8A08D',
          400: '#8B6F47',
          500: '#6B5444',
          600: '#4A3C2F',
          700: '#362B22',
          800: '#2A2118',
          900: '#1C160F',
        }
      },
    },
  },
  plugins: [],
}
