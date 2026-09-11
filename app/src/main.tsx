import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { getSkyStateForDate, isSkyState } from "./data/sky";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/components.css";

const skyOverride = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get("sky")
  : null;
document.documentElement.dataset.sky = isSkyState(skyOverride)
  ? skyOverride
  : getSkyStateForDate(new Date());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
