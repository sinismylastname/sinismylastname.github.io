import { DEFAULT_AERO_SETTINGS } from "./aeroSettings";

export type AeroRuntimeSettings = Pick<typeof DEFAULT_AERO_SETTINGS, "tiltStrength" | "cursorTug" | "shineTravel">;

type RuntimeSetting = keyof AeroRuntimeSettings;
const runtimeSettings: RuntimeSetting[] = ["tiltStrength", "cursorTug", "shineTravel"];
let cachedSettings: AeroRuntimeSettings | null = null;

function readSetting(name: string, fallback: number) {
  if (typeof document === "undefined") return fallback;
  const root = document.documentElement;
  const inlineValue = root.style.getPropertyValue(name);
  const rawValue = inlineValue || getComputedStyle(root).getPropertyValue(name);
  const value = Number.parseFloat(rawValue);
  return Number.isFinite(value) ? value : fallback;
}

export function getAeroRuntimeSettings(): AeroRuntimeSettings {
  if (cachedSettings) return cachedSettings;
  cachedSettings = runtimeSettings.reduce((settings, key) => {
    const cssName = `--aero-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    settings[key] = readSetting(cssName, DEFAULT_AERO_SETTINGS[key]);
    return settings;
  }, {} as AeroRuntimeSettings);
  return cachedSettings;
}
