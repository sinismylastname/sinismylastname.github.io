export type AeroQualityTier = "high" | "balanced" | "low";

export type AeroQuality = {
  tier: AeroQualityTier;
  dprCap: number;
  waveOctaves: number;
  bubbleCount: number;
  causticIntensity: number;
};

const QUALITY_STORAGE_KEY = "andy-sin-aero-quality-v1";
const QUALITY_STORAGE_VERSION = 1;
const QUALITY_STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const QUALITY_RANK: Record<AeroQualityTier, number> = { low: 0, balanced: 1, high: 2 };
const MAX_HIGH_RENDER_PIXELS = 3_000_000;

const QUALITY: Readonly<Record<AeroQualityTier, AeroQuality>> = {
  high: { tier: "high", dprCap: 1, waveOctaves: 2, bubbleCount: 0, causticIntensity: 0 },
  balanced: { tier: "balanced", dprCap: .9, waveOctaves: 1, bubbleCount: 0, causticIntensity: 0 },
  low: { tier: "low", dprCap: .75, waveOctaves: 1, bubbleCount: 0, causticIntensity: 0 },
};

type StoredQualityFloor = {
  version: number;
  tier: AeroQualityTier;
  expiresAt: number;
};

function isQualityTier(value: unknown): value is AeroQualityTier {
  return value === "high" || value === "balanced" || value === "low";
}

function moreConservativeTier(first: AeroQualityTier, second: AeroQualityTier) {
  return QUALITY_RANK[first] <= QUALITY_RANK[second] ? first : second;
}

function getSafetyTier(): AeroQualityTier {
  if (typeof window === "undefined") return "high";

  const compactViewport = window.matchMedia("(max-width: 639px)").matches;
  const veryCompactViewport = window.matchMedia("(max-width: 420px)").matches;
  const hardwareConcurrency = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 0;
  const limitedCpu = hardwareConcurrency > 0 && hardwareConcurrency <= 4;
  const veryLimitedCpu = hardwareConcurrency > 0 && hardwareConcurrency <= 2;
  const devicePixelRatio = Number.isFinite(window.devicePixelRatio) ? window.devicePixelRatio : 1;
  const renderPixels = Math.max(1, window.innerWidth) * Math.max(1, window.innerHeight) * Math.min(devicePixelRatio, 1.25) ** 2;

  if (veryCompactViewport && (veryLimitedCpu || devicePixelRatio >= 3)) return "low";
  if (compactViewport || limitedCpu || devicePixelRatio >= 2.5 || renderPixels > MAX_HIGH_RENDER_PIXELS) return "balanced";
  return "high";
}

function readStoredQualityFloor(removeExpired = true): AeroQualityTier | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUALITY_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<StoredQualityFloor>;
    if (stored.version !== QUALITY_STORAGE_VERSION || !isQualityTier(stored.tier) || typeof stored.expiresAt !== "number") return null;
    if (stored.expiresAt <= Date.now()) {
      if (removeExpired) window.localStorage.removeItem(QUALITY_STORAGE_KEY);
      return null;
    }
    return stored.tier;
  } catch {
    return null;
  }
}

function persistQualityFloor(tier: AeroQualityTier) {
  if (tier === "high" || typeof window === "undefined") return;
  try {
    const stored: StoredQualityFloor = {
      version: QUALITY_STORAGE_VERSION,
      tier,
      expiresAt: Date.now() + QUALITY_STORAGE_TTL_MS,
    };
    window.localStorage.setItem(QUALITY_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Private browsing or storage restrictions should not block WebGL fallback selection.
  }
}

export function getAeroQuality({ persist = true }: { persist?: boolean } = {}): AeroQuality {
  const safetyTier = getSafetyTier();
  const storedFloor = readStoredQualityFloor(persist);
  const tier = storedFloor === null ? safetyTier : moreConservativeTier(safetyTier, storedFloor);
  if (persist) persistQualityFloor(tier);
  return QUALITY[tier];
}

export function persistAeroQualityFloor(tier: AeroQualityTier) {
  readStoredQualityFloor();
  persistQualityFloor(tier);
}

export function getAeroQualityTier(): AeroQualityTier {
  return getAeroQuality().tier;
}
