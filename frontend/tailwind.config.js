/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./app/**/*.{js,jsx,ts,tsx}"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
