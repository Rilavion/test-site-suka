import React, { useState } from "react";
import PageIntro from "../components/PageIntro";
import Icon from "../components/ui/Icon";
import { Button, Kicker, Mark, useReveal } from "../components/ui/Primitives";
import { leadership } from "../data/leadership";
import {
  appealFlow,
  hotlineServices,
  ministryDirections,
  ministryFacts,
  siteConfig,
} from "../config/site";
import { asset } from "../utils/basePath";

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

      {/* ——— Три способа обратиться ——— */}
      <section className="section services" id="services">
        <div className="shell">
          <div className="section-head">
            <div data-reveal>
              <Kicker>Электронная приёмная</Kicker>
              <h2 className="h-xl">
                Три способа обратиться
                <br />в Министерство
              </h2>
            </div>
            <p
              className="lead"
              data-reveal
              style={{ "--reveal-delay": "90ms" }}
            >
              Все каналы ведут в одну систему: обращение из формы, звонка или
              письма получает единый номер и проходит одинаковые этапы
              рассмотрения.
            </p>
          </div>

          <div className="service-row">
            {hotlineServices.map((item, i) => (
              <article
                className="service"
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": `${i * 110}ms` }}
              >
                <span className="service-icon">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="h-md">{item.title}</h3>
                <p>{item.body}</p>
                <button
                  className="link-arrow"
                  onClick={() => navigate(item.path)}
                >
                  {item.action}
                  <Icon name="arrow" size={16} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Путь обращения ——— */}
      <section className="section section-tint flow">
        <div className="shell">
          <div className="section-head">
            <div data-reveal>
              <Kicker>Как проходит обращение</Kicker>
              <h2 className="h-xl">
                Понятный путь —<br />
                от заявки до ответа
              </h2>
            </div>
            <p
              className="lead"
              data-reveal
              style={{ "--reveal-delay": "90ms" }}
            >
              На каждом шаге в карточке обращения появляется запись. Вы видите,
              где сейчас находится дело и кто им занимается.
            </p>
          </div>

          <ol className="flow-line">
            {appealFlow.map((item, i) => (
              <li
                key={item.step}
                data-reveal
                style={{ "--reveal-delay": `${i * 110}ms` }}
              >
                <span className="flow-dot">
                  <i />
                </span>
                <span className="flow-index">
                  Шаг {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="h-md">{item.step}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Ведомство вблизи ——— */}
      <section className="section teaser">
        <div className="shell teaser-grid">
          <figure className="teaser-media wave-reveal" data-reveal="scale">
            <img
              src={asset("assets/media/colonnade.jpg")}
              alt="Фасад здания Министерства"
              loading="lazy"
            />
            <figcaption>
              <Mark size="sm" />
              Дом Правительства · Патриарск
            </figcaption>
          </figure>

          <div className="teaser-copy" data-reveal="right">
            <Kicker>Структура</Kicker>
            <h2 className="h-xl">
              Ведомство, к которому
              <br />
              можно <em>обратиться напрямую</em>
            </h2>
            <p className="body-text">
              Министерство объединяет профильные управления, территориальные
              подразделения и службу обратной связи. Такая структура помогает
              видеть ситуацию целиком: обращение гражданина попадает сразу к
              тем, кто может решить вопрос, без посредников и пересылок.
            </p>
            <button
              className="link-arrow"
              onClick={() => navigate("/contacts")}
            >
              Связаться с ведомством
              <Icon name="arrow" size={16} />
            </button>
          </div>
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
            <Kicker>Нужна помощь прямо сейчас</Kicker>
            <h2 className="h-xl">
              Позвоните на горячую линию —<br />
              <em>мы на связи</em>
            </h2>
            <a
              className="call-number"
              href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}
            >
              {siteConfig.hotline}
            </a>
            <p className="muted">
              {siteConfig.hoursShort} · обращения через сайт принимаются
              круглосуточно
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
