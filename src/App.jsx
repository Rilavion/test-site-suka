import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { Header, Navigation } from "./components/navigation/Navigation";
import SiteFooter from "./components/SiteFooter";
import { Toast, Mark, Modal, Button } from "./components/ui/Primitives";
import Icon from "./components/ui/Icon";
import Home from "./pages/Home";
import Ministry from "./pages/Ministry";
import SubmitAppeal from "./pages/SubmitAppeal";
import TrackAppeal from "./pages/TrackAppeal";
import Contacts from "./pages/Contacts";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import AppealDetails from "./pages/AppealDetails";
import {
  loadAppeals,
  saveAppeals,
  loadSession,
  saveSession,
  APPEALS_KEY,
} from "./utils/storage";
import { navItems } from "./config/site";
import { createAppealRecord } from "./services/appealService";
import { motionConfig, reducedMotion } from "./config/motion";

function BootScreen() {
  return (
    <div className="boot-screen" aria-label="Загрузка портала">
      <Mark size="xl" />
      <b>МСПиТ · Патриарший федеральный округ</b>
      <span className="boot-bar">
        <i />
      </span>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => ({
    path: window.location.pathname || "/",
    data: window.history.state?.routeData || null,
  }));
  const [menu, setMenu] = useState(false);
  const [booting, setBooting] = useState(true);
  const [phase, setPhase] = useState("");
  const [sweep, setSweep] = useState(0);
  const [appeals, setAppealsState] = useState(loadAppeals);
  const [user, setUser] = useState(loadSession);
  const [toastState, setToastState] = useState(null);
  const [draftDirty, setDraftDirty] = useState(false);
  const [leavePrompt, setLeavePrompt] = useState(false);

  const pendingNavigation = useRef(null);
  const confirmingNavigation = useRef(false);
  const appealStore = useRef(appeals);
  const navigationBusy = useRef(false);
  const timers = useRef([]);
  const stage = useRef(null);
  const scrollPositions = useRef(new Map());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (stage.current) stage.current.inert = menu || leavePrompt;
  }, [menu, leavePrompt, route.path]);

  /* синхронизация между вкладками */
  useEffect(() => {
    const sync = (e) => {
      if (e.key !== APPEALS_KEY) return;
      appealStore.current = loadAppeals();
      setAppealsState(appealStore.current);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* заголовок вкладки и фокус на содержимое */
  useEffect(() => {
    const name =
      navItems.find((item) => item.path === route.path)?.title ||
      (route.path.startsWith("/staff")
        ? "Центр обращений"
        : "Раздел не найден");
    document.title = `${name} — МСПиТ ПФО`;
    document.querySelector("#main-content")?.focus({ preventScroll: true });
  }, [route.path]);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(t);
  }, []);

  /* ручное восстановление прокрутки */
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const save = () =>
      scrollPositions.current.set(window.location.pathname, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      history.scrollRestoration = previous;
      window.removeEventListener("scroll", save);
    };
  }, []);

  const applyRoute = useCallback((path, data, scrollTo = 0) => {
    window.history.pushState({ routeData: data }, "", path);
    flushSync(() => setRoute({ path, data }));
    window.scrollTo({ top: scrollTo, behavior: "instant" });
  }, []);

  const runTransition = useCallback((apply) => {
    if (reducedMotion()) {
      apply();
      navigationBusy.current = false;
      return;
    }
    setSweep((n) => n + 1);
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => apply());
      transition.finished.finally(() => {
        navigationBusy.current = false;
      });
      return;
    }
    setPhase("route-leaving");
    timers.current.push(
      setTimeout(() => {
        apply();
        setPhase("route-entering");
        timers.current.push(
          setTimeout(() => {
            setPhase("");
            navigationBusy.current = false;
          }, motionConfig.pageTransition),
        );
      }, 280),
    );
  }, []);

  /* переход по маршруту */
  const navigate = useCallback(
    (target, data = null) => {
      const path = target || "/";
      if (
        route.path === "/submit" &&
        draftDirty &&
        !confirmingNavigation.current &&
        path !== route.path
      ) {
        pendingNavigation.current = { path, data };
        setLeavePrompt(true);
        return;
      }
      if (path === route.path && data === null) return;
      if (navigationBusy.current) return;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      navigationBusy.current = true;
      setMenu(false);
      runTransition(() => applyRoute(path, data));
    },
    [route.path, draftDirty, runTransition, applyRoute],
  );

  /* кнопка «назад» браузера */
  useEffect(() => {
    const pop = () => {
      const poppedPath = window.location.pathname || "/";
      const poppedData = window.history.state?.routeData || null;
      if (
        route.path === "/submit" &&
        draftDirty &&
        !leavePrompt &&
        poppedPath !== route.path
      ) {
        window.history.pushState({ routeData: route.data }, "", route.path);
        pendingNavigation.current = { path: poppedPath, data: poppedData };
        setLeavePrompt(true);
        return;
      }
      timers.current.forEach(clearTimeout);
      navigationBusy.current = false;
      setMenu(false);
      const top =
        poppedPath === "/" ? 0 : scrollPositions.current.get(poppedPath) || 0;
      const apply = () => {
        flushSync(() => setRoute({ path: poppedPath, data: poppedData }));
        window.scrollTo({ top, behavior: "instant" });
      };
      if (!reducedMotion() && document.startViewTransition) {
        setSweep((n) => n + 1);
        document.startViewTransition(apply);
      } else {
        apply();
      }
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [route.path, route.data, draftDirty, leavePrompt]);

  const cancelLeave = useCallback(() => {
    setLeavePrompt(false);
    pendingNavigation.current = null;
  }, []);

  const confirmLeave = useCallback(() => {
    const target = pendingNavigation.current;
    pendingNavigation.current = null;
    setLeavePrompt(false);
    setDraftDirty(false);
    confirmingNavigation.current = true;
    if (target) navigate(target.path, target.data);
    confirmingNavigation.current = false;
  }, [navigate]);

  const showToast = useCallback((message, type = "success") => {
    setToastState({ message, type, nonce: Date.now() });
  }, []);
  const clearToast = useCallback(() => setToastState(null), []);

  const updateAppeals = useCallback((value) => {
    const next =
      typeof value === "function" ? value(appealStore.current) : value;
    saveAppeals(next);
    appealStore.current = next;
    setAppealsState(next);
  }, []);

  const createAppeal = useCallback(
    (form) => {
      const appeal = createAppealRecord(form, appealStore.current);
      updateAppeals((prev) => [appeal, ...prev]);
      return appeal;
    },
    [updateAppeals],
  );

  const updateAppeal = useCallback(
    (updated) =>
      updateAppeals((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      ),
    [updateAppeals],
  );

  const login = useCallback(
    ({ name, role, email }) => {
      saveSession({ name, role, email });
      setUser({ name, role, email });
      navigate("/staff");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
    navigate("/staff/login");
  }, [navigate]);

  const path = route.path.replace(/\/$/, "") || "/";
  const detailMatch = path.match(/^\/staff\/appeals\/(.+)$/);
  const isPrivateView = path.startsWith("/staff");
  const currentNav = useMemo(
    () => (path === "/" ? "/" : path.startsWith("/staff") ? "/staff" : path),
    [path],
  );

  let page;
  if (path === "/") page = <Home navigate={navigate} />;
  else if (path === "/ministry") page = <Ministry navigate={navigate} />;
  else if (path === "/submit")
    page = (
      <SubmitAppeal
        onSubmit={createAppeal}
        navigate={navigate}
        toast={showToast}
        onDirtyChange={setDraftDirty}
      />
    );
  else if (path === "/track")
    page = <TrackAppeal appeals={appeals} routeData={route.data} />;
  else if (path === "/contacts") page = <Contacts navigate={navigate} />;
  else if (path === "/staff/login")
    page = user ? (
      <StaffDashboard
        appeals={appeals}
        navigate={navigate}
        user={user}
        onLogout={logout}
      />
    ) : (
      <StaffLogin onLogin={login} navigate={navigate} />
    );
  else if (path === "/staff" && !user)
    page = <StaffLogin onLogin={login} navigate={navigate} />;
  else if (path === "/staff")
    page = (
      <StaffDashboard
        appeals={appeals}
        navigate={navigate}
        user={user}
        onLogout={logout}
      />
    );
  else if (detailMatch && !user)
    page = <StaffLogin onLogin={login} navigate={navigate} />;
  else if (detailMatch)
    page = (
      <AppealDetails
        appeals={appeals}
        appealId={detailMatch[1]}
        navigate={navigate}
        user={user}
        onUpdate={updateAppeal}
        toast={showToast}
      />
    );
  else
    page = (
      <div className="not-found">
        <Mark size="lg" />
        <h1>Раздел не найден</h1>
        <p className="lead">
          Возможно, страница была перемещена или адрес указан с ошибкой.
        </p>
        <button className="link-arrow" onClick={() => navigate("/")}>
          Вернуться на главную
          <Icon name="arrow" size={16} />
        </button>
      </div>
    );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      {booting && <BootScreen />}

      <div
        className={`app-root ${phase} ${isPrivateView ? "is-private" : ""} ${
          path === "/" ? "is-home" : ""
        }`}
      >
        {!isPrivateView && (
          <Header
            onMenu={() => setMenu(true)}
            navigate={navigate}
            staff={!!user}
            menuOpen={menu}
            currentPath={currentNav}
          />
        )}

        <div className="view-stage" key={path} ref={stage}>
          <main id="main-content" tabIndex={-1}>
            {page}
          </main>
          {!isPrivateView && <SiteFooter navigate={navigate} />}
        </div>

        {!isPrivateView && (
          <Navigation
            open={menu}
            onClose={() => setMenu(false)}
            navigate={navigate}
            currentPath={currentNav}
            staff={!!user}
          />
        )}

        <Toast toast={toastState} onClose={clearToast} />

        <Modal
          open={leavePrompt}
          title="Покинуть форму?"
          onClose={cancelLeave}
          actions={
            <>
              <button className="btn btn-quiet btn-sm" onClick={cancelLeave}>
                <span>Остаться</span>
              </button>
              <Button size="sm" onClick={confirmLeave}>
                Покинуть страницу
              </Button>
            </>
          }
        >
          <p>
            Введённые данные этого обращения ещё не отправлены. Если перейти в
            другой раздел, черновик будет потерян.
          </p>
        </Modal>

        {sweep > 0 && (
          <div className="route-progress" key={sweep} aria-hidden="true">
            <i />
          </div>
        )}
      </div>
    </>
  );
}
