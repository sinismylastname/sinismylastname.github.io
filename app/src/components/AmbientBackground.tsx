import { useEffect } from "react";

export function AmbientBackground() {
  useEffect(() => {
    const syncVisibility = () => {
      if (document.visibilityState === "hidden") {
        document.documentElement.dataset.pageHidden = "true";
      } else {
        delete document.documentElement.dataset.pageHidden;
      }
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      <span className="ambient-orb ambient-orb-one" />
      <span className="ambient-orb ambient-orb-two" />
      <span className="ambient-orb ambient-orb-three" />
      <span className="ambient-cloud ambient-cloud-one" />
      <span className="ambient-cloud ambient-cloud-two" />
      <span className="ambient-cloud ambient-cloud-three" />
      <span className="ambient-cloud ambient-cloud-four" />
      <span className="ambient-wave ambient-wave-one" />
      <span className="ambient-wave ambient-wave-two" />
      <span className="ambient-bubble bubble-one" />
      <span className="ambient-bubble bubble-two" />
      <span className="ambient-bubble bubble-three" />
      <span className="ambient-bubble bubble-four" />
      <span className="ambient-bubble bubble-five" />
      <span className="ambient-bubble bubble-six" />
      <span className="ambient-bubble bubble-seven" />
      <span className="ambient-bubble bubble-eight" />
      <span className="ambient-bubble bubble-nine" />
      <span className="ambient-bubble bubble-ten" />
      <span className="ambient-bubble bubble-eleven" />
      <span className="ambient-bubble bubble-twelve" />
      <span className="ambient-bubble bubble-thirteen" />
      <span className="ambient-bubble bubble-fourteen" />
      <span className="ambient-bubble bubble-fifteen" />
      <span className="ambient-bubble bubble-sixteen" />
    </div>
  );
}
