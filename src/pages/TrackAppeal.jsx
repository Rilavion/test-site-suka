import React, { useEffect, useState } from "react";
import PageIntro from "../components/PageIntro";
import Icon from "../components/ui/Icon";
import { Button, StatusPill, useReveal } from "../components/ui/Primitives";
import { formatDate, formatStamp } from "../utils/format";
import { lookupAppeal, publicAppeal } from "../services/appealService";

const STAGES = ["Регистрация", "Проверка", "Рассмотрение", "Решение", "Ответ"];

const publicStage = {
  NEW: 0,
  ACCEPTED: 1,
  IN_PROGRESS: 2,
  DECISION: 3,
  ANSWERED: 4,
  CLOSED: 4,
  REJECTED: 1,
};

export default function TrackAppeal({ appeals, routeData }) {
  const [id, setId] = useState(routeData?.id || "");
  const [code, setCode] = useState(routeData?.code || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  useReveal("track");

  useEffect(() => {
    if (routeData?.id && routeData?.code) lookup(routeData.id, routeData.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeData?.id, routeData?.code]);

  useEffect(() => {
    setResult((previous) => {
      if (!previous) return null;
      const updated = appeals.find((a) => a.id === previous.id);
      return updated ? publicAppeal(updated) : null;
    });
  }, [appeals]);

  function lookup(nextId = id, nextCode = code) {
    if (!String(nextId).trim() || !String(nextCode).trim()) {
      setResult(null);
      setError("Введите номер обращения и код доступа.");
      return;
    }
    const found = lookupAppeal(
      appeals,
      String(nextId).trim().toUpperCase(),
      nextCode,
    );
    if (!found) {
      setResult(null);
      setError("Не удалось найти обращение. Проверьте номер и код доступа.");
      return;
    }
    setError("");
    setResult(found);
  }

  return (
    <div className="page">
      <PageIntro
        kicker="Ход рассмотрения"
        title={["Статус обращения"]}
        lead="Введите регистрационный номер и личный код доступа. Информация доступна только заявителю."
      />

      <section className="section track-section">
        <div className="shell track-grid">
          {/* — форма поиска — */}
          <aside className="track-form" data-reveal="left">
            <div className="track-form-inner">
              <span className="tiny-label">Поиск обращения</span>
              <label className="field">
                <span>Номер обращения</span>
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookup()}
                  placeholder="МСПТ-ПФО-2026-0143"
                  autoComplete="off"
                />
              </label>
              <label className="field">
                <span>Код доступа</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookup()}
                  placeholder="6 цифр"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="off"
                />
              </label>

              {error && (
                <div className="inline-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <Button
                icon="search"
                className="btn-block"
                onClick={() => lookup()}
              >
                Найти обращение
              </Button>

              <div className="note">
                <Icon name="lock" size={17} />
                Данные открываются только по индивидуальному коду, выданному при
                регистрации обращения.
              </div>

              <button
                className="demo-fill"
                onClick={() => {
                  setId("МСПТ-ПФО-2026-0143");
                  setCode("739184");
                  lookup("МСПТ-ПФО-2026-0143", "739184");
                }}
              >
                <span className="tiny-label">Демонстрационная пара</span>
                <b>МСПТ-ПФО-2026-0143 · 739184</b>
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </aside>

          {/* — результат — */}
          <div className="track-result" data-reveal="right">
            {result ? (
              <ResultCard appeal={result} />
            ) : (
              <div className="track-placeholder">
                <span className="placeholder-icon">
                  <Icon name="doc" size={24} />
                </span>
                <h2 className="h-lg">Здесь появится история обращения</h2>
                <p className="body-text">
                  После проверки кода доступа откроются этапы рассмотрения,
                  записи журнала и официальный ответ Министерства.
                </p>
                <ol className="placeholder-stages">
                  {STAGES.map((stage, i) => (
                    <li key={stage}>
                      <i>{String(i + 1).padStart(2, "0")}</i>
                      {stage}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        <div className="shell">
          <div className="note note-accent track-privacy">
            <Icon name="shield" size={18} />
            <span>
              <b>Конфиденциальность.</b> На этой странице отображаются только
              статус и публичные события. Служебные заметки и вложения доступны
              исключительно уполномоченным сотрудникам Министерства.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResultCard({ appeal }) {
  const timeline = (appeal.timeline || [])
    .filter((e) => e.public !== false)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  const stage = publicStage[appeal.status] ?? 0;
  const rejected = appeal.status === "REJECTED";
  const answer = rejected
    ? appeal.rejectionReason ||
      "Обращение не прошло первичную проверку. Для уточнения требований обратитесь на горячую линию."
    : (appeal.status === "ANSWERED" || appeal.status === "CLOSED") &&
        appeal.answer
      ? appeal.answer
      : appeal.status === "DECISION" && appeal.verdict
        ? appeal.verdict
        : "";
  const answerTitle = rejected
    ? "Результат первичной проверки"
    : appeal.status === "DECISION"
      ? "Решение Министерства"
      : "Официальный ответ Министерства";

  return (
    <article className="case">
      <header className="case-head">
        <div>
          <span className="tiny-label">Карточка обращения</span>
          <h2 className="case-id">{appeal.id}</h2>
        </div>
        <StatusPill status={appeal.status} />
      </header>

      <dl className="case-meta">
        <div>
          <dt>Тип</dt>
          <dd>{appeal.type}</dd>
        </div>
        <div>
          <dt>Дата регистрации</dt>
          <dd>{formatDate(appeal.date)}</dd>
        </div>
        <div>
          <dt>Последнее обновление</dt>
          <dd>
            {timeline.length
              ? formatDate(timeline[timeline.length - 1].at)
              : formatDate(appeal.date)}
          </dd>
        </div>
      </dl>

      <section className="case-progress">
        <span className="tiny-label">Путь обращения</span>
        <ol
          className={`progress-track ${rejected ? "is-stopped" : ""}`}
          style={{ "--stage": stage }}
        >
          {STAGES.map((label, i) => (
            <li
              key={label}
              className={`${i <= stage ? "is-passed" : ""} ${i === stage ? "is-current" : ""}`}
            >
              <i>{i < stage ? <Icon name="check" size={12} /> : i + 1}</i>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-timeline">
        <span className="tiny-label">История рассмотрения</span>
        {timeline.length ? (
          <ol>
            {timeline.map((event, i) => (
              <li key={`${event.at}-${i}`}>
                <span className="timeline-dot" />
                <time>{formatStamp(event.at)}</time>
                <p>{event.text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">История пока не сформирована.</p>
        )}
      </section>

      {answer && (
        <section className={`case-answer ${rejected ? "is-rejected" : ""}`}>
          <span className="tiny-label">{answerTitle}</span>
          <p>{answer}</p>
          {!rejected && appeal.verdict && appeal.answer && (
            <small>Решение: {appeal.verdict}</small>
          )}
        </section>
      )}

      <footer className="case-foot">
        <Icon name="clock" size={15} />
        Статус обновляется по мере прохождения этапов рассмотрения.
      </footer>
    </article>
  );
}
