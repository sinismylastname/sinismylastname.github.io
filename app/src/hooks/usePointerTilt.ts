import { useEffect, useRef } from "react";
import { getAeroRuntimeSettings } from "../data/aeroRuntime";
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
    let latestPointer = { x: 0, y: 0 };
    let bounds: DOMRect | null = null;
    let boundsDirty = true;
    let pointerInside = false;
    let resetPending = false;

    const refreshBounds = () => {
      bounds = element.getBoundingClientRect();
      boundsDirty = false;
      return bounds;
    };
    const applyValues = () => {
      frameRef.current = null;
      if (!resetPending) {
        const currentBounds = boundsDirty ? refreshBounds() : bounds;
        if (currentBounds) {
          const { tiltStrength, shineTravel } = getAeroRuntimeSettings();
          const x = Math.max(0, Math.min(1, (latestPointer.x - currentBounds.left) / Math.max(currentBounds.width, 1)));
          const y = Math.max(0, Math.min(1, (latestPointer.y - currentBounds.top) / Math.max(currentBounds.height, 1)));
          nextValues = {
            x: x * 100,
            y: y * 100,
            tiltX: (0.5 - y) * 5 * tiltStrength,
            tiltY: (x - 0.5) * 5 * tiltStrength,
          };
          element.style.setProperty("--reflection-x", `${(nextValues.x - 50) * 1.4 * shineTravel}px`);
        }
      }
      resetPending = false;
      element.style.setProperty("--pointer-x", `${nextValues.x}%`);
      element.style.setProperty("--pointer-y", `${nextValues.y}%`);
      element.style.setProperty("--tilt-x", `${nextValues.tiltX}deg`);
      element.style.setProperty("--tilt-y", `${nextValues.tiltY}deg`);
    };

    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(applyValues);
    };
    const reset = () => {
      resetPending = true;
      nextValues = { x: 50, y: 50, tiltX: 0, tiltY: 0 };
      schedule();
    };
    const onPointerEnter = () => {
      pointerInside = true;
      boundsDirty = true;
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerInside = true;
      latestPointer = { x: event.clientX, y: event.clientY };
      if (event.target instanceof Element && event.target.closest("[data-tilt-ignore]")) {
        reset();
        return;
      }
      schedule();
    };
    const onPointerLeave = () => {
      pointerInside = false;
      boundsDirty = true;
      reset();
    };
    const onViewportChange = () => {
      boundsDirty = true;
      if (pointerInside) schedule();
    };

    element.addEventListener("pointerenter", onPointerEnter, { passive: true });
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("scroll", onViewportChange, { passive: true, capture: true });
    window.addEventListener("resize", onViewportChange, { passive: true });
    return () => {
      element.removeEventListener("pointerenter", onPointerEnter);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enabled, reducedMotion]);

  return elementRef;
}
