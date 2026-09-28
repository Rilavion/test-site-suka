import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/manrope";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/ministry.css";
import "./styles/forms-pages.css";
import "./styles/navigation.css";
import "./styles/staff.css";
import "./styles/responsive.css";
import "./styles/portal.css";
import "./styles/system.css";
import "./styles/experience.css";
import "./styles/fixes.css";
import { initializeTheme } from "./config/theme";
import { initializeMotion } from "./config/motion";

initializeTheme();
initializeMotion();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
