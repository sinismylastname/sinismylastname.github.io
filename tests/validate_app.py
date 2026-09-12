"""Dependency-free validation for the React/Vite portfolio.

Run from the repository root with: python3 tests/validate_app.py
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app" / "src"
DIST = ROOT / "dist"
LEGACY = ("index.html", "blog.html", "portfolio.html", "resume.html", "contact.html", "styles.css")
REQUIRED_SOURCE = (
    "main.tsx", "app/App.tsx", "components/AppShell.tsx", "components/Navigation.tsx",
    "components/GlassSurface.tsx", "components/ProjectCard.tsx", "components/CustomCursor.tsx",
    "hooks/useHashPage.ts", "hooks/usePointerTilt.ts", "data/projects.ts",
    "components/AeroEnvironmentCanvas.tsx", "data/aeroEnvironment.ts",
    "webgl/aeroRenderer.ts", "webgl/aeroWebGLSupport.ts",
    "pages/HomePage.tsx", "pages/PortfolioPage.tsx", "pages/BlogPage.tsx",
    "pages/ResumePage.tsx", "pages/ContactPage.tsx",
    "styles/tokens.css", "styles/globals.css", "styles/components.css",
)
PROJECT_NAMES = ("hack4impact StarterPack", "SinnerPad", "Shiba Arcade Game & Custom Cabinet", "FRC Team 3598 Robot Software")


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def text(relative):
    return (ROOT / relative).read_text(encoding="utf-8")


def check_structure():
    for legacy in LEGACY:
        require(not (ROOT / legacy).exists(), f"legacy root file remains: {legacy}")
    for relative in REQUIRED_SOURCE:
        require((APP / relative).is_file(), f"required app source is missing: {relative}")
    require((ROOT / "package-lock.json").is_file(), "package-lock.json is missing")
    package = json.loads(text("package.json"))
    require(package["scripts"].get("build"), "build script is missing")
    require(package["scripts"].get("check"), "type-check script is missing")
    require("react" in package["dependencies"], "React dependency is missing")
    require("vite" in package["devDependencies"], "Vite dependency is missing")


def check_content():
    projects = text("app/src/data/projects.ts")
    for name in PROJECT_NAMES:
        require(name in projects, f"project content is missing: {name}")
    for asset in ("andy-avatar.svg", "project-preview.svg", "sinnerpad.png", "lockednloaded.png", "robot.jpg"):
        require((ROOT / "images" / asset).is_file(), f"image asset is missing: {asset}")
    home = text("app/src/pages/HomePage.tsx")
    require("Hello," in home and "I’m Andy Sin" in home, "homepage introduction is missing")
    resume = text("app/src/pages/ResumePage.tsx")
    for section in ("Education", "Engineering Experience", "Technical Skills", "Projects", "Honors"):
        require(section in resume, f"resume section is missing: {section}")
    contact = text("app/src/pages/ContactPage.tsx")
    for control in ('id="name"', 'id="email"', 'id="message"', 'id="contact-form"'):
        require(control in contact, f"contact control is missing: {control}")
    home = text("app/src/pages/HomePage.tsx")
    require("Hello," in home and "I’m Andy Sin" in home, "homepage introduction is missing")


def check_interactions():
    css = text("app/src/styles/components.css") + text("app/src/styles/globals.css")
    tilt = text("app/src/hooks/usePointerTilt.ts")
    cursor = text("app/src/components/CustomCursor.tsx")
    ambient = text("app/src/components/AmbientBackground.tsx")
    webgl = text("app/src/components/AeroEnvironmentCanvas.tsx") + text("app/src/webgl/aeroRenderer.ts")
    webgl_support = text("app/src/webgl/aeroWebGLSupport.ts")
    app = text("app/src/app/App.tsx") + text("app/src/hooks/useHashPage.ts")
    require("pointer: fine" in tilt, "tilt must be limited to fine pointers")
    require("bubble-rise" in css and "ambient-bubble" in ambient, "rising bubble ambience is missing")
    require("custom-cursor" in css and "closest" in cursor, "morphing custom cursor is missing")
    require("lockedTarget" in cursor and "RELEASE_DISTANCE" in cursor and "MAX_TUG" in cursor, "cursor lock/release/tug contract is missing")
    require("requestAnimationFrame(render)" in cursor and "velocity.x * 0.84" in cursor, "cursor smoothing loop is missing")
    require("prefers-reduced-motion" in css and "return null" in cursor, "cursor reduced-motion fallback is missing")
    require("scrollbar-width" in text("app/src/styles/globals.css") and "::-webkit-scrollbar" in text("app/src/styles/globals.css"), "custom scrollbar styling is missing")
    require(":hover" in css and "text-shadow" in css, "universal hover language is missing")
    require("startViewTransition" in app and "page-transition" in css, "smooth page transition support is missing")
    require("aria-hidden=\"true\"" in ambient and "aria-hidden=\"true\"" in cursor, "decorative layers must be hidden from assistive technology")
    require("aero-world-scene" not in css and "--scene-water-top" not in text("app/src/styles/tokens.css"), "rejected Aero world scene styles remain")
    require("horizonY" in webgl and "rippleHighlight" in webgl and "gl_FragColor" in webgl, "visible procedural water shader is missing")
    require('get("webgl") === "0"' in webgl_support and "return true" in webgl_support, "WebGL must be default-on with an explicit development fallback")
    require("orbEnabled" not in text("app/src/components/AeroEnvironmentCanvas.tsx"), "the optional hero orb prop must remain dormant")
    require("const bubbleCount = 0;" in text("app/src/components/AeroEnvironmentCanvas.tsx"), "GPU bubbles must remain removed from the standard renderer")
    require("frameInterval" in text("app/src/components/AeroEnvironmentCanvas.tsx"), "the renderer must use a bounded frame budget")
    require("getAeroPointerLight" in text("app/src/components/AeroEnvironmentCanvas.tsx"), "pointer lighting must use the shared module state")
    require("AeroIntro" in text("app/src/components/AppShell.tsx") and "aero-intro" in css, "the Aero first-load reveal is missing")


def check_accessibility():
    navigation = text("app/src/components/Navigation.tsx")
    require('aria-label="Primary navigation"' in navigation, "primary navigation name is missing")
    require("aria-current" in navigation, "current navigation state is missing")
    globals_css = text("app/src/styles/globals.css")
    components_css = text("app/src/styles/components.css")
    require(":focus-visible" in globals_css and "outline:" in globals_css, "focus-visible styling is missing")
    require("@media (prefers-reduced-motion: reduce)" in globals_css, "reduced-motion CSS is missing")
    require("pointer-events: none" in components_css, "decorative cursor/glare layers must be pointer isolated")
    require("loading=\"lazy\"" in text("app/src/components/ProjectCard.tsx"), "below-fold project images should be lazy loaded")


def check_build():
    index = DIST / "index.html"
    require(index.is_file(), "dist/index.html is missing; run npm run build")
    built = index.read_text(encoding="utf-8")
    require("type=\"module\"" in built and "/assets/" in built, "dist entry does not reference bundled assets")
    assets = list((DIST / "assets").glob("*")) if (DIST / "assets").is_dir() else []
    require(assets, "dist/assets is empty")
    require(any(asset.suffix == ".pdf" for asset in assets), "bundled resume PDF is missing")


def check_deployment():
    workflow = text(".github/workflows/deploy.yml")
    require("npm ci" in workflow and "npm run build" in workflow, "GitHub Pages workflow does not build the app")
    require("upload-pages-artifact" in workflow and "path: dist" in workflow, "workflow does not upload dist")
    require("deploy-pages" in workflow, "workflow does not deploy Pages artifact")


def run(scope="all"):
    checks = {
        "structure": check_structure,
        "content": check_content,
        "interactions": check_interactions,
        "accessibility": check_accessibility,
        "build": check_build,
        "deployment": check_deployment,
    }
    if scope == "all":
        for check in checks.values():
            check()
    else:
        checks[scope]()
    print(f"PASS: React/Vite app validation ({scope})")


if __name__ == "__main__":
    run()
