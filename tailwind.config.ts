import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6e6fa",
          100: "#dcd3f3",
          600: "#371e68",
          700: "#4B0082"
        },
        lavender: {
          50: "#f3f0fb",
          100: "#e6e6fa"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
