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
          primary: '#1F5E42',
          bg: '#FBF6EE',
          textDark: '#1A1A1A',
          textMuted: '#6B6B6B',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'large': '16px',
        'xlarge': '24px',
      }
    },
  },
  plugins: [],
}
