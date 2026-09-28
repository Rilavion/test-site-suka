import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navItems, siteConfig } from "../../config/site";
import { Mark } from "../ui/Primitives";
import Icon from "../ui/Icon";
import ThemeSwitch from "../ThemeSwitch";

/* ——— Шапка: постоянное меню на широких экранах, ящик на узких ——— */

export function Header({ onMenu, navigate, staff, menuOpen, currentPath }) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => setStuck(window.scrollY > 8);
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <header className={`site-header ${stuck ? "is-stuck" : ""}`}>
      <div className="header-inner">
        <button
          className="brand"
          onClick={() => navigate("/")}
          aria-label="На главную страницу портала"
        >
          <Mark size="md" />
          <span className="brand-text">
            <b>{siteConfig.shortName}</b>
            <small>{siteConfig.districtShort}</small>
          </span>
        </button>

        <nav className="primary-nav" aria-label="Основные разделы">
          {navItems.map((item) => (
            <button
              key={item.path}
              className="underline-sweep"
              onClick={() => navigate(item.path)}
              aria-current={currentPath === item.path ? "page" : undefined}
            >
              {item.title}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <span className="header-divider" />
          <ThemeSwitch />
          <button
            className="staff-chip"
            onClick={() => navigate(staff ? "/staff" : "/staff/login")}
          >
            Служебный доступ
            <Icon name="external" size={13} />
          </button>
          <button
            className="menu-trigger"
            onClick={onMenu}
            aria-label="Открыть меню разделов"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span>Меню</span>
            <span className="menu-glyph" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ——— Выдвижное меню ——— */

export function Navigation({ open, onClose, navigate, currentPath, staff }) {
  const panel = useRef(null);
  useEffect(() => {
    if (panel.current) panel.current.inert = !open;
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    document.body.classList.add("is-locked");
    const focusables = () =>
      panel.current?.querySelectorAll("button,a[href]") || [];
    const timer = setTimeout(() => focusables()[0]?.focus(), 60);
    const key = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = [...focusables()];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
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
      clearTimeout(timer);
      window.removeEventListener("keydown", key);
      document.body.classList.remove("is-locked");
      previous?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <div className={`nav-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button
        className="nav-scrim"
        onClick={onClose}
        aria-label="Закрыть меню"
        tabIndex={open ? 0 : -1}
      />
      <aside
        id="main-navigation"
        ref={panel}
        className="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Разделы портала"
      >
        <div className="nav-drawer-top">
          <span className="tiny-label">Разделы портала</span>
          <ThemeSwitch />
          <button className="nav-close" onClick={onClose}>
            Закрыть
            <Icon name="close" size={15} />
          </button>
        </div>

        <nav className="nav-links" aria-label="Навигация по разделам">
          {navItems.map((item, i) => (
            <button
              key={item.path}
              className={`nav-link ${currentPath === item.path ? "is-current" : ""}`}
              style={{ "--i": i }}
              aria-current={currentPath === item.path ? "page" : undefined}
              onClick={() => {
                onClose();
                navigate(item.path);
              }}
            >
              <span className="nav-link-copy">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <span className="nav-link-arrow">
                <Icon name="arrow" size={19} />
              </span>
            </button>
          ))}
        </nav>

        <div className="nav-drawer-foot">
          <div className="nav-hotline">
            <span className="tiny-label">Горячая линия</span>
            <a href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}>
              {siteConfig.hotline}
            </a>
            <small className="muted">Обращения принимаются круглосуточно</small>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              onClose();
              navigate(staff ? "/staff" : "/staff/login");
            }}
          >
            <span>Служебный доступ</span>
            <span className="btn-icon">
              <Icon name="lock" size={15} />
            </span>
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
