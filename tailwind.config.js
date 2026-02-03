/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff', // White
          dark: '#f8fafc',    // Slate 50 (Very light gray for backgrounds)
        },
        secondary: {
          DEFAULT: '#1e40af', // Blue 800
          light: '#3b82f6',   // Blue 500
          dark: '#1e3a8a',    // Blue 900
        },
        accent: '#e2e8f0',    // Slate 200 (Borders)
      },
    },
  },
  plugins: [],
}
