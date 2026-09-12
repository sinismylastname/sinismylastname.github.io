import { useEffect, useState, type ReactNode } from "react";
import type { AeroEnvironment } from "../data/aeroEnvironment";
import type { PageId } from "../data/site";
import { AeroEnvironmentCanvas } from "./AeroEnvironmentCanvas";
import { AmbientBackground } from "./AmbientBackground";
import { AeroIntro } from "./AeroIntro";
import { CursorModeToggle } from "./CursorModeToggle";
import { CustomCursor } from "./CustomCursor";
import { Navigation } from "./Navigation";
import { ScrollProgress } from "./ScrollProgress";

const CURSOR_MODE_STORAGE_KEY = "andy-sin-portfolio-cursor-mode";

function readNativeCursorPreference() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CURSOR_MODE_STORAGE_KEY) === "native";
  } catch {
    return false;
  }
}

export function AppShell({
  environment,
  activePage,
  onNavigate,
  children,
}: {
  environment: AeroEnvironment;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}) {
  const [nativeCursor, setNativeCursor] = useState(readNativeCursorPreference);

  useEffect(() => {
    document.body.dataset.cursorMode = nativeCursor ? "native" : "smooth";
    try {
      window.localStorage.setItem(CURSOR_MODE_STORAGE_KEY, nativeCursor ? "native" : "smooth");
    } catch {
      // Private browsing or storage restrictions should not block cursor selection.
    }

    return () => {
      delete document.body.dataset.cursorMode;
    };
  }, [nativeCursor]);

  return (
    <div className="app-shell" data-cursor-mode={nativeCursor ? "native" : "smooth"}>
      <AeroEnvironmentCanvas environment={environment} />
      <AmbientBackground />
      <AeroIntro />
      <ScrollProgress />
      <CustomCursor enabled={!nativeCursor} />
      <CursorModeToggle nativeCursor={nativeCursor} onNativeCursorChange={setNativeCursor} />
      <Navigation activePage={activePage} onNavigate={onNavigate} />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <div className="page-transition" key={activePage}>{children}</div>
      </main>
      <footer className="app-footer">© 2026 Andy Sin · Built with curiosity and a little glass.</footer>
    </div>
  );
}
