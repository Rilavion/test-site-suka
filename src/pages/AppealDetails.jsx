import ThemeSwitch from "../components/ThemeSwitch";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Eyebrow,
  StatusPill,
  Modal,
  EmptyState,
} from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
import { formatDate, formatStamp } from "../utils/format";
import { transitionAppeal, addInternalNote } from "../services/appealService";
export default function AppealDetails({
  appeals,
  appealId,
  navigate,
  user,
  onUpdate,
  toast,
}) {
  const appeal = useMemo(() => {
    try {
      return appeals.find((a) => a.id === decodeURIComponent(appealId || ""));
    } catch {
      return undefined;
    }
  }, [appeals, appealId]);
  const [verdict, setVerdict] = useState(appeal?.verdict || ""),
    [answer, setAnswer] = useState(appeal?.answer || ""),
    [modal, setModal] = useState(false),
    [previewOpen, setPreviewOpen] = useState(false),
    [rejectionReason, setRejectionReason] = useState(""),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    setVerdict(appeal?.verdict || "");
    setAnswer(appeal?.answer || "");
  }, [appeal?.id]);
  if (!appeal)
    return (
      <div className="page staff-page">
        <div className="detail-empty">
          <EmptyState
            icon="search"
            title="Обращение не найдено"
            body="Возможно, оно было удалено или номер указан неверно."
          />
          <Button variant="outline" onClick={() => navigate("/staff")}>
            Вернуться в реестр
          </Button>
        </div>
      </div>
    );
  const act = async (status, fields = {}) => {
    if (busy) return;
    setBusy(true);
    try {
      const next = transitionAppeal(appeal, status, user.name, fields);
      await new Promise((resolve) => setTimeout(resolve, 250));
      onUpdate(next);
      setModal(false);
      toast(
        status === "ACCEPTED"
          ? "Обращение принято. Оно ожидает передачи в производство."
          : "Изменения сохранены в журнале обращения",
      );
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(false);
    }
  };
  const accept = () => act("ACCEPTED");
  const take = () => act("IN_PROGRESS");
  const reject = () => act("REJECTED", { rejectionReason });
  const saveDecision = () => act("DECISION", { verdict });
  const provideAnswer = () => act("ANSWERED", { answer });
  const close = () => act("CLOSED");
  const saveNote = () => {
    try {
      onUpdate(addInternalNote(appeal, note, user.name));
      setNote("");
      toast("Служебная заметка сохранена");
    } catch (error) {
      toast(error.message, "error");
    }
  };
  const internalEvents = (appeal.timeline || [])
    .slice()
    .sort((a, b) => new Date(b.at) - new Date(a.at));
  return (
    <div className="page staff-page detail-page">
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
            <button
              className="rail-item active"
              onClick={() => navigate("/staff")}
            >
              <span className="rail-icon">▤</span>Обращения
            </button>
            <button className="rail-item" onClick={() => navigate("/staff")}>
              <span className="rail-icon">◌</span>Первичная проверка
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
            <button onClick={() => navigate("/staff")} aria-label="К списку">
              <Icon name="back" size={17} />
            </button>
          </div>
        </aside>
        <div className="staff-main">
          <header className="staff-topbar">
            <div className="staff-breadcrumb">
              <button onClick={() => navigate("/staff")}>
                Центр обращений
              </button>
              <i>/</i>
              <b>Карточка дела</b>
            </div>
            <div className="staff-top-right">
              <ThemeSwitch />
              <span className="staff-live">
                <i /> DEMO / ЛОКАЛЬНАЯ СРЕДА
              </span>
            </div>
          </header>
          <div className="staff-content detail-content">
            <button className="detail-back" onClick={() => navigate("/staff")}>
              <Icon name="back" size={16} /> К РЕЕСТРУ ОБРАЩЕНИЙ
            </button>
            <div className="detail-heading">
              <div>
                <Eyebrow number="ДЕЛО">ПОЛНАЯ КАРТОЧКА</Eyebrow>
                <h1>{appeal.id}</h1>
                <span className="detail-date">
                  ЗАРЕГИСТРИРОВАНО {formatDate(appeal.date).toUpperCase()}
                </span>
              </div>
              <StatusPill status={appeal.status} />
            </div>
            <div className="detail-layout">
              <div className="detail-main-column">
                <section className="detail-block citizen-block">
                  <div className="detail-block-title">
                    <span>01</span>
                    <h2>ГРАЖДАНИН</h2>
                  </div>
                  <div className="citizen-info">
                    <div className="citizen-monogram">
                      {appeal.citizen
                        .split(" ")
                        .slice(0, 2)
                        .map((x) => x[0])
                        .join("")}
                    </div>
                    <div>
                      <h3>{appeal.citizen}</h3>
                      <p>
                        <Icon name="phone" size={15} />
                        {appeal.phone}
                      </p>
                      <p>
                        <Icon name="mail" size={15} />
                        {appeal.email}
                      </p>
                    </div>
                  </div>
                </section>
                <section className="detail-block">
                  <div className="detail-block-title">
                    <span>02</span>
                    <h2>СУТЬ ОБРАЩЕНИЯ</h2>
                  </div>
                  <div className="appeal-type-line">
                    <span className="type-dot wine" />
                    {appeal.type}
                    <span>·</span>
                    {formatDate(appeal.date)}
                  </div>
                  <p className="appeal-full-text">{appeal.text}</p>
                </section>
                <section className="detail-block">
                  <div className="detail-block-title">
                    <span>03</span>
                    <h2>ПОДТВЕРЖДЕНИЕ ПРИНАДЛЕЖНОСТИ</h2>
                  </div>
                  {appeal.attachmentPreview ? (
                    <button
                      className="passport-preview"
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      aria-label="Открыть прикреплённое изображение"
                    >
                      <img
                        src={appeal.attachmentPreview}
                        alt="Прикреплённое подтверждение"
                      />
                      <span>
                        {appeal.attachmentName || "Изображение гражданина"}
                      </span>
                    </button>
                  ) : (
                    <div className="passport-placeholder">
                      <div className="passport-symbol">ПФО</div>
                      <div>
                        <span>ПРИЛОЖЕННЫЙ ФАЙЛ</span>
                        <b>
                          {appeal.attachmentName ||
                            "Скриншот паспорта гражданина"}
                        </b>
                        <small>
                          Демонстрационный файл · просмотр доступен сотруднику
                        </small>
                      </div>
                      <Icon name="shield" size={20} />
                    </div>
                  )}
                </section>
                <section className="detail-block">
                  <div className="detail-block-title">
                    <span>04</span>
                    <h2>ЖУРНАЛ ДЕЙСТВИЙ</h2>
                    <span className="journal-count">
                      {internalEvents.length} СОБЫТИЙ
                    </span>
                  </div>
                  <div className="staff-timeline">
                    {internalEvents.map((event, i) => (
                      <div className="staff-event" key={`${event.at}-${i}`}>
                        <span
                          className={`staff-event-mark ${event.public ? "" : "private"}`}
                        >
                          {event.public ? (
                            <Icon name="check" size={12} />
                          ) : (
                            <Icon name="lock" size={11} />
                          )}
                        </span>
                        <div>
                          <span className="event-visibility">
                            {event.public
                              ? "ДОСТУПНО ГРАЖДАНИНУ"
                              : "СЛУЖЕБНАЯ ЗАПИСЬ"}
                          </span>
                          <p>{event.text}</p>
                          <small>
                            {formatStamp(event.at)} · {event.actor || "Система"}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="internal-note-form">
                    <label className="field">
                      <span>СЛУЖЕБНАЯ ЗАМЕТКА</span>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        placeholder="Внутренний комментарий. Гражданин его не увидит."
                      />
                    </label>
                    <Button
                      variant="outline"
                      onClick={saveNote}
                      disabled={!note.trim() || busy}
                    >
                      Добавить заметку
                    </Button>
                  </div>
                </section>
              </div>
              <aside className="detail-side-column">
                <section className="detail-block status-workflow">
                  <span className="tiny-label">ДЕЙСТВИЯ ПО ОБРАЩЕНИЮ</span>
                  <div className="workflow-status">
                    <StatusPill status={appeal.status} />
                    <span>Текущий статус</span>
                  </div>
                  {appeal.assignee && (
                    <div className="assigned-to">
                      <span>ОТВЕТСТВЕННЫЙ</span>
                      <b>
                        <i>{appeal.assignee.slice(0, 1)}</i>
                        {appeal.assignee}
                      </b>
                    </div>
                  )}
                  <div className="workflow-actions">
                    {appeal.status === "NEW" && (
                      <>
                        <p>
                          Первичная проверка подтверждает, что обращение
                          соответствует требованиям.
                        </p>
                        <Button onClick={accept} disabled={busy} icon="check">
                          Принять обращение
                        </Button>
                        <button
                          className="reject-button"
                          onClick={() => setModal(true)}
                        >
                          Отклонить после проверки
                        </button>
                        <small>
                          «Принято» не означает, что обращение уже в
                          производстве.
                        </small>
                      </>
                    )}
                    {appeal.status === "ACCEPTED" && (
                      <>
                        <p>
                          Обращение прошло первичную фильтрацию и ожидает
                          передачи ответственному.
                        </p>
                        <Button onClick={take} disabled={busy}>
                          Взять в производство
                        </Button>
                        <small>
                          После действия будет назначен ответственный
                          специалист.
                        </small>
                      </>
                    )}
                    {appeal.status === "IN_PROGRESS" && (
                      <>
                        <p>
                          Подготовьте решение и официальный ответ гражданину.
                        </p>
                        <label className="field">
                          <span>РЕШЕНИЕ / ВЕРДИКТ</span>
                          <textarea
                            value={verdict}
                            onChange={(e) => setVerdict(e.target.value)}
                            rows={4}
                            placeholder="Укажите принятое решение…"
                          />
                        </label>
                        <label className="field">
                          <span>ОТВЕТ ГРАЖДАНИНУ</span>
                          <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={5}
                            placeholder="Текст официального ответа…"
                          />
                        </label>
                        <button
                          className="workflow-save"
                          onClick={saveDecision}
                          disabled={busy}
                        >
                          СОХРАНИТЬ РЕШЕНИЕ <Icon name="check" size={16} />
                        </button>
                        <small>
                          Сначала сохраните решение. На следующем этапе можно
                          опубликовать ответ.
                        </small>
                      </>
                    )}
                    {appeal.status === "DECISION" && (
                      <>
                        <div className="saved-decision">
                          <span>СОХРАНЁННОЕ РЕШЕНИЕ</span>
                          <p>{appeal.verdict || "Решение вынесено."}</p>
                        </div>
                        <label className="field">
                          <span>ОТВЕТ ГРАЖДАНИНУ</span>
                          <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={5}
                            placeholder="Текст официального ответа…"
                          />
                        </label>
                        <Button onClick={provideAnswer} disabled={busy}>
                          Предоставить ответ
                        </Button>
                      </>
                    )}
                    {appeal.status === "ANSWERED" && (
                      <>
                        <div className="saved-decision">
                          <span>ОТВЕТ ПРЕДОСТАВЛЕН</span>
                          <p>{appeal.answer}</p>
                        </div>
                        <Button
                          onClick={() => setModal(true)}
                          variant="outline"
                        >
                          Закрыть обращение
                        </Button>
                      </>
                    )}
                    {appeal.status === "CLOSED" && (
                      <div className="workflow-complete">
                        <Icon name="check" size={21} />
                        <b>Дело закрыто</b>
                        <p>Все необходимые действия завершены.</p>
                      </div>
                    )}
                    {appeal.status === "REJECTED" && (
                      <div className="workflow-complete rejected">
                        <Icon name="close" size={21} />
                        <b>Обращение отклонено</b>
                        <p>
                          {appeal.rejectionReason ||
                            "После первичной проверки обращение завершено."}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
                <div className="side-access-note">
                  <Icon name="lock" size={15} />
                  <p>
                    Паспортное подтверждение и контактные данные видны только
                    сотрудникам.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <div className="demo-ribbon">
        ДЕМО-СРЕДА · ЖУРНАЛ СОБЫТИЙ СОХРАНЯЕТСЯ В ЭТОМ БРАУЗЕРЕ
      </div>
      <Modal
        open={previewOpen}
        title="Прикреплённое изображение"
        onClose={() => setPreviewOpen(false)}
        className="attachment-modal"
      >
        <img src={appeal.attachmentPreview} alt="Полный просмотр скриншота" />
        <p>{appeal.attachmentName}</p>
      </Modal>
      <Modal
        open={modal}
        title={
          appeal.status === "NEW"
            ? "Отклонить обращение?"
            : "Закрыть обращение?"
        }
        onClose={() => setModal(false)}
        actions={
          <>
            <button className="back-button" onClick={() => setModal(false)}>
              ОТМЕНА
            </button>
            <Button
              variant="burgundy"
              disabled={
                busy || (appeal.status === "NEW" && !rejectionReason.trim())
              }
              onClick={appeal.status === "NEW" ? reject : close}
            >
              {appeal.status === "NEW" ? "Отклонить" : "Закрыть дело"}
            </Button>
          </>
        }
      >
        <p>
          {appeal.status === "NEW"
            ? "Решение об отклонении будет зафиксировано в истории и отражено в публичном статусе обращения."
            : "Обращение будет переведено в статус «Закрыто». Это действие сохранится в журнале."}
        </p>
        {appeal.status === "NEW" && (
          <label className="field">
            <span>ПРИЧИНА ОТКЛОНЕНИЯ</span>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              maxLength={1500}
              placeholder="Объясните причину. Этот текст будет доступен гражданину."
            />
          </label>
        )}
      </Modal>
    </div>
  );
}
