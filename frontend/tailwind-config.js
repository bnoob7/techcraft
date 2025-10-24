// @type {import('tailwindcss').Config} 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        secondary: {
          300: "#FFAC30",
          400: "#E89D2C",
        },
        light: "#F2EAEC",
        primary: {
          blur: "#213423",
          10: "#f6f4f2",
          50: "#f2eaec",
          100: "#fedee1",
          200: "#fcbbc0",
          300: "#7C303D",
          400: "#dd2130",
          500: "#c41e2a",
          600: "#b81c28",
          700: "#931620",
          800: "#6e1118",
          900: "#560d13",
        },
        orange: {
          100: "#fef4ee",
        },
        blue: {
          800: " #16163c",
          900: "#050515",
        },
        yellow: {
          100: "#FFFBF0",
          800: "#F3EB2F",
        },
      },
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
  },
  plugins: [],
};
