import React, { useEffect, useRef, useState } from "react";
import { applyTheme, themeConfig } from "../config/theme";
import { motionConfig, reducedMotion } from "../config/motion";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );
  const busy = useRef(false);

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(document.documentElement.dataset.theme),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  async function toggle(event) {
    if (busy.current) return;
    busy.current = true;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const next = theme === "dark" ? "light" : "dark";
    const change = () => {
      applyTheme(next);
      try {
        localStorage.setItem(themeConfig.storageKey, next);
      } catch {
        /* хранилище может быть недоступно */
      }
    };
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
            easing: "cubic-bezier(.33,1,.68,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ).finished;
        await transition.finished;
      } else {
        change();
        if (!reducedMotion()) {
          const ring = document.createElement("div");
          ring.className = "theme-wave";
          ring.style.left = `${x}px`;
          ring.style.top = `${y}px`;
          document.body.append(ring);
          try {
            await ring.animate(
              [
                { transform: "scale(0)", opacity: 0.85 },
                { transform: `scale(${radius / 18})`, opacity: 0 },
              ],
              { duration: motionConfig.themeDuration, easing: "ease-out" },
            ).finished;
          } finally {
            ring.remove();
          }
        }
      }
    } catch {
      change();
    } finally {
      busy.current = false;
    }
  }

  return (
    <button
      className="theme-switch"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
      }
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {theme === "light" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 1.8v2.6m0 15.2v2.6M1.8 12h2.6m15.2 0h2.6M4.6 4.6l1.9 1.9m11 11 1.9 1.9M4.6 19.4l1.9-1.9m11-11 1.9-1.9" />
          </>
        ) : (
          <path d="M20.6 14.3A8.6 8.6 0 0 1 9.7 3.4 8.6 8.6 0 1 0 20.6 14.3Z" />
        )}
      </svg>
    </button>
  );
}
