import test from "node:test";
import assert from "node:assert/strict";
import {
  createAppealRecord,
  transitionAppeal,
  publicAppeal,
  lookupAppeal,
  validateCitizen,
  isAppeal,
  addInternalNote,
} from "../src/services/appealService.js";
import { loadAppeals, saveAppeals, APPEALS_KEY } from "../src/utils/storage.js";
import { initialAppeals } from "../src/data/appeals.js";
const citizen = {
  name: "Тестов Тест Тестович",
  phone: "+7 (999) 000-00-00",
  email: "test@example.local",
  type: "Предложение",
  text: "Предлагаю улучшить доступность районного центра поддержки.",
  fileName: "demo.png",
  fileData: "data:image/png;base64,AAAA",
};
const date = new Date("2026-09-24T10:00:00Z");
const create = () => createAppealRecord(citizen, initialAppeals, date);

test("registration creates a unique reference, six-digit code and initial journal", () => {
  const appeal = create();
  assert.equal(appeal.id, "МСПТ-ПФО-2026-0144");
  assert.match(appeal.accessCode, /^\d{6}$/);
  assert.equal(appeal.status, "NEW");
  assert.equal(appeal.timeline.length, 1);
  assert.equal(
    createAppealRecord(citizen, [...initialAppeals, appeal], date).id,
    "МСПТ-ПФО-2026-0145",
  );
  assert.equal(isAppeal(appeal), true);
});
test("acceptance does not start production; full workflow records every step", () => {
  let appeal = transitionAppeal(create(), "ACCEPTED", "Сотрудник");
  assert.equal(appeal.status, "ACCEPTED");
  assert.equal(appeal.assignee, "");
  appeal = transitionAppeal(appeal, "IN_PROGRESS", "Сотрудник");
  assert.equal(appeal.assignee, "Сотрудник");
  assert.equal(appeal.timeline.at(-1).public, false);
  appeal = transitionAppeal(appeal, "DECISION", "Сотрудник", {
    verdict: "Решение принято.",
  });
  appeal = transitionAppeal(appeal, "ANSWERED", "Сотрудник", {
    answer: "Официальный ответ.",
  });
  appeal = transitionAppeal(appeal, "CLOSED", "Сотрудник");
  assert.equal(appeal.timeline.length, 7);
  assert.equal(appeal.status, "CLOSED");
  assert.throws(() => transitionAppeal(appeal, "NEW", "Сотрудник"));
});
test("invalid jumps and blank decisions are rejected", () => {
  assert.throws(() => transitionAppeal(create(), "IN_PROGRESS", "Сотрудник"));
  const progress = transitionAppeal(
    transitionAppeal(create(), "ACCEPTED", "Сотрудник"),
    "IN_PROGRESS",
    "Сотрудник",
  );
  assert.throws(() =>
    transitionAppeal(progress, "ANSWERED", "Сотрудник", { answer: "Ответ" }),
  );
  assert.throws(() =>
    transitionAppeal(progress, "DECISION", "Сотрудник", { verdict: "   " }),
  );
});
test("rejection requires a reason and exposes it to the citizen", () => {
  assert.throws(() => transitionAppeal(create(), "REJECTED", "Сотрудник"));
  const rejected = transitionAppeal(create(), "REJECTED", "Сотрудник", {
    rejectionReason: "Изображение нечитаемо.",
  });
  assert.equal(
    publicAppeal(rejected).rejectionReason,
    "Изображение нечитаемо.",
  );
});
test("public projection never returns contacts, passport, code, assignee or internal notes", () => {
  const appeal = addInternalNote(create(), "Служебная заметка", "Сотрудник");
  const result = publicAppeal(appeal);
  for (const key of [
    "accessCode",
    "citizen",
    "phone",
    "email",
    "attachmentPreview",
    "attachmentName",
    "assignee",
  ])
    assert.equal(key in result, false);
  assert.equal(result.timeline.length, 1);
  assert.equal("actor" in result.timeline[0], false);
  assert.equal(JSON.stringify(result).includes("Служебная заметка"), false);
});
test("lookup needs both reference and correct code", () => {
  const appeal = create();
  assert.equal(lookupAppeal([appeal], appeal.id, "000000"), null);
  assert.equal(lookupAppeal([appeal], "not-found", appeal.accessCode), null);
  assert.equal(
    lookupAppeal([appeal], ` ${appeal.id.toLowerCase()} `, appeal.accessCode)
      .id,
    appeal.id,
  );
});
test("validation rejects spaces-only telephone and incomplete form", () => {
  assert.ok(validateCitizen({ ...citizen, phone: "(         )" }).phone);
  assert.ok(validateCitizen({ ...citizen, email: "test@@local.ru" }).email);
  assert.ok(validateCitizen({ ...citizen, name: "Тест" }).name);
  assert.throws(() =>
    createAppealRecord({ ...citizen, fileData: "" }, [], date),
  );
  assert.throws(() =>
    createAppealRecord({ ...citizen, text: "Коротко" }, [], date),
  );
});
test("persistent store round-trips, recovers malformed data and reports quota errors", () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  };
  const records = [create()];
  saveAppeals(records);
  assert.deepEqual(loadAppeals(), records);
  store.set(APPEALS_KEY, "{bad json");
  assert.deepEqual(loadAppeals(), initialAppeals);
  store.set(APPEALS_KEY, '{"not":"an array"}');
  assert.deepEqual(loadAppeals(), initialAppeals);
  globalThis.localStorage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  assert.throws(() => saveAppeals(records), /Браузер не смог сохранить/);
});
