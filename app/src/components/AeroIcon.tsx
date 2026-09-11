import { useId, type ReactNode } from "react";

export type AeroIconKind = "project" | "about" | "resume" | "contact" | "software" | "hardware" | "robotics";

const iconPaths: Record<AeroIconKind, ReactNode> = {
  project: <path d="M3.5 7.5h6l1.8 2h9.2v8.8a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2V7.5Zm0 0V5.8a2.3 2.3 0 0 1 2.3-2.3h3.8l1.7 2h4.1" />,
  about: <><circle cx="12" cy="8" r="3.2" /><path d="M5.2 20.3a6.8 6.8 0 0 1 13.6 0" /></>,
  resume: <><path d="M6 3.5h7l5 5v12H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" /><path d="M13 3.5v5h5M8 13h6M8 16.5h6" /></>,
  contact: <><rect x="3" y="5" width="18" height="14" rx="2.2" /><path d="m4.5 7 7.5 6 7.5-6" /></>,
  software: <><rect x="3" y="4" width="18" height="15" rx="2.5" /><path d="m7 9 2.5 2.5L7 14M12 14h5" /></>,
  hardware: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17v3.5M14.5 17v3.5M3.5 9.5H7M3.5 14.5H7M17 9.5h3.5M17 14.5h3.5" /></>,
  robotics: <><path d="M7 8.5h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z" /><path d="M12 8.5v-3M10 5.5h4M8.5 13h.1M15.4 13h.1M9 16h6" /></>,
};

export function AeroIcon({ kind, size = 18 }: { kind: AeroIconKind; size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`aero-icon aero-icon-${kind}`} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`aero-icon-fill-${id}`} x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--aero-icon-highlight, #fff)" />
          <stop offset=".48" stopColor="var(--aero-icon-accent, #4bd4e8)" />
          <stop offset="1" stopColor="var(--aero-icon-shadow, #0879a8)" />
        </linearGradient>
      </defs>
      <g stroke={`url(#aero-icon-fill-${id})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {iconPaths[kind]}
      </g>
    </svg>
  );
}
