/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  variants: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        bgPrimaryColor: {
          dark: 'rgb(17, 25, 54)',
          light: '#ffffff',
        },
        bgContainerColor: {
          dark: 'rgb(26, 34, 63)',
          light: 'rgb(238, 242, 246)',
        },
        textPrimaryColor: {
          dark: '#ffffff',
          light: '#121926',
        }
      },
    },
  },
  plugins: [],
}
