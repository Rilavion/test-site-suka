export const motionConfig = {
  enabled: true,
  intensity: 1,
  pageTransitionDuration: 900,
  menuDuration: 720,
  themeDuration: 800,
  stepDuration: 380,
  parallax: true,
  ambientMotion: true,
  reducedMotionFallback: 80,
};
export const reducedMotion = () =>
  !motionConfig.enabled ||
  matchMedia("(prefers-reduced-motion: reduce)").matches;
export function initializeMotion() {
  const root = document.documentElement;
  root.dataset.motion = motionConfig.enabled ? "on" : "off";
  root.dataset.ambient = motionConfig.ambientMotion ? "on" : "off";
  root.style.setProperty("--motion-intensity", motionConfig.intensity);
  root.style.setProperty(
    "--page-leave",
    `${motionConfig.pageTransitionDuration * 0.38}ms`,
  );
  root.style.setProperty(
    "--page-arrive",
    `${motionConfig.pageTransitionDuration * 0.62}ms`,
  );
  root.style.setProperty("--menu-duration", `${motionConfig.menuDuration}ms`);
  root.style.setProperty("--step-duration", `${motionConfig.stepDuration}ms`);
}
