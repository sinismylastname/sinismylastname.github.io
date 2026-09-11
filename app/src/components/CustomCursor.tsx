import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { getAeroRuntimeSettings } from "../data/aeroRuntime";
import { useReducedMotion } from "../hooks/useReducedMotion";

const INTERACTIVE_SELECTOR = "a, button, input, textarea, select";
const CURSOR_IGNORE_SELECTOR = "[data-cursor-ignore]";
const RELEASE_DISTANCE = 18;
const MAX_TUG = 8;
const FOLLOW_EASE = 0.21;

type CursorState = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  rotate: number;
  active: boolean;
  visible: boolean;
};

const hiddenState = (): CursorState => ({ x: -40, y: -40, width: 24, height: 24, radius: 50, rotate: 0, active: false, visible: false });

function moveToward(current: number, target: number, amount = FOLLOW_EASE) {
  return current + (target - current) * amount;
}

export function CustomCursor({ enabled }: { enabled: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let lockedTarget: HTMLElement | null = null;
    let lockedBounds: DOMRect | null = null;
    let lockedRadius = 12;
    let hasPointer = false;
    let lastPointer = { x: 0, y: 0, time: performance.now() };
    let velocity = { x: 0, y: 0 };
    let current = hiddenState();
    let desired = hiddenState();
    let viewportFrame: number | null = null;
    let viewportDirty = false;
    const clearTargetCache = () => {
      lockedBounds = null;
      lockedRadius = 12;
      viewportDirty = false;
    };
    const refreshTargetCache = () => {
      if (!lockedTarget) return false;
      lockedBounds = lockedTarget.getBoundingClientRect();
      const styles = getComputedStyle(lockedTarget);
      lockedRadius = parseFloat(styles.borderRadius) || 12;
      viewportDirty = false;
      return true;
    };
    const setLockedTarget = (target: HTMLElement | null) => {
      if (lockedTarget === target && (target === null || lockedBounds)) return;
      lockedTarget = target;
      clearTargetCache();
      if (lockedTarget) refreshTargetCache();
    };

    const render = () => {
      current = {
        x: moveToward(current.x, desired.x),
        y: moveToward(current.y, desired.y),
        width: moveToward(current.width, desired.width),
        height: moveToward(current.height, desired.height),
        radius: moveToward(current.radius, desired.radius),
        rotate: moveToward(current.rotate, desired.rotate, 0.16),
        active: desired.active,
        visible: desired.visible,
      };
      document.documentElement.style.setProperty("--pointer-light-x", `${(lastPointer.x / Math.max(window.innerWidth, 1)) * 100}%`);
      document.documentElement.style.setProperty("--pointer-light-y", `${(lastPointer.y / Math.max(window.innerHeight, 1)) * 100}%`);
      cursor.style.setProperty("--cursor-x", `${current.x}px`);
      cursor.style.setProperty("--cursor-y", `${current.y}px`);
      cursor.style.setProperty("--cursor-width", `${current.width}px`);
      cursor.style.setProperty("--cursor-height", `${current.height}px`);
      cursor.style.setProperty("--cursor-radius", `${current.radius}px`);
      cursor.style.setProperty("--cursor-rotate", `${current.rotate}deg`);
      cursor.dataset.active = current.active ? "true" : "false";
      cursor.dataset.visible = current.visible ? "true" : "false";
      const ghost = ghostRef.current;
      if (ghost) {
        ghost.style.setProperty("--ghost-x", `${lastPointer.x}px`);
        ghost.style.setProperty("--ghost-y", `${lastPointer.y}px`);
        ghost.dataset.active = current.active ? "true" : "false";
        ghost.dataset.visible = current.visible ? "true" : "false";
      }

      const stillMoving = [
        current.x - desired.x,
        current.y - desired.y,
        current.width - desired.width,
        current.height - desired.height,
        current.radius - desired.radius,
        current.rotate - desired.rotate,
      ].some((difference) => Math.abs(difference) > 0.5);
      frameRef.current = stillMoving ? requestAnimationFrame(render) : null;
    };
    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(render);
    };
    const release = () => {
      setLockedTarget(null);
      desired = hasPointer
        ? { x: lastPointer.x, y: lastPointer.y, width: 24, height: 24, radius: 50, rotate: 0, active: false, visible: false }
        : hiddenState();
      schedule();
    };
    const updateDesired = (tugX: number, tugY: number, rotate: number, snap = false) => {
      if (lockedTarget) {
        const bounds = lockedBounds ?? (refreshTargetCache() ? lockedBounds : null);
        if (!bounds) return;
        desired = {
          x: bounds.left + bounds.width / 2 + tugX,
          y: bounds.top + bounds.height / 2 + tugY,
          width: Math.max(32, bounds.width + 14),
          height: Math.max(32, bounds.height + 10),
          radius: Math.min(24, Math.max(8, lockedRadius)),
          rotate,
          active: true,
          visible: true,
        };
      } else {
        desired = { x: lastPointer.x + tugX, y: lastPointer.y + tugY, width: 24, height: 24, radius: 50, rotate, active: false, visible: true };
      }
      if (snap) current = desired;
      schedule();
    };

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const elapsed = Math.max(8, now - lastPointer.time);
      if (hasPointer) {
        const rawX = (event.clientX - lastPointer.x) / elapsed;
        const rawY = (event.clientY - lastPointer.y) / elapsed;
        velocity = { x: velocity.x * 0.84 + rawX * 0.16, y: velocity.y * 0.84 + rawY * 0.16 };
      } else {
        hasPointer = true;
      }
      lastPointer = { x: event.clientX, y: event.clientY, time: now };

      const { cursorTug } = getAeroRuntimeSettings();
      const maxTug = MAX_TUG * cursorTug;
      const tugX = Math.max(-maxTug, Math.min(maxTug, velocity.x * 10));
      const tugY = Math.max(-maxTug, Math.min(maxTug, velocity.y * 10));
      const rotate = Math.max(-2.5, Math.min(2.5, velocity.x * 2.5));
      const eventElement = event.target instanceof Element ? event.target : null;
      const ignoredTarget = eventElement?.closest<HTMLElement>(CURSOR_IGNORE_SELECTOR);
      const hoveredTarget = ignoredTarget ? null : eventElement?.closest<HTMLElement>(INTERACTIVE_SELECTOR);

      if (ignoredTarget) {
        setLockedTarget(null);
      } else if (hoveredTarget) {
        setLockedTarget(hoveredTarget);
      } else if (lockedTarget) {
        if (viewportDirty) refreshTargetCache();
        const bounds = lockedBounds ?? (refreshTargetCache() ? lockedBounds : null);
        if (!bounds) return;
        const outsideX = Math.max(bounds.left - event.clientX, 0, event.clientX - bounds.right);
        const outsideY = Math.max(bounds.top - event.clientY, 0, event.clientY - bounds.bottom);
        if (Math.hypot(outsideX, outsideY) > RELEASE_DISTANCE) release();
      }

      updateDesired(tugX, tugY, rotate);
    };
    const syncViewport = () => {
      viewportFrame = null;
      if (!hasPointer || !lockedTarget || !viewportDirty) return;
      refreshTargetCache();
      const bounds = lockedBounds;
      if (!bounds) return;
      const outsideX = Math.max(bounds.left - lastPointer.x, 0, lastPointer.x - bounds.right);
      const outsideY = Math.max(bounds.top - lastPointer.y, 0, lastPointer.y - bounds.bottom);
      if (Math.hypot(outsideX, outsideY) > RELEASE_DISTANCE) {
        release();
        return;
      }
      updateDesired(0, 0, 0, true);
    };
    const onViewportChange = () => {
      if (!hasPointer || !lockedTarget) return;
      viewportDirty = true;
      if (viewportFrame === null) viewportFrame = requestAnimationFrame(syncViewport);
    };
    const onFocusIn = (event: FocusEvent) => {
      const focused = event.target instanceof HTMLElement
        ? event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR)
        : null;
      if (!focused || focused.matches(CURSOR_IGNORE_SELECTOR)) return;
      setLockedTarget(focused);
      updateDesired(0, 0, 0, true);
    };
    const onFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget;
      if (lockedTarget && (!(nextTarget instanceof Node) || !lockedTarget.contains(nextTarget))) release();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.documentElement.removeEventListener("pointerleave", release);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (viewportFrame !== null) {
        cancelAnimationFrame(viewportFrame);
        viewportFrame = null;
      }
    };
  }, [enabled, reducedMotion]);

  if (!enabled || reducedMotion) return null;
  return createPortal(
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span /></div>
      <div ref={ghostRef} className="custom-cursor-ghost" aria-hidden="true" />
    </>,
    document.body,
  );
}
