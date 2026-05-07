import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Coastal Calm palette
        aqua: {
          50:  "#f0fafa",
          100: "#d4f1f0",
          200: "#a0e7e5",
          300: "#6dd8d6",
          400: "#3ec9c7",
          500: "#1eb8b6",
          600: "#159494",
          700: "#0f7070",
          800: "#0a4d4d",
          900: "#052929",
        },
        coral: {
          50:  "#fff5f4",
          100: "#ffe8e6",
          200: "#ffccc9",
          300: "#ffaaa5",
          400: "#ff8880",
          500: "#ff6b62",
          600: "#e84e45",
          700: "#c43530",
          800: "#9e2420",
          900: "#7a1a17",
        },
        navy: {
          DEFAULT: "#1E3A5F",
          light: "#2d5282",
          muted: "#4a6fa5",
          faint: "#8ba7c7",
        },
        sky: {
          soft: "#7EC8E0",
          light: "#b8e4f0",
          pale: "#e8f7fc",
        },
        sand: {
          DEFAULT: "#f5ede0",
          light: "#faf5ee",
        },
      },
      fontFamily: {
        heading:  ["var(--font-caveat)", "cursive"],
        display:  ["var(--font-pacifico)", "cursive"],
        body:     ["var(--font-quicksand)", "sans-serif"],
        sans:     ["var(--font-quicksand)", "sans-serif"],
        handwriting: ["var(--font-caveat)", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "float":          "float 4s ease-in-out infinite",
        "wiggle":         "wiggle 3s ease-in-out infinite",
        "fade-up":        "fade-up 0.4s ease-out",
      },
      boxShadow: {
        polaroid: "0 4px 12px rgba(30,58,95,0.12), 0 1px 3px rgba(30,58,95,0.08)",
        "polaroid-hover": "0 8px 24px rgba(30,58,95,0.16), 0 2px 6px rgba(30,58,95,0.1)",
        sticky: "2px 3px 8px rgba(30,58,95,0.15)",
        soft: "0 2px 8px rgba(160,231,229,0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
