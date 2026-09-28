import React, { useEffect, useMemo, useRef, useState } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import Icon from "../components/ui/Icon";
import {
  EmptyState,
  Kicker,
  Mark,
  StatusPill,
} from "../components/ui/Primitives";
import { STATUS } from "../data/appeals";
import { formatDate, localDateKey } from "../utils/format";

export default function StaffDashboard({ appeals, navigate, user, onLogout }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [assignee, setAssignee] = useState("ALL");
  const [day, setDay] = useState("");
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
  const filtersActive =
    query || status !== "ALL" || type !== "ALL" || assignee !== "ALL" || day;

  function reset() {
    setQuery("");
    setStatus("ALL");
    setType("ALL");
    setAssignee("ALL");
    setDay("");
  }

  return (
    <div className="page console">
      <StaffRail
        user={user}
        onLogout={onLogout}
        active="inbox"
        navigate={navigate}
        counts={counts}
        total={appeals.length}
        onFilter={setStatus}
      />

      <div className="console-main">
        <StaffTopbar
          crumbs={[
            ["МСПиТ", null],
            ["Центр обращений", null],
          ]}
          navigate={navigate}
          onLogout={onLogout}
        />

        <div className="console-body">
          <header className="console-head">
            <div>
              <Kicker>Служебная система</Kicker>
              <h1 className="h-xl">Центр обращений</h1>
            </div>
            <div className="console-date">
              <span className="tiny-label">Сегодня</span>
              <b>{formatDate(new Date())}</b>
            </div>
          </header>

          <div className="stat-row">
            {[
              ["NEW", "Новые", "требуют проверки"],
              ["ACCEPTED", "Принятые", "ожидают назначения"],
              ["IN_PROGRESS", "В производстве", "на рассмотрении"],
              ["DECISION", "Ожидают ответа", "решение готово"],
              ["CLOSED", "Завершённые", "закрытые дела"],
            ].map(([key, label, desc]) => (
              <button
                key={key}
                className={`stat ${status === key ? "is-selected" : ""}`}
                onClick={() => setStatus(status === key ? "ALL" : key)}
              >
                <span className="stat-value">
                  {String(counts[key] || 0).padStart(2, "0")}
                </span>
                <span className="stat-label">{label}</span>
                <small>{desc}</small>
              </button>
            ))}
          </div>

          <section className="inbox">
            <div className="inbox-head">
              <h2 className="h-lg">
                Реестр обращений <sup>{filtered.length}</sup>
              </h2>
              {filtersActive && (
                <button className="back-link" onClick={reset}>
                  <Icon name="close" size={14} /> Сбросить фильтры
                </button>
              )}
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
                <span>Обращение / гражданин</span>
                <span>Тип</span>
                <span>Дата</span>
                <span>Исполнитель</span>
                <span>Статус</span>
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
                    style={{ "--row-i": Math.min(i, 12) }}
                  >
                    <span className="row-person">
                      <b>{a.id}</b>
                      <small>{a.citizen}</small>
                    </span>
                    <span className="row-type">
                      <i
                        className={`type-dot ${a.type === "Жалоба" ? "wine" : "brass"}`}
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

            <div className="table-foot">
              <span>
                Показано {filtered.length} из {appeals.length} обращений
              </span>
              <span>Данные локальной демонстрационной системы</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ——— Общие элементы служебного контура ——— */

export function StaffRail({
  user,
  onLogout,
  navigate,
  counts = {},
  total,
  onFilter,
  active = "inbox",
}) {
  return (
    <aside className="console-rail">
      <button className="rail-brand" onClick={() => navigate("/staff")}>
        <Mark size="sm" />
        <span>
          <b>МСПиТ</b>
          <small>Центр обращений</small>
        </span>
      </button>

      <nav className="rail-nav" aria-label="Служебные разделы">
        <span className="tiny-label">Рабочий контур</span>
        <button
          className={`rail-item ${active === "inbox" ? "is-active" : ""}`}
          onClick={() => {
            navigate("/staff");
            onFilter?.("ALL");
          }}
        >
          <Icon name="grid" size={17} />
          Все обращения
          {total != null && <b>{total}</b>}
        </button>
        <button
          className="rail-item"
          onClick={() => {
            navigate("/staff");
            onFilter?.("NEW");
          }}
        >
          <Icon name="doc" size={17} />
          Первичная проверка
          {counts.NEW != null && <b>{counts.NEW}</b>}
        </button>
        <button
          className="rail-item"
          onClick={() => {
            navigate("/staff");
            onFilter?.("IN_PROGRESS");
          }}
        >
          <Icon name="clock" size={17} />В производстве
          {counts.IN_PROGRESS != null && <b>{counts.IN_PROGRESS}</b>}
        </button>
      </nav>

      <div className="rail-user">
        <span className="rail-avatar">{(user?.name || "С").slice(0, 1)}</span>
        <div>
          <b>{user?.name || "Сотрудник"}</b>
          <small>{user?.role || "Специалист"}</small>
        </div>
        <button aria-label="Выйти из системы" onClick={onLogout}>
          <Icon name="logout" size={17} />
        </button>
      </div>
    </aside>
  );
}

export function StaffTopbar({ crumbs, navigate, onLogout }) {
  return (
    <header className="console-topbar">
      <nav className="crumbs" aria-label="Навигационная цепочка">
        {crumbs.map(([label, path], i) => (
          <React.Fragment key={label}>
            {i > 0 && <i>/</i>}
            {path ? (
              <button onClick={() => navigate(path)}>{label}</button>
            ) : (
              <span>{label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
      <div className="console-topbar-right">
        <span className="demo-flag">
          <i /> Демо · локальная среда
        </span>
        <ThemeSwitch />
        <button className="staff-chip" onClick={() => navigate("/")}>
          Публичный портал
          <Icon name="external" size={13} />
        </button>
        {onLogout && (
          <button
            className="icon-button console-logout"
            onClick={onLogout}
            aria-label="Выйти из системы"
          >
            <Icon name="logout" size={17} />
          </button>
        )}
      </div>
    </header>
  );
}
