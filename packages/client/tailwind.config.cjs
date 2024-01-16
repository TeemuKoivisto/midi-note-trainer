const { screens } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,svelte}'],
  darkMode: 'class', // 'media' or 'class'
  theme: {
    extend: {
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out'
      }
    },
    screens: {
      xs: '480px',
      ...screens
    }
  }
}
