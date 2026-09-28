import { initialAppeals } from "../data/appeals.js";
import { isAppeal } from "../services/appealService.js";
export const APPEALS_KEY = "mspt-portal-appeals-v2";
const SESSION_KEY = "mspt-portal-session-v2";
export function loadAppeals() {
  try {
    const saved = localStorage.getItem(APPEALS_KEY);
    const records = saved ? JSON.parse(saved) : initialAppeals;
    return Array.isArray(records) && records.every(isAppeal)
      ? records
      : initialAppeals;
  } catch {
    return initialAppeals;
  }
}
export function saveAppeals(appeals) {
  try {
    localStorage.setItem(APPEALS_KEY, JSON.stringify(appeals));
  } catch {
    throw new Error(
      "Браузер не смог сохранить данные. Возможно, хранилище заполнено или недоступно. Изменения не записаны. Введённые данные остаются на странице.",
    );
  }
}
export function loadSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    return value &&
      typeof value.name === "string" &&
      typeof value.role === "string"
      ? value
      : null;
  } catch {
    return null;
  }
}
export function saveSession(value) {
  if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  else sessionStorage.removeItem(SESSION_KEY);
}
