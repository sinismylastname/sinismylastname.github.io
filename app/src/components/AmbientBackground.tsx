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
      <svg className="ambient-wire-art" viewBox="0 0 1200 900" preserveAspectRatio="none" focusable="false">
        <defs>
          <radialGradient id="wire-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#e9fdff" stopOpacity=".58" />
            <stop offset=".4" stopColor="#76e5ff" stopOpacity=".2" />
            <stop offset="1" stopColor="#76e5ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="aurora-ribbons">
          <path d="M-80 350C190 160 380 188 568 322s367 176 736-18" />
          <path d="M-100 385C182 198 378 224 570 354s378 170 750-20" />
          <path d="M-120 420C170 236 370 260 574 386s388 166 768-22" />
        </g>
        <g className="ambient-cloud-shapes">
          <path d="M72 142c0-22 19-39 42-39 10-27 35-45 65-45 35 0 63 24 69 56 31 1 56 25 56 54H72c0-3 0-7 0-10 0-9 0-12 0-16Z" />
          <path d="M824 214c0-18 16-33 35-33 9-22 30-37 55-37 29 0 53 20 58 46 26 1 47 21 47 45H824c0-3 0-6 0-9v-12Z" />
        </g>
        <g className="wire-ribbon wire-ribbon-one">
          <path d="M-90 174C85 48 205 48 344 144S602 290 785 92" />
          <path d="M-92 188C84 62 205 62 344 158S602 304 786 106" />
          <path d="M-94 202C83 76 205 76 344 172S602 318 787 120" />
          <path d="M-96 216C81 90 204 90 344 186S602 332 788 134" />
          <path d="M-98 230C79 104 204 104 344 200S602 346 789 148" />
          <path d="M-100 244C77 118 203 118 344 214S602 360 790 162" />
          <path d="M-102 258C75 132 203 132 344 228S602 374 791 176" />
        </g>
        <g className="wire-ribbon wire-ribbon-two">
          <path d="M760-40C900 56 1010 118 1238 82" />
          <path d="M748-24C900 72 1012 134 1242 98" />
          <path d="M736-8C900 88 1014 150 1246 114" />
          <path d="M724 8C900 104 1016 166 1250 130" />
          <path d="M712 24C900 120 1018 182 1254 146" />
          <path d="M700 40C900 136 1020 198 1258 162" />
          <path d="M688 56C900 152 1022 214 1262 178" />
          <path d="M676 72C900 168 1024 230 1266 194" />
        </g>
        <g className="wire-ribbon wire-ribbon-three">
          <path d="M-110 570C102 434 246 456 412 572S736 738 1320 548" />
          <path d="M-112 584C102 448 246 470 412 586S736 752 1322 562" />
          <path d="M-114 598C102 462 246 484 412 600S736 766 1324 576" />
          <path d="M-116 612C102 476 246 498 412 614S736 780 1326 590" />
          <path d="M-118 626C102 490 246 512 412 628S736 794 1328 604" />
          <path d="M-120 640C102 504 246 526 412 642S736 808 1330 618" />
        </g>
        <g className="wire-orbit wire-orbit-one">
          <circle cx="215" cy="704" r="101" className="wire-globe-glow" />
          <circle cx="215" cy="704" r="76" />
          <ellipse cx="215" cy="704" rx="76" ry="29" />
          <ellipse cx="215" cy="704" rx="76" ry="52" />
          <ellipse cx="215" cy="704" rx="28" ry="76" />
          <ellipse cx="215" cy="704" rx="55" ry="76" />
          <path d="M142 704h146" />
        </g>
        <g className="wire-orbit wire-orbit-two">
          <circle cx="978" cy="378" r="56" className="wire-globe-glow" />
          <circle cx="978" cy="378" r="39" />
          <ellipse cx="978" cy="378" rx="39" ry="15" />
          <ellipse cx="978" cy="378" rx="39" ry="28" />
          <ellipse cx="978" cy="378" rx="15" ry="39" />
        </g>
        <g className="wire-sparkles">
          <circle cx="105" cy="300" r="9" />
          <circle cx="1100" cy="176" r="6" />
          <circle cx="1060" cy="706" r="8" />
          <circle cx="555" cy="790" r="5" />
          <circle cx="574" cy="787" r="2" />
        </g>
      </svg>
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
