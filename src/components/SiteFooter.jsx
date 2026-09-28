import React from "react";
import { siteConfig, navItems } from "../config/site";
import { Mark } from "./ui/Primitives";
import { asset } from "../utils/basePath";

export default function SiteFooter({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <Mark size="md" />
              <span>
                <b>{siteConfig.ministryName}</b>
                <small>{siteConfig.districtName}</small>
              </span>
            </div>
            <p>
              Электронная приёмная ведомства: обращение регистрируется
              автоматически, а ход рассмотрения виден заявителю по личному коду
              доступа.
            </p>
          </div>

          <div className="footer-col">
            <span className="tiny-label">Разделы</span>
            {navItems.map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)}>
                {item.title}
              </button>
            ))}
          </div>

          <div className="footer-col">
            <span className="tiny-label">Горячая линия</span>
            <a
              className="footer-phone"
              href={`tel:${siteConfig.hotline.replace(/[^+\d]/g, "")}`}
            >
              {siteConfig.hotline}
            </a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <span className="muted" style={{ fontSize: "0.86rem" }}>
              {siteConfig.address}
            </span>
            <span className="muted" style={{ fontSize: "0.86rem" }}>
              {siteConfig.hours}
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} МСПиТ ПФО · {siteConfig.version}
          </span>
          <span className="footer-rmrp">
            <img src={asset("assets/rmrp/rmrp-forum-logo.png")} alt="" />
            {siteConfig.project} · {siteConfig.server}
          </span>
          <button onClick={() => navigate("/staff/login")}>
            Служебный доступ
          </button>
        </div>
      </div>
    </footer>
  );
}
