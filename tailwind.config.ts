import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./styles/**/*.css"],
  theme: {
    extend: {
      colors: {
        ink: "#102a43",
        petrol: "#0f4c5c",
        coral: "#ff6b4a",
        cream: "#f7f5ef",
        mist: "#eef7f5"
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "Manrope", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(16, 42, 67, 0.10)",
        soft: "0 14px 40px rgba(16, 42, 67, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
