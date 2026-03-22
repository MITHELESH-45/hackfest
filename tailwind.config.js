/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          dark: '#f8fafc',
          900: '#0f172a',
        },
        secondary: {
          DEFAULT: '#4f46e5', // Vibrant Indigo
          light: '#818cf8',
          dark: '#312e81',
          glow: 'rgba(79, 70, 229, 0.5)',
        },
        accent: {
          DEFAULT: '#f43f5e', // Vibrant Rose
          light: '#fb7185',
          dark: '#be123c',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(15, 23, 42, 0.7)',
          border: 'rgba(255, 255, 255, 0.2)',
        }
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(at 40% 20%, rgba(224, 231, 255, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(254, 240, 138, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(253, 230, 138, 1) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(207, 250, 254, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(254, 226, 226, 1) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(224, 231, 255, 1) 0px, transparent 50%), radial-gradient(at 0% 0%, rgba(238, 242, 255, 1) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 0% 0%, rgba(30, 27, 75, 1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(76, 29, 149, 1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(131, 24, 67, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(23, 37, 84, 1) 0px, transparent 50%)',
      },
      animation: {
        blob: "blob 7s infinite",
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glass-card-hover': '0 12px 40px 0 rgba(79, 70, 229, 0.15)',
        'btn-glow': '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
      }
    },
  },
  plugins: [],
}
