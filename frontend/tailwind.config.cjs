module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.14)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.18), transparent 30%)',
      },
    },
  },
  plugins: [],
}
