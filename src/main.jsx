import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/manrope";
import "./styles/base.css";
import "./styles/motion.css";
import "./styles/chrome.css";
import "./styles/ui.css";
import "./styles/pages.css";
import "./styles/staff.css";
import { initializeTheme } from "./config/theme";
import { initializeMotion } from "./config/motion";

initializeTheme();
initializeMotion();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
