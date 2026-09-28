import React, { useEffect, useState } from "react";
import {
  Button,
  Eyebrow,
  StatusPill,
  EmptyState,
  Mark,
} from "../components/ui/Primitives";
import { formatDate, formatStamp } from "../utils/format";
import { STATUS } from "../data/appeals";
import Icon from "../components/ui/Icon";
import { lookupAppeal, publicAppeal } from "../services/appealService";
const publicStage = {
  NEW: 0,
  ACCEPTED: 1,
  IN_PROGRESS: 2,
  DECISION: 3,
  ANSWERED: 4,
  CLOSED: 5,
  REJECTED: 1,
};
export default function TrackAppeal({ appeals, routeData, toast }) {
  const [id, setId] = useState(routeData?.id || ""),
    [code, setCode] = useState(routeData?.code || ""),
    [result, setResult] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    if (routeData?.id && routeData?.code) {
      lookup(routeData.id, routeData.code);
    }
  }, [routeData?.id, routeData?.code]);
  useEffect(() => {
    setResult((previous) => {
      if (!previous) return null;
      const updated = appeals.find((a) => a.id === previous.id);
      return updated ? publicAppeal(updated) : null;
    });
  }, [appeals]);
  function lookup(i = id, c = code) {
    const normalized = i.trim().toUpperCase();
    const found = lookupAppeal(appeals, normalized, c);
    if (!i.trim() || !c.trim()) {
      setResult(null);
      setError("Введите номер обращения и код доступа.");
      return;
    }
    if (!found) {
      setResult(null);
      setError("Не удалось найти обращение. Проверьте номер и код доступа.");
      return;
    }
    setError("");
    setResult(found);
  }
  return (
    <div className="page track-page">
      <section className="track-hero">
        <div className="page-hero-meta">
          <Eyebrow number="04">ЛИЧНЫЙ КОД ДОСТУПА</Eyebrow>
          <span>ИНФОРМАЦИЯ ДОСТУПНА ТОЛЬКО ЗАЯВИТЕЛЮ</span>
        </div>
        <h1 className="display-title">
          СТАТУС
          <br />
          <span>ОБРАЩЕНИЯ</span>
        </h1>
        <p>
          Введите регистрационный номер и код доступа, чтобы узнать о ходе
          рассмотрения.
        </p>
        <div className="track-service-mark" aria-hidden="true">
          <Mark light />
          <span>СЕРВИС МСПиТ</span>
          <strong>
            Статус доступен
            <br />
            по личному коду
          </strong>
          <small>Регистрация · рассмотрение · ответ</small>
        </div>
      </section>
      <section className="track-workspace">
        <div className="track-form-card">
          <div className="track-card-top">
            <span className="tiny-label">ПОИСК ОБРАЩЕНИЯ</span>
            <span>ДВА ПОЛЯ</span>
          </div>
          <label className="field">
            <span>НОМЕР ОБРАЩЕНИЯ</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="МСПТ-ПФО-2026-0143"
            />
          </label>
          <label className="field">
            <span>КОД ДОСТУПА</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="6 цифр"
              inputMode="numeric"
              maxLength={6}
            />
          </label>
          {error && (
            <div className="inline-error">
              <span>!</span>
              {error}
            </div>
          )}
          <Button onClick={() => lookup()} icon="search">
            Найти обращение
          </Button>
          <div className="track-secure">
            <Icon name="lock" size={14} />
            Данные доступны по индивидуальному коду
          </div>
          <div className="demo-lookup">
            <span>ДЛЯ ДЕМО-ПРОВЕРКИ</span>
            <button
              onClick={() => {
                setId("МСПТ-ПФО-2026-0143");
                setCode("739184");
                lookup("МСПТ-ПФО-2026-0143", "739184");
              }}
            >
              МСПТ-ПФО-2026-0143 <b>739184</b>
            </button>
          </div>
        </div>
        <div className="track-result-area">
          {result ? (
            <ResultCard appeal={result} />
          ) : (
            <div className="track-placeholder">
              <span className="placeholder-orbit">
                <Icon name="search" size={24} />
              </span>
              <Eyebrow>ИНФОРМАЦИЯ О ДЕЛЕ</Eyebrow>
              <h3>
                ЗДЕСЬ ПОЯВИТСЯ
                <br />
                <em>ИСТОРИЯ ОБРАЩЕНИЯ</em>
              </h3>
              <p>
                После проверки кода доступа отобразятся этапы рассмотрения и
                официальный ответ Министерства.
              </p>
              <span className="placeholder-index">ПФО / СИСТЕМА ОБРАЩЕНИЙ</span>
            </div>
          )}
        </div>
      </section>
      <div className="track-privacy">
        <Icon name="shield" size={18} />
        <p>
          <b>Конфиденциальность.</b> На этой странице отображаются только статус
          и публичные события. Служебные заметки и вложения доступны
          исключительно уполномоченным сотрудникам.
        </p>
      </div>
    </div>
  );
}
function ResultCard({ appeal }) {
  const timeline = (appeal.timeline || [])
    .filter((e) => e.public !== false)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  const stage = publicStage[appeal.status] ?? 0;
  return (
    <article className="case-card">
      <div className="case-card-head">
        <div>
          <span className="tiny-label">КАРТОЧКА ОБРАЩЕНИЯ</span>
          <h2>{appeal.id}</h2>
        </div>
        <StatusPill status={appeal.status} />
      </div>
      <div className="case-meta">
        <div>
          <span>ТИП</span>
          <b>{appeal.type}</b>
        </div>
        <div>
          <span>ДАТА РЕГИСТРАЦИИ</span>
          <b>{formatDate(appeal.date)}</b>
        </div>
        <div>
          <span>ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ</span>
          <b>
            {timeline.length
              ? formatDate(timeline[timeline.length - 1].at)
              : formatDate(appeal.date)}
          </b>
        </div>
      </div>
      <div className="public-progress">
        <span className="tiny-label">ПУТЬ ОБРАЩЕНИЯ</span>
        <div className="public-progress-line">
          {["Регистрация", "Проверка", "Рассмотрение", "Решение", "Ответ"].map(
            (x, i) => (
              <div
                className={`${i <= stage ? "passed" : ""} ${i === stage ? "current" : ""}`}
                key={x}
              >
                <i>{i < stage ? "✓" : `0${i + 1}`}</i>
                <span>{x}</span>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="case-timeline">
        <span className="tiny-label">ИСТОРИЯ РАССМОТРЕНИЯ</span>
        {timeline.length ? (
          timeline.map((event, i) => (
            <div className="case-event" key={`${event.at}-${i}`}>
              <span className="event-dot" />
              <time>{formatStamp(event.at)}</time>
              <p>{event.text}</p>
            </div>
          ))
        ) : (
          <p className="muted">История пока не сформирована.</p>
        )}
      </div>
      {appeal.status === "REJECTED" && (
        <div className="public-answer">
          <span>РЕЗУЛЬТАТ ПЕРВИЧНОЙ ПРОВЕРКИ</span>
          <p>
            {appeal.rejectionReason ||
              "Обращение не прошло первичную проверку. Для уточнения требований обратитесь на горячую линию."}
          </p>
        </div>
      )}
      {(appeal.status === "ANSWERED" || appeal.status === "CLOSED") &&
        appeal.answer && (
          <div className="public-answer">
            <span>ОФИЦИАЛЬНЫЙ ОТВЕТ МИНИСТЕРСТВА</span>
            <p>{appeal.answer}</p>
            {appeal.verdict && <small>Решение: {appeal.verdict}</small>}
          </div>
        )}
      {appeal.status === "DECISION" && appeal.verdict && (
        <div className="public-answer">
          <span>РЕШЕНИЕ МИНИСТЕРСТВА</span>
          <p>{appeal.verdict}</p>
        </div>
      )}
      <div className="case-footnote">
        <Icon name="clock" size={15} />
        Статус обновляется по мере прохождения этапов рассмотрения.
      </div>
    </article>
  );
}
