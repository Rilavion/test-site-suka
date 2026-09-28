import { STATUS } from "../data/appeals.js";

// Pure domain rules: the UI and future API adapters use the same contract.
const transitions = {
  NEW: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["DECISION"],
  DECISION: ["ANSWERED"],
  ANSWERED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};
const eventText = {
  ACCEPTED: "Обращение прошло первичную проверку",
  REJECTED: "Обращение отклонено после первичной проверки",
  IN_PROGRESS: "Обращение принято в производство",
  DECISION: "По обращению вынесено решение",
  ANSWERED: "Официальный ответ опубликован в карточке обращения",
  CLOSED: "Обращение закрыто",
};

export function validateCitizen(form) {
  const errors = {};
  if (form.name.trim().split(/\s+/).length < 2 || form.name.trim().length > 180)
    errors.name =
      "Укажите имя и фамилию, а также отчество при наличии (до 180 символов)";
  const digits = form.phone.replace(/\D/g, "");
  if (
    !/^\+?[\d\s()\-]+$/.test(form.phone.trim()) ||
    digits.length < 10 ||
    digits.length > 15
  )
    errors.phone = "Номер должен содержать от 10 до 15 цифр";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ||
    form.email.length > 254
  )
    errors.email = "Укажите корректный адрес почты";
  return errors;
}

export function createAppealRecord(form, existing, date = new Date()) {
  if (Object.keys(validateCitizen(form)).length)
    throw new Error("Проверьте сведения о гражданине");
  if (!["Жалоба", "Предложение"].includes(form.type))
    throw new Error("Выберите тип обращения");
  if (form.text.trim().length < 20 || form.text.trim().length > 3000)
    throw new Error("Текст должен содержать от 20 до 3000 символов");
  if (!form.fileData?.startsWith("data:image/"))
    throw new Error("Приложите изображение игрового паспорта");
  const year = date.getFullYear();
  const sequence =
    Math.max(
      143,
      ...existing
        .filter((a) => a.id.startsWith(`МСПТ-ПФО-${year}-`))
        .map((a) => Number(a.id.split("-").at(-1)) || 0),
    ) + 1;
  const accessCode = String(
    100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000),
  );
  const at = date.toISOString();
  return {
    id: `МСПТ-ПФО-${year}-${String(sequence).padStart(4, "0")}`,
    accessCode,
    citizen: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    type: form.type,
    text: form.text.trim(),
    status: "NEW",
    date: at,
    attachmentName: form.fileName,
    attachmentPreview: form.fileData,
    assignee: "",
    verdict: "",
    answer: "",
    timeline: [
      {
        text: "Обращение зарегистрировано",
        at,
        actor: "Система",
        public: true,
      },
    ],
  };
}

export function transitionAppeal(
  appeal,
  status,
  actor,
  fields = {},
  at = new Date().toISOString(),
) {
  if (!transitions[appeal.status]?.includes(status))
    throw new Error("Это действие недоступно на текущем этапе");
  if (!actor) throw new Error("Не указан сотрудник");
  if (status === "DECISION" && !fields.verdict?.trim())
    throw new Error("Добавьте текст решения");
  if (status === "ANSWERED" && !fields.answer?.trim())
    throw new Error("Добавьте ответ гражданину");
  if (status === "REJECTED" && !fields.rejectionReason?.trim())
    throw new Error("Укажите причину отклонения");
  const next = {
    ...appeal,
    status,
    timeline: [
      ...appeal.timeline,
      { text: eventText[status], at, actor, public: true },
    ],
  };
  if (status === "IN_PROGRESS") {
    next.assignee = actor;
    next.timeline.push({
      text: `Назначен исполнитель: ${actor}`,
      at,
      actor,
      public: false,
    });
  }
  if (status === "DECISION") next.verdict = fields.verdict.trim();
  if (status === "ANSWERED") next.answer = fields.answer.trim();
  if (status === "REJECTED")
    next.rejectionReason = fields.rejectionReason.trim();
  return next;
}

export function addInternalNote(appeal, text, actor) {
  if (!text.trim()) throw new Error("Введите служебную заметку");
  return {
    ...appeal,
    timeline: [
      ...appeal.timeline,
      { text: text.trim(), actor, at: new Date().toISOString(), public: false },
    ],
  };
}

// Explicit allowlist: no contact details, screenshot, actor or internal notes.
export function publicAppeal(appeal) {
  const { id, type, date, status, verdict, answer, rejectionReason } = appeal;
  return {
    id,
    type,
    date,
    status,
    verdict: ["DECISION", "ANSWERED", "CLOSED"].includes(status) ? verdict : "",
    answer: ["ANSWERED", "CLOSED"].includes(status) ? answer : "",
    rejectionReason,
    timeline: appeal.timeline
      .filter((e) => e.public === true)
      .map(({ text, at }) => ({ text, at })),
  };
}
export function lookupAppeal(appeals, id, code) {
  const found = appeals.find(
    (a) =>
      a.id.toUpperCase() === id.trim().toUpperCase() &&
      a.accessCode === code.trim(),
  );
  return found ? publicAppeal(found) : null;
}
export function isAppeal(value) {
  return (
    value &&
    typeof value.id === "string" &&
    typeof value.accessCode === "string" &&
    typeof value.citizen === "string" &&
    typeof value.text === "string" &&
    typeof value.date === "string" &&
    !Number.isNaN(Date.parse(value.date)) &&
    typeof value.phone === "string" &&
    typeof value.email === "string" &&
    typeof value.type === "string" &&
    value.status in STATUS &&
    Array.isArray(value.timeline) &&
    value.timeline.every(
      (e) => e && typeof e.text === "string" && !Number.isNaN(Date.parse(e.at)),
    )
  );
}
