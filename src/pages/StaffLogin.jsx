import React, { useState } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import Icon from "../components/ui/Icon";
import { Button, Mark } from "../components/ui/Primitives";
import { demoCredentials, siteConfig } from "../config/site";

export default function StaffLogin({ onLogin, navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

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
      } else {
        setError(
          "Не удалось подтвердить демонстрационные данные. Проверьте логин и пароль.",
        );
      }
      setBusy(false);
    }, 450);
  }

  return (
    <div className="page login">
      <aside className="login-aside">
        <img src="/assets/media/colonnade.jpg" alt="" />
        <div className="login-aside-copy">
          <Mark size="lg" />
          <h2 className="h-lg">
            Служебный контур
            <br />
            электронной приёмной
          </h2>
          <p>
            Реестр обращений, журнал действий и подготовка официальных ответов
            Министерства социальной политики и труда {siteConfig.districtName}.
          </p>
          <span className="tiny-label">{siteConfig.server}</span>
        </div>
      </aside>

      <section className="login-panel">
        <div className="login-top">
          <button className="back-link" onClick={() => navigate("/")}>
            <Icon name="back" size={15} /> На главную
          </button>
          <ThemeSwitch />
        </div>

        <div className="login-form-wrap">
          <span className="tiny-label">Защищённый вход</span>
          <h1 className="h-xl">
            Служебный <em>доступ</em>
          </h1>
          <p className="body-text">
            Войдите в систему для обработки обращений граждан округа.
          </p>

          <form onSubmit={submit}>
            <label className="field">
              <span>Логин / электронная почта</span>
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
              <span>Пароль</span>
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
                {show ? "Скрыть" : "Показать"}
              </button>
            </label>

            {error && (
              <div className="inline-error">
                <span>!</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="btn-block"
              disabled={busy}
              icon={busy ? null : "lock"}
            >
              {busy ? "Проверка доступа…" : "Войти в систему"}
            </Button>
          </form>

          <div className="note note-accent">
            <Icon name="shield" size={17} />
            <span>
              <b>Демонстрационный вход.</b> Логин <code>admin@mspt.local</code>,
              пароль <code>admin</code>. Все действия выполняются локально в
              этом браузере.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
