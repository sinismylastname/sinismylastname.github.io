import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const INTRO_SESSION_KEY = "aero-intro-seen";
const MINIMUM_INTRO_MS = 700;
const MAXIMUM_INTRO_MS = 1500;

function hasSeenIntro() {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
  } catch {
    // Storage restrictions should never block the site or the intro timeout.
  }
}

export function AeroIntro() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !hasSeenIntro());
  const [stage, setStage] = useState<"field" | "orb" | "reveal" | "exit">("field");

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      markIntroSeen();
      setVisible(false);
      return;
    }

    document.documentElement.dataset.aeroIntro = "active";
    const startedAt = performance.now();
    let finished = false;
    let exitTimer: number | null = null;
    const finish = () => {
      if (finished) return;
      finished = true;
      markIntroSeen();
      setStage("exit");
      exitTimer = window.setTimeout(() => {
        delete document.documentElement.dataset.aeroIntro;
        setVisible(false);
      }, 220);
    };
    const stageOrbTimer = window.setTimeout(() => setStage("orb"), 150);
    const stageRevealTimer = window.setTimeout(() => setStage("reveal"), 420);
    const readinessTimer = window.setInterval(() => {
      const canvas = document.querySelector<HTMLCanvasElement>(".aero-environment-canvas");
      const rendererReady = !canvas || canvas.dataset.state === "ready" || canvas.dataset.state === "unavailable";
      if (rendererReady && performance.now() - startedAt >= MINIMUM_INTRO_MS) finish();
    }, 60);
    const maximumTimer = window.setTimeout(finish, MAXIMUM_INTRO_MS);
    const skip = () => finish();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape" || event.key === " ") skip();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", skip, { passive: true, once: true });
    return () => {
      window.clearTimeout(stageOrbTimer);
      window.clearTimeout(stageRevealTimer);
      window.clearTimeout(maximumTimer);
      window.clearInterval(readinessTimer);
      if (exitTimer !== null) window.clearTimeout(exitTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", skip);
      delete document.documentElement.dataset.aeroIntro;
    };
  }, [reducedMotion, visible]);

  if (!visible) return null;
  return (
    <div className="aero-intro" data-stage={stage} aria-hidden="true">
      <div className="aero-intro-bloom" />
      <div className="aero-intro-orb"><span>AS</span><i /></div>
      <div className="aero-intro-horizon" />
    </div>
  );
}
