/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,tsx,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
        'text-primary': 'var(--text-color)',
        'text-muted': 'var(--text-muted)',
        'card-bg': 'var(--card-bg)',
        'card-border': 'var(--card-border)',
        'body-bg': 'var(--dark-bg)'
      },
      transitionProperty: {
        colors: 'color, background-color, border-color, text-shadow, box-shadow, filter, opacity'
      },
      boxShadow: {
        neon: '0 0 12px rgba(106,17,203,0.6), 0 0 24px rgba(255,105,180,0.4)',
        'neon-cyan': '0 0 12px rgba(0,201,217,0.6), 0 0 24px rgba(37,117,252,0.4)',
        'neon-pink': '0 0 12px rgba(255,46,120,0.6), 0 0 24px rgba(255,61,112,0.4)'
      }
    }
  },
  plugins: []
}
