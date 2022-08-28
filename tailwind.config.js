/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js, ts, jsx, tsx}",
    "./components/**/*.{js, ts, jsx, tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "sm-max": { max: "640px" },
        "xs-max": { max: "360px" },
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/forms")],
};
