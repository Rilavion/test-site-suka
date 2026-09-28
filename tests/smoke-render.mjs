/**
 * Дымовой тест: приложение монтируется в jsdom на каждом маршруте.
 * Запуск: node tests/smoke-render.mjs
 */
import { JSDOM } from "jsdom";

const dom = new JSDOM(
  `<!doctype html><html data-theme="light"><head><meta name="theme-color" content="#f4f1e9"></head><body></body></html>`,
  { url: "http://localhost:5173/", pretendToBeVisual: true },
);

const g = dom.window;
const define = (key, value) =>
  Object.defineProperty(globalThis, key, {
    value,
    configurable: true,
    writable: true,
  });

g.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});
g.scrollTo = () => {};
g.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
g.cancelAnimationFrame = clearTimeout;

for (const key of [
  "window",
  "document",
  "navigator",
  "location",
  "history",
  "HTMLElement",
  "Element",
  "Node",
  "SVGElement",
  "MutationObserver",
  "IntersectionObserver",
  "matchMedia",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "innerWidth",
  "innerHeight",
  "getComputedStyle",
  "localStorage",
  "sessionStorage",
]) {
  define(key, g[key]);
}
define("IS_REACT_ACT_ENVIRONMENT", true);

const React = (await import("react")).default;
const client = await import("react-dom/client");
const { createServer } = await import("vite");

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
const { initializeTheme } = await vite.ssrLoadModule("/src/config/theme.js");
const { initializeMotion } = await vite.ssrLoadModule("/src/config/motion.js");
initializeTheme();
initializeMotion();

g.sessionStorage.setItem(
  "mspt-portal-session-v2",
  JSON.stringify({
    name: "Елена Соколова",
    role: "Главный специалист",
    email: "admin@mspt.local",
  }),
);

const routes = [
  "/",
  "/ministry",
  "/submit",
  "/track",
  "/contacts",
  "/staff/login",
  "/staff",
  `/staff/appeals/${encodeURIComponent("МСПТ-ПФО-2026-0143")}`,
  "/unknown-route",
];

const errors = [];
const originalError = console.error;
console.error = (...args) => {
  const text = args.map(String).join(" ");
  if (/not wrapped in act|ReactDOMTestUtils/.test(text)) return;
  errors.push(text);
  originalError(...args);
};

for (const route of routes) {
  g.history.pushState({}, "", route);
  const host = g.document.createElement("div");
  g.document.body.append(host);
  try {
    const root = client.createRoot(host);
    root.render(React.createElement(App));
    await new Promise((r) => setTimeout(r, 160));
    const size = host.innerHTML.length;
    if (size < 400) errors.push(`${route}: слишком короткий вывод (${size})`);
    process.stdout.write(
      `${size > 400 ? "✓" : "✗"} ${route} — ${size} симв.\n`,
    );
    root.unmount();
  } catch (error) {
    errors.push(`${route}: ${error.stack || error.message}`);
    process.stdout.write(`✗ ${route}\n`);
  } finally {
    host.remove();
  }
}

console.error = originalError;
await vite.close();

if (errors.length) {
  console.log("\nОШИБКИ:\n" + errors.join("\n---\n"));
  process.exit(1);
}
console.log("\nВсе маршруты смонтированы без ошибок.");
process.exit(0);
