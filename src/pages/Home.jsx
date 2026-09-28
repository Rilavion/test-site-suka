import React from "react";
import HeroBackdrop from "../components/HeroBackdrop";
import Icon from "../components/ui/Icon";
import {
  Button,
  Kicker,
  Mark,
  SplitTitle,
  useReveal,
} from "../components/ui/Primitives";
import {
  siteConfig,
  hotlineServices,
  appealFlow,
  ministryFacts,
} from "../config/site";

export default function Home({ navigate }) {
  useReveal("home");
  const tel = `tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`;

  return (
    <div className="page home">
      {/* ——— Первый экран ——— */}
      <section className="hero">
        <HeroBackdrop />
        <div className="hero-inner shell">
          <span className="hero-tag">
            <img src="/assets/rmrp/rmrp-forum-logo.png" alt="" />
            RMRP · GTA5RP · Сервер №3 «Патрики»
          </span>

          <h1 className="display hero-title">
            <SplitTitle lines={["Горячая линия"]} delay={120} />
            <span className="hero-title-sub">
              <SplitTitle lines={["Министерства"]} delay={420} />
            </span>
          </h1>

          <p className="hero-lead">
            Прямая связь жителей Патриаршего федерального округа с Министерством
            социальной политики и труда. Обращение регистрируется за минуту,
            получает номер и не теряется.
          </p>

          <div className="hero-actions">
            <Button onClick={() => navigate("/submit")}>
              Подать обращение
            </Button>
            <Button
              variant="ghost-light"
              icon="search"
              onClick={() => navigate("/track")}
            >
              Проверить статус
            </Button>
          </div>

          <dl className="hero-facts">
            <div>
              <dt>Горячая линия</dt>
              <dd>
                <a href={tel}>{siteConfig.hotline}</a>
              </dd>
            </div>
            <div>
              <dt>Приём обращений</dt>
              <dd>Круглосуточно, без выходных</dd>
            </div>
            <div>
              <dt>Срок рассмотрения</dt>
              <dd>до {siteConfig.reviewDays}</dd>
            </div>
          </dl>
        </div>

        <a className="hero-scroll" href="#services">
          <span>Что можно сделать</span>
          <i>
            <Icon name="down" size={16} />
          </i>
        </a>
      </section>

      {/* ——— Три действия ——— */}
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

      {/* ——— О ведомстве ——— */}
      <section className="section teaser">
        <div className="shell teaser-grid">
          <figure className="teaser-media wave-reveal" data-reveal="scale">
            <img
              src="/assets/media/colonnade.jpg"
              alt="Фасад здания Министерства"
              loading="lazy"
            />
            <figcaption>
              <Mark size="sm" />
              Дом Правительства · Патриарск
            </figcaption>
          </figure>

          <div className="teaser-copy" data-reveal="right">
            <Kicker>О Министерстве</Kicker>
            <h2 className="h-xl">
              Ведомство, к которому
              <br />
              можно <em>обратиться напрямую</em>
            </h2>
            <p className="body-text">
              Министерство социальной политики и труда отвечает за поддержку
              жителей округа, защиту трудовых прав и доступность городской
              среды. Горячая линия — часть этой работы: она соединяет гражданина
              с профильным специалистом без посредников.
            </p>

            <dl className="fact-strip">
              {ministryFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.value}</dt>
                  <dd>{fact.label}</dd>
                </div>
              ))}
            </dl>

            <button
              className="link-arrow"
              onClick={() => navigate("/ministry")}
            >
              Структура и руководство
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ——— Контактная полоса ——— */}
      <section className="section call-band">
        <div className="shell call-grid">
          <div data-reveal="left">
            <Kicker>Нужна помощь прямо сейчас</Kicker>
            <h2 className="h-xl">
              Позвоните на горячую линию —<br />
              <em>мы на связи</em>
            </h2>
            <a className="call-number" href={tel}>
              {siteConfig.hotline}
            </a>
            <p className="muted">
              {siteConfig.hoursShort} · обращения через сайт принимаются
              круглосуточно
            </p>
          </div>
          <div className="call-actions" data-reveal="right">
            <Button onClick={() => navigate("/submit")}>
              Написать обращение
            </Button>
            <Button
              variant="secondary"
              icon="pin"
              onClick={() => navigate("/contacts")}
            >
              Адрес и часы приёма
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
