import React from "react";
import { siteConfig } from "../config/site";
import { Button, Eyebrow, Mark } from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
export default function Contacts({ navigate }) {
  return (
    <div className="page contacts-page">
      <section className="page-hero contacts-hero">
        <div className="page-hero-meta">
          <Eyebrow number="05">СВЯЗЬ С МИНИСТЕРСТВОМ</Eyebrow>
          <span>МЫ НА СВЯЗИ КАЖДЫЙ ДЕНЬ</span>
        </div>
        <h1 className="display-title">КОНТАКТЫ</h1>
        <p className="contacts-lead">
          Один звонок или одно сообщение — и мы поможем выбрать верный путь.
        </p>
        <div className="contacts-index">
          05
          <br />
          <span>КАНАЛЫ СВЯЗИ</span>
        </div>
      </section>
      <section className="contact-grid">
        <article className="contact-primary">
          <span className="contact-symbol">
            <Icon name="phone" size={22} />
          </span>
          <Eyebrow>ГОРЯЧАЯ ЛИНИЯ</Eyebrow>
          <a
            href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}
            className="contact-big"
          >
            {siteConfig.hotline}
          </a>
          <p>
            Бесплатный звонок по территории округа.
            <br />
            Обращения принимаются круглосуточно.
          </p>
          <span className="contact-foot">
            КОНСУЛЬТАЦИЯ СПЕЦИАЛИСТА — В ЧАСЫ РАБОТЫ
          </span>
        </article>
        <div className="contact-side">
          <article className="contact-cell">
            <span className="contact-symbol">
              <Icon name="mail" size={20} />
            </span>
            <Eyebrow>ЭЛЕКТРОННАЯ ПОЧТА</Eyebrow>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <p>Для вопросов о работе сервиса</p>
          </article>
          <article className="contact-cell">
            <span className="contact-symbol">
              <Icon name="pin" size={20} />
            </span>
            <Eyebrow>АДРЕС</Eyebrow>
            <b>{siteConfig.address}</b>
            <p>Приём посетителей по предварительной записи</p>
          </article>
        </div>
      </section>
      <section className="hours-band">
        <div>
          <Eyebrow>ГРАФИК РАБОТЫ</Eyebrow>
          <h2>
            МЫ РЯДОМ,
            <br />
            <em>КОГДА ВАМ НУЖНО.</em>
          </h2>
        </div>
        <div className="hours-value">
          <span className="hours-dot" />
          <p>{siteConfig.hours}</p>
          <small>Время указано по местному времени</small>
        </div>
      </section>
      <section className="contact-map">
        <div className="map-visual">
          <img
            className="contact-place-photo"
            src="/assets/backgrounds/patriarch-district.jpg"
            alt="Здание приёмной Патриаршего федерального округа"
          />
          <div className="contact-place-brand">
            <Mark light />
            <span>ПРИЁМНАЯ МСПиТ</span>
          </div>
          <span className="map-label">
            ПАТРИАРСК
            <br />
            59°56′ N / 30°18′ E
          </span>
          <span className="map-coordinate map-coord-a">ЦЕНТРАЛЬНЫЙ ВХОД</span>
        </div>
        <div className="map-copy">
          <Eyebrow>ПРИЁМНАЯ МИНИСТЕРСТВА</Eyebrow>
          <h2>
            СОБОРНАЯ
            <br />
            ПЛОЩАДЬ, 4
          </h2>
          <p>
            Демонстрационный адрес ведомства. Для личного приёма, пожалуйста,
            предварительно свяжитесь с горячей линией.
          </p>
          <Button variant="outline" onClick={() => navigate("/submit")}>
            Задать вопрос онлайн
          </Button>
        </div>
      </section>
    </div>
  );
}
