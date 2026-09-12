export type AeroPointerLightState = {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
};

type MutableAeroPointerLightState = {
  x: number;
  y: number;
  active: boolean;
};

const pointerLightState: MutableAeroPointerLightState = {
  x: 0.5,
  y: 0.5,
  active: false,
};

function clampUnit(value: number) {
  return Math.max(0, Math.min(1, value));
}

function safeViewportSize(value: number) {
  return Number.isFinite(value) ? Math.max(value, 1) : 1;
}

export function updateAeroPointerLight(clientX: number, clientY: number, viewportWidth = typeof window === "undefined" ? 1 : window.innerWidth, viewportHeight = typeof window === "undefined" ? 1 : window.innerHeight) {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    resetAeroPointerLight();
    return;
  }
  pointerLightState.x = clampUnit(clientX / safeViewportSize(viewportWidth));
  pointerLightState.y = clampUnit(clientY / safeViewportSize(viewportHeight));
  pointerLightState.active = true;
}

export function resetAeroPointerLight() {
  pointerLightState.x = 0.5;
  pointerLightState.y = 0.5;
  pointerLightState.active = false;
}

export function getAeroPointerLight(): AeroPointerLightState {
  return pointerLightState;
}
