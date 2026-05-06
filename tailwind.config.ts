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
        // Basketball court palette
        court: {
          black: "#111111",
          dark: "#1a1a1a",
          slate: "#1e293b",
          gray: "#2d2d2d",
          concrete: "#3a3a3a",
          wood: "#D2A679",
        },
        hoop: {
          orange: "#F97316",
          "orange-bright": "#FF6B35",
          neon: "#39FF14",
          "neon-dim": "#22cc0d",
          white: "#F8FAFC",
          chalk: "#E2E8F0",
        },
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "var(--font-poppins)", "sans-serif"],
        subheading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        handwriting: ["var(--font-inter)", "sans-serif"],
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
          "50%": { transform: "translateY(-12px)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0.8,0,1,1)" },
          "50%": { transform: "translateY(-20px)", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
        },
        "neon-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 20px #39FF14" },
          "50%": { boxShadow: "0 0 10px #39FF14, 0 0 25px #39FF14, 0 0 50px #39FF14" },
        },
        "orange-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #F97316, 0 0 10px #F97316" },
          "50%": { boxShadow: "0 0 15px #F97316, 0 0 30px #F97316, 0 0 45px #F97316" },
        },
        "hoop-shake": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-3deg)" },
          "30%": { transform: "rotate(3deg)" },
          "45%": { transform: "rotate(-2deg)" },
          "60%": { transform: "rotate(2deg)" },
          "75%": { transform: "rotate(-1deg)" },
        },
        "spin-ball": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "bounce-ball": "bounce 0.8s infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "orange-pulse": "orange-pulse 2s ease-in-out infinite",
        "hoop-shake": "hoop-shake 0.5s ease-in-out",
        "spin-ball": "spin-ball 2s linear infinite",
        "slide-up": "slide-up 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "court-gradient": "linear-gradient(180deg, #111111 0%, #1a1a1a 50%, #111111 100%)",
        "orange-gradient": "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
        "neon-gradient": "linear-gradient(135deg, #39FF14 0%, #22cc0d 100%)",
        "card-dark": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        "court-lines": `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 60px,
          rgba(249,115,22,0.04) 60px,
          rgba(249,115,22,0.04) 61px
        ), repeating-linear-gradient(
          0deg,
          transparent,
          transparent 60px,
          rgba(249,115,22,0.04) 60px,
          rgba(249,115,22,0.04) 61px
        )`,
      },
      boxShadow: {
        neon: "0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 40px rgba(57,255,20,0.3)",
        "neon-sm": "0 0 5px #39FF14, 0 0 10px rgba(57,255,20,0.5)",
        orange: "0 0 10px #F97316, 0 0 20px rgba(249,115,22,0.4)",
        "orange-sm": "0 0 5px #F97316, 0 0 10px rgba(249,115,22,0.3)",
        "card-hover": "0 8px 32px rgba(249,115,22,0.2), 0 0 0 1px rgba(249,115,22,0.3)",
        court: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
