import { useEffect, useRef, useState } from "react";
import type { AeroEnvironment } from "../data/aeroEnvironment";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { getAeroQuality, persistAeroQualityFloor } from "../webgl/aeroQuality";
import type { AeroQuality } from "../webgl/aeroQuality";
import { AeroRenderer } from "../webgl/aeroRenderer";
import { getAeroPointerLight, resetAeroPointerLight, updateAeroPointerLight } from "../webgl/aeroPointerLight";
import { createAeroGLContext, isAeroWebGLEnabled } from "../webgl/aeroWebGLSupport";

function getPrintPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("print").matches;
}

export function AeroEnvironmentCanvas({ environment }: { environment: AeroEnvironment }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AeroRenderer | null>(null);
  const environmentRef = useRef(environment);
  environmentRef.current = environment;
  const enabled = isAeroWebGLEnabled();
  const reducedMotion = useReducedMotion();
  const [isPrinting, setIsPrinting] = useState(getPrintPreference);
  const [quality, setQuality] = useState<AeroQuality | null>(() => enabled ? getAeroQuality({ persist: false }) : null);
  useEffect(() => {
    if (quality !== null || !enabled) return;
    setQuality(getAeroQuality({ persist: false }));
  }, [enabled, quality, reducedMotion]);

  useEffect(() => {
    const onBeforePrint = () => setIsPrinting(true);
    const onAfterPrint = () => setIsPrinting(false);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setEnvironment(environment);
  }, [environment]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled || isPrinting || quality === null) return;

    let renderer: AeroRenderer | null = null;
    let animationFrame: number | null = null;
    let resizeFrame: number | null = null;
    let resizeSettleTimer: number | null = null;
    let resizePending = false;
    let startedAt: number | null = null;
    let paused = document.visibilityState === "hidden";
    const frameInterval = quality.tier === "high" ? 1000 / 45 : quality.tier === "balanced" ? 1000 / 40 : 1000 / 30;
    const pointerViewport = window.matchMedia?.("(pointer: fine)") ?? null;
    const usePointerLight = !reducedMotion && quality.tier !== "low" && Boolean(pointerViewport?.matches);
    let lastRenderAt = -Infinity;
    // Keep the experimental GPU bubble branch dormant; authored CSS bubbles are the only bubble layer.
    const bubbleCount = 0;
    const cancelAnimation = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };
    const cancelResize = () => {
      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = null;
      }
      if (resizeSettleTimer !== null) {
        window.clearTimeout(resizeSettleTimer);
        resizeSettleTimer = null;
      }
    };
    const scheduleAnimation = () => {
      if (animationFrame === null && renderer && !paused && !reducedMotion) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };
    const renderFrame = (timestamp: number) => {
      animationFrame = null;
      if (!renderer || paused) return;
      // Apply deferred canvas-size changes immediately before drawing. This
      // prevents ResizeObserver from clearing the backbuffer between frames.
      let resized = false;
      if (resizePending) {
        renderer.resize(true);
        resizePending = false;
        resized = true;
      }
      if (!resized && timestamp - lastRenderAt < frameInterval) {
        scheduleAnimation();
        return;
      }
      if (startedAt === null) startedAt = timestamp;
      lastRenderAt = timestamp;
      renderer.render((timestamp - startedAt) / 1000, getAeroPointerLight());
      scheduleAnimation();
    };
    const renderOnce = () => {
      if (!renderer || paused) return;
      if (resizePending) {
        renderer.resize(true);
        resizePending = false;
      }
      renderer.render(0, getAeroPointerLight());
      scheduleAnimation();
    };
    const scheduleReducedMotionResize = () => {
      if (resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        renderOnce();
      });
    };
    const scheduleResize = () => {
      // Safari can emit a burst of height-only observations while its browser
      // chrome expands/collapses during scroll. Keep the old GPU buffer while
      // that settles, then resize and redraw together in one frame.
      if (resizeSettleTimer !== null) window.clearTimeout(resizeSettleTimer);
      resizeSettleTimer = window.setTimeout(() => {
        resizeSettleTimer = null;
        resizePending = true;
        if (reducedMotion) scheduleReducedMotionResize();
        else scheduleAnimation();
      }, 180);
    };
    const initialize = () => {
      try {
        const gl = createAeroGLContext(canvas);
        if (!gl) {
          rendererRef.current = null;
          renderer = null;
          canvas.dataset.state = "unavailable";
          return;
        }
        renderer?.dispose();
        const heroOrbEnabled = false;
        const heroRefractionEnabled = false;
        const causticsEnabled = false;
        renderer = new AeroRenderer(canvas, gl, quality, environmentRef.current, bubbleCount, heroOrbEnabled, heroRefractionEnabled, usePointerLight, causticsEnabled);
        persistAeroQualityFloor(quality.tier);
        rendererRef.current = renderer;
        startedAt = null;
        lastRenderAt = -Infinity;
        canvas.dataset.quality = quality.tier;
        canvas.dataset.state = paused ? "paused" : "ready";
        canvas.dataset.bubbles = "css";
        canvas.dataset.orb = heroOrbEnabled ? "gpu" : "css";
        canvas.dataset.refraction = heroRefractionEnabled ? "gpu" : "off";
        resizePending = true;
        renderOnce();
      } catch {
        renderer?.dispose();
        renderer = null;
        rendererRef.current = null;
        canvas.dataset.state = "unavailable";
      }
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimation();
      cancelResize();
      renderer?.dispose();
      renderer = null;
      rendererRef.current = null;
      startedAt = null;
      canvas.dataset.state = "lost";
    };
    const onContextRestored = () => initialize();
    const onVisibilityChange = () => {
      paused = document.visibilityState === "hidden";
      if (paused) {
        cancelAnimation();
        cancelResize();
        startedAt = null;
        canvas.dataset.state = "paused";
      } else if (renderer) {
        canvas.dataset.state = "ready";
        startedAt = null;
        renderOnce();
      } else {
        initialize();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!usePointerLight || event.pointerType === "touch") return;
      updateAeroPointerLight(event.clientX, event.clientY);
    };
    const onPointerLeave = () => resetAeroPointerLight();

    initialize();
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleResize);
    resizeObserver?.observe(canvas);
    window.addEventListener("resize", scheduleResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);
    if (usePointerLight) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      window.addEventListener("blur", onPointerLeave, { passive: true });
    }

    return () => {
      cancelAnimation();
      cancelResize();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (usePointerLight) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("blur", onPointerLeave);
      }
      resetAeroPointerLight();
      renderer?.dispose();
      if (rendererRef.current === renderer) rendererRef.current = null;
    };
  }, [enabled, isPrinting, quality, reducedMotion]);

  if (!enabled || isPrinting || quality === null) return null;
  return <canvas ref={canvasRef} className="aero-environment-canvas" aria-hidden="true" data-state="pending" />;
}
