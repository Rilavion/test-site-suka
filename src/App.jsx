import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Header, Navigation } from "./components/navigation/Navigation";
import SiteFooter from "./components/SiteFooter";
import {
  Toast,
  Mark,
  Eyebrow,
  Modal,
  Button,
} from "./components/ui/Primitives";
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
import { themeConfig } from "./config/theme";

function InitialLoader() {
  return (
    <div className="initial-loader" aria-label="Загрузка портала">
      <div className="loader-content">
        <Mark light />
        <span className="loader-ministry">МСПиТ</span>
        <span className="loader-line">
          <i />
        </span>
        <span className="loader-district">ПАТРИАРШИЙ ФЕДЕРАЛЬНЫЙ ОКРУГ</span>
      </div>
      <span className="loader-bottom">ГОСУДАРСТВЕННЫЙ СЕРВИС / 2026</span>
    </div>
  );
}
export default function App() {
  const [route, setRoute] = useState(() => ({
    path: window.location.pathname || "/",
    data: window.history.state?.routeData || null,
  }));
  const [menu, setMenu] = useState(false),
    [transition, setTransition] = useState(""),
    [loading, setLoading] = useState(true),
    [appeals, setAppealsState] = useState(loadAppeals),
    [user, setUser] = useState(loadSession),
    [toastState, setToastState] = useState(null),
    [draftDirty, setDraftDirty] = useState(false),
    [leavePrompt, setLeavePrompt] = useState(false);
  const pendingNavigation = useRef(null);
  const confirmingNavigation = useRef(false);
  const appealStore = useRef(appeals);
  const navigationBusy = useRef(false);
  const transitionTimers = useRef([]);
  const stage = useRef(null);
  const scrollPositions = useRef(new Map());
  const [transitionKind, setTransitionKind] = useState("enter");
  useEffect(() => () => transitionTimers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (stage.current) stage.current.inert = menu || leavePrompt;
  }, [menu, leavePrompt, route.path]);
  useEffect(() => {
    const sync = (e) => {
      if (e.key !== APPEALS_KEY) return;
      appealStore.current = loadAppeals();
      setAppealsState(appealStore.current);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    const name =
      navItems.find((item) => item.path === route.path)?.title ||
      (route.path.startsWith("/staff")
        ? "Центр обращений"
        : "Раздел не найден");
    document.title = `${name} — МСПиТ ПФО`;
    document.querySelector("#main-content")?.focus({ preventScroll: true });
  }, [route.path]);
  const closeMenu = useCallback(() => setMenu(false), []);
  const updateDraftDirty = useCallback((value) => setDraftDirty(value), []);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 720);
    return () => clearTimeout(t);
  }, []);
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
      transitionTimers.current.forEach(clearTimeout);
      navigationBusy.current = false;
      setMenu(false);
      setRoute({ path: poppedPath, data: poppedData });
      setTransitionKind(poppedPath === "/" ? "rise" : "enter");
      setTransition("arrive");
      requestAnimationFrame(() =>
        window.scrollTo({
          top:
            poppedPath === "/"
              ? 0
              : scrollPositions.current.get(poppedPath) || 0,
          behavior: "instant",
        }),
      );
      transitionTimers.current.push(
        setTimeout(
          () => setTransition(""),
          reducedMotion()
            ? motionConfig.reducedMotionFallback
            : motionConfig.pageTransitionDuration * 0.62,
        ),
      );
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [route.path, route.data, draftDirty, leavePrompt]);
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
  useEffect(() => {
    let frame;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const d = document.documentElement;
        const progress =
          d.scrollHeight <= innerHeight
            ? 0
            : d.scrollTop / (d.scrollHeight - innerHeight);
        d.style.setProperty("--scroll-progress", progress);
        d.style.setProperty(
          "--hero-scroll",
          Math.min(d.scrollTop, 1000) * 0.12 + "px",
        );
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (
      !motionConfig.enabled ||
      !motionConfig.parallax ||
      !themeConfig.background.parallax ||
      window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
        .matches
    )
      return;
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / innerWidth - 0.5) * 2,
          y = (e.clientY / innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty("--pointer-x", x.toFixed(3));
        document.documentElement.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
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
      transitionTimers.current.forEach(clearTimeout);
      transitionTimers.current = [];
      navigationBusy.current = true;
      const reduced = reducedMotion();
      setTransitionKind(
        path.startsWith("/staff/appeals/")
          ? "focus"
          : path.startsWith("/staff") && !route.path.startsWith("/staff")
            ? "secure"
            : path === "/"
              ? "rise"
              : "enter",
      );
      setMenu(false);
      setTransition("leave");
      transitionTimers.current.push(
        setTimeout(
          () => {
            window.history.pushState({ routeData: data }, "", path);
            setRoute({ path: window.location.pathname, data });
            window.scrollTo({ top: 0, behavior: "instant" });
            setTransition("arrive");
            transitionTimers.current.push(
              setTimeout(
                () => {
                  setTransition("");
                  navigationBusy.current = false;
                },
                reduced
                  ? motionConfig.reducedMotionFallback
                  : motionConfig.pageTransitionDuration * 0.62,
              ),
            );
          },
          reduced ? 0 : motionConfig.pageTransitionDuration * 0.38,
        ),
      );
    },
    [route.path, draftDirty],
  );
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
    (value) => {
      const { name, role, email } = value;
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
  const staffPath = path.startsWith("/staff");
  const isPrivateView = staffPath;
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
        appeals={appeals}
        onSubmit={createAppeal}
        navigate={navigate}
        toast={showToast}
        onDirtyChange={updateDraftDirty}
      />
    );
  else if (path === "/track")
    page = (
      <TrackAppeal appeals={appeals} routeData={route.data} toast={showToast} />
    );
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
      <StaffLogin onLogin={login} toast={showToast} navigate={navigate} />
    );
  else if (path === "/staff" && !user)
    page = <StaffLogin onLogin={login} toast={showToast} navigate={navigate} />;
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
    page = <StaffLogin onLogin={login} toast={showToast} navigate={navigate} />;
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
        <Eyebrow>СИСТЕМА / 404</Eyebrow>
        <h1>
          РАЗДЕЛ
          <br />
          <em>НЕ НАЙДЕН</em>
        </h1>
        <button className="text-link" onClick={() => navigate("/")}>
          Вернуться на главную <Icon name="arrow" />
        </button>
      </div>
    );
  const showHeader = !isPrivateView;
  const showFooter = !isPrivateView && path !== "/";
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      {loading && <InitialLoader />}
      <div
        data-transition-kind={transitionKind}
        className={`app-root ${menu ? "menu-is-open" : ""} ${path === "/" ? "home-app" : ""} ${loading ? "app-loading" : ""} ${isPrivateView ? "private-app" : ""} ${transition ? `transition-${transition}` : ""}`}
      >
        {showHeader && (
          <Header
            onMenu={() => setMenu(true)}
            navigate={navigate}
            staff={!!user}
            menuOpen={menu}
          />
        )}
        <div className="view-stage" key={path} ref={stage}>
          <main id="main-content" tabIndex={-1}>
            {page}
          </main>
          {showFooter && <SiteFooter navigate={navigate} />}
        </div>
        {showHeader && (
          <Navigation
            open={menu}
            onClose={closeMenu}
            navigate={navigate}
            currentPath={currentNav}
          />
        )}
        <Toast toast={toastState} onClose={clearToast} />
        <Modal
          open={leavePrompt}
          title="Покинуть форму?"
          onClose={cancelLeave}
          actions={
            <>
              <button className="back-button" onClick={cancelLeave}>
                ОСТАТЬСЯ
              </button>
              <Button variant="burgundy" onClick={confirmLeave}>
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
        {transition && (
          <div className={`page-transition ${transition}`} aria-hidden="true">
            <div className="transition-surface">
              <Mark light />
              <span>МСПиТ · ГОРЯЧАЯ ЛИНИЯ</span>
              <i />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
