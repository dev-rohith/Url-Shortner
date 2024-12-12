/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(50px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        fadeInDown: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out'
      }
    },
  },
  plugins: [],
}