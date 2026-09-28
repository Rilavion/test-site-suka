export const themeConfig = {
  storageKey: "mspt-portal-theme",
  default: "system",
  palette: { burgundy: "#793747", gold: "#b49868", goldLight: "#d1bd94" },
  themes: {
    light: {
      "bg-primary": "#f2f0e9",
      "bg-secondary": "#e8e5dc",
      surface: "#faf9f5",
      "surface-elevated": "#ffffff",
      "text-primary": "#202321",
      "text-secondary": "#62655e",
      border: "#20232129",
      "accent-text": "#793747",
    },
    dark: {
      "bg-primary": "#191c1a",
      "bg-secondary": "#222623",
      surface: "#272c28",
      "surface-elevated": "#303631",
      "text-primary": "#f0eee5",
      "text-secondary": "#b8beb4",
      border: "#eee9db29",
      "accent-text": "#daa0ad",
    },
  },
  background: {
    enabled: true,
    parallax: true,
    grain: true,
    particles: false,
    orbitSpeed: 1,
    pointerInfluence: 8,
    glowIntensity: 0.32,
    motionIntensity: 1,
  },
};
export function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  for (const [key, value] of Object.entries(themeConfig.themes[theme]))
    root.style.setProperty(`--${key}`, value);
  root.style.setProperty("--accent-burgundy", themeConfig.palette.burgundy);
  root.style.setProperty("--accent-gold", themeConfig.palette.gold);
  root.style.setProperty("--gold-light", themeConfig.palette.goldLight);
}
export function initializeTheme() {
  let saved;
  try {
    saved = localStorage.getItem(themeConfig.storageKey);
  } catch {
    /* Storage can be unavailable. */
  }
  const theme = ["light", "dark"].includes(saved)
    ? saved
    : themeConfig.default === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : themeConfig.default;
  applyTheme(theme);
}
