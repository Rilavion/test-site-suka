import React from "react";

const paths = {
  arrow: <path d="M4 12h15M13 5l7 7-7 7" />,
  back: <path d="M20 12H5m7 7-7-7 7-7" />,
  down: <path d="m6 9 6 6 6-6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.2 4.2L19 6.8" />,
  plus: <path d="M12 5v14M5 12h14" />,
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2.4" />
      <path d="M16 8V5.4A2.4 2.4 0 0 0 13.6 3H5.4A2.4 2.4 0 0 0 3 5.4v8.2A2.4 2.4 0 0 0 5.4 16H8" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16.5V4m-5 5 5-5 5 5" />
      <path d="M4 16.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2.5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 21.5s7.5-3.8 7.5-10.3V5.4L12 2.5 4.5 5.4v5.8C4.5 17.7 12 21.5 12 21.5Z" />
      <path d="m9.2 11.8 2 2 3.6-3.7" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  pin: (
    <>
      <path d="M19.5 10.2c0 5.3-7.5 11.3-7.5 11.3S4.5 15.5 4.5 10.2a7.5 7.5 0 1 1 15 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: (
    <path d="M21.5 16.9v2.7a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.6 4.6 1.9 1.9 0 0 1 4.5 2.5h2.7a1.9 1.9 0 0 1 1.9 1.6c.12.94.35 1.86.67 2.74a1.9 1.9 0 0 1-.43 2L8.2 9.9a15 15 0 0 0 5.9 5.9l1.06-1.14a1.9 1.9 0 0 1 2-.43c.88.33 1.8.55 2.74.67a1.9 1.9 0 0 1 1.6 1.95Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="m3.6 7 8.4 5.6L20.4 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9.2" cy="8.4" r="3.6" />
      <path d="M2.8 20.2a6.4 6.4 0 0 1 12.8 0" />
      <path d="M16.4 5.2a3.6 3.6 0 0 1 0 6.9" />
      <path d="M17.8 14.6a6.4 6.4 0 0 1 3.4 5.6" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.4v17.2M7 20.6h10" />
      <path d="M4.4 7.4h15.2" />
      <path d="m7.6 7.6-3.2 6.2h6.4Z" />
      <path d="m16.4 7.6-3.2 6.2h6.4Z" />
    </>
  ),
  heart: (
    <path d="M12 20.4s-7.8-4.6-7.8-10a4.4 4.4 0 0 1 7.8-2.8 4.4 4.4 0 0 1 7.8 2.8c0 5.4-7.8 10-7.8 10Z" />
  ),
  accessibility: (
    <>
      <circle cx="12" cy="4.6" r="1.8" />
      <path d="M5.6 8.4h12.8" />
      <path d="M12 8.4v5.6m0 0-3 6.4m3-6.4 3 6.4" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12.4c0 4-3.8 7.2-8.5 7.2a9.9 9.9 0 0 1-2.6-.34L4.2 21l1.1-3.6a6.8 6.8 0 0 1-1.8-4.5c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  filter: <path d="M3.5 5.5h17l-6.6 7.6v5.3l-3.8 2.1v-7.4Z" />,
  logout: (
    <>
      <path d="M15 4.5h3.5A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5H15" />
      <path d="M10 8 6 12l4 4M6 12h10" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.6,
  className = "",
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
