/**
 * Портал умеет жить и в корне домена, и в подкаталоге —
 * например, на GitHub Pages: https://<пользователь>.github.io/<репозиторий>/
 *
 * Базовый путь подставляет Vite на этапе сборки (переменная BASE_PATH),
 * поэтому в коде не должно остаться адресов, начинающихся с «/assets».
 */

const RAW = import.meta.env.BASE_URL || "/";

/** Префикс маршрутов: «/test-site-suka» или пустая строка в корне домена. */
export const routeBase = RAW.replace(/\/+$/, "");

/** Адрес файла из public/ с учётом базового пути. */
export const asset = (path) => `${RAW}${String(path).replace(/^\/+/, "")}`;

/** Маршрут приложения → адрес в строке браузера. */
export const toHref = (path) => `${routeBase}${path || "/"}`;

/** Адрес в строке браузера → маршрут приложения. */
export const toRoute = (pathname) => {
  let value = pathname || "/";
  if (routeBase && value.startsWith(routeBase)) {
    value = value.slice(routeBase.length);
  }
  if (!value.startsWith("/")) value = `/${value}`;
  return value.length > 1 ? value.replace(/\/+$/, "") : "/";
};
