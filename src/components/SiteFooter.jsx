import React from "react";
import { siteConfig, navItems } from "../config/site";
import { Mark } from "./ui/Primitives";
import Icon from "./ui/Icon";
import "../styles/footer.css";
export default function SiteFooter({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-heading">
        <div className="footer-brand">
          <Mark />
          <div>
            <b>{siteConfig.ministryName}</b>
            <small>{siteConfig.districtName}</small>
          </div>
        </div>
        <span className="footer-year">{new Date().getFullYear()}</span>
      </div>
      <div className="footer-main">
        <p className="footer-statement">
          Диалог начинается
          <br />
          <em>с вашего слова.</em>
        </p>
        <nav className="footer-nav" aria-label="Навигация в подвале">
          {navItems.map((i) => (
            <button key={i.path} onClick={() => navigate(i.path)}>
              {i.title}
              <Icon name="arrow" size={16} />
            </button>
          ))}
        </nav>
        <div className="footer-contact">
          <span className="tiny-label">ГОРЯЧАЯ ЛИНИЯ</span>
          <a href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}>
            {siteConfig.hotline}
          </a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <small>Обращения онлайн — круглосуточно</small>
        </div>
      </div>
      <div className="footer-bottom">
        <span>МСПиТ / ПФО</span>
        <span>
          {siteConfig.project} · {siteConfig.server}
        </span>
        <button onClick={() => navigate("/staff/login")}>
          Служебный доступ <Icon name="arrow" size={16} />
        </button>
      </div>
    </footer>
  );
}
