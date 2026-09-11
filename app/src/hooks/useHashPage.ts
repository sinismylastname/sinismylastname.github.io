import { useCallback, useEffect, useRef, useState } from "react";
import type { PageId } from "../data/site";
import { useReducedMotion } from "./useReducedMotion";

const validPages: PageId[] = ["home", "work", "about", "resume", "contact"];
const PAGE_SCROLL_DURATION = 520;

type ViewTransitionDocument = Document & { startViewTransition?: (callback: () => void) => unknown };

function readPage(): PageId {
  const page = window.location.hash.slice(1) as PageId;
  return validPages.includes(page) ? page : "home";
}

export function useHashPage() {
  const [page, setPage] = useState<PageId>(readPage);
  const reducedMotion = useReducedMotion();
  const scrollFrameRef = useRef<number | null>(null);
  const scrollBehaviorRef = useRef<string | null>(null);

  useEffect(() => {
    const restoreScrollBehavior = () => {
      if (scrollBehaviorRef.current === null) return;
      document.documentElement.style.scrollBehavior = scrollBehaviorRef.current;
      scrollBehaviorRef.current = null;
    };
    const cancelScroll = () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = null;
      restoreScrollBehavior();
    };
    const onHashChange = () => {
      setPage(readPage());
      cancelScroll();
      if (reducedMotion) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      const start = window.scrollY;
      const startedAt = performance.now();
      scrollBehaviorRef.current = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      const animateScroll = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / PAGE_SCROLL_DURATION);
        const eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, start * (1 - eased));
        if (progress < 1) {
          scrollFrameRef.current = requestAnimationFrame(animateScroll);
        } else {
          scrollFrameRef.current = null;
          restoreScrollBehavior();
        }
      };
      scrollFrameRef.current = requestAnimationFrame(animateScroll);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      cancelScroll();
    };
  }, [reducedMotion]);

  const navigate = useCallback((nextPage: PageId) => {
    if (window.location.hash === `#${nextPage}`) return;
    const updateHash = () => { window.location.hash = nextPage; };
    if (!reducedMotion && "startViewTransition" in document) {
      (document as ViewTransitionDocument).startViewTransition?.(updateHash);
    } else {
      updateHash();
    }
  }, [reducedMotion]);

  return { page, navigate };
}
