import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectNotes } from "../data/projects";

export function ProjectNotesModal({ notes, onClose }: { notes: ProjectNotes; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const requestClose = () => {
      setClosing(true);
      window.setTimeout(onClose, 260);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  const requestClose = () => {
    setClosing(true);
    window.setTimeout(onClose, 260);
  };

  return createPortal(
    <div className={`notes-modal-backdrop${closing ? " is-closing" : ""}`} role="presentation" onClick={requestClose}>
      <section className="notes-modal" role="dialog" aria-modal="true" aria-labelledby="notes-modal-title" onClick={(event) => event.stopPropagation()}>
        <button ref={closeButtonRef} className="notes-modal-close" type="button" aria-label="Close notes" onClick={requestClose}>×</button>
        <p className="eyebrow">{notes.eyebrow}</p>
        <h2 id="notes-modal-title">{notes.title}</h2>
        {notes.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
    </div>,
    document.body,
  );
}
