import { useLayoutEffect, useRef, useState } from "react";
import type { PageId } from "../data/site";
import { navigation } from "../data/site";
import { GlassSurface } from "./GlassSurface";

export function Navigation({ activePage, onNavigate }: { activePage: PageId; onNavigate: (page: PageId) => void }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Partial<Record<PageId, HTMLAnchorElement | null>>>({});
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const measureIndicator = () => {
      const shell = shellRef.current;
      const activeLink = linkRefs.current[activePage];
      if (!shell || !activeLink) return;
      const shellBounds = shell.getBoundingClientRect();
      const linkBounds = activeLink.getBoundingClientRect();
      setIndicator({
        left: linkBounds.left - shellBounds.left,
        top: linkBounds.top - shellBounds.top,
        width: linkBounds.width,
        height: linkBounds.height,
      });
    };

    measureIndicator();
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [activePage]);

  return (
    <header className="site-header">
      <GlassSurface as="nav" variant="nav" className="site-nav" aria-label="Primary navigation">
        <a className="brand-mark" href="#home" onClick={() => onNavigate("home")} aria-label="Andy Sin home">AS</a>
        <div ref={shellRef} className="nav-links-shell">
          <span
            className="nav-active-indicator"
            aria-hidden="true"
            style={{ left: indicator.left, top: indicator.top, width: indicator.width, height: indicator.height }}
          />
          <div className="nav-links">
            {navigation.map((item) => (
              <a
                key={item.id}
                ref={(node) => { linkRefs.current[item.id] = node; }}
                href={`#${item.id}`}
                className={activePage === item.id ? "nav-link is-current" : "nav-link"}
                aria-current={activePage === item.id ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
