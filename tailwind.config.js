module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'fetra-olive': '#6B8E23',
        'fetra-pink': '#F472B6',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: { 'brand': '0 8px 30px rgba(16,24,40,0.06)' }
    }
  },
  plugins: []
};
