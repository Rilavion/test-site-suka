export const themeConfig = {
  storageKey: "mspt-portal-theme",
  default: "system",
  /** Фон главной. Отключите drift, если нужен полностью статичный кадр. */
  background: {
    enabled: true,
    drift: true,
    driftSeconds: 34,
  },
};

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta)
    meta.setAttribute("content", theme === "dark" ? "#121410" : "#f4f1e9");
}

export function initializeTheme() {
  let saved;
  try {
    saved = localStorage.getItem(themeConfig.storageKey);
  } catch {
    /* хранилище может быть недоступно */
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
