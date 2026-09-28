import React from "react";
import { Button, Eyebrow } from "../components/ui/Primitives";
import AmbientBackground from "../components/AmbientBackground";
import Icon from "../components/ui/Icon";
import { siteConfig } from "../config/site";
export default function Home({ navigate }) {
  return (
    <div className="page page-home">
      <AmbientBackground />
      <section className="lobby-content">
        <Eyebrow>МСПиТ ПФО · RMRP / СЕРВЕР №3 «ПАТРИКИ»</Eyebrow>
        <h1 className="lobby-title">
          ГОРЯЧАЯ
          <span>
            ЛИНИЯ<span className="lobby-period">.</span>
          </span>
        </h1>
        <div className="lobby-intro">
          <span className="lobby-rule" />
          <div>
            <h2>Связь граждан с Министерством — в одном месте.</h2>
            <p>
              Расскажите о проблеме, получите помощь специалиста
              <br className="desktop-break" /> или следите за ходом обращения.
            </p>
          </div>
        </div>
        <div className="lobby-actions">
          <Button onClick={() => navigate("/submit")}>Подать обращение</Button>
          <Button variant="secondary" onClick={() => navigate("/track")}>
            Проверить обращение
          </Button>
        </div>
        <button className="lobby-about" onClick={() => navigate("/ministry")}>
          <span>Изучить структуру округа</span>
          <Icon name="arrow" size={18} />
        </button>
      </section>
      <div className="lobby-side-note">
        <span>RMRP · СЕРВЕР №3</span>
        <p>
          Патрики начинаются
          <br />
          <em>с людей.</em>
        </p>
      </div>
      <footer className="lobby-strip">
        <span>
          <i /> ОБРАЩЕНИЯ ОНЛАЙН <b>24 / 7</b>
        </span>
        <a href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}>
          {siteConfig.hotline}
        </a>
        <button onClick={() => navigate("/contacts")}>
          Контакты <Icon name="arrow" size={16} />
        </button>
        <small>ПФО · RMRP / SERVER 03</small>
      </footer>
    </div>
  );
}
