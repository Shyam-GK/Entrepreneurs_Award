/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust to match your project’s file structure
  ],
  theme: {
    extend: {
      animation: {
        'bounce-pulse': 'bouncePulse 0.3s ease-in-out',
        'ripple': 'ripple 0.5s ease-out',
        'rocket-line': 'rocketLine 0.3s ease-in-out forwards',
      },
      keyframes: {
        bouncePulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(79, 70, 229, 0.7)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 10px 4px rgba(79, 70, 229, 0.5)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        rocketLine: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--line-width)' },
        },
      },
    },
  },
  plugins: [],
};