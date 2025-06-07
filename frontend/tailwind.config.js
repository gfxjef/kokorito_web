/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B9D',
        secondary: '#FFF3E0',
        accent: '#4ECDC4',
        warning: '#FFD93D',
        background: '#FFFFFF',
        text: '#2C3E50',
        'pastel-pink': '#FFE4E6',
        'mint-light': '#E8F8F7',
        'cream': '#FFF8F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 