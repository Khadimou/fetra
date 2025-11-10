module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'fetra-olive': '#6B8E23',
        'fetra-pink': '#F472B6',
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: { 'brand': '0 8px 30px rgba(16,24,40,0.06)' },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out',
      },
    }
  },
  plugins: []
};
