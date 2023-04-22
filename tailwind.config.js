const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter var", ...defaultTheme.fontFamily.sans] },
      colors: {
        primary: {
          DEFAULT: colors.green[500],
          ...colors.green,
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
