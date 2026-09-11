import type { PageId } from "../data/site";
import { navigation } from "../data/site";
import { GlassSurface } from "./GlassSurface";

export function Navigation({ activePage, onNavigate }: { activePage: PageId; onNavigate: (page: PageId) => void }) {
  return (
    <header className="site-header">
      <GlassSurface as="nav" variant="nav" className="site-nav" aria-label="Primary navigation">
        <a className="brand-mark" href="#home" onClick={() => onNavigate("home")} aria-label="Andy Sin home">AS</a>
        <div className="nav-links">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activePage === item.id ? "nav-link is-current" : "nav-link"}
              aria-current={activePage === item.id ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </GlassSurface>
    </header>
  );
}
