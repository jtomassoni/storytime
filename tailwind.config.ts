import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-bg": "var(--card-bg)",
        "border-color": "var(--border-color)",
        "accent-purple": "var(--accent-purple)",
        "accent-purple-dark": "var(--accent-purple-dark)",
      },
    },
  },
  plugins: [],
};
export default config;

