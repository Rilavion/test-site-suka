import React, { useState } from "react";
import { leadership } from "../data/leadership";
import { ministryDirections, siteConfig } from "../config/site";
import { Button, Eyebrow, Mark } from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
export default function Ministry({ navigate }) {
  const [selected, setSelected] = useState(0);
  const person = leadership[selected];
  return (
    <div className="page ministry-page">
      <section className="page-hero ministry-intro">
        <div className="page-hero-meta">
          <Eyebrow number="02">О ВЕДОМСТВЕ</Eyebrow>
          <span>ПАТРИАРШИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ</span>
        </div>
        <h1 className="display-title">
          О<br />
          <span>МИНИСТЕРСТВЕ</span>
        </h1>
        <div className="ministry-lead">
          <span className="lead-rule" />
          <p>
            Работаем для того, чтобы социальная поддержка была <i>доступной</i>,
            труд — достойным, а диалог с жителями — открытым.
          </p>
          <span className="lead-index">
            УКАЗ ПФО
            <br />№ 014 / 2024
          </span>
        </div>
        <div className="ministry-seal" aria-hidden="true">
          <span>М</span>
          <i />
        </div>
      </section>
      <section className="ministry-statement">
        <div>
          <Eyebrow>НАША МИССИЯ</Eyebrow>
          <h2>
            СОЗДАВАТЬ УСЛОВИЯ,
            <br />В КОТОРЫХ <em>ЧЕЛОВЕК</em>
            <br />
            ЧУВСТВУЕТ ОПОРУ.
          </h2>
        </div>
        <p className="statement-copy">
          Министерство формирует и реализует политику в сфере социальной защиты
          населения и труда, объединяя усилия профессионального сообщества и
          гражданского общества.
        </p>
      </section>
      <section className="directions-section">
        <div className="section-heading">
          <div>
            <Eyebrow number="02">НАПРАВЛЕНИЯ</Eyebrow>
            <h2>
              РАБОТАЕМ
              <br />
              ПО СУЩЕСТВУ
            </h2>
          </div>
          <p>
            Четыре взаимосвязанных направления формируют целостную систему
            поддержки жителей округа.
          </p>
        </div>
        <div className="direction-list">
          {ministryDirections.map((d, i) => (
            <article className="direction-row" key={d.number}>
              <span className="direction-no">{d.number}</span>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              <span className="direction-symbol">0{i + 1}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="structure-section">
        <div className="structure-graphic">
          <div className="structure-brand">
            <Mark light />
            <span>ЕДИНАЯ СЛУЖБА ОБРАЩЕНИЙ</span>
            <strong>МСПиТ ПФО</strong>
            <p>
              Принимаем обращение, направляем специалисту и возвращаемся с
              ответом.
            </p>
          </div>
          <div className="structure-channels">
            <span>
              <b>01</b> Принять
            </span>
            <span>
              <b>02</b> Рассмотреть
            </span>
            <span>
              <b>03</b> Ответить
            </span>
          </div>
        </div>
        <div className="structure-copy">
          <Eyebrow number="03">СТРУКТУРА</Eyebrow>
          <h2>
            ЕДИНАЯ
            <br />
            СИСТЕМА.
            <br />
            <em>ОБЩАЯ ЦЕЛЬ.</em>
          </h2>
          <p>
            Министерство объединяет профильные управления, территориальные
            подразделения и службу обратной связи. Такая структура помогает
            видеть ситуацию целиком и действовать согласованно.
          </p>
          <button className="text-link" onClick={() => navigate("/contacts")}>
            Связаться с ведомством <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>
      <section className="leadership-section">
        <div className="section-heading">
          <div>
            <Eyebrow number="04">РУКОВОДСТВО</Eyebrow>
            <h2>
              ЛЮДИ,
              <br />
              <span>КОТОРЫЕ ОТВЕЧАЮТ</span>
            </h2>
          </div>
          <div className="leader-controls">
            <span>
              0{selected + 1} <i>/</i> 0{leadership.length}
            </span>
            <div>
              <button
                onClick={() =>
                  setSelected(
                    (selected + leadership.length - 1) % leadership.length,
                  )
                }
                aria-label="Предыдущий руководитель"
              >
                ←
              </button>
              <button
                onClick={() => setSelected((selected + 1) % leadership.length)}
                aria-label="Следующий руководитель"
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div
          className={`leader-showcase tone-${person.tone}`}
          key={person.name}
        >
          <div className="leader-portrait">
            <img
              src={person.image}
              alt={`Условный аватар: ${person.name}`}
              loading="lazy"
            />
            <div className="portrait-index">0{selected + 1}</div>
          </div>
          <div className="leader-info">
            <span className="tiny-label">РУКОВОДСТВО МИНИСТЕРСТВА</span>
            <h3>{person.name}</h3>
            <p className="leader-role">{person.role}</p>
            <span className="leader-rule" />
            <p className="leader-bio">{person.bio}</p>
            <div className="leader-focus">
              <span>НАПРАВЛЕНИЕ</span>
              <b>{person.focus}</b>
            </div>
            <div className="leader-tabs">
              {leadership.map((x, i) => (
                <button
                  key={x.name}
                  className={i === selected ? "selected" : ""}
                  onClick={() => setSelected(i)}
                  aria-label={`Показать ${x.name}`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <i />
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="demo-caption">
          Состав руководства представлен в демонстрационных целях
        </p>
      </section>
      <section className="ministry-cta">
        <div>
          <Eyebrow>ВАШ ГОЛОС ВАЖЕН</Eyebrow>
          <h2>
            ЕСТЬ ВОПРОС?
            <br />
            <em>МЫ ОТКРЫТЫ К ДИАЛОГУ.</em>
          </h2>
        </div>
        <Button onClick={() => navigate("/submit")}>Направить обращение</Button>
      </section>
    </div>
  );
}
