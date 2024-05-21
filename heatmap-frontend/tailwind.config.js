/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        rotate: "rotate 13s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(at top left, var(--tw-gradient-stops))",
      },
      backgroundPosition: {
        "top-left": "left top",
      },

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
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        rotate: {
          "0%": { transform: "rotate(0deg) scale(10)" },
          "100%": { transform: "rotate(-360deg) scale(10)" },
        },
      },
    },
  },
  plugins: [],
};
