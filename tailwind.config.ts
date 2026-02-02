import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'naik-black': '#050505',
        'naik-dark': '#080808',
        'naik-gold': '#FFD700',
        'naik-neon': '#CCFF00',
        'naik-blue': '#009ee3',
        'naik-green': '#25D366',
        'naik-pink': '#E4405F',
      },
      fontFamily: {
        oswald: ['var(--font-oswald)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.6)',
        'glow-gold-sm': '0 0 15px rgba(255, 215, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;