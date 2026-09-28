import React, { useEffect, useRef, useState } from "react";
import { navItems, siteConfig } from "../../config/site";
import { Mark } from "../ui/Primitives";
import Icon from "../ui/Icon";
import { createPortal } from "react-dom";
import ThemeSwitch from "../ThemeSwitch";

export function Header({ onMenu, navigate, staff, menuOpen = false }) {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    let previous = window.scrollY;
    let frame;
    const update = () => {
      const current = window.scrollY;
      setCompact(current > 24);
      setHidden(current > previous && current > 150 && !menuOpen);
      previous = current;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);
  return (
    <header
      className={`site-header ${compact ? "is-compact" : ""} ${hidden ? "is-hidden" : ""}`}
    >
      <button
        className="brand-lockup"
        onClick={() => navigate("/")}
        aria-label="На главную"
      >
        <Mark />
        <span className="brand-text">
          <b>{siteConfig.ministryName}</b>
          <small>{siteConfig.districtName}</small>
        </span>
      </button>
      <div className="header-right">
        <span className="header-note">
          <i /> {siteConfig.project} · {siteConfig.server}
        </span>
        <ThemeSwitch />
        <button
          className="staff-chip"
          onClick={() => navigate(staff ? "/staff" : "/staff/login")}
        >
          СЛУЖЕБНЫЙ ДОСТУП <span>↗</span>
        </button>
        <button
          className="menu-trigger"
          onClick={onMenu}
          aria-label="Открыть навигацию"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          <span>МЕНЮ</span>
          <span className="menu-glyph">
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}

export function Navigation({ open, onClose, navigate, currentPath }) {
  const panel = useRef(null);
  const [activeNumber, setActiveNumber] = useState("01");
  useEffect(() => {
    if (open)
      setActiveNumber(
        navItems.find((item) => item.path === currentPath)?.id || "01",
      );
  }, [open, currentPath]);
  useEffect(() => {
    if (panel.current) panel.current.inert = !open;
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      panel.current?.querySelectorAll("button,a[href]") || [];
    const first = focusables()[0];
    first?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = [...focusables()];
        if (!items.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = oldOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);
  return createPortal(
    <div className={`nav-system ${open ? "nav-open" : ""}`} aria-hidden={!open}>
      <button
        className="nav-backdrop"
        onClick={onClose}
        aria-label="Закрыть меню"
        tabIndex={open ? 0 : -1}
      />
      <aside
        id="main-navigation"
        ref={panel}
        className="nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Навигация"
      >
        <div className="nav-panel-top">
          <span className="nav-kicker">СИСТЕМА / РАЗДЕЛЫ</span>
          <ThemeSwitch />
          <button
            className="nav-close"
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <span>ЗАКРЫТЬ</span>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="nav-panel-main">
          <div className="nav-list">
            {navItems.map((item, i) => (
              <button
                key={item.path}
                className={`nav-item ${currentPath === item.path ? "is-current" : ""}`}
                style={{ "--i": i }}
                onMouseEnter={() => setActiveNumber(item.id)}
                onFocus={() => setActiveNumber(item.id)}
                aria-current={currentPath === item.path ? "page" : undefined}
                onClick={() => {
                  onClose();
                  navigate(item.path);
                }}
              >
                <span className="nav-item-number">{item.id}</span>
                <span className="nav-item-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="nav-item-arrow">
                  <Icon name="arrow" size={19} />
                </span>
                <i className="nav-item-line" />
              </button>
            ))}
          </div>
          <div className="nav-visual" aria-hidden="true">
            <div className="nav-ring ring-one" />
            <div className="nav-ring ring-two" />
            <span className="nav-watermark" key={activeNumber}>
              {activeNumber}
            </span>
            <span className="nav-coordinate">
              59°56′ N<br />
              30°18′ E
            </span>
            <span className="nav-panel-id">ПФО / 2026</span>
          </div>
        </div>
        <div className="nav-panel-bottom">
          <div>
            <span className="tiny-label">СЛУЖЕБНЫЙ КОНТУР</span>
            <button
              className="staff-link"
              onClick={() => {
                onClose();
                navigate("/staff/login");
              }}
            >
              Для сотрудников <span>↗</span>
            </button>
          </div>
          <div className="nav-contact">
            Горячая линия
            <br />
            <a href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}>
              {siteConfig.hotline}
            </a>
          </div>
          <span className="nav-index">
            {activeNumber} / {String(navItems.length).padStart(2, "0")}
          </span>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
