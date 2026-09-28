import ThemeSwitch from "../components/ThemeSwitch";
import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  Button,
  Eyebrow,
  StatusPill,
  EmptyState,
} from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
import { STATUS } from "../data/appeals";
import { formatDate, localDateKey } from "../utils/format";
export default function StaffDashboard({ appeals, navigate, user, onLogout }) {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("ALL"),
    [type, setType] = useState("ALL"),
    [assignee, setAssignee] = useState("ALL"),
    [day, setDay] = useState("");
  const searchInput = useRef(null);
  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(STATUS).map((s) => [
          s,
          appeals.filter((a) => a.status === s).length,
        ]),
      ),
    [appeals],
  );
  const filtered = useMemo(
    () =>
      appeals
        .filter((a) => {
          const q = query.toLowerCase();
          return (
            (!q ||
              [a.id, a.citizen, a.email, a.text].some((x) =>
                String(x || "")
                  .toLowerCase()
                  .includes(q),
              )) &&
            (status === "ALL" || a.status === status) &&
            (type === "ALL" || a.type === type) &&
            (assignee === "ALL" ||
              (assignee === "UNASSIGNED"
                ? !a.assignee
                : a.assignee === assignee)) &&
            (!day || localDateKey(a.date) === day)
          );
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [appeals, query, status, type, assignee, day],
  );
  const assignees = [
    ...new Set(appeals.map((a) => a.assignee).filter(Boolean)),
  ];
  function reset() {
    setQuery("");
    setStatus("ALL");
    setType("ALL");
    setAssignee("ALL");
    setDay("");
  }
  return (
    <div className="page staff-page">
      <div className="staff-shell">
        <aside className="staff-rail">
          <div className="staff-mini-brand">
            <span className="staff-emblem">М</span>
            <span>
              МСПиТ<small>ЦЕНТР ОБРАЩЕНИЙ</small>
            </span>
          </div>
          <div className="rail-nav">
            <span className="rail-nav-label">РАБОЧИЙ КОНТУР</span>
            <button className="rail-item active" onClick={reset}>
              <span className="rail-icon">▤</span>Обращения{" "}
              <b>{appeals.length}</b>
            </button>
            <button className="rail-item" onClick={() => setStatus("NEW")}>
              <span className="rail-icon">◌</span>Первичная проверка{" "}
              <b>{counts.NEW || 0}</b>
            </button>
            <button
              className="rail-item"
              onClick={() => setStatus("IN_PROGRESS")}
            >
              <span className="rail-icon">◷</span>В производстве{" "}
              <b>{counts.IN_PROGRESS || 0}</b>
            </button>
          </div>
          <div className="rail-bottom">
            <span className="rail-avatar">
              {(user?.name || "Е").slice(0, 1)}
            </span>
            <div>
              <b>{user?.name || "Сотрудник"}</b>
              <small>{user?.role || "Специалист"}</small>
            </div>
            <button aria-label="Выйти" onClick={onLogout}>
              <Icon name="back" size={17} />
            </button>
          </div>
        </aside>
        <div className="staff-main">
          <header className="staff-topbar">
            <div className="staff-breadcrumb">
              <span>МСПиТ</span>
              <i>/</i>
              <b>Центр обращений</b>
            </div>
            <div className="staff-top-right">
              <ThemeSwitch />
              <button
                className="staff-mobile-logout"
                onClick={onLogout}
                aria-label="Выйти из кабинета"
              >
                <Icon name="back" size={18} />
              </button>
              <span className="staff-live">
                <i /> DEMO / ЛОКАЛЬНАЯ СРЕДА
              </span>
              <button
                className="staff-public-link"
                onClick={() => navigate("/")}
              >
                ПУБЛИЧНЫЙ ПОРТАЛ ↗
              </button>
            </div>
          </header>
          <div className="staff-content">
            <div className="staff-title-row">
              <div>
                <Eyebrow number="01">СЛУЖЕБНАЯ СИСТЕМА</Eyebrow>
                <h1>
                  ЦЕНТР
                  <br />
                  <em>ОБРАЩЕНИЙ</em>
                </h1>
              </div>
              <div className="staff-date">
                <span>СЕГОДНЯ</span>
                <b>{formatDate(new Date()).toUpperCase()}</b>
              </div>
            </div>
            <div className="staff-stats">
              {[
                ["NEW", "Новые", "требуют проверки"],
                ["ACCEPTED", "Принятые", "ожидают назначения"],
                ["IN_PROGRESS", "В производстве", "на рассмотрении"],
                ["DECISION", "Ожидают ответа", "решение готово"],
                ["CLOSED", "Завершённые", "закрытые дела"],
              ].map(([key, label, desc], i) => (
                <button
                  key={key}
                  className={`stat-block ${status === key ? "stat-selected" : ""}`}
                  onClick={() => setStatus(status === key ? "ALL" : key)}
                >
                  <span className="stat-number">
                    {String(counts[key] || 0).padStart(2, "0")}
                  </span>
                  <span className="stat-label">{label}</span>
                  <small>{desc}</small>
                  <i className="stat-bar" style={{ "--stat-index": i }} />
                </button>
              ))}
            </div>
            <section className="inbox-section">
              <div className="inbox-heading">
                <div>
                  <Eyebrow number="02">ВХОДЯЩИЙ ПОТОК</Eyebrow>
                  <h2>
                    РЕЕСТР ОБРАЩЕНИЙ <sup>{filtered.length}</sup>
                  </h2>
                </div>
                <button className="refresh-button" onClick={reset}>
                  <Icon name="clock" size={16} /> СБРОСИТЬ ФИЛЬТРЫ
                </button>
              </div>
              <div className="filter-bar">
                <label className="search-field">
                  <Icon name="search" size={17} />
                  <input
                    ref={searchInput}
                    aria-label="Поиск по обращениям"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по номеру, гражданину или тексту"
                  />
                  <kbd>Ctrl K</kbd>
                </label>
                <select
                  aria-label="Фильтр по статусу"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ALL">Все статусы</option>
                  {Object.entries(STATUS).map(([key, s]) => (
                    <option value={key} key={key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Фильтр по типу"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="ALL">Все типы</option>
                  <option>Жалоба</option>
                  <option>Предложение</option>
                </select>
                <select
                  aria-label="Фильтр по исполнителю"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="ALL">Все исполнители</option>
                  {assignees.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                  <option value="UNASSIGNED">Не назначен</option>
                </select>
                <input
                  className="date-filter"
                  type="date"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  aria-label="Фильтр по дате"
                />
              </div>
              <div className="appeal-table">
                <div className="table-head">
                  <span>ОБРАЩЕНИЕ / ГРАЖДАНИН</span>
                  <span>ТИП</span>
                  <span>ДАТА</span>
                  <span>ИСПОЛНИТЕЛЬ</span>
                  <span>СТАТУС</span>
                  <span />
                </div>
                {filtered.length ? (
                  filtered.map((a, i) => (
                    <button
                      className="appeal-row"
                      key={a.id}
                      onClick={() =>
                        navigate(`/staff/appeals/${encodeURIComponent(a.id)}`)
                      }
                      style={{ "--row-i": i }}
                    >
                      <span className="row-person">
                        <span className="row-index">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <b>{a.id}</b>
                          <small>{a.citizen}</small>
                        </span>
                      </span>
                      <span className="row-type">
                        <i
                          className={
                            a.type === "Жалоба"
                              ? "type-dot wine"
                              : "type-dot gold"
                          }
                        />
                        {a.type}
                      </span>
                      <span className="row-date">{formatDate(a.date)}</span>
                      <span className="row-assignee">
                        {a.assignee || <i>Не назначен</i>}
                      </span>
                      <span>
                        <StatusPill status={a.status} />
                      </span>
                      <span className="row-chevron">
                        <Icon name="arrow" size={17} />
                      </span>
                    </button>
                  ))
                ) : (
                  <EmptyState
                    title="Ничего не найдено"
                    body="Измените параметры поиска или сбросьте фильтры."
                  />
                )}
              </div>
              <div className="table-footer">
                <span>
                  ПОКАЗАНО {filtered.length} ИЗ {appeals.length} ОБРАЩЕНИЙ
                </span>
                <span>
                  ДАННЫЕ ЛОКАЛЬНОЙ ДЕМО-СИСТЕМЫ <i />
                </span>
              </div>
            </section>
            <footer className="staff-footer">
              <span>МСПиТ / СЛУЖЕБНЫЙ КОНТУР</span>
              <span>Все действия фиксируются в журнале обращения</span>
            </footer>
          </div>
        </div>
      </div>
      <div className="demo-ribbon">
        ДЕМО-СРЕДА · ДАННЫЕ СОХРАНЯЮТСЯ В ЭТОМ БРАУЗЕРЕ
      </div>
    </div>
  );
}
