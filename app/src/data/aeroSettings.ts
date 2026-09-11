export type AeroSettings = {
  glassOpacity: number;
  glassReflection: number;
  glassBlur: number;
  upperRim: number;
  greenBounce: number;
  skySaturation: number;
  cloudBrightness: number;
  bubbleDensity: number;
  bubbleSpeed: number;
  tiltStrength: number;
  cursorTug: number;
  shineTravel: number;
  pointerLight: number;
  acrylicOpacity: number;
  plasticGloss: number;
  enamelHighlight: number;
  bubbleEdge: number;
  lensReflection: number;
};

export const DEFAULT_AERO_SETTINGS: AeroSettings = {
  glassOpacity: .72,
  glassReflection: 1.5,
  glassBlur: .55,
  upperRim: 1.5,
  greenBounce: 1,
  skySaturation: 1.2,
  cloudBrightness: 1.4,
  bubbleDensity: 1,
  bubbleSpeed: .88,
  tiltStrength: 1.5,
  cursorTug: 1.16,
  shineTravel: 1.18,
  pointerLight: 1.19,
  acrylicOpacity: 1,
  plasticGloss: 1.5,
  enamelHighlight: 1.06,
  bubbleEdge: 1.6,
  lensReflection: 1,
};
