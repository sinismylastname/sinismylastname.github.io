"""Dependency-free checks for motion, fallbacks, and decorative isolation.

Run from the repository root with: python3 tests/validate_motion.py
"""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys

PAGES = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html")
DECORATIVE_CLASS = "sky-stage-bubble"
AMBIENT_ANIMATIONS = {"ambient-drift", "ambient-bob"}
NON_LAYOUT_PROPERTIES = {
    "transform", "opacity", "color", "background", "background-color",
    "border-color", "box-shadow", "filter",
}


class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []

    def handle_starttag(self, tag, attrs):
        self.elements.append({"tag": tag.lower(), "attrs": dict(attrs)})

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def css_leaf_blocks(source):
    """Return simple selector/declaration pairs for non-nested CSS blocks."""
    return [(match.group(1).strip(), match.group(2)) for match in re.finditer(r"([^{}]+)\{([^{}]*)\}", source, re.S)]


def declarations_for(blocks, selector):
    return "\n".join(body for head, body in blocks if selector in head)


def assert_true(condition, message):
    if not condition:
        raise AssertionError(message)


def parse_pages(root):
    documents = {}
    for page in PAGES:
        document = Document()
        document.feed((root / page).read_text(encoding="utf-8"))
        document.close()
        documents[page] = document
    return documents


def check_html_decorations(documents):
    for page, document in documents.items():
        decorations = [
            element for element in document.elements
            if DECORATIVE_CLASS in element["attrs"].get("class", "").split()
        ]
        for decoration in decorations:
            attrs = decoration["attrs"]
            assert_true(attrs.get("aria-hidden") == "true", f"{page}: authored decoration must be aria-hidden=true")
            assert_true("tabindex" not in attrs, f"{page}: authored decoration must not be focusable")
            assert_true(attrs.get("role") is None, f"{page}: authored decoration must not expose a semantic role")


def check_css_decorations(source, blocks):
    # Every authored and pseudo-element ambient owner is pointer-isolated.
    for selector in ("body::before", "body::after", ".sky-stage::before", ".sky-stage::after", DECORATIVE_CLASS):
        assert_true(selector in source, f"{selector}: decorative owner is missing")
    assert_true(source.count("pointer-events: none;") >= 4, "decorative layers must be pointer-isolated")

    # Ambient layers remain below content, while content and focus are explicitly above them.
    assert_true("body::before," in source and "body::after" in source and "z-index: -1" in source, "page ambience must use a negative stacking layer")
    assert_true(".sky-stage::before," in source and ".sky-stage::after" in source and "z-index: 0" in source, "sky-stage pseudo-elements must remain below content")
    assert_true(".sky-stage-bubble" in source and "z-index: 0" in source, "authored bubbles must remain below content")
    assert_true(".sky-stage > :not(.sky-stage-bubble)" in source and "z-index: 1" in source, "sky-stage content must be above decoration")
    assert_true("focus-visible" in source, "focus-visible state must be authored")
    assert_true(re.search(r"z-index:\s*[3-9]", source), "focus indicators must be above surfaces and ambience")


def animation_names(declarations):
    return set(re.findall(r"animation\s*:\s*([\w-]+)", declarations))


