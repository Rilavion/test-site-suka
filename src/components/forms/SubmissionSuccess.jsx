import React from "react";
import { Button, Eyebrow, Mark } from "../ui/Primitives";
import Icon from "../ui/Icon";
export default function SubmissionSuccess({
  success,
  copied,
  copy,
  navigate,
  onNew,
}) {
  return (
    <section className="success-screen">
      <div className="success-seal">
        <Mark light />
        <span className="success-check">
          <Icon name="check" size={19} />
        </span>
      </div>
      <Eyebrow>РЕГИСТРАЦИЯ ЗАВЕРШЕНА</Eyebrow>
      <h1>
        ОБРАЩЕНИЕ
        <br />
        <em>ЗАРЕГИСТРИРОВАНО</em>
      </h1>
      <p className="success-message">
        Спасибо, {success?.citizen.split(" ")[1] || "что обратились"}. Обращение
        поступило в электронную приёмную Министерства.
      </p>
      <div className="credentials-card">
        <div>
          <span>НОМЕР ОБРАЩЕНИЯ</span>
          <strong>{success?.id}</strong>
          <button
            onClick={() => copy(success?.id, "id")}
            aria-label="Копировать номер обращения"
          >
            <Icon name={copied === "id" ? "check" : "copy"} size={15} />
            {copied === "id" ? "СКОПИРОВАНО" : "КОПИРОВАТЬ"}
          </button>
        </div>
        <div>
          <span>КОД ДОСТУПА</span>
          <strong className="access-code">{success?.accessCode}</strong>
          <button
            onClick={() => copy(success?.accessCode, "code")}
            aria-label="Копировать код доступа"
          >
            <Icon name={copied === "code" ? "check" : "copy"} size={15} />
            {copied === "code" ? "СКОПИРОВАНО" : "КОПИРОВАТЬ"}
          </button>
        </div>
      </div>
      <div className="save-warning">
        <Icon name="shield" size={17} />
        <p>
          Сохраните номер обращения и код доступа. Они понадобятся, чтобы
          проверить ход рассмотрения.
        </p>
      </div>
      <div className="success-actions">
        <Button
          onClick={() =>
            navigate("/track", {
              id: success?.id,
              code: success?.accessCode,
            })
          }
        >
          Проверить статус
        </Button>
        <button className="text-link" onClick={onNew}>
          Новое обращение <Icon name="plus" size={16} />
        </button>
      </div>
      <span className="success-ref">МСПиТ / ПФО · ЭЛЕКТРОННАЯ ПРИЁМНАЯ</span>
    </section>
  );
}
