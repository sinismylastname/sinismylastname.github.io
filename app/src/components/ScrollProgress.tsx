import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type ScrollMetrics = {
  maxScroll: number;
  trackHeight: number;
  thumbHeight: number;
  travel: number;
};

type DragState = {
  pointerId: number;
  startY: number;
  startScroll: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ScrollProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const metricsRef = useRef<ScrollMetrics>({ maxScroll: 0, trackHeight: 0, thumbHeight: 0, travel: 0 });
  const dragRef = useRef<DragState | null>(null);
  const frameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const update = () => {
      frameRef.current = null;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const trackHeight = track.clientHeight;
      const maxScroll = Math.max(0, documentHeight - viewportHeight);
      const thumbHeight = maxScroll === 0
        ? trackHeight
        : Math.min(trackHeight, Math.max(4.5 * 16, trackHeight * (viewportHeight / documentHeight)));
      const travel = Math.max(0, trackHeight - thumbHeight);
      const progress = maxScroll === 0 ? 0 : clamp(window.scrollY / maxScroll, 0, 1);
      const top = progress * travel;
      metricsRef.current = { maxScroll, trackHeight, thumbHeight, travel };
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${top}px`;
      track.setAttribute("aria-valuenow", `${Math.round(progress * 100)}`);
      track.setAttribute("aria-valuetext", progress <= 0 ? "Top" : progress >= 1 ? "Bottom" : `${Math.round(progress * 100)} percent`);
      track.setAttribute("aria-disabled", maxScroll === 0 ? "true" : "false");
    };
    const resetIdle = () => {
      track.classList.remove("is-idle");
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        if (!dragRef.current && document.activeElement !== track) track.classList.add("is-idle");
      }, 1600);
    };
    const schedule = () => {
      resetIdle();
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update);
    };
    const scrollImmediately = (top: number) => {
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top, behavior: "auto" });
      document.documentElement.style.scrollBehavior = previousBehavior;
    };
    const scrollToProgress = (progress: number, behavior: ScrollBehavior = "auto") => {
      const { maxScroll } = metricsRef.current;
      const top = clamp(progress, 0, 1) * maxScroll;
      if (behavior === "auto") scrollImmediately(top);
      else window.scrollTo({ top, behavior });
    };
    const progressFromPointer = (clientY: number) => {
      const { travel, thumbHeight } = metricsRef.current;
      if (travel <= 0) return 0;
      const bounds = track.getBoundingClientRect();
      return clamp((clientY - bounds.top - thumbHeight / 2) / travel, 0, 1);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || metricsRef.current.maxScroll === 0) return;
      resetIdle();
      const onThumb = event.target instanceof Node && thumb.contains(event.target);
      if (onThumb) {
        dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startScroll: window.scrollY };
        track.setPointerCapture(event.pointerId);
        track.classList.add("is-dragging");
        event.preventDefault();
      } else {
        scrollToProgress(progressFromPointer(event.clientY));
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      const { maxScroll, travel } = metricsRef.current;
      if (!drag || drag.pointerId !== event.pointerId || travel <= 0) return;
      const nextScroll = drag.startScroll + ((event.clientY - drag.startY) / travel) * maxScroll;
      scrollImmediately(clamp(nextScroll, 0, maxScroll));
      resetIdle();
      event.preventDefault();
    };
    const stopDragging = (event: PointerEvent) => {
      if (dragRef.current?.pointerId !== event.pointerId) return;
      dragRef.current = null;
      track.classList.remove("is-dragging");
      resetIdle();
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const { maxScroll } = metricsRef.current;
      if (maxScroll === 0) return;
      const step = 48;
      const destinations: Record<string, number> = {
        Home: 0,
        End: maxScroll,
        ArrowUp: window.scrollY - step,
        ArrowLeft: window.scrollY - step,
        ArrowDown: window.scrollY + step,
        ArrowRight: window.scrollY + step,
        PageUp: window.scrollY - window.innerHeight * .9,
        PageDown: window.scrollY + window.innerHeight * .9,
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      window.scrollTo({ top: clamp(destinations[event.key], 0, maxScroll), behavior: reducedMotion ? "auto" : "smooth" });
    };

    update();
    resetIdle();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    track.addEventListener("pointerenter", resetIdle);
    track.addEventListener("focus", resetIdle);
    track.addEventListener("blur", resetIdle);
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);
    track.addEventListener("lostpointercapture", () => {
      dragRef.current = null;
      track.classList.remove("is-dragging");
      resetIdle();
    });
    track.addEventListener("keydown", onKeyDown);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      track.removeEventListener("pointerenter", resetIdle);
      track.removeEventListener("focus", resetIdle);
      track.removeEventListener("blur", resetIdle);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", stopDragging);
      track.removeEventListener("pointercancel", stopDragging);
      track.removeEventListener("keydown", onKeyDown);
      observer?.disconnect();
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={trackRef}
      className="scroll-progress-track"
      role="scrollbar"
      tabIndex={0}
      aria-label="Page scroll"
      aria-controls="main-content"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-valuetext="Top"
    >
      <span ref={thumbRef} className="scroll-progress-thumb" />
    </div>
  );
}
