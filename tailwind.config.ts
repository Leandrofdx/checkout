import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#eb015b",
          dark: "#c1014a",
        },
      },
      animation: {
        "slide-in-from-top": "slide-in-from-top 0.5s ease-out",
      },
      keyframes: {
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  // Otimizações para reduzir tamanho
  corePlugins: {
    // Desabilitar plugins não utilizados
    container: false,
    preflight: true,
  },
}

export default config
