import React from "react";
import { themeConfig } from "../config/theme";
import { asset } from "../utils/basePath";

const PHOTO = asset("assets/media/government-house.jpg");
const TINY = asset("assets/media/government-house-tiny.jpg");

/**
 * Фон главной страницы.
 * Анимируются только transform и opacity — без filter и blur на больших
 * поверхностях, поэтому сцена не нагружает GPU и не «лагает».
 */
export default function HeroBackdrop() {
  const { background } = themeConfig;

  if (!background.enabled) {
    return (
      <div
        className="hero-backdrop hero-backdrop-plain"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8,10,8,.32), rgba(8,10,8,.78)), url("${PHOTO}")`,
        }}
      />
    );
  }

  return (
    <div
      className={`hero-backdrop ${background.drift ? "is-drifting" : ""}`}
      aria-hidden="true"
      style={{ "--drift-duration": `${background.driftSeconds}s` }}
    >
      {/* размытая миниатюра видна, пока грузится основной кадр */}
      <div className="hero-photo" style={{ backgroundImage: `url("${TINY}")` }}>
        <img src={PHOTO} alt="" decoding="async" />
      </div>
      <div className="hero-veil" />
      <div className="hero-sheen" />
      <div className="hero-grid" />
    </div>
  );
}
