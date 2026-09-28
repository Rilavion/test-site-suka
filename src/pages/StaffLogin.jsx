import ThemeSwitch from "../components/ThemeSwitch";
import React, { useState } from "react";
import { Button, Eyebrow, Mark } from "../components/ui/Primitives";
import { demoCredentials } from "../config/site";
import Icon from "../components/ui/Icon";
export default function StaffLogin({ onLogin, toast, navigate }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false);
  function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === demoCredentials.email &&
        password === demoCredentials.password
      ) {
        try {
          onLogin(demoCredentials);
        } catch {
          setError(
            "Браузер не разрешает сохранить демо-сессию. Проверьте настройки хранилища.",
          );
        }
      } else
        setError(
          "Не удалось подтвердить демонстрационные данные. Проверьте логин и пароль.",
        );
      setBusy(false);
    }, 500);
  }
  return (
    <div className="page login-page">
      <div className="login-backdrop">
        <span className="login-orbit lo-a" />
        <span className="login-orbit lo-b" />
        <span className="login-watermark">М</span>
      </div>
      <section className="login-panel">
        <div className="login-theme">
          <ThemeSwitch />
        </div>
        <button className="login-home" onClick={() => navigate("/")}>
          <Icon name="back" size={16} /> НА ГЛАВНУЮ
        </button>
        <div className="login-brand">
          <Mark light />
          <span>
            <b>МСПиТ</b>
            <small>ПАТРИАРШИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ</small>
          </span>
        </div>
        <Eyebrow number="ВХОД">ЗАЩИЩЁННЫЙ КОНТУР</Eyebrow>
        <h1>
          СЛУЖЕБНЫЙ
          <br />
          <em>ДОСТУП</em>
        </h1>
        <p className="login-intro">
          Войдите в систему для обработки обращений граждан.
        </p>
        <form onSubmit={submit}>
          <label className="field">
            <span>ЛОГИН / ЭЛЕКТРОННАЯ ПОЧТА</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mspt.local"
              required
              autoComplete="username"
            />
          </label>
          <label className="field password-field">
            <span>ПАРОЛЬ</span>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Скрыть пароль" : "Показать пароль"}
            >
              {show ? "СКРЫТЬ" : "ПОКАЗАТЬ"}
            </button>
          </label>
          {error && (
            <div className="inline-error">
              <span>!</span>
              {error}
            </div>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? "Проверка доступа…" : "Войти в систему"}
          </Button>
        </form>
        <div className="login-demo">
          <div>
            <Icon name="shield" size={17} />
            <span>ДЕМОНСТРАЦИОННЫЙ ВХОД</span>
          </div>
          <p>
            Логин <code>admin@mspt.local</code> &nbsp;·&nbsp; пароль{" "}
            <code>admin</code>
          </p>
        </div>
        <div className="demo-warning login-warning">
          <span>ДЕМО-РЕЖИМ</span> Вход открывает учебную систему. Все действия
          выполняются локально в этом браузере.
        </div>
      </section>
      <span className="login-side-note">MINISTRY / STAFF PORTAL</span>
    </div>
  );
}
