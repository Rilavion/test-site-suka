import React, { useEffect, useMemo, useState } from "react";
import Icon from "../components/ui/Icon";
import {
  Button,
  EmptyState,
  Kicker,
  Modal,
  StatusPill,
} from "../components/ui/Primitives";
import { StaffRail, StaffTopbar } from "./StaffDashboard";
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

  const [verdict, setVerdict] = useState(appeal?.verdict || "");
  const [answer, setAnswer] = useState(appeal?.answer || "");
  const [modal, setModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setVerdict(appeal?.verdict || "");
    setAnswer(appeal?.answer || "");
  }, [appeal?.id]);

  if (!appeal) {
    return (
      <div className="page console">
        <StaffRail
          user={user}
          navigate={navigate}
          onLogout={() => navigate("/staff")}
        />
        <div className="console-main">
          <StaffTopbar
            crumbs={[
              ["Центр обращений", "/staff"],
              ["Карточка дела", null],
            ]}
            navigate={navigate}
          />
          <div className="console-body">
            <EmptyState
              icon="search"
              title="Обращение не найдено"
              body="Возможно, оно было удалено или номер указан неверно."
            />
            <div style={{ display: "grid", placeItems: "center" }}>
              <Button variant="secondary" onClick={() => navigate("/staff")}>
                Вернуться в реестр
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const act = async (status, fields = {}) => {
    if (busy) return;
    setBusy(true);
    try {
      const next = transitionAppeal(appeal, status, user.name, fields);
      await new Promise((resolve) => setTimeout(resolve, 220));
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

  const saveNote = () => {
    try {
      onUpdate(addInternalNote(appeal, note, user.name));
      setNote("");
      toast("Служебная заметка сохранена");
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const events = (appeal.timeline || [])
    .slice()
    .sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <div className="page console">
      <StaffRail
        user={user}
        navigate={navigate}
        onLogout={() => navigate("/staff")}
      />

      <div className="console-main">
        <StaffTopbar
          crumbs={[
            ["Центр обращений", "/staff"],
            ["Карточка дела", null],
          ]}
          navigate={navigate}
        />

        <div className="console-body">
          <button className="back-link" onClick={() => navigate("/staff")}>
            <Icon name="back" size={15} /> К реестру обращений
          </button>

          <header className="console-head">
            <div>
              <Kicker>Полная карточка</Kicker>
              <h1 className="h-xl">{appeal.id}</h1>
              <span className="muted" style={{ fontSize: "0.86rem" }}>
                Зарегистрировано {formatDate(appeal.date)}
              </span>
            </div>
            <StatusPill status={appeal.status} />
          </header>

          <div className="detail-grid">
            <div className="detail-column">
              <section className="detail-block">
                <h2 className="detail-title">Гражданин</h2>
                <div className="citizen">
                  <span className="monogram tone-wine">
                    {appeal.citizen
                      .split(" ")
                      .slice(0, 2)
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <div>
                    <h3 className="h-md">{appeal.citizen}</h3>
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
                <h2 className="detail-title">Суть обращения</h2>
                <div className="detail-type">
                  <i
                    className={`type-dot ${appeal.type === "Жалоба" ? "wine" : "brass"}`}
                  />
                  {appeal.type}
                  <span>·</span>
                  {formatDate(appeal.date)}
                </div>
                <p className="detail-text">{appeal.text}</p>
              </section>

              <section className="detail-block">
                <h2 className="detail-title">Подтверждение принадлежности</h2>
                {appeal.attachmentPreview ? (
                  <button
                    className="passport"
                    type="button"
                    onClick={() => setPreviewOpen(true)}
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
                  <div className="passport-empty">
                    <span className="passport-badge">ПФО</span>
                    <div>
                      <span className="tiny-label">Приложенный файл</span>
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
                <h2 className="detail-title">
                  Журнал действий <sup>{events.length}</sup>
                </h2>
                <ol className="journal">
                  {events.map((event, i) => (
                    <li key={`${event.at}-${i}`}>
                      <span
                        className={`journal-mark ${event.public ? "" : "is-private"}`}
                      >
                        <Icon
                          name={event.public ? "check" : "lock"}
                          size={11}
                        />
                      </span>
                      <div>
                        <span className="tiny-label">
                          {event.public
                            ? "Доступно гражданину"
                            : "Служебная запись"}
                        </span>
                        <p>{event.text}</p>
                        <small>
                          {formatStamp(event.at)} · {event.actor || "Система"}
                        </small>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="note-form">
                  <label className="field">
                    <span>Служебная заметка</span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="Внутренний комментарий. Гражданин его не увидит."
                    />
                  </label>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="plus"
                    onClick={saveNote}
                    disabled={!note.trim() || busy}
                  >
                    Добавить заметку
                  </Button>
                </div>
              </section>
            </div>

            <aside className="detail-side">
              <section className="detail-block workflow">
                <h2 className="detail-title">Действия по обращению</h2>
                <div className="workflow-status">
                  <StatusPill status={appeal.status} />
                  <span className="muted">Текущий статус</span>
                </div>

                {appeal.assignee && (
                  <div className="assignee">
                    <span className="tiny-label">Ответственный</span>
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
                      <Button
                        className="btn-block"
                        icon="check"
                        onClick={() => act("ACCEPTED")}
                        disabled={busy}
                      >
                        Принять обращение
                      </Button>
                      <button
                        className="reject-link"
                        onClick={() => setModal(true)}
                      >
                        Отклонить после проверки
                      </button>
                      <small>
                        «Принято» не означает, что обращение уже в производстве.
                      </small>
                    </>
                  )}

                  {appeal.status === "ACCEPTED" && (
                    <>
                      <p>
                        Обращение прошло первичную фильтрацию и ожидает передачи
                        ответственному.
                      </p>
                      <Button
                        className="btn-block"
                        onClick={() => act("IN_PROGRESS")}
                        disabled={busy}
                      >
                        Взять в производство
                      </Button>
                      <small>
                        После действия будет назначен ответственный специалист.
                      </small>
                    </>
                  )}

                  {appeal.status === "IN_PROGRESS" && (
                    <>
                      <p>Подготовьте решение и официальный ответ гражданину.</p>
                      <label className="field">
                        <span>Решение / вердикт</span>
                        <textarea
                          value={verdict}
                          onChange={(e) => setVerdict(e.target.value)}
                          rows={4}
                          placeholder="Укажите принятое решение…"
                        />
                      </label>
                      <label className="field">
                        <span>Ответ гражданину</span>
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          rows={5}
                          placeholder="Текст официального ответа…"
                        />
                      </label>
                      <Button
                        className="btn-block"
                        icon="check"
                        onClick={() => act("DECISION", { verdict })}
                        disabled={busy}
                      >
                        Сохранить решение
                      </Button>
                      <small>
                        Сначала сохраните решение. На следующем этапе можно
                        опубликовать ответ.
                      </small>
                    </>
                  )}

                  {appeal.status === "DECISION" && (
                    <>
                      <div className="saved-block">
                        <span className="tiny-label">Сохранённое решение</span>
                        <p>{appeal.verdict || "Решение вынесено."}</p>
                      </div>
                      <label className="field">
                        <span>Ответ гражданину</span>
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          rows={5}
                          placeholder="Текст официального ответа…"
                        />
                      </label>
                      <Button
                        className="btn-block"
                        onClick={() => act("ANSWERED", { answer })}
                        disabled={busy}
                      >
                        Предоставить ответ
                      </Button>
                    </>
                  )}

                  {appeal.status === "ANSWERED" && (
                    <>
                      <div className="saved-block">
                        <span className="tiny-label">Ответ предоставлен</span>
                        <p>{appeal.answer}</p>
                      </div>
                      <Button
                        className="btn-block"
                        variant="secondary"
                        onClick={() => setModal(true)}
                      >
                        Закрыть обращение
                      </Button>
                    </>
                  )}

                  {appeal.status === "CLOSED" && (
                    <div className="workflow-final">
                      <Icon name="check" size={22} />
                      <b>Дело закрыто</b>
                      <p>Все необходимые действия завершены.</p>
                    </div>
                  )}

                  {appeal.status === "REJECTED" && (
                    <div className="workflow-final is-rejected">
                      <Icon name="close" size={22} />
                      <b>Обращение отклонено</b>
                      <p>
                        {appeal.rejectionReason ||
                          "После первичной проверки обращение завершено."}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <div className="note">
                <Icon name="lock" size={16} />
                Паспортное подтверждение и контактные данные видны только
                сотрудникам Министерства.
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        title="Прикреплённое изображение"
        onClose={() => setPreviewOpen(false)}
      >
        <img src={appeal.attachmentPreview} alt="Полный просмотр скриншота" />
        <p className="muted">{appeal.attachmentName}</p>
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
            <button
              className="btn btn-quiet btn-sm"
              onClick={() => setModal(false)}
            >
              <span>Отмена</span>
            </button>
            <Button
              size="sm"
              icon={null}
              disabled={
                busy || (appeal.status === "NEW" && !rejectionReason.trim())
              }
              onClick={() =>
                appeal.status === "NEW"
                  ? act("REJECTED", { rejectionReason })
                  : act("CLOSED")
              }
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
            <span>Причина отклонения</span>
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
