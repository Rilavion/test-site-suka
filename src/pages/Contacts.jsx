import React from "react";
import PageIntro from "../components/PageIntro";
import Icon from "../components/ui/Icon";
import { Button, Kicker, Mark, useReveal } from "../components/ui/Primitives";
import { siteConfig } from "../config/site";

export default function Contacts({ navigate }) {
  useReveal("contacts");
  const tel = `tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`;

  return (
    <div className="page">
      <PageIntro
        kicker="Связь с Министерством"
        title={["Контакты"]}
        lead="Один звонок или одно сообщение — и специалист горячей линии поможет выбрать верный путь."
        aside={
          <div className="intro-card intro-card-accent">
            <span className="tiny-label">Горячая линия</span>
            <a className="intro-phone" href={tel}>
              {siteConfig.hotline}
            </a>
            <p className="muted">
              Бесплатный звонок по территории округа. Обращения через сайт
              принимаются круглосуточно.
            </p>
            <hr className="rule" />
            <span className="tiny-label">Консультация специалиста</span>
            <p>{siteConfig.hoursShort}</p>
          </div>
        }
      />

      {/* ——— Каналы связи ——— */}
      <section className="section">
        <div className="shell contact-channels">
          {[
            {
              icon: "phone",
              label: "Телефон",
              value: siteConfig.hotline,
              href: tel,
              note: "Круглосуточный приём обращений, консультации — в рабочие часы",
            },
            {
              icon: "mail",
              label: "Электронная почта",
              value: siteConfig.email,
              href: `mailto:${siteConfig.email}`,
              note: "Вопросы о работе сервиса и технические обращения",
            },
            {
              icon: "pin",
              label: "Приёмная",
              value: siteConfig.address,
              note: "Личный приём — по предварительной записи",
            },
            {
              icon: "clock",
              label: "Часы работы",
              value: siteConfig.hoursShort,
              note: "Время указано по местному времени округа",
            },
          ].map((item, i) => (
            <article
              className="channel"
              key={item.label}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` }}
            >
              <span className="channel-icon">
                <Icon name={item.icon} size={20} />
              </span>
              <span className="tiny-label">{item.label}</span>
              {item.href ? (
                <a className="channel-value underline-sweep" href={item.href}>
                  {item.value}
                </a>
              ) : (
                <b className="channel-value">{item.value}</b>
              )}
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ——— Приёмная ——— */}
      <section className="section section-tint">
        <div className="shell place-grid">
          <figure className="place-media wave-reveal" data-reveal="scale">
            <img
              src="/assets/media/government-house.jpg"
              alt="Здание приёмной Министерства на Соборной площади"
              loading="lazy"
            />
            <figcaption>
              <Mark size="sm" />
              <span>
                <b>Приёмная МСПиТ</b>
                <small>Патриарск · 59°56′ N / 30°18′ E</small>
              </span>
            </figcaption>
          </figure>

          <div className="place-copy" data-reveal="right">
            <Kicker>Приёмная Министерства</Kicker>
            <h2 className="h-xl">
              Соборная
              <br />
              площадь, 4
            </h2>
            <p className="body-text">
              Здание Дома Правительства округа. Личный приём граждан ведётся по
              предварительной записи — её можно оформить по телефону горячей
              линии или отправив обращение через сайт.
            </p>
            <ul className="place-list">
              <li>
                <Icon name="check" size={16} />
                Центральный вход со стороны Соборной площади
              </li>
              <li>
                <Icon name="check" size={16} />
                Доступная среда: пандус, лифт, сопровождение
              </li>
              <li>
                <Icon name="check" size={16} />
                При себе — документ, удостоверяющий личность
              </li>
            </ul>
            <Button variant="secondary" onClick={() => navigate("/submit")}>
              Задать вопрос онлайн
            </Button>
          </div>
        </div>
      </section>

      {/* ——— Призыв ——— */}
      <section className="section call-band">
        <div className="shell call-grid">
          <div data-reveal="left">
            <Kicker>Не дозвонились?</Kicker>
            <h2 className="h-xl">
              Напишите — <em>ответим письменно</em>
            </h2>
            <p className="muted">
              Электронное обращение регистрируется автоматически и получает
              номер для отслеживания.
            </p>
          </div>
          <div className="call-actions" data-reveal="right">
            <Button onClick={() => navigate("/submit")}>
              Подать обращение
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
