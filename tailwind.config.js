/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        he: {
          blue: '#003087',
          teal: '#007999',
          light: '#e8f4f8',
        },
        haven: {
          blue: '#2563eb',
          purple: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}

