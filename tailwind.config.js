/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'fetra-olive': {
          DEFAULT: '#6B8E23', // olive-ish
          50:  '#F4F7EE',
          100: '#E9F0DD'
        },
        'fetra-pink': {
          DEFAULT: '#F472B6', // pink accent
          50:  '#FFF0F6',
          100: '#FFE6F2'
        }
      },
      borderRadius: {
        'xl-2': '1.25rem'
      }
    }
  },
  plugins: [],
};
