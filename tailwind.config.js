/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          DEFAULT: '#f7f9fb',
          dark: '#0f172a',
          card: '#ffffff',
          'card-dark': '#1e293b',
          muted: '#f1f5f9',
          'muted-dark': '#334155',
          border: '#e2e8f0',
          'border-dark': '#334155',
        },
        dayflow: {
          primary: '#4f46e5',
          'primary-dark': '#3525cd',
          'primary-light': '#e0e7ff',
          'primary-container': '#dad7ff',
          secondary: '#565e74',
          tertiary: '#006e4b',
          success: '#10b981',
          'success-bg': '#ecfdf5',
          'success-text': '#047857',
          warning: '#f59e0b',
          'warning-bg': '#fffbeb',
          'warning-text': '#b45309',
          danger: '#ef4444',
          'danger-bg': '#fef2f2',
          'danger-text': '#b91c1c',
          info: '#3b82f6',
          'info-bg': '#eff6ff',
          'info-text': '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
