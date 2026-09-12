export type AeroGLContext = WebGLRenderingContext | WebGL2RenderingContext;

const CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: false,
  desynchronized: true,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  stencil: false,
};

export function isAeroWebGLEnabled() {
  if (typeof window === "undefined") return false;
  if (import.meta.env.VITE_AERO_WEBGL === "false") return false;
  if (import.meta.env.VITE_AERO_WEBGL === "true") return true;
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("webgl") === "0") return false;
  return true;
}

export function isAeroGpuBubblesEnabled() {
  if (!isAeroWebGLEnabled()) return false;
  if (import.meta.env.VITE_AERO_GPU_BUBBLES === "false") return false;
  if (import.meta.env.VITE_AERO_GPU_BUBBLES === "true") return true;
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("gpu-bubbles") === "0") return false;
  return true;
}

export function isAeroRefractionEnabled() {
  if (!isAeroWebGLEnabled()) return false;
  if (import.meta.env.VITE_AERO_REFRACTION === "true") return true;
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get("refraction") === "1";
}

export function createAeroGLContext(canvas: HTMLCanvasElement): AeroGLContext | null {
  return canvas.getContext("webgl2", CONTEXT_ATTRIBUTES)
    ?? canvas.getContext("webgl", CONTEXT_ATTRIBUTES)
    ?? canvas.getContext("experimental-webgl", CONTEXT_ATTRIBUTES) as AeroGLContext | null;
}
