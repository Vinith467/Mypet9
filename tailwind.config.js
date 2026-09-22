/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petoo: {
          primary: '#FBBF24',
          primaryDark: '#F59E0B',
          bg: '#FBF6EE',
          textDark: '#1B2B48',
          textMuted: '#6B6B6B',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        'large': '16px',
        'xlarge': '24px',
      }
    },
  },
  plugins: [],
}
