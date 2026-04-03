// theme.js — Enduring Roots Design System
// Brand Green: rgb(85, 130, 94) → #55825E

const theme = {
  colors: {
    // Primary brand green (from the site's actual color)
    brand: {
      50:  "#f0f7f2",
      100: "#d9ede0",
      200: "#b3dcbf",
      300: "#7ec094",
      400: "#55a36d",
      500: "#55825E", // ← exact site green
      600: "#3e6b47",
      700: "#2f5237",
      800: "#1f3824",
      900: "#132217",
      950: "#0a1410",
    },

    // Warm neutrals for a heritage/family feel
    stone: {
      50:  "#fafaf9",
      100: "#f5f5f0",
      200: "#e8e8e0",
      300: "#d4d4c8",
      400: "#a8a898",
      500: "#7a7a6a",
      600: "#5c5c4e",
      700: "#3d3d31",
      800: "#282820",
      900: "#1a1a14",
      950: "#0d0d09",
    },

    // Accent — warm amber for warmth/nostalgia
    amber: {
      300: "#fcd34d",
      400: "#f59e0b",
      500: "#d97706",
    },

    // Semantic
    rose:    { 400: "#fb7185", 500: "#f43f5e" },
    emerald: { 300: "#6ee7b7", 400: "#34d399" },

    white: "#ffffff",
    black: "#000000",
  },

  // Spacing scale (multiplied by 0.25rem)
  spacing: (n:any) => `${n * 0.25}rem`,

  fontSize: {
    xs:   "0.75rem",
    sm:   "0.875rem",
    base: "1rem",
    lg:   "1.125rem",
    xl:   "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },

  borderRadius: {
    none: "0",
    sm:   "0.125rem",
    base: "0.25rem",
    md:   "0.375rem",
    lg:   "0.5rem",
    xl:   "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  boxShadow: {
    sm:      "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md:      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg:      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl:      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl":   "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    // Brand-tinted shadows
    green:   "0 10px 30px -8px rgba(85,130,94,0.35)",
    greenLg: "0 20px 40px -10px rgba(85,130,94,0.4)",
  },

  fontFamily: {
    sans:    '"Lato", ui-sans-serif, system-ui, sans-serif',
    serif:   '"Playfair Display", ui-serif, Georgia, serif',
    display: '"Cormorant Garamond", Georgia, serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  },

  transition: {
    fast:    "all 0.15s ease",
    DEFAULT: "all 0.2s ease",
    slow:    "all 0.4s ease",
  },

  // Dark mode helpers
  dark: {
    bg:           "#0d1a10",   // near-black with green tint
    bgCard:       "#132217",
    bgInput:      "#1f3824cc",
    border:       "#2f5237",
    borderSubtle: "#1f3824",
    text:         "#f0f7f2",
    textMuted:    "#7ec094",
  },

  // Light mode helpers
  light: {
    bg:        "#fafaf9",
    bgCard:    "#ffffff",
    bgInput:   "#f0f7f2",
    border:    "#d9ede0",
    text:      "#132217",
    textMuted: "#3e6b47",
  },
};

export default theme;