import type { SkyState } from "./sky";

export const ENVIRONMENT_PHASES = ["day", "twilight", "night"] as const;

export type EnvironmentPhase = (typeof ENVIRONMENT_PHASES)[number];
export type Color3 = readonly [number, number, number];
export type Direction2 = readonly [number, number];

export type AeroEnvironment = {
  readonly skyState: SkyState;
  readonly phase: EnvironmentPhase;
  readonly skyTop: Color3;
  readonly skyHorizon: Color3;
  readonly waterColor: Color3;
  readonly sunDirection: Direction2;
  readonly sunIntensity: number;
  readonly moonDirection: Direction2;
  readonly moonIntensity: number;
  readonly groundBounce: Color3;
  readonly specularColor: Color3;
  readonly starIntensity: number;
  readonly causticIntensity: number;
};

const AERO_ENVIRONMENTS: Readonly<Record<SkyState, AeroEnvironment>> = {
  morning: {
    skyState: "morning",
    phase: "day",
    skyTop: [0.4392, 0.8627, 1],
    skyHorizon: [0.9216, 1, 0.7255],
    waterColor: [0.0941, 0.6902, 0.7804],
    sunDirection: [0.34, 0.94],
    sunIntensity: 0.92,
    moonDirection: [0.35, 0.94],
    moonIntensity: 0,
    groundBounce: [0.6627, 0.9373, 0.298,],
    specularColor: [1, 0.99, 0.92],
    starIntensity: 0,
    causticIntensity: 0.8,
  },
  midday: {
    skyState: "midday",
    phase: "day",
    skyTop: [0.2392, 0.7843, 1],
    skyHorizon: [0.8353, 1, 0.6824],
    waterColor: [0.0706, 0.7137, 0.7961],
    sunDirection: [0.08, 1],
    sunIntensity: 1,
    moonDirection: [0.35, 0.94],
    moonIntensity: 0,
    groundBounce: [0.6471, 0.9255, 0.2471],
    specularColor: [1, 1, 1],
    starIntensity: 0,
    causticIntensity: 1,
  },
  sunset: {
    skyState: "sunset",
    phase: "twilight",
    skyTop: [0.2588, 0.7882, 0.9333],
    skyHorizon: [1, 0.902, 0.6588],
    waterColor: [0.1176, 0.5608, 0.6431],
    sunDirection: [-0.56, 0.55],
    sunIntensity: 0.72,
    moonDirection: [0.48, 0.88],
    moonIntensity: 0.08,
    groundBounce: [0.7922, 0.8941, 0.3961],
    specularColor: [1, 0.72, 0.55],
    starIntensity: 0.015,
    causticIntensity: 0.45,
  },
  night: {
    skyState: "night",
    phase: "night",
    skyTop: [0.0431, 0.2039, 0.451],
    skyHorizon: [0.0902, 0.3922, 0.4706],
    waterColor: [0.0431, 0.3765, 0.4784],
    sunDirection: [-0.2, 0.75],
    sunIntensity: 0,
    moonDirection: [0.35, 0.94],
    moonIntensity: 0.35,
    groundBounce: [0.1765, 0.4902, 0.3137],
    specularColor: [0.65, 0.9, 1],
    starIntensity: 0.45,
    causticIntensity: 0.16,
  },
};

export function getAeroEnvironment(skyState: SkyState): AeroEnvironment {
  return AERO_ENVIRONMENTS[skyState];
}
