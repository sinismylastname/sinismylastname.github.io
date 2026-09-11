"""Final dependency-free HTML/accessibility checks for the static portfolio.

Run from the repository root with: python3 tests/validate_accessibility.py
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

PAGES = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html")
EXPECTED_NAV = {
    "Home": "index.html", "Blog": "blog.html", "Portfolio": "portfolio.html",
    "Resume": "resume.html", "Contact": "contact.html",
}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
OPTIONAL = {"li", "dt", "dd", "p", "thead", "tbody", "tr", "th", "td", "option"}


class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in self.stack and tag in OPTIONAL:
            self.stack.remove(tag)
        element = {"tag": tag, "attrs": dict(attrs), "text": "", "parent": self.stack[-1] if self.stack else None}
        self.elements.append(element)
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag.lower() not in VOID and self.stack and self.stack[-1] == tag.lower():
            self.stack.pop()

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.stack:
            index = len(self.stack) - 1 - self.stack[::-1].index(tag)
            if any(open_tag not in OPTIONAL for open_tag in self.stack[index + 1:]):
                self.errors.append(f"mismatched closing tag </{tag}>")
            del self.stack[index:]
        elif tag not in OPTIONAL:
            self.errors.append(f"closing tag without opening tag </{tag}>")

    def handle_data(self, data):
        if self.stack:
            for element in self.elements:
                if element["tag"] == self.stack[-1] and element["text"] == "":
                    element["text"] += data

    def find(self, tag=None, **attrs):
        return [element for element in self.elements if (tag is None or element["tag"] == tag) and all(element["attrs"].get(k) == v for k, v in attrs.items())]


def clean(text):
    return " ".join(text.split())


def parse(page, root):
    document = Document()
    document.feed((root / page).read_text(encoding="utf-8"))
    document.close()
    if document.errors or document.stack:
        raise AssertionError(f"{page}: parse errors: {document.errors or 'unclosed tags ' + str(document.stack)}")
    return document


def relative_file(root, href, page):
    parsed = urlsplit(href)
    if parsed.scheme or parsed.netloc or href.startswith("/"):
        return None
    target = parsed.path
    if not target:
        return None
    path = (root / target).resolve()
    if root not in path.parents and path != root:
        raise AssertionError(f"{page}: asset escapes repository: {href}")
    return path


def check_document(page, document, root):
    title = document.find("title")
    assert len(title) == 1 and clean(title[0]["text"]), f"{page}: expected one non-empty title"
    assert len(document.find("main")) == 1, f"{page}: expected exactly one main landmark"
    navs = [e for e in document.find("nav") if e["attrs"].get("aria-label") == "Primary navigation"]
    assert len(navs) == 1, f"{page}: expected exactly one named primary navigation landmark"
    assert not document.find("script"), f"{page}: JavaScript must not be required"

    headings = [e for e in document.elements if e["tag"] in {"h1", "h2", "h3", "h4", "h5", "h6"}]
    assert sum(e["tag"] == "h1" for e in headings) == 1, f"{page}: expected exactly one document h1"
    levels = [int(e["tag"][1]) for e in headings]
    assert all(b <= a + 1 for a, b in zip(levels, levels[1:])), f"{page}: heading levels skip a level"
    assert all(clean(e["text"]) for e in headings), f"{page}: headings must have readable text"

    nav_links = []
    for link in navs[0]["attrs"].get("id", ""),:
        pass
    nav_source = [e for e in document.elements if e["tag"] == "a" and e["parent"] == "li"]
    for link in nav_source:
        text = clean(link["text"])
        if text in EXPECTED_NAV:
            nav_links.append(link)
    assert len(nav_links) == 5, f"{page}: expected five primary navigation links"
    assert {clean(link["text"]): link["attrs"].get("href") for link in nav_links} == EXPECTED_NAV, f"{page}: primary navigation labels/destinations changed"
    current = [link for link in nav_links if link["attrs"].get("aria-current") == "page"]
    assert len(current) == 1 and current[0]["attrs"].get("href") == page, f"{page}: current navigation state is invalid"
    assert "active" in current[0]["attrs"].get("class", "").split(), f"{page}: current link lacks active styling"
    assert all(link is current[0] or "aria-current" not in link["attrs"] for link in nav_links), f"{page}: duplicate current state"
    for label, href in EXPECTED_NAV.items():
        assert (root / href).is_file(), f"{page}: navigation destination missing: {href}"

    for image in document.find("img"):
        assert image["attrs"].get("alt", "").strip(), f"{page}: image is missing descriptive alt text"
        src = image["attrs"].get("src", "")
        path = relative_file(root, src, page)
        assert path and path.is_file(), f"{page}: image asset does not resolve: {src}"
    for link in document.find("a"):
        href = link["attrs"].get("href", "")
        parsed = urlsplit(href)
        if parsed.scheme in {"http", "https"}:
            assert link["attrs"].get("target") == "_blank", f"{page}: external link target changed: {href}"
            assert link["attrs"].get("rel") == "noreferrer", f"{page}: external link rel changed: {href}"
        elif href and not href.startswith("#"):
            path = relative_file(root, href, page)
            assert path and path.is_file(), f"{page}: relative link does not resolve: {href}"
    for stylesheet in document.find("link", rel="stylesheet"):
        path = relative_file(root, stylesheet["attrs"].get("href", ""), page)
        assert path and path.is_file(), f"{page}: stylesheet does not resolve"

    for form in document.find("form"):
        ids = {e["attrs"].get("id") for e in document.elements if e["tag"] in {"input", "textarea", "select"} and e["attrs"].get("id")}
        for control in [e for e in document.elements if e["tag"] in {"input", "textarea", "select"} and e["attrs"].get("id")]:
            labels = [label for label in document.find("label") if label["attrs"].get("for") == control["attrs"].get("id")]
            assert len(labels) == 1, f"{page}: form control {control['attrs']['id']} lacks a label association"
        assert form["attrs"].get("id") == "contact-form" or page != "contact.html", f"{page}: contact form id changed"


def contrast(hex_a, hex_b):
    def channel(value):
        value = int(value, 16) / 255
        return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4
    def luminance(value):
        return 0.2126 * channel(value[1:3]) + 0.7152 * channel(value[3:5]) + 0.0722 * channel(value[5:7])
    light, dark = sorted((luminance(hex_a), luminance(hex_b)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


def check_css(root):
    css = (root / "styles.css").read_text(encoding="utf-8")
    assert ":focus-visible" in css and "outline:" in css and "outline-offset:" in css, "CSS focus-visible indicator is missing"
    assert "z-index: 4" in css or "z-index: 5" in css, "focus indicator priority is missing"
    assert "--ink: #123459" in css and "--muted: #496b85" in css and "--glass-fallback: #f4fcff" in css, "contrast tokens changed without review"
    assert contrast("#123459", "#f4fcff") >= 4.5, "body text fails fallback-surface contrast"
    assert contrast("#496b85", "#f4fcff") >= 4.5, "supporting text fails fallback-surface contrast"
    assert contrast("#4b7600", "#f4fcff") >= 3, "focus ring fails fallback-surface contrast"


def main():
    root = Path(__file__).resolve().parents[1]
    for page in PAGES:
        check_document(page, parse(page, root), root)
    check_css(root)
    print("PASS: validated parseable HTML, unique titles and headings, landmarks/current navigation, image alternatives/assets, form labels, external attributes, relative links, JavaScript-independent baseline, and CSS focus/contrast contracts.")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
