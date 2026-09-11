"""Dependency-free checks for fallback and progressive-baseline behavior.

The checks model JavaScript-disabled, unavailable-backdrop-filter, unavailable-font,
and disabled-CSS-animation environments through the static HTML/CSS contracts.
Run from the repository root with: python3 tests/validate_fallbacks.py
"""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

PAGES = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html")
SURFACE_SELECTORS = (".about-text", ".post", ".project", ".contact-layout", ".resume")
ALLOWED_EXTERNAL_STYLE_IMPORT = "fonts.googleapis.com"
FORBIDDEN_RUNTIME = re.compile(
    r"(?:<script\b|javascript:|\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(|\b(?:setTimeout|setInterval)\s*\(|\b(?:localStorage|sessionStorage|indexedDB)\b|google-analytics|googletagmanager|gtag\s*\(|plausible\.io|hotjar|mixpanel|autoplay\b|<audio\b|<video\b)",
    re.I,
)
FORBIDDEN_BUNDLES = re.compile(r"(?:<script\b|\.(?:js|mjs)\b|webpack|vite|parcel|rollup)", re.I)


class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []

    def handle_starttag(self, tag, attrs):
        self.elements.append({"tag": tag.lower(), "attrs": dict(attrs)})

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def find(self, tag=None):
        return [element for element in self.elements if tag is None or element["tag"] == tag]


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def parse_page(root, page):
    source = (root / page).read_text(encoding="utf-8")
    document = Document()
    document.feed(source)
    document.close()
    return source, document


def is_external(value):
    parsed = urlsplit(value)
    return bool(parsed.scheme or parsed.netloc) or value.startswith("//")


def resolve_relative_asset(root, page, value):
    parsed = urlsplit(value)
    if not value or value.startswith("#") or parsed.scheme in {"mailto", "tel", "data", "javascript"} or is_external(value):
        return
    target = (root / page).parent / parsed.path
    require(target.is_file(), f"{page}: relative asset does not resolve: {value}")


def check_js_disabled(root, pages):
    for page, source, document in pages:
        require("<script" not in source.lower(), f"{page}: JavaScript must not be required by the page")
        require(len(document.find("main")) == 1, f"{page}: primary content must remain available without JavaScript")
        require(document.find("h1") and document.find("p"), f"{page}: readable heading and paragraph content must remain in the static document")
        require(not any("hidden" in element["attrs"] for element in document.find("main")), f"{page}: main content must not be hidden in the progressive baseline")
        nav_links = [element for element in document.find("a") if element["attrs"].get("href") in PAGES]
        require(len(nav_links) >= 5, f"{page}: native navigation links are incomplete without JavaScript")
        for form in document.find("form"):
            require("onsubmit" not in form["attrs"], f"{page}: form must not require an inline JavaScript handler")
        for control in document.find("input") + document.find("textarea") + document.find("select"):
            if control["tag"] != "input" or control["attrs"].get("type", "text") not in {"hidden", "submit", "button"}:
                require(control["attrs"].get("name"), f"{page}: native form control is missing name")


def check_native_forms(pages):
    contact = next(document for page, _, document in pages if page == "contact.html")
    forms = contact.find("form")
    require(len(forms) == 1, "contact.html: expected one native form")
    form = forms[0]["attrs"]
    require("action" not in form or not is_external(form["action"]), "contact.html: form must not require an external endpoint")
    require("method" not in form or form["method"].lower() in {"get", "post"}, "contact.html: form method must remain native")
    controls = contact.find("input") + contact.find("textarea")
    for control_id in ("name", "email", "message"):
        matches = [control for control in controls if control["attrs"].get("id") == control_id]
        require(len(matches) == 1 and matches[0]["attrs"].get("name") == control_id, f"contact.html: native {control_id} control is missing")
    require(any(control["attrs"].get("type") == "submit" for control in contact.find("input")), "contact.html: native submit control is missing")