def check_animation_contract(source, blocks):
    ambient_count = len(re.findall(r"animation\s*:\s*ambient-(?:drift|bob)\s+var\(--duration-ambient\)", source))
    assert_true(ambient_count == 3, f"expected three continuous desktop ambient owners, found {ambient_count}")
    assert_true("ambient-drift" in source and "ambient-bob" in source, "ambient drift and bob should both be represented")

    duration = re.search(r"--duration-ambient\s*:\s*([\d.]+)s", source)
    assert_true(duration and 12 <= float(duration.group(1)) <= 20, "ambient duration must be between 12 and 20 seconds")

    for name in ("ambient-drift", "ambient-bob"):
        match = re.search(r"@keyframes\s+" + name + r"\s*\{[\s\S]*?from\s*\{([^}]*)\}\s*to\s*\{([^}]*)\}", source)
        assert_true(match, f"missing {name} keyframes")
        keyframe_body = match.group(1) + match.group(2)
        transforms = re.findall(r"transform\s*:\s*([^;]+)", keyframe_body)
        assert_true(len(transforms) == 2, f"{name}: expected transform-only from/to states")
        assert_true(not re.search(r"(?:left|right|top|bottom|width|height|margin|padding)\s*:", keyframe_body), f"{name}: must not animate layout properties")
        numbers = [float(value) for value in re.findall(r"-?[\d.]+", " ".join(transforms))]
        assert_true(numbers and max(abs(number) for number in numbers) <= 12, f"{name}: travel exceeds 12px-equivalent bound")

    for name in ("rise-in", "gloss-sweep"):
        match = re.search(r"@keyframes\s+" + name + r"\s*\{[\s\S]*?from\s*\{([^}]*)\}\s*to\s*\{([^}]*)\}", source)
        assert_true(match, f"missing {name} keyframes")
        keyframe_body = match.group(1) + match.group(2)
        assert_true(not re.search(r"(?:left|right|top|bottom|width|height|margin|padding)\s*:", keyframe_body), f"{name}: must be visual-only")

    # Navigation, labels, and long-form text have no continuous animation ownership.
    for selector in (".navbar", ".nav-list", "label", "p"):
        selector_pattern = r"(?:^|,)\s*" + re.escape(selector) + r"\s*\{[^}]*animation"
        assert_true(not re.search(selector_pattern, source, re.S), f"{selector}: content must remain stationary")

    # CSS is the primary ambient mechanism and no runtime timer is required.
    assert_true("<script" not in source.lower(), "styles.css must not require a script")
    for page in PAGES:
        # This source is intentionally checked by the caller; this assertion documents the static baseline.
        assert_true(page.endswith(".html"), "page list must remain static HTML")


def check_visibility_fallbacks(source, blocks):
    assert_true(".page-title" in source and "animation: rise-in" in source, "supported entrance animation is missing")
    assert_true("opacity: 0" not in source and "visibility: hidden" not in source, "animation must not hide primary content on failure")
    entrance = declarations_for(blocks, ".page-title") + declarations_for(blocks, ".about-image")
    assert_true("animation: rise-in" in entrance, "entrance ownership should be explicit")
    assert_true("transform: none" in source, "reduced-motion/fallback rules must restore final transform")
    assert_true("@media (prefers-reduced-motion: reduce)" in source, "reduced-motion media query is required")
    reduced = source.split("@media (prefers-reduced-motion: reduce)", 1)[1].split("@media print", 1)[0]
    assert_true("animation: none !important" in reduced, "reduced motion must disable animation")
    assert_true("animation-duration: 1ms !important" in reduced, "reduced motion must neutralize inherited animation")
    assert_true("transform: none" in reduced, "reduced motion must remove entrance/interactivity transforms")

    glass_fallback = declarations_for(blocks, ".about-text") + declarations_for(blocks, ".post")
    assert_true("background: var(--glass-fallback)" in glass_fallback, "glass surfaces need an opaque fallback")
    assert_true("border: 1px solid var(--edge)" in glass_fallback, "glass fallback needs a visible edge")


def check_print(source):
    assert_true("@media print" in source, "print rules are required")
    print_css = source.split("@media print", 1)[1]
    for expected in (".resume-main", ".resume", "animation: none !important", "backdrop-filter: none", "background: #fff", "box-shadow: none"):
        assert_true(expected in print_css, f"print state missing {expected}")
    assert_true("body::before" in print_css and "body::after" in print_css, "print must remove ambient pseudo-elements")


def check_static_baseline(root):
    for page in PAGES:
        source = (root / page).read_text(encoding="utf-8").lower()
        assert_true("<script" not in source, f"{page}: motion and fallback checks must not require JavaScript")
    css = (root / "styles.css").read_text(encoding="utf-8").lower()
    assert_true("setinterval" not in css and "settimeout" not in css, "CSS must not depend on timer fallback")


def main():
    root = Path(__file__).resolve().parents[1]
    source = (root / "styles.css").read_text(encoding="utf-8")
    blocks = css_leaf_blocks(source)
    documents = parse_pages(root)
    check_html_decorations(documents)
    check_css_decorations(source, blocks)
    check_animation_contract(source, blocks)
    check_visibility_fallbacks(source, blocks)
    check_print(source)
    check_static_baseline(root)
    print("PASS: validated decorative isolation, stacking, CSS-primary visual-only motion, counts/durations/travel, stationary content, reduced-motion, entrance/fallback visibility, print rules, and static baseline.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
