import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFD700', // Tu amarillo
          blue: '#00BFFF',   // Tu azul
        }
      },
    },
  },
  plugins: [],
};
export default config;