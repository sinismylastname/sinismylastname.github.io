export const SKY_STATES = ["morning", "midday", "sunset", "night"] as const;

export type SkyState = (typeof SKY_STATES)[number];

export function isSkyState(value: string | null | undefined): value is SkyState {
  return value != null && SKY_STATES.includes(value as SkyState);
}

export function getSkyStateForHour(hour: number): SkyState {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "midday";
  if (hour >= 17 && hour < 21) return "sunset";
  return "night";
}

export function getSkyStateForDate(date: Date): SkyState {
  return getSkyStateForHour(date.getHours());
}

export function resolveSkyState({
  search,
  date,
  allowOverride,
}: {
  search: string;
  date: Date;
  allowOverride: boolean;
}): SkyState {
  const skyOverride = allowOverride ? new URLSearchParams(search).get("sky") : null;
  return isSkyState(skyOverride) ? skyOverride : getSkyStateForDate(date);
}
