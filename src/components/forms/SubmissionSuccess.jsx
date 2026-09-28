import React from "react";
import { Button, Mark } from "../ui/Primitives";
import Icon from "../ui/Icon";

export default function SubmissionSuccess({
  success,
  copied,
  copy,
  navigate,
  onNew,
}) {
  const firstName = success?.citizen?.split(" ")[1];
  return (
    <section className="success">
      <div className="shell success-inner">
        <span className="success-seal">
          <Mark size="lg" />
          <i>
            <Icon name="check" size={16} />
          </i>
        </span>

        <span className="tiny-label">Регистрация завершена</span>
        <h1 className="h-xl">
          Обращение <em>зарегистрировано</em>
        </h1>
        <p className="lead">
          {firstName ? `Спасибо, ${firstName}. ` : "Спасибо. "}
          Обращение поступило в электронную приёмную Министерства социальной
          политики и труда.
        </p>

        <div className="credentials">
          <div>
            <span className="tiny-label">Номер обращения</span>
            <strong>{success?.id}</strong>
            <button onClick={() => copy(success?.id, "id")}>
              <Icon name={copied === "id" ? "check" : "copy"} size={14} />
              {copied === "id" ? "Скопировано" : "Копировать"}
            </button>
          </div>
          <div>
            <span className="tiny-label">Код доступа</span>
            <strong className="code">{success?.accessCode}</strong>
            <button onClick={() => copy(success?.accessCode, "code")}>
              <Icon name={copied === "code" ? "check" : "copy"} size={14} />
              {copied === "code" ? "Скопировано" : "Копировать"}
            </button>
          </div>
        </div>

        <div className="note note-accent">
          <Icon name="shield" size={18} />
          Сохраните номер и код доступа: без них проверить ход рассмотрения
          будет невозможно.
        </div>

        <div className="success-actions">
          <Button
            icon="search"
            onClick={() =>
              navigate("/track", {
                id: success?.id,
                code: success?.accessCode,
              })
            }
          >
            Проверить статус
          </Button>
          <button className="link-arrow" onClick={onNew}>
            Новое обращение
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
