import { useEffect, useState } from "react";
import type { PageId } from "../data/site";

const validPages: PageId[] = ["home", "notes", "work", "about", "resume", "contact"];

function readPage(): PageId {
  const page = window.location.hash.slice(1) as PageId;
  return validPages.includes(page) ? page : "home";
}

export function useHashPage() {
  const [page, setPage] = useState<PageId>(readPage);

  useEffect(() => {
    const onHashChange = () => setPage(readPage());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (nextPage: PageId) => {
    window.location.hash = nextPage;
  };

  return { page, navigate };
}
