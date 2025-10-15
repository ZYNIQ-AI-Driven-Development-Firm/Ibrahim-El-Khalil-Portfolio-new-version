/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          50: 'rgb(var(--color-primary) / 0.05)',
          100: 'rgb(var(--color-primary) / 0.1)',
          200: 'rgb(var(--color-primary) / 0.2)',
          300: 'rgb(var(--color-primary) / 0.3)',
          400: 'rgb(var(--color-primary) / 0.4)',
          500: 'rgb(var(--color-primary) / 1)',
          600: 'rgb(var(--color-secondary) / 1)',
          700: 'rgb(var(--color-secondary) / 1)',
          800: 'rgb(var(--color-accent) / 1)',
          900: 'rgb(var(--color-accent) / 1)',
        },
      },
    },
  },
  plugins: [],
}
