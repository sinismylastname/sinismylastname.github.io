import { useEffect, useRef, useState } from "react";
import type { AeroEnvironment } from "../data/aeroEnvironment";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { getAeroQuality, persistAeroQualityFloor } from "../webgl/aeroQuality";
import type { AeroQuality } from "../webgl/aeroQuality";
import { AeroRenderer } from "../webgl/aeroRenderer";
import { getAeroPointerLight, resetAeroPointerLight, updateAeroPointerLight } from "../webgl/aeroPointerLight";
import { createAeroGLContext, isAeroGpuBubblesEnabled, isAeroRefractionEnabled, isAeroWebGLEnabled } from "../webgl/aeroWebGLSupport";

function getPrintPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("print").matches;
}

export function AeroEnvironmentCanvas({ environment, orbEnabled = false }: { environment: AeroEnvironment; orbEnabled?: boolean }) {
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
    let startedAt: number | null = null;
    let paused = document.visibilityState === "hidden";
    const gpuBubblesRequested = isAeroGpuBubblesEnabled();
    const refractionRequested = isAeroRefractionEnabled();
    const desktopViewport = window.matchMedia?.("(min-width: 900px)") ?? null;
    const pointerViewport = window.matchMedia?.("(pointer: fine)") ?? null;
    const useGpuOrb = () => orbEnabled && quality.tier !== "low" && Boolean(desktopViewport?.matches);
    const usePointerLight = !reducedMotion && quality.tier !== "low" && Boolean(pointerViewport?.matches);
    const bubbleCount = gpuBubblesRequested && !reducedMotion && !refractionRequested ? quality.bubbleCount : 0;
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
    };
    const scheduleAnimation = () => {
      if (animationFrame === null && renderer && !paused && !reducedMotion) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };
    const renderFrame = (timestamp: number) => {
      animationFrame = null;
      if (!renderer || paused) return;
      if (startedAt === null) startedAt = timestamp;
      renderer.render((timestamp - startedAt) / 1000, getAeroPointerLight());
      scheduleAnimation();
    };
    const renderOnce = () => {
      if (!renderer || paused) return;
      renderer.resize();
      renderer.render(0, getAeroPointerLight());
      scheduleAnimation();
    };
    const scheduleResize = () => {
      if (resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        if (!renderer || paused) return;
        renderer.resize();
        if (reducedMotion) renderer.render(0, getAeroPointerLight());
      });
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
        const heroOrbEnabled = useGpuOrb();
        const heroRefractionEnabled = heroOrbEnabled && refractionRequested && quality.tier === "high" && bubbleCount === 0;
        const causticsEnabled = quality.causticIntensity > 0;
        renderer = new AeroRenderer(canvas, gl, quality, environmentRef.current, bubbleCount, heroOrbEnabled, heroRefractionEnabled, usePointerLight, causticsEnabled);
        persistAeroQualityFloor(quality.tier);
        rendererRef.current = renderer;
        startedAt = null;
        canvas.dataset.quality = quality.tier;
        canvas.dataset.state = paused ? "paused" : "ready";
        canvas.dataset.bubbles = bubbleCount > 0 ? "gpu" : "css";
        canvas.dataset.orb = heroOrbEnabled ? "gpu" : "css";
        canvas.dataset.refraction = heroRefractionEnabled ? "gpu" : "off";
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
      resetAeroPointerLight();
      canvas.dataset.state = "lost";
    };
    const onContextRestored = () => initialize();
    const onVisibilityChange = () => {
      paused = document.visibilityState === "hidden";
      if (paused) {
        cancelAnimation();
        cancelResize();
        startedAt = null;
        resetAeroPointerLight();
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
    const onMediaChange = () => {
      if (!paused) initialize();
    };

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
    desktopViewport?.addEventListener?.("change", onMediaChange);
    document.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      cancelAnimation();
      cancelResize();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (usePointerLight) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("blur", onPointerLeave);
      }
      desktopViewport?.removeEventListener?.("change", onMediaChange);
      resetAeroPointerLight();
      renderer?.dispose();
      if (rendererRef.current === renderer) rendererRef.current = null;
    };
  }, [enabled, isPrinting, quality, reducedMotion, orbEnabled]);

  if (!enabled || isPrinting || quality === null) return null;
  return <canvas ref={canvasRef} className="aero-environment-canvas" aria-hidden="true" data-state="pending" />;
}
