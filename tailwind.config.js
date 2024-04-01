/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/*.tsx', 
    './src/mainComponents/*.tsx', 
    './src/Auth/*.tsx', 
    './src/Investment/*.tsx',
    './src/Investment/components/FormComponents/*.tsx', 
    './src/Investment/components/HistoryComponents/*.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
