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
      screens: {
        "2xl": "1400px",
      },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Girly pastel palette
        blush: {
          50: "#fff0f3",
          100: "#ffe0e8",
          200: "#ffc1d1",
          300: "#ff93b0",
          400: "#ff5585",
          500: "#ff1f5e",
          600: "#f0003d",
          700: "#cc0033",
          800: "#a8002e",
          900: "#8c002b",
        },
        lavender: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        baby: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
        },
        rose: {
          pastel: "#ffd6e0",
        },
      },
      fontFamily: {
        heading: ["var(--font-fredoka)", "cursive"],
        body: ["var(--font-quicksand)", "sans-serif"],
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      backgroundImage: {
        "girly-gradient":
          "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 25%, #e8eaf6 50%, #e3f2fd 75%, #fce4ec 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,240,245,0.9) 100%)",
      },
      boxShadow: {
        girly:
          "0 4px 20px rgba(255, 182, 193, 0.3), 0 2px 8px rgba(216, 180, 254, 0.2)",
        "girly-lg":
          "0 8px 40px rgba(255, 182, 193, 0.4), 0 4px 16px rgba(216, 180, 254, 0.3)",
        polaroid:
          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06), 4px 4px 0 rgba(255,182,193,0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
