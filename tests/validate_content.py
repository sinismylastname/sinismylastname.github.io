"""Dependency-free regression checks for preserved site content and semantics.

Run from the repository root with: python3 tests/validate_content.py
"""

from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import urlsplit

PAGES = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html")
EXPECTED_TITLES = {
    "index.html": "Andy Sin | Home",
    "blog.html": "Andy Sin | Blog",
    "portfolio.html": "Andy Sin | Portfolio",
    "resume.html": "Andy Sin | Resume",
    "contact.html": "Andy Sin | Contact",
}
EXPECTED_PROJECTS = (
    "hack4impact StarterPack",
    "SinnerPad",
    "Shiba Arcade Game & Custom Cabinet",
    "FRC Team 3598 Robot Software",
)
EXPECTED_PROJECT_IMAGES = {
    "images/project-preview.svg": "Frutiger styled preview of Andy's personal website",
    "images/sinnerpad.png": "Preview of the SinnerPad macropad",
    "images/lockednloaded.png": "Preview of the Game Title Screen for the Shiba Arcade Game",
    "images/robot.jpg": "Preview of the FRC robot",
}
EXPECTED_RESUME_SECTIONS = (
    "Education",
    "Engineering Experience",
    "Technical Skills",
    "Projects",
    "Honors",
)
EXPECTED_RESUME_ENTRIES = (
    "California Polytechnic State University, San Luis Obispo",
    "Lead Programmer & Competition Strategist",
    "Programming & Outreach Member",
    "SinnerPad",
    "Shiba Arcade Game & Custom Cabinet",
)


