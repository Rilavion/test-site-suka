import React, { useState } from "react";
import PageIntro from "../components/PageIntro";
import Icon from "../components/ui/Icon";
import { Button, Kicker, Mark, useReveal } from "../components/ui/Primitives";
import { leadership } from "../data/leadership";
import { ministryDirections, ministryFacts, siteConfig } from "../config/site";

export default function Ministry({ navigate }) {
  const [selected, setSelected] = useState(0);
  const person = leadership[selected];
  useReveal("ministry");

  return (
    <div className="page">
      <PageIntro
        kicker="О ведомстве"
        title={["О Министерстве"]}
        lead="Работаем для того, чтобы социальная поддержка была доступной, труд — достойным, а диалог с жителями округа — открытым."
        aside={
          <div className="intro-card">
            <Mark size="lg" />
            <b>{siteConfig.ministryName}</b>
            <span className="muted">{siteConfig.districtName}</span>
            <hr className="rule" />
            <span className="tiny-label">Указ ПФО</span>
            <p>№ 014 / 2024 · об электронной приёмной ведомства</p>
          </div>
        }
      />

      {/* ——— Миссия ——— */}
      <section className="section mission">
        <div className="shell mission-grid">
          <h2 className="h-xl" data-reveal>
            Создавать условия,
            <br />в которых <em>человек чувствует опору</em>
          </h2>
          <div data-reveal style={{ "--reveal-delay": "100ms" }}>
            <p className="body-text">
              Министерство формирует и реализует политику в сфере социальной
              защиты населения и труда, объединяя усилия профессионального
              сообщества, работодателей и гражданских инициатив округа.
            </p>
            <dl className="fact-strip fact-strip-wide">
              {ministryFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.value}</dt>
                  <dd>{fact.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ——— Направления ——— */}
      <section className="section section-tint">
        <div className="shell">
          <div className="section-head">
            <div data-reveal>
              <Kicker>Направления работы</Kicker>
              <h2 className="h-xl">Работаем по существу</h2>
            </div>
            <p
              className="lead"
              data-reveal
              style={{ "--reveal-delay": "80ms" }}
            >
              Четыре взаимосвязанных направления формируют целостную систему
              поддержки жителей Патриаршего федерального округа.
            </p>
          </div>

          <div className="direction-list">
            {ministryDirections.map((item, i) => (
              <article
                className="direction"
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` }}
              >
                <span className="direction-icon">
                  <Icon name={item.icon} size={21} />
                </span>
                <h3 className="h-md">{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Структура ——— */}
      <section className="section">
        <div className="shell structure-grid">
          <div className="structure-copy" data-reveal="left">
            <Kicker>Структура</Kicker>
            <h2 className="h-xl">
              Единая система.
              <br />
              <em>Общая цель.</em>
            </h2>
            <p className="body-text">
              Министерство объединяет профильные управления, территориальные
              подразделения и службу обратной связи. Такая структура помогает
              видеть ситуацию целиком и действовать согласованно: обращение
              гражданина попадает сразу к тем, кто может решить вопрос.
            </p>
            <button
              className="link-arrow"
              onClick={() => navigate("/contacts")}
            >
              Связаться с ведомством
              <Icon name="arrow" size={16} />
            </button>
          </div>

          <ol className="structure-steps" data-reveal="right">
            {[
              ["Принять", "Обращение регистрируется и получает номер"],
              ["Рассмотреть", "Профильное управление изучает ситуацию"],
              ["Ответить", "Гражданин получает официальный ответ"],
            ].map(([title, body], i) => (
              <li key={title}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <div>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Руководство ——— */}
      <section className="section section-tint">
        <div className="shell">
          <div className="section-head">
            <div data-reveal>
              <Kicker>Руководство</Kicker>
              <h2 className="h-xl">Люди, которые отвечают</h2>
            </div>
            <p
              className="lead"
              data-reveal
              style={{ "--reveal-delay": "80ms" }}
            >
              Состав руководства приведён в демонстрационных целях и
              соответствует ролевой структуре округа.
            </p>
          </div>

          <div className="leader-block" data-reveal>
            <div className="leader-tabs" aria-label="Выбор руководителя">
              {leadership.map((item, i) => (
                <button
                  key={item.name}
                  aria-pressed={i === selected}
                  className={`leader-tab ${i === selected ? "is-active" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  <span className={`monogram tone-${item.tone}`}>
                    {item.initials}
                  </span>
                  <span>
                    <strong>{item.name.split(" ").slice(1).join(" ")}</strong>
                    <small>{item.role}</small>
                  </span>
                </button>
              ))}
            </div>

            <article className="leader-card" key={person.name}>
              <span className={`monogram monogram-lg tone-${person.tone}`}>
                {person.initials}
              </span>
              <div>
                <span className="tiny-label">{person.focus}</span>
                <h3 className="h-lg">{person.name}</h3>
                <p className="leader-role">{person.role}</p>
                <p className="body-text">{person.bio}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ——— Призыв ——— */}
      <section className="section call-band">
        <div className="shell call-grid">
          <div data-reveal="left">
            <Kicker>Ваш голос важен</Kicker>
            <h2 className="h-xl">
              Есть вопрос?
              <br />
              <em>Мы открыты к диалогу.</em>
            </h2>
            <p className="muted">
              Обращение можно направить в любое время — ответ придёт в карточку
              дела.
            </p>
          </div>
          <div className="call-actions" data-reveal="right">
            <Button onClick={() => navigate("/submit")}>
              Направить обращение
            </Button>
            <Button
              variant="secondary"
              icon="search"
              onClick={() => navigate("/track")}
            >
              Проверить статус
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