def check_relative_assets(root, pages):
    for page, source, document in pages:
        for element in document.find("img"):
            resolve_relative_asset(root, page, element["attrs"].get("src"))
        for element in document.find("link"):
            resolve_relative_asset(root, page, element["attrs"].get("href"))
        for element in document.find("a"):
            href = element["attrs"].get("href", "")
            parsed = urlsplit(href)
            if parsed.scheme in {"http", "https", "mailto", "tel"} or href.startswith("#"):
                continue
            resolve_relative_asset(root, page, href)


def check_no_runtime_or_dependency(root, pages, css):
    combined = css + "\n" + "\n".join(source for _, source, _ in pages)
    require(not FORBIDDEN_RUNTIME.search(combined), "site must not require scripts, timers, runtime APIs, tracking, or autoplay media")
    require(not FORBIDDEN_BUNDLES.search(combined), "site must not reference a JavaScript bundle or build runtime")
    imports = re.findall(r"@import\s+url\([\"']?([^\"')]+)", css, re.I)
    require(all(ALLOWED_EXTERNAL_STYLE_IMPORT in url for url in imports), "only the optional external font stylesheet may be imported")
    require(len(imports) <= 1, "visual system must use one shared stylesheet and no extra runtime imports")
    require(not re.search(r"(?:/api/|https?://[^\s\"']+/(?:api|graphql|collect|track))", combined, re.I), "no required endpoint or data-collection URL may be referenced")


def css_blocks(css):
    return [(match.group(1), match.group(2)) for match in re.finditer(r"([^{}]+)\{([^{}]*)\}", css, re.S)]


def check_css_fallbacks(css):
    require("--glass-fallback:" in css, "glass fallback token is missing")
    require("--font-body:" in css and re.search(r"--font-body:[^;]*(?:system-ui|sans-serif)", css), "body font fallback is missing")
    require("--font-display:" in css and re.search(r"--font-display:[^;]*(?:system-ui|sans-serif)", css), "display font fallback is missing")
    require("@supports (backdrop-filter: blur(1px))" in css, "backdrop-filter enhancement boundary is missing")
    blocks = css_blocks(css)
    surface_block = "\n".join(body for head, body in blocks if "backdrop-filter" in body and any(selector in head for selector in SURFACE_SELECTORS))
    require("background: var(--glass-fallback)" in surface_block, "glass surfaces need an opaque fallback before blur enhancement")
    require("border: 1px solid var(--edge)" in surface_block, "glass fallback needs a visible border")
    require("box-shadow:" in surface_block, "glass fallback needs a depth cue without blur")
    require("-webkit-backdrop-filter" in css, "vendor backdrop-filter enhancement is missing")


def check_animation_disabled(css):
    # With animation support disabled, static declarations must expose content; no
    # opacity/visibility gate may leave primary content hidden.
    require(not re.search(r"(?:opacity|visibility)\s*:\s*(?:0|hidden)", css, re.I), "primary content must not depend on animation for visibility")
    require("animation: rise-in" in css, "supported entrance animation contract is missing")
    require("@media (prefers-reduced-motion: reduce)" in css, "reduced-motion fallback contract is missing")
    reduced = css.split("@media (prefers-reduced-motion: reduce)", 1)[1]
    require("animation: none !important" in reduced, "reduced motion must disable continuous animation")
    require("opacity: 1" in reduced and "transform: none" in reduced, "reduced motion must restore final visible state")
    require(re.search(r"animation:\s*rise-in[^;]*\bboth\b", css), "entrance final-state behavior must be explicit")


def main():
    root = Path(__file__).resolve().parents[1]
    css = (root / "styles.css").read_text(encoding="utf-8")
    pages = [(page, *parse_page(root, page)) for page in PAGES]
    check_js_disabled(root, pages)
    check_native_forms(pages)
    check_relative_assets(root, pages)
    check_no_runtime_or_dependency(root, pages, css)
    check_css_fallbacks(css)
    check_animation_disabled(css)
    print("PASS: validated JavaScript-disabled navigation/forms/content, backdrop/font/animation fallbacks, native progressive enhancement, static dependency boundaries, and relative assets.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
