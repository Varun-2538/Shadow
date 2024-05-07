/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        7: "1.75rem",
      },
      colors: {
        "sidebar-dark": "#1A202C", // example color
      },
      boxShadow: {
        "glow-red":
          "0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.6)",
        "glow-white":
          "0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.6)",
        "glow-red-intense":
          "0 0 20px rgba(255, 0, 0, 0.8), 0 0 30px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.8)",
        "glow-white-intense":
          "0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.8)",
      },
      gradientBorderColors: {
        "gradient-red": ["#ff0000", "#ff7f7f"],
      },
    },
  },
  plugins: [],
};

