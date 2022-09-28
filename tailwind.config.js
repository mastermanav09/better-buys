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
        "md-max": { max: "767px" },
        "lg-max": { max: "1023px" },
      },

      animation: {
        slideRight: "slideRight 300ms ease-out 0ms",
      },

      keyframes: {
        slideRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(-100px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/forms")],
};
