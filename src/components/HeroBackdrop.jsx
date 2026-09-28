import React from "react";
import { themeConfig } from "../config/theme";

/**
 * Фон главной страницы.
 * Анимируются только transform и opacity — без filter и blur на больших
 * поверхностях, поэтому сцена не нагружает GPU и не «лагает».
 */
export default function HeroBackdrop() {
  const { background } = themeConfig;
  if (!background.enabled) {
    return (
      <div className="hero-backdrop hero-backdrop-plain" aria-hidden="true" />
    );
  }
  return (
    <div
      className={`hero-backdrop ${background.drift ? "is-drifting" : ""}`}
      aria-hidden="true"
      style={{ "--drift-duration": `${background.driftSeconds}s` }}
    >
      <div className="hero-photo">
        <img src="/assets/media/government-house.jpg" alt="" decoding="async" />
      </div>
      <div className="hero-veil" />
      <div className="hero-sheen" />
      <div className="hero-grid" />
    </div>
  );
}
