"""Dependency-free structural checks for static navigation and landmarks.

Run from the repository root with: python3 tests/validate_navigation.py
"""

from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

PAGES = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html")
EXPECTED = (("Home", "index.html"), ("Blog", "blog.html"), ("Portfolio", "portfolio.html"), ("Resume", "resume.html"), ("Contact", "contact.html"))
LINK = re.compile(r'<a\b([^>]*)>(.*?)</a\s*>', re.I | re.S)
ATTR = re.compile(r'([\w-]+)\s*=\s*["\']([^"\']*)["\']', re.S)


def check(page: str, root: Path) -> None:
    source = (root / page).read_text(encoding="utf-8")
    if len(re.findall(r"<main\b", source, re.I)) != 1:
        raise AssertionError(f"{page}: expected exactly one main landmark")
    if len(re.findall(r'<nav\b[^>]*aria-label=["\']Primary navigation["\']', source, re.I)) != 1:
        raise AssertionError(f"{page}: expected exactly one named primary navigation")
    if re.search(r"<script\b", source, re.I):
        raise AssertionError(f"{page}: navigation must not depend on JavaScript")

    nav_match = re.search(r'<ul\b[^>]*class=["\'][^"\']*\bnav-list\b[^"\']*["\'][^>]*>(.*?)</ul\s*>', source, re.I | re.S)
    if not nav_match:
        raise AssertionError(f"{page}: missing .nav-list")
    links = []
    for attributes, inner in LINK.findall(nav_match.group(1)):
        attrs = dict(ATTR.findall(attributes))
        text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", inner)).strip()
        links.append((text, attrs.get("href"), attrs.get("class", ""), attrs.get("aria-current")))
    if [(text, href) for text, href, _, _ in links] != list(EXPECTED):
        raise AssertionError(f"{page}: primary links do not match expected labels/destinations")

    current = [link for link in links if link[3] == "page"]
    active = [link for link in links if "active" in link[2].split()]
    if len(current) != 1:
        raise AssertionError(f"{page}: expected exactly one aria-current=page item")
    if len(active) != 1 or active[0] != current[0]:
        raise AssertionError(f"{page}: active styling and aria-current do not match")
    if current[0][1] != page:
        raise AssertionError(f"{page}: current link does not target the current document")
    if any(link[3] is not None and link[3] != "page" for link in links):
        raise AssertionError(f"{page}: unexpected aria-current value")

    for label, href in EXPECTED:
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc or parsed.query or parsed.fragment or href.startswith("/"):
            raise AssertionError(f"{page}: {label} destination is not plain relative")
        if not (root / href).is_file():
            raise AssertionError(f"{page}: {label} destination does not exist")


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    for page in PAGES:
        check(page, root)
    print(f"PASS: validated {len(PAGES)} pages, five relative destinations, one current item, one named primary navigation, and one main landmark per page.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
