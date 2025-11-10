/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e0e7ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: {
          pink: '#ec4899',
          green: '#10b981',
          orange: '#f97316',
        },
      },
      boxShadow: {
        card: '0 4px 14px rgba(0,0,0,0.08)',
        glow: '0 0 15px rgba(59,130,246,0.4)',
      },
    },
  },
  plugins: [],
}

