import React from "react";
import { themeConfig } from "../config/theme";
import { asset } from "../utils/basePath";
export default function AmbientBackground() {
  const config = themeConfig.background;
  if (!config.enabled) return null;
  return (
    <div
      className={`ambient-scene ${config.grain ? "with-grain" : ""} ${config.particles ? "with-particles" : ""}`}
      aria-hidden="true"
      style={{
        "--orbit-duration": `${48 / Math.max(0.05, config.orbitSpeed * config.motionIntensity)}s`,
        "--glow-opacity": config.glowIntensity,
        "--pointer-distance": `${config.parallax ? config.pointerInfluence : 0}px`,
      }}
    >
      <img
        className="ambient-photo"
        src={asset("assets/media/government-house.jpg")}
        alt=""
      />
      <div className="ambient-photo-shade" />
      <div className="home-project-mark">
        <img src={asset("assets/rmrp/rmrp-forum-logo.png")} alt="" />
        <span>
          RMRP · СЕРВЕР №3
          <small>ПАТРИКИ</small>
        </span>
      </div>
    </div>
  );
}
