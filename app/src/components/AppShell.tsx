import type { ReactNode } from "react";
import type { PageId } from "../data/site";
import { AmbientBackground } from "./AmbientBackground";
import { CustomCursor } from "./CustomCursor";
import { Navigation } from "./Navigation";

export function AppShell({
  activePage,
  onNavigate,
  children,
}: {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <AmbientBackground />
      <CustomCursor />
      <Navigation activePage={activePage} onNavigate={onNavigate} />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <div className="page-transition" key={activePage}>{children}</div>
      </main>
      <footer className="app-footer">© 2026 Andy Sin · Built with curiosity and a little glass.</footer>
    </div>
  );
}