class Document(HTMLParser):
    """Small HTML model sufficient for static content contract checks."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.elements = []
        self.text_by_id = {}
        self._next_id = 0

    def handle_starttag(self, tag, attrs):
        element = {"id": self._next_id, "tag": tag.lower(), "attrs": dict(attrs), "text": "", "parent": self.stack[-1] if self.stack else None}
        self._next_id += 1
        self.elements.append(element)
        self.stack.append(element)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.stack.pop()

    def handle_endtag(self, tag):
        tag = tag.lower()
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        for element in self.stack:
            element["text"] += data

    def find(self, tag=None, **attrs):
        return [
            element
            for element in self.elements
            if (tag is None or element["tag"] == tag)
            and all(element["attrs"].get(key) == value for key, value in attrs.items())
        ]

    @staticmethod
    def clean(text):
        return " ".join(text.split())


def parse(page, root):
    source = (root / page).read_text(encoding="utf-8")
    document = Document()
    document.feed(source)
    document.close()
    return document


def assert_true(condition, message):
    if not condition:
        raise AssertionError(message)


def check_common(page, document, root):
    title = document.find("title")
    assert_true(len(title) == 1 and Document.clean(title[0]["text"]) == EXPECTED_TITLES[page], f"{page}: title changed or is missing")

    headings = [Document.clean(element["text"]) for element in document.find() if element["tag"] in {"h1", "h2", "h3"}]
    paragraphs = [Document.clean(element["text"]) for element in document.find("p")]
    assert_true(headings and all(headings), f"{page}: every heading must retain readable text")
    assert_true(paragraphs and all(paragraphs), f"{page}: every paragraph must retain readable text")

    images = document.find("img")
    assert_true(all(element["attrs"].get("alt", "").strip() for element in images), f"{page}: every meaningful image needs non-empty alt text")
    for image in images:
        src = image["attrs"].get("src")
        assert_true(src and (root / src).is_file(), f"{page}: image asset does not resolve: {src}")

    links = document.find("a")
    assert_true(links, f"{page}: meaningful links were removed")
    for link in links:
        href = link["attrs"].get("href", "")
        assert_true(href, f"{page}: link is missing its destination")
        if urlsplit(href).scheme in {"http", "https"}:
            assert_true(link["attrs"].get("target") == "_blank", f"{page}: external link must retain target=_blank: {href}")
            assert_true(link["attrs"].get("rel") == "noreferrer", f"{page}: external link must retain rel=noreferrer: {href}")


def check_home(document):
    stages = document.find("section", **{"class": "sky-stage"})
    assert_true(len(stages) == 1, "index.html: sky-stage composition is missing")
    hero_text = " ".join(Document.clean(element["text"]) for element in document.find() if element["tag"] in {"h1", "h2", "p", "a"})
    assert_true("Hello, world!" in hero_text and "I’m Andy Sin." in hero_text, "index.html: hero title or introduction was removed")
    status = [element for element in document.find() if element["attrs"].get("role") == "status" and Document.clean(element["text"])]
    complete_stage = stages[0]["attrs"].get("aria-labelledby") == "home-title"
    assert_true(complete_stage or status, "index.html: sky-stage needs a complete composition or perceivable failure indication")
    avatar = [element for element in document.find("img") if element["attrs"].get("src") == "images/andy-avatar.svg"]
    assert_true(len(avatar) == 1 and avatar[0]["attrs"].get("alt"), "index.html: avatar and meaningful alternative text must be preserved")


def check_portfolio(document):
    projects = [element for element in document.find("article") if "project" in element["attrs"].get("class", "").split()]
    assert_true(len(projects) == 4, f"portfolio.html: expected four project cards, found {len(projects)}")
    names = {Document.clean(element["text"]) for element in document.find("p") if "project-name" in element["attrs"].get("class", "").split()}
    assert_true(names == set(EXPECTED_PROJECTS), "portfolio.html: project names/cards changed")
    for src, alt in EXPECTED_PROJECT_IMAGES.items():
        matches = [image for image in document.find("img") if image["attrs"].get("src") == src]
        assert_true(len(matches) == 1 and matches[0]["attrs"].get("alt") == alt, f"portfolio.html: project image or alt text changed: {src}")


def check_resume(document):
    section_names = {Document.clean(element["text"]) for element in document.find("h2") if "section-title" in element["attrs"].get("class", "").split()}
    assert_true(section_names == set(EXPECTED_RESUME_SECTIONS), "resume.html: resume section hierarchy changed")
    entry_text = " ".join(Document.clean(element["text"]) for element in document.find("h3"))
    assert_true(all(entry in entry_text for entry in EXPECTED_RESUME_ENTRIES), "resume.html: resume entries were removed or renamed")
    lists = document.find("ul")
    assert_true(len(lists) >= 2 and len(document.find("li")) >= 6, "resume.html: resume lists/entries were removed")
    github = [link for link in document.find("a") if link["attrs"].get("href") == "https://github.com/sinismylastname"]
    assert_true(len(github) == 1, "resume.html: GitHub link was removed")


def check_contact(document):
    forms = document.find("form")
    assert_true(len(forms) == 1 and forms[0]["attrs"].get("id") == "contact-form", "contact.html: contact form changed")
    controls = {element["attrs"].get("id"): element for element in document.find() if element["tag"] in {"input", "textarea"}}
    assert_true({"name", "email", "message"}.issubset(controls), "contact.html: required named controls were removed")
    for control_id in ("name", "email", "message"):
        labels = [label for label in document.find("label") if label["attrs"].get("for") == control_id]
        assert_true(len(labels) == 1, f"contact.html: missing label association for {control_id}")
        assert_true("required" in controls[control_id]["attrs"], f"contact.html: required attribute removed from {control_id}")
    assert_true(any(element["attrs"].get("type") == "submit" for element in document.find("input")), "contact.html: submit control was removed")


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    for page in PAGES:
        document = parse(page, root)
        check_common(page, document, root)
        if page == "index.html":
            check_home(document)
        elif page == "portfolio.html":
            check_portfolio(document)
        elif page == "resume.html":
            check_resume(document)
        elif page == "contact.html":
            check_contact(document)
    print("PASS: preserved headings, paragraphs, links, controls, resume content, project cards/images, external attributes, and home sky-stage fallback across five pages.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
