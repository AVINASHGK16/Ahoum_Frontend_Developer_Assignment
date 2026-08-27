/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nectar: {
          DEFAULT: '#53B175',
          dark: '#489E67',
          light: '#6EC38D',
        },
      },
    },
  },
  plugins: [],
};
