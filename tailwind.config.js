/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#111118",
        "surface-2": "#1a1a24",
        "surface-3": "#242433",
        border: "#2a2a3d",
        "border-light": "#3a3a55",
        primary: "#6366f1",
        "primary-dark": "#4f46e5",
        "primary-light": "#818cf8",
        accent: "#a855f7",
        "accent-light": "#c084fc",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        "text-primary": "#f1f1f8",
        "text-secondary": "#9494b8",
        "text-muted": "#5a5a80",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(99,102,241,0.15)",
        glow: "0 0 20px rgba(99,102,241,0.3)",
      },
    },
  },
  plugins: [],
};
