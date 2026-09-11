import { useCallback, useEffect, useRef, useState } from "react";
import type { PageId } from "../data/site";
import { useReducedMotion } from "./useReducedMotion";

const validPages: PageId[] = ["home", "work", "about", "resume", "contact"];

type ViewTransitionDocument = Document & { startViewTransition?: (callback: () => void) => unknown };

function readPage(): PageId {
  const page = window.location.hash.slice(1) as PageId;
  return validPages.includes(page) ? page : "home";
}

export function useHashPage() {
  const [page, setPage] = useState<PageId>(readPage);
  const reducedMotion = useReducedMotion();

  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setPage(readPage());
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      if (reducedMotion) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      const start = window.scrollY;
      const startedAt = performance.now();
      const duration = 900;
      const animateScroll = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, start * (1 - eased));
        if (progress < 1) scrollFrameRef.current = requestAnimationFrame(animateScroll);
        else scrollFrameRef.current = null;
      };
      scrollFrameRef.current = requestAnimationFrame(animateScroll);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
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
