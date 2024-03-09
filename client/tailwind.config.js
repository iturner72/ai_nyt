/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
        fontFamily: {
            sans: ['Inter', ...defaultTheme.fontFamily.sans],
            lora: ['Lora', ...defaultTheme.fontFamily.serif],
            display: ['UnifrakturMaguntia', ...defaultTheme.fontFamily.serif],
        },

    },
  },
  plugins: [],
}

