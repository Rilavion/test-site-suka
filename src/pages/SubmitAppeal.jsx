import React, { useEffect, useId, useRef, useState } from "react";
import PageIntro from "../components/PageIntro";
import Icon from "../components/ui/Icon";
import { Button, useReveal } from "../components/ui/Primitives";
import SubmissionSuccess from "../components/forms/SubmissionSuccess";
import { validateCitizen } from "../services/appealService";
import { compressImage } from "../services/imageService";
import { reducedMotion } from "../config/motion";
import { siteConfig } from "../config/site";

const STEPS = [
  { label: "Гражданин", hint: "Кому отвечать" },
  { label: "Подтверждение", hint: "Скриншот паспорта" },
  { label: "Тип обращения", hint: "Жалоба или идея" },
  { label: "Суть", hint: "Что произошло" },
  { label: "Проверка", hint: "Всё ли верно" },
];

const initial = {
  name: "",
  phone: "",
  email: "",
  type: "",
  text: "",
  file: null,
  fileName: "",
  fileData: "",
};

export default function SubmitAppeal({
  onSubmit,
  navigate,
  toast,
  onDirtyChange,
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(null);
  const [drag, setDrag] = useState(false);
  const [copied, setCopied] = useState("");
  const [processingFile, setProcessingFile] = useState(false);
  const input = useRef(null);
  const panel = useRef(null);
  useReveal("submit");

  useEffect(() => {
    const hasDraft =
      step < 5 &&
      Object.values(form).some((value) =>
        typeof value === "string" ? Boolean(value.trim()) : Boolean(value),
      );
    onDirtyChange?.(hasDraft);
    const handler = (e) => {
      if (!hasDraft) return;
      e.preventDefault();
      e.returnValue = "У вас есть незавершённое обращение.";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [form, step, onDirtyChange]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const pick = async (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setErrors((e) => ({
        ...e,
        file: "Поддерживаются форматы JPG, PNG или WEBP.",
      }));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErrors((e) => ({
        ...e,
        file: "Размер файла не должен превышать 12 МБ.",
      }));
      return;
    }
    setProcessingFile(true);
    try {
      const data = await compressImage(file);
      setForm((f) => ({ ...f, file, fileName: file.name, fileData: data }));
      setErrors((e) => ({ ...e, file: "" }));
    } catch {
      setErrors((e) => ({
        ...e,
        file: "Не удалось прочитать файл. Попробуйте другое изображение.",
      }));
    } finally {
      setProcessingFile(false);
    }
  };

  const validate = () => {
    let e = {};
    if (step === 0) e = validateCitizen(form);
    if (step === 1 && !form.file)
      e.file = "Добавьте необрезанный скриншот игрового паспорта";
    if (step === 2 && !form.type) e.type = "Выберите тип обращения";
    if (step === 3 && form.text.trim().length < 20)
      e.text = "Опишите ситуацию подробнее (не менее 20 символов)";
    setErrors(e);
    return !Object.keys(e).length;
  };

  /** Мягкая подводка: страница не «прыгает» вверх, а лишь подтягивает
   *  карточку шага, если она ушла из зоны видимости под шапкой. */
  const keepStepInView = () => {
    const node = panel.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const headerGap =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h",
        ),
        10,
      ) || 74;
    const safeTop = headerGap + 16;
    if (rect.top >= safeTop && rect.top < window.innerHeight * 0.5) return;
    window.scrollTo({
      top: Math.max(0, window.scrollY + rect.top - safeTop),
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  };

  const goTo = (next) => {
    setStep(next);
    setErrors({});
    requestAnimationFrame(keepStepInView);
  };

  const next = () => {
    if (!validate()) return;
    goTo(Math.min(4, step + 1));
  };

  const back = () => goTo(Math.max(0, step - 1));

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 420));
    try {
      const appeal = onSubmit(form);
      setSuccess(appeal);
      setStep(5);
      onDirtyChange?.(false);
      window.scrollTo({
        top: 0,
        behavior: reducedMotion() ? "instant" : "smooth",
      });
    } catch (error) {
      toast?.(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
      toast?.("Скопировано в буфер обмена");
    } catch {
      toast?.("Выделите текст и скопируйте вручную", "error");
    }
  };

  if (step === 5) {
    return (
      <div className="page">
        <SubmissionSuccess
          success={success}
          copied={copied}
          copy={copy}
          navigate={navigate}
          onNew={() => {
            setForm(initial);
            setStep(0);
            setSuccess(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <PageIntro
        kicker="Электронная приёмная"
        title={["Подать обращение"]}
        lead="Расскажите, что произошло. Министерство рассмотрит обращение и сообщит о результате в карточке дела."
      >
        <div className="intro-meta">
          <span>
            <Icon name="clock" size={15} /> 4–6 минут
          </span>
          <span>
            <Icon name="shield" size={15} /> Контакты не публикуются
          </span>
          <span>
            <Icon name="doc" size={15} /> Ответ до {siteConfig.reviewDays}
          </span>
        </div>
      </PageIntro>

      <section className="section form-section">
        <div className="shell form-grid">
          {/* — шаги — */}
          <aside className="form-steps" aria-label="Шаги заполнения">
            <div className="form-steps-inner">
              <div className="form-progress">
                <i style={{ "--progress": `${((step + 1) / 5) * 100}%` }} />
              </div>
              <ol>
                {STEPS.map((item, i) => (
                  <li key={item.label}>
                    <button
                      className={`step ${i === step ? "is-current" : ""} ${i < step ? "is-done" : ""}`}
                      onClick={() => i < step && goTo(i)}
                      disabled={i > step}
                      aria-current={i === step ? "step" : undefined}
                    >
                      <span className="step-mark">
                        {i < step ? <Icon name="check" size={12} /> : i + 1}
                      </span>
                      <span className="step-copy">
                        <strong>{item.label}</strong>
                        <small>{item.hint}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* — содержимое шага — */}
          <div className="form-panel" ref={panel}>
            <div className="form-panel-head">
              <span className="tiny-label">
                Шаг {step + 1} из 5 · {STEPS[step].label}
              </span>
            </div>

            <div className="form-panel-body" key={step}>
              {step === 0 && (
                <>
                  <h2 className="h-lg">Сведения о гражданине</h2>
                  <p className="body-text">
                    Укажите данные для регистрации обращения и обратной связи.
                  </p>
                  <div className="field-grid">
                    <Field
                      label="Фамилия, имя, отчество"
                      value={form.name}
                      onChange={(v) => set("name", v)}
                      error={errors.name}
                      placeholder="Иванов Иван Иванович"
                    />
                    <Field
                      label="Контактный номер телефона"
                      value={form.phone}
                      onChange={(v) => set("phone", v)}
                      error={errors.phone}
                      placeholder="+7 (900) 000-00-00"
                      type="tel"
                    />
                    <Field
                      label="Электронная почта"
                      value={form.email}
                      onChange={(v) => set("email", v)}
                      error={errors.email}
                      placeholder="name@example.ru"
                      type="email"
                    />
                  </div>
                  <div className="note">
                    <Icon name="lock" size={17} />
                    Контактные сведения не отображаются в публичной карточке
                    обращения — их видит только сотрудник Министерства.
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="h-lg">Подтверждение принадлежности</h2>
                  <p className="body-text">
                    Загрузите необрезанный скриншот игрового паспорта. Он
                    подтверждает, что вы житель Патриаршего федерального округа.
                  </p>
                  <div
                    className={`upload ${drag ? "is-dragging" : ""} ${errors.file ? "has-error" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      pick(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => input.current?.click()}
                    role="button"
                    aria-label="Загрузить скриншот игрового паспорта"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (
                        e.target === e.currentTarget &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        input.current?.click();
                      }
                    }}
                  >
                    <input
                      ref={input}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={(e) => {
                        pick(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                    {form.fileData ? (
                      <div className="upload-preview">
                        <img src={form.fileData} alt="Предпросмотр вложения" />
                        <div className="upload-preview-bar">
                          <span>{form.fileName}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              input.current?.click();
                            }}
                          >
                            Заменить файл
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="upload-icon">
                          <Icon name="upload" size={24} />
                        </span>
                        <strong>
                          {processingFile
                            ? "Подготавливаем изображение…"
                            : "Перетащите изображение сюда"}
                        </strong>
                        <span className="muted">
                          или выберите файл на устройстве
                        </span>
                        <small className="tiny-label">
                          JPG, PNG, WEBP · до 12 МБ
                        </small>
                      </>
                    )}
                  </div>
                  {errors.file && <FieldError>{errors.file}</FieldError>}
                  <div className="note">
                    <Icon name="shield" size={17} />
                    Убедитесь, что изображение целое и читаемое: обрезанные
                    скриншоты не проходят первичную проверку.
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="h-lg">Тип обращения</h2>
                  <p className="body-text">
                    Выберите, с чем вы обращаетесь. Это помогает направить дело
                    в профильное подразделение.
                  </p>
                  <div className="choice-grid">
                    {[
                      [
                        "Жалоба",
                        "Сообщить о проблеме, нарушении или бездействии",
                        "scale",
                      ],
                      [
                        "Предложение",
                        "Поделиться идеей или инициативой для округа",
                        "heart",
                      ],
                    ].map(([type, desc, icon]) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => set("type", type)}
                        aria-pressed={form.type === type}
                        className={`choice ${form.type === type ? "is-selected" : ""}`}
                      >
                        <span className="choice-icon">
                          <Icon name={icon} size={20} />
                        </span>
                        <strong>{type}</strong>
                        <small>{desc}</small>
                        <span className="choice-radio" aria-hidden="true">
                          <i />
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.type && <FieldError>{errors.type}</FieldError>}
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="h-lg">Суть обращения</h2>
                  <p className="body-text">
                    Опишите ситуацию конкретно: что произошло, когда и где,
                    какого результата вы ожидаете.
                  </p>
                  <label className={`field ${errors.text ? "has-error" : ""}`}>
                    <span>Текст обращения</span>
                    <textarea
                      value={form.text}
                      onChange={(e) =>
                        set("text", e.target.value.slice(0, 3000))
                      }
                      placeholder="Что произошло? Когда и где? Какого результата вы ожидаете?"
                      rows={9}
                    />
                  </label>
                  <div className="textarea-meta">
                    <span className={form.text.length >= 20 ? "is-ready" : ""}>
                      {form.text.length < 20
                        ? "Добавьте подробности — минимум 20 символов"
                        : "Текст можно отправлять"}
                    </span>
                    <span>{form.text.length} / 3000</span>
                  </div>
                  {errors.text && <FieldError>{errors.text}</FieldError>}
                  <div className="note">
                    <Icon name="shield" size={17} />
                    Не указывайте в тексте пароли и данные банковских карт.
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="h-lg">Проверьте данные</h2>
                  <p className="body-text">
                    Убедитесь, что всё верно. После отправки обращение получит
                    регистрационный номер и код доступа.
                  </p>
                  <dl className="summary">
                    <div>
                      <dt>Гражданин</dt>
                      <dd>{form.name}</dd>
                    </div>
                    <div>
                      <dt>Телефон и почта</dt>
                      <dd>
                        {form.phone}
                        <br />
                        {form.email}
                      </dd>
                    </div>
                    <div>
                      <dt>Тип обращения</dt>
                      <dd>{form.type}</dd>
                    </div>
                    <div>
                      <dt>Приложение</dt>
                      <dd className="summary-file">
                        <Icon name="check" size={15} />
                        {form.fileName}
                      </dd>
                    </div>
                    <div>
                      <dt>Суть обращения</dt>
                      <dd className="summary-text">{form.text}</dd>
                    </div>
                  </dl>
                  <p className="demo-note">
                    <b>Демо-режим</b>
                    Данные сохраняются только в этом браузере и не передаются
                    реальному ведомству.
                  </p>
                </>
              )}
            </div>

            <div className="form-actions">
              {step > 0 ? (
                <button className="back-link" onClick={back}>
                  <Icon name="back" size={16} /> Назад
                </button>
              ) : (
                <span />
              )}
              {step < 4 ? (
                <Button onClick={next} disabled={processingFile}>
                  Продолжить
                </Button>
              ) : (
                <Button
                  onClick={submit}
                  disabled={busy}
                  icon={busy ? null : "check"}
                >
                  {busy ? "Регистрируем…" : "Отправить обращение"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder, type = "text" }) {
  const id = useId();
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      <input
        aria-label={label}
        aria-describedby={error ? `${id}-error` : undefined}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && (
        <span id={`${id}-error`}>
          <FieldError>{error}</FieldError>
        </span>
      )}
    </label>
  );
}

function FieldError({ children }) {
  return (
    <span className="field-error">
      <i>!</i>
      {children}
    </span>
  );
}
