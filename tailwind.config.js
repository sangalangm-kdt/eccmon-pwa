/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "cyan-to-blue": "linear-gradient(to right, #22d3ee, #3b82f6)",
        "cyan-to-blue-active": "linear-gradient(to right, #1ca1c9, #2a6edc)",
      },
      colors: {
        primary: "#00bfff",
        secondary: "#cfeeff",
        tertiary: "#00d4ff",
        background: "#f2f2f2",
        languageSwitchBackground: "#fafafa",
        navbar: "#fafafa",
        primaryText: "#333333",
        secondaryText: "#6e7271",
        inputBorderColor: "rgba(79,79,79,38%)",
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        tiny: "0.625rem", // Custom size: 10px
        huge: "3rem", // Custom size: 48px
        xxl: "4rem", // Custom size: 64px
        md: "0.9375rem",
      },
      screens: {
        xs: "300px", // Custom breakpoint for extra small screens
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        0.5: "0.5px",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      zIndex: {
        60: "60",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        // Adding bounce-fast keyframes
        "bounce-fast": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        slideUp: "slideUp 0.2s ease-out",
        slideDown: "slideDown 0.2s ease-out",
        // Adding bounce-fast animation
        "bounce-fast": "bounce-fast 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
