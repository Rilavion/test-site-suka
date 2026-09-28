import React, { useEffect, useState, useRef } from "react";
import { applyTheme, themeConfig } from "../config/theme";
import { motionConfig, reducedMotion } from "../config/motion";
export default function ThemeSwitch() {
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );
  const [busy, setBusy] = useState(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const observer = new MutationObserver(() =>
      setTheme(document.documentElement.dataset.theme),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      alive.current = false;
      observer.disconnect();
    };
  }, []);
  async function toggle(event) {
    if (busy) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.x + rect.width / 2,
      y = rect.y + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const next = theme === "dark" ? "light" : "dark";
    const change = () => {
      applyTheme(next);
      try {
        localStorage.setItem(themeConfig.storageKey, next);
      } catch {}
    };
    setBusy(true);
    try {
      if (document.startViewTransition && !reducedMotion()) {
        const transition = document.startViewTransition(change);
        await transition.ready;
        await document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: motionConfig.themeDuration,
            easing: "cubic-bezier(.22,.75,.24,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ).finished;
        await transition.finished;
      } else {
        change();
        if (!reducedMotion()) {
          const ring = document.createElement("div");
          ring.className = "theme-reveal-ring";
          ring.style.cssText = `left:${x}px;top:${y}px;`;
          document.body.append(ring);
          try {
            await ring.animate(
              [
                { transform: "translate(-50%,-50%) scale(0)", opacity: 1 },
                {
                  transform: `translate(-50%,-50%) scale(${radius / 20})`,
                  opacity: 0,
                },
              ],
              { duration: motionConfig.themeDuration },
            ).finished;
          } finally {
            ring.remove();
          }
        }
      }
    } catch {
      change();
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <button
      className={`theme-switch ${busy ? "is-switching" : ""}`}
      onClick={toggle}
      disabled={busy}
      aria-label={
        theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
      }
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        {theme === "light" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
          </>
        ) : (
          <path d="M20.4 14.1A8.5 8.5 0 0 1 9.9 3.6 8.5 8.5 0 1 0 20.4 14.1Z" />
        )}
      </svg>
    </button>
  );
}
