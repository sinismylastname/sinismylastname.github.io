import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function usePointerTilt<T extends HTMLElement>(enabled = true) {
  const elementRef = useRef<T>(null);
  const frameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled || reducedMotion) return;

    const pointerMedia = window.matchMedia("(pointer: fine)");
    if (!pointerMedia.matches) return;

    let nextValues = { x: 50, y: 50, tiltX: 0, tiltY: 0 };
    const applyValues = () => {
      frameRef.current = null;
      element.style.setProperty("--pointer-x", `${nextValues.x}%`);
      element.style.setProperty("--pointer-y", `${nextValues.y}%`);
      element.style.setProperty("--tilt-x", `${nextValues.tiltX}deg`);
      element.style.setProperty("--tilt-y", `${nextValues.tiltY}deg`);
    };

    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(applyValues);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-tilt-ignore]")) {
        reset();
        return;
      }
      const bounds = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      nextValues = {
        x: x * 100,
        y: y * 100,
        tiltX: (0.5 - y) * 5,
        tiltY: (x - 0.5) * 5,
      };
      schedule();
    };

    const reset = () => {
      nextValues = { x: 50, y: 50, tiltX: 0, tiltY: 0 };
      schedule();
    };

    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", reset);
    return () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", reset);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, reducedMotion]);

  return elementRef;
}
