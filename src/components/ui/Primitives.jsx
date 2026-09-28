import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import { STATUS } from "../../data/appeals";

/* ——— Знак Министерства ——— */

export function Mark({ size = "md", className = "" }) {
  return (
    <span className={`mark mark-${size} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 74" fill="none">
        <path
          d="M32 2.6 58.4 11.3v25.3c0 16.6-12.1 27.5-26.4 34.8C17.7 64.1 5.6 53.2 5.6 36.6V11.3Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M32 8.2 53.4 15.3v20.9c0 13.7-9.8 23-21.4 29.4C20.4 59.2 10.6 49.9 10.6 36.2V15.3Z"
          stroke="currentColor"
          strokeWidth=".9"
          opacity=".5"
          strokeLinejoin="round"
        />
        <path
          d="m32 14 1.6 3.9 4.2.34-3.2 2.76.97 4.1L32 22.94l-3.57 2.16.97-4.1-3.2-2.76 4.2-.34Z"
          fill="currentColor"
        />
        <path
          d="M18.6 34.4 32 27.1l13.4 7.3"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M17.8 37.6h28.4"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M21.8 40.8v10.6M27.4 40.8v10.6M36.6 40.8v10.6M42.2 40.8v10.6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M17.8 54.2h28.4M21.4 57.6h21.2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/* ——— Рубрика ——— */

export function Kicker({ children, plain = false, className = "" }) {
  return (
    <span className={`kicker ${plain ? "kicker-plain" : ""} ${className}`}>
      {children}
    </span>
  );
}

/* ——— Заголовок с посимвольным появлением ——— */

export function SplitTitle({ lines, delay = 0, className = "" }) {
  const rows = Array.isArray(lines) ? lines : [lines];
  let index = 0;
  return (
    <span className={`split-title ${className}`}>
      {rows.map((line, r) => (
        <span className="split-line" key={r}>
          {[...String(line)].map((char, c) => {
            const ci = index++;
            return (
              <span
                className="split-char"
                key={`${r}-${c}`}
                style={{ "--ci": ci, "--base-delay": `${delay}ms` }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/* ——— Кнопка ——— */

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  icon = "arrow",
  size = "",
  className = "",
  type = "button",
  disabled = false,
}) {
  const cls = `btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="btn-icon">
          <Icon name={icon} size={17} />
        </span>
      )}
    </>
  );
  return href ? (
    <a className={cls} href={href}>
      {inner}
    </a>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}

/* ——— Статус ——— */

export function StatusPill({ status }) {
  const item = STATUS[status] || STATUS.NEW;
  return (
    <span className={`status-pill status-${item.tone}`}>
      <i />
      {item.label}
    </span>
  );
}

/* ——— Уведомление ——— */

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return createPortal(
    <div className={`toast toast-${toast.type || "success"}`} role="status">
      <span className="toast-mark">
        <Icon name={toast.type === "error" ? "close" : "check"} size={15} />
      </span>
      <span>{toast.message}</span>
      <button aria-label="Закрыть уведомление" onClick={onClose}>
        <Icon name="close" size={15} />
      </button>
    </div>,
    document.body,
  );
}

/* ——— Модальное окно ——— */

export function Modal({
  open,
  title,
  children,
  onClose,
  actions,
  className = "",
}) {
  const dialog = useRef(null);
  const closeHandler = useRef(onClose);
  closeHandler.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const items = () =>
      dialog.current?.querySelectorAll(
        'button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),[tabindex]:not([tabindex="-1"])',
      ) || [];
    items()[0]?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        closeHandler.current?.();
        return;
      }
      if (e.key === "Tab") {
        const list = [...items()];
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
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
    document.body.classList.add("is-locked");
    return () => {
      window.removeEventListener("keydown", key);
      document.body.classList.remove("is-locked");
      previous?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div
      className="modal-scrim"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <section
        ref={dialog}
        className={`modal-card ${className}`}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-top">
          <span className="tiny-label">МСПиТ · Уведомление</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
        <h2 id="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </section>
    </div>,
    document.body,
  );
}

/* ——— Пустое состояние ——— */

export function EmptyState({ title, body, icon = "search" }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

/* ——— Появление при прокрутке ——— */

export function useReveal(dependency) {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]:not(.is-revealed)");
    if (!nodes.length) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [dependency]);
}

/* ——— Небольшая утилита для последовательных задержек ——— */

export function useStagger(count, step = 80) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        "--reveal-delay": `${i * step}ms`,
      })),
    [count, step],
  );
}
