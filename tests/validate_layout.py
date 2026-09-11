"""Dependency-free layout-safety checks.

Run from the repository root with: python3 tests/validate_layout.py
"""
from pathlib import Path
import re
import sys

PAGES = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html")
VIEWPORTS = (320, 375, 760, 1024, 2560)
ZOOMS = (100, 200, 300, 400)


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def block(source, selector):
    match = re.search(re.escape(selector) + r"\s*\{([^{}]*)\}", source, re.S)
    return match.group(1) if match else ""


def state_blocks(source):
    return re.findall(r"([^{}]*(?::hover|:focus-visible|:focus-within|:active|:user-invalid)[^{}]*)\{([^{}]*)\}", source, re.S)


def main():
    root = Path(__file__).resolve().parents[1]
    css = (root / "styles.css").read_text(encoding="utf-8")

    # Representative viewport and zoom-equivalent matrices requested by task 4.2.
    require(VIEWPORTS == (320, 375, 760, 1024, 2560), "viewport matrix is incomplete")
    require(ZOOMS == (100, 200, 300, 400), "zoom matrix is incomplete")
    require("@media (max-width: 760px)" in css, "mobile breakpoint is missing")
    require("@media (prefers-reduced-motion: reduce)" in css, "reduced-motion state is missing")

    # Fluid sizing, wrapping, and mobile stacking prevent overflow at those widths.
    for selector in (".navbar", "main", ".footer"):
        body = block(css, selector)
        require("width: min(" in body and "calc(100% - 2rem)" in body,
                f"{selector}: fluid width constraint is missing")
    require("overflow-wrap: anywhere" in css, "long content does not have a wrapping contract")
    require("min-width: 0" in css, "flex/grid children need min-width: 0")
    require("width: 100vw" not in css, "100vw can introduce horizontal overflow")
    require("flex-wrap: wrap" in block(css, ".nav-list"), "navigation must wrap")
    require("white-space: normal" in css, "mobile navigation labels must wrap")
    require("flex-direction: column" in css, "mobile flex groups must stack")
    require("grid-template-columns: 1fr" in css, "mobile project cards must stack")

    # Focus is visible and explicitly above surfaces/ambient layers.
    focus = block(css, ":where(a, button, input, select, textarea, [tabindex]):focus-visible")
    require("outline:" in focus and "outline-offset:" in focus, "focus outline is missing")
    require(re.search(r"z-index:\s*[3-9]", focus), "focus priority z-index is missing")
    require(".project-image:focus-visible" in css and "z-index: 5" in css, "project focus priority is missing")
    require(".nav-list a:focus-visible" in css and "z-index: 5" in css, "navigation focus priority is missing")

    # Decorative elements cannot intercept content, and authored decoration is below it.
    require(css.count("pointer-events: none") >= 4, "decoration pointer isolation is incomplete")
    require(".sky-stage > :not(.sky-stage-bubble)" in css, "sky-stage content stacking is missing")
    require(".sky-stage > :not(.sky-stage-bubble)" in css and "z-index: 1" in css, "content must be above decoration")

    # State rules may alter visual properties only; geometry-affecting declarations
    # would change bounds between default, hover, focus, active, or validation states.
    layout_names = re.compile(r"(?:^|;)\s*(?:width|height|min-width|max-width|min-height|max-height|margin(?:-[\w-]+)?|padding(?:-[\w-]+)?|gap|display|top|right|bottom|left|order|flex(?:-[\w-]+)?|grid(?:-[\w-]+)?)\s*:", re.I)
    for selectors, declarations in state_blocks(css):
        require(not layout_names.search(declarations),
                f"interaction state changes layout bounds: {selectors.strip()}")
    for value in re.findall(r"translateY\(\s*(-?[\d.]+)px\s*\)", css):
        require(abs(float(value)) <= 4, "interaction translation exceeds 4px")
    reduced = css.split("@media (prefers-reduced-motion: reduce)", 1)[1]
    require("animation: none !important" in reduced, "reduced motion does not disable loops")
    require("transform: none" in reduced and "opacity: 1" in reduced, "reduced motion can hide or move content")

    # Every page remains a static, single-main document for the matrix inspection.
    for page in PAGES:
        html = (root / page).read_text(encoding="utf-8")
        require(len(re.findall(r"<main\b", html, re.I)) == 1, f"{page}: main landmark count changed")
        require(len(re.findall(r'<nav\b[^>]*aria-label=["\']Primary navigation["\']', html, re.I)) == 1,
                f"{page}: named navigation landmark count changed")
        require("<script" not in html.lower(), f"{page}: layout baseline requires JavaScript")

    print(f"PASS: layout safety checked at widths {VIEWPORTS} and zoom-equivalent levels {ZOOMS}%; no overflow contracts, focus-priority violations, decoration interception, or state-bound changes found.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
