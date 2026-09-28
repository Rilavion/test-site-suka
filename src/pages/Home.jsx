import React from "react";
import HeroBackdrop from "../components/HeroBackdrop";
import Icon from "../components/ui/Icon";
import { Button, Mark, SplitTitle } from "../components/ui/Primitives";
import { siteConfig } from "../config/site";
import { asset } from "../utils/basePath";

/**
 * Главная — неподвижный экран во всю высоту окна.
 * Страница не прокручивается: это витрина горячей линии, с которой
 * пользователь уходит в нужный раздел. Содержательные блоки живут
 * на странице «О Министерстве».
 */
export default function Home({ navigate }) {
  const tel = `tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`;

  return (
    <div className="page home">
      <section className="hero">
        <HeroBackdrop />

        <div className="hero-inner shell">
          <span className="hero-tag">
            <img src={asset("assets/rmrp/rmrp-forum-logo.png")} alt="" />
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
            <a className="hero-call" href={tel}>
              <i>
                <Icon name="phone" size={17} />
              </i>
              <span>
                <small>Горячая линия · круглосуточно</small>
                <b>{siteConfig.hotline}</b>
              </span>
            </a>
          </div>

          <dl className="hero-facts">
            <div>
              <dt>Приём обращений</dt>
              <dd>Круглосуточно, без выходных</dd>
            </div>
            <div>
              <dt>Срок рассмотрения</dt>
              <dd>до {siteConfig.reviewDays}</dd>
            </div>
            <div>
              <dt>Контроль хода дела</dt>
              <dd>По номеру и коду доступа</dd>
            </div>
          </dl>
        </div>

        {/* нижняя полоса заменяет подвал: на главной прокрутки нет */}
        <div className="hero-foot">
          <div className="shell hero-foot-inner">
            <span className="hero-foot-brand">
              <Mark size="sm" />
              <span>
                <b>{siteConfig.shortName}</b>
                <small>{siteConfig.districtShort}</small>
              </span>
            </span>

            <nav className="hero-foot-links" aria-label="Быстрые ссылки">
              <button onClick={() => navigate("/ministry")}>
                О Министерстве
              </button>
              <button onClick={() => navigate("/contacts")}>Контакты</button>
              <button onClick={() => navigate("/staff/login")}>
                Служебный вход
              </button>
            </nav>

            <span className="hero-foot-note">{siteConfig.version}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
