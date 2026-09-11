import { useCallback, useEffect, useState } from "react";
import type { PageId } from "../data/site";
import { useReducedMotion } from "./useReducedMotion";

const validPages: PageId[] = ["home", "notes", "work", "about", "resume", "contact"];

type ViewTransitionDocument = Document & { startViewTransition?: (callback: () => void) => unknown };

function readPage(): PageId {
  const page = window.location.hash.slice(1) as PageId;
  return validPages.includes(page) ? page : "home";
}

export function useHashPage() {
  const [page, setPage] = useState<PageId>(readPage);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onHashChange = () => {
      setPage(readPage());
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
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
