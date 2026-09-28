import React, { useEffect, useRef } from "react";
import Icon from "./Icon";
import { STATUS } from "../../data/appeals";
import { createPortal } from "react-dom";
export function Mark({ light = false }) {
  return (
    <div
      className={`mark ${light ? "mark-light" : ""}`}
      aria-label="Знак Министерства"
    >
      <svg viewBox="0 0 64 76" fill="none" aria-hidden="true">
        <path
          d="M32 3 58 13v28c0 15-15 25-26 32C21 66 6 56 6 41V13Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M32 9 52 17v24c0 11-11 20-20 26-9-6-20-15-20-26V17Z"
          stroke="currentColor"
          strokeWidth=".6"
        />
        <path
          d="M18 46V25l14 16 14-16v21M15 49h34M21 53h22M27 57h10M26 17h12M29 14h6"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="m32 11 1-3-1-3-1 3Z" fill="currentColor" />
      </svg>
    </div>
  );
}
export function StatusPill({ status }) {
  const item = STATUS[status] || STATUS.NEW;
  return (
    <span className={`status-pill status-${item.tone}`}>
      <i />
      {item.label}
    </span>
  );
}
export function Eyebrow({ children, number }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-rule" />
      {number && <span className="eyebrow-number">{number}</span>}
      <span>{children}</span>
    </div>
  );
}
export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  icon = "arrow",
  className = "",
  type = "button",
  disabled = false,
  loading = false,
}) {
  const cls = `button button-${variant} ${className}`;
  const inner = (
    <>
      {children}
      {icon && (
        <span className="button-icon">
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
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {inner}
    </button>
  );
}
export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return createPortal(
    <div className={`toast toast-${toast.type || "success"}`} role="status">
      <span className="toast-mark">
        <Icon name={toast.type === "error" ? "close" : "check"} size={17} />
      </span>
      <span>{toast.message}</span>
      <button aria-label="Закрыть уведомление" onClick={onClose}>
        <Icon name="close" size={16} />
      </button>
    </div>,
    document.body,
  );
}
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
        const first = list[0],
          last = list[list.length - 1];
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
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", key);
      document.body.classList.remove("modal-open");
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
          <span className="eyebrow-number">МСПиТ / УВЕДОМЛЕНИЕ</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <Icon name="close" />
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
export function EmptyState({ title, body, icon = "search" }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={24} />
      </span>
      <span className="eyebrow">
        СИСТЕМА / 0{icon === "search" ? "4" : "0"}
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
