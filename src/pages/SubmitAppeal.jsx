import React, { useEffect, useRef, useState, useId } from "react";
import { Button, Eyebrow, Mark } from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
import SubmissionSuccess from "../components/forms/SubmissionSuccess";
import { validateCitizen } from "../services/appealService";
import { compressImage } from "../services/imageService";
import { reducedMotion } from "../config/motion";

const labels = [
  "Гражданин",
  "Подтверждение",
  "Тип обращения",
  "Суть обращения",
  "Проверка",
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
  appeals,
  onSubmit,
  navigate,
  toast,
  onDirtyChange,
}) {
  const [step, setStep] = useState(0),
    [form, setForm] = useState(initial),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(null),
    [drag, setDrag] = useState(false),
    [copied, setCopied] = useState("");
  const [processingFile, setProcessingFile] = useState(false);
  const input = useRef(null);
  const formMain = useRef(null);
  useEffect(() => {
    const hasDraft =
      step < 5 &&
      Object.values(form).some((value) =>
        typeof value === "string" ? Boolean(value.trim()) : Boolean(value),
      );
    onDirtyChange?.(hasDraft);
    const handler = (e) => {
      if (hasDraft) {
        e.preventDefault();
        e.returnValue = "У вас есть незавершённое обращение.";
      }
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
  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(4, s + 1));
    requestAnimationFrame(() => scrollFormIntoView());
  };
  const back = () => {
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
    requestAnimationFrame(() => scrollFormIntoView());
  };
  const scrollFormIntoView = () => {
    const target = formMain.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const headerGap = window.innerWidth <= 800 ? 98 : 116;
    if (rect.top >= headerGap && rect.top < window.innerHeight * 0.42) return;
    window.scrollTo({
      top: Math.max(0, window.scrollY + rect.top - headerGap),
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  };
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
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
  const copy = async (val, key) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
      toast?.("Скопировано в буфер обмена");
    } catch {
      toast?.("Выделите текст и скопируйте вручную", "error");
    }
  };
  return (
    <div
      className={`page submit-page ${step === 5 ? "submission-complete" : ""}`}
    >
      {step < 5 && (
        <section className="submit-top">
          <div className="page-hero-meta">
            <Eyebrow number="03">ЭЛЕКТРОННАЯ ПРИЁМНАЯ</Eyebrow>
            <span>ПАТРИАРШИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ</span>
          </div>
          <h1 className="display-title">
            ПОДАТЬ
            <br />
            <span>ОБРАЩЕНИЕ</span>
          </h1>
          <p>
            Расскажите, что произошло. Мы внимательно рассмотрим обращение и
            сообщим о результате.
          </p>
          <div className="submit-side-note">
            <Icon name="shield" size={19} />
            <span>
              ДАННЫЕ ИСПОЛЬЗУЮТСЯ
              <br />
              ТОЛЬКО ДЛЯ РАССМОТРЕНИЯ
            </span>
          </div>
        </section>
      )}
      {step < 5 ? (
        <section className="form-section">
          <div className="form-sidebar">
            <span className="tiny-label">НОВОЕ ОБРАЩЕНИЕ</span>
            <div className="form-progress">
              <span style={{ "--progress": `${((step + 1) / 5) * 100}%` }} />
            </div>
            <div className="form-steps">
              {labels.map((label, i) => (
                <button
                  key={label}
                  className={`${i === step ? "current" : ""} ${i < step ? "done" : ""}`}
                  onClick={() => {
                    if (i < step) setStep(i);
                  }}
                  disabled={i > step}
                >
                  <span>
                    {i < step ? <Icon name="check" size={13} /> : `0${i + 1}`}
                  </span>
                  {label}
                </button>
              ))}
            </div>
            <div className="form-help">
              <span className="tiny-label">ОБЫЧНО ЗАНИМАЕТ</span>
              <b>4–6 минут</b>
              <span>Все поля обязательны, кроме отмеченных отдельно.</span>
            </div>
          </div>
          <div
            className="form-main"
            key={step}
            ref={formMain}
            aria-live="polite"
          >
            <div className="form-step-head">
              <span className="step-kicker">ШАГ 0{step + 1} / 05</span>
              <span className="step-underline" />
              <span className="step-kicker">{labels[step].toUpperCase()}</span>
            </div>
            {step === 0 && (
              <>
                <h2>
                  Сведения
                  <br />
                  <em>о гражданине</em>
                </h2>
                <p className="form-instruction">
                  Укажите данные для регистрации и обратной связи.
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
                <div className="privacy-note">
                  <Icon name="lock" size={17} />
                  <span>
                    Контактные сведения не отображаются в публичной карточке
                    обращения.
                  </span>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h2>
                  Подтверждение
                  <br />
                  <em>принадлежности</em>
                </h2>
                <p className="form-instruction">
                  Загрузите необрезанный скриншот игрового паспорта.
                </p>
                <div
                  className={`upload-zone ${drag ? "dragging" : ""} ${errors.file ? "upload-error" : ""}`}
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
                  tabIndex="0"
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
                      <img
                        src={form.fileData}
                        alt="Предварительный просмотр прикреплённого изображения"
                      />
                      <div className="preview-overlay">
                        <span>{form.fileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            input.current?.click();
                          }}
                        >
                          ЗАМЕНИТЬ ФАЙЛ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="upload-icon">
                        <Icon name="upload" size={23} />
                      </span>
                      <strong>
                        {processingFile
                          ? "Подготавливаем изображение…"
                          : "Перетащите изображение сюда"}
                      </strong>
                      <span>или выберите файл на устройстве</span>
                      <small>JPG, PNG, WEBP · ДО 12 МБ</small>
                    </>
                  )}
                </div>
                {errors.file && <FieldError>{errors.file}</FieldError>}
                <div className="upload-explain">
                  <span>!</span>
                  <p>
                    Скриншот используется для подтверждения принадлежности
                    гражданина к Патриаршему федеральному округу. Убедитесь, что
                    изображение целое и читаемое.
                  </p>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2>
                  Тип
                  <br />
                  <em>обращения</em>
                </h2>
                <p className="form-instruction">
                  Выберите, с чем вы обращаетесь в Министерство.
                </p>
                <div className="type-choices">
                  {[
                    ["Жалоба", "Сообщить о проблеме или нарушении", "01"],
                    ["Предложение", "Поделиться идеей или инициативой", "02"],
                  ].map(([type, desc, n]) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => set("type", type)}
                      aria-pressed={form.type === type}
                      className={`type-choice ${form.type === type ? "selected" : ""}`}
                    >
                      <span className="type-choice-no">{n}</span>
                      <span>
                        <strong>{type}</strong>
                        <small>{desc}</small>
                      </span>
                      <span className="choice-radio">
                        <i />
                      </span>
                    </button>
                  ))}
                </div>
                {errors.type && <FieldError>{errors.type}</FieldError>}
                <div className="type-footnote">
                  <span>ВАЖНО</span> Выбор категории помогает направить
                  обращение в профильное подразделение.
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2>
                  Суть
                  <br />
                  <em>обращения</em>
                </h2>
                <p className="form-instruction">
                  Опишите ситуацию, вопрос или предложение максимально
                  конкретно.
                </p>
                <label
                  className={`textarea-wrap ${errors.text ? "has-error" : ""}`}
                >
                  <span>ТЕКСТ ОБРАЩЕНИЯ</span>
                  <textarea
                    value={form.text}
                    onChange={(e) => set("text", e.target.value.slice(0, 3000))}
                    placeholder="Что произошло? Когда и где? Какого результата вы ожидаете?"
                    rows={8}
                  />
                  <div className="textarea-meta">
                    <span className={form.text.length >= 20 ? "is-ready" : ""}>
                      {form.text.length < 20
                        ? "Добавьте подробности"
                        : "Текст можно отправлять"}
                    </span>
                    <span>{form.text.length} / 3000</span>
                  </div>
                </label>
                {errors.text && <FieldError>{errors.text}</FieldError>}
                <div className="privacy-note">
                  <Icon name="shield" size={17} />
                  <span>
                    Не указывайте в тексте пароли и данные банковских карт.
                  </span>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2>
                  Проверьте
                  <br />
                  <em>данные</em>
                </h2>
                <p className="form-instruction">
                  Убедитесь, что всё верно. После отправки обращение получит
                  регистрационный номер.
                </p>
                <div className="summary-sheet">
                  <SummaryRow label="ГРАЖДАНИН" value={form.name} />
                  <SummaryRow
                    label="ТЕЛЕФОН / ПОЧТА"
                    value={
                      <>
                        {form.phone}
                        <br />
                        {form.email}
                      </>
                    }
                  />
                  <SummaryRow
                    label="ТИП ОБРАЩЕНИЯ"
                    value={<span className="summary-type">{form.type}</span>}
                  />
                  <SummaryRow
                    label="ПРИЛОЖЕНИЕ"
                    value={
                      <span className="summary-file">
                        <Icon name="check" size={15} />
                        {form.fileName}
                      </span>
                    }
                  />
                  <SummaryRow
                    label="СУТЬ ОБРАЩЕНИЯ"
                    value={<span className="summary-text">{form.text}</span>}
                  />
                </div>
                <div className="demo-warning">
                  <span>ДЕМО-РЕЖИМ</span> Данные сохраняются только в этом
                  браузере и не передаются ведомству.
                </div>
              </>
            )}
            <div className="form-actions">
              {step > 0 && (
                <button className="back-button" onClick={back}>
                  <Icon name="back" size={17} /> НАЗАД
                </button>
              )}
              <span className="form-actions-spacer" />
              {step < 4 ? (
                <Button onClick={next} disabled={processingFile}>
                  Продолжить
                </Button>
              ) : (
                <Button
                  onClick={submit}
                  disabled={busy}
                  icon={busy ? null : "arrow"}
                >
                  {busy ? "Регистрируем…" : "Отправить обращение"}
                </Button>
              )}
            </div>
          </div>
        </section>
      ) : (
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
      )}
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
function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <div>{value}</div>
    </div>
  );
}
