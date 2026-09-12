import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { getAeroEnvironment } from "./data/aeroEnvironment";
import faviconUrl from "../../images/pfp.png";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/components.css";

function setFavicon(href: string): void {
  const rels = ["icon", "apple-touch-icon"];
  for (const rel of rels) {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (rel === "icon") {
      link.type = "image/png";
    }
    link.href = href;
  }
}

setFavicon(faviconUrl);

const skyState = "midday";
document.documentElement.dataset.sky = skyState;
const environment = getAeroEnvironment(skyState);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App environment={environment} />
  </StrictMode>,
);
