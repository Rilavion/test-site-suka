export const motionConfig = {
  enabled: true,
  /** Длительность перехода между разделами, мс. */
  pageTransition: 520,
  /** Длительность круговой волны при смене темы, мс. */
  themeDuration: 720,
};

export const reducedMotion = () =>
  !motionConfig.enabled ||
  (typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches);

export function initializeMotion() {
  document.documentElement.dataset.motion = motionConfig.enabled ? "on" : "off";
}
