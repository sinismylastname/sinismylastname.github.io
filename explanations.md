# Project Explanations

This document explains how the portfolio works, why it is organized this way, and the main syntax patterns used in the code. It is intended for a developer who has never seen the project before.

## 1. What this project is

This repository contains Andy Sin’s personal portfolio website. It is a client-side React application built with Vite and TypeScript, deployed as a GitHub Pages user site at `sinismylastname.github.io`.

The site combines:

- Portfolio content about software, hardware, and robotics projects.
- Hash-based navigation between Home, Portfolio, About, Resume, and Contact.
- A Frutiger Aero visual system: aqua sky colors, green accents, bubbles, clouds, waves, translucent surfaces, and glass-like controls.
- Interactive glass cards and buttons.
- A progressive raw-WebGL environment canvas for procedural water with dormant experimental branches kept out of the normal rendering path.
- A custom cursor for fine-pointer desktop devices.
- Contextual build notes shown in a modal from the StarterPack project.
- A custom desktop scroll-progress control that falls back to the native scrollbar on mobile and coarse-pointer devices.

The application is intentionally frontend-only. There is no server, database, CMS, analytics system, authentication, or email service.

## 2. Repository organization

```text
repository-root/
├── app/
│   ├── index.html                 Browser entry document
│   └── src/
│       ├── app/App.tsx            Top-level page composition
│       ├── components/            Reusable visual and interactive components
│       ├── data/                  Typed content and site constants
│       ├── hooks/                 Reusable stateful browser behavior
│       ├── main.tsx               React mounting point
│       ├── pages/                 Page-level compositions
│       ├── styles/                Design tokens and CSS
│       └── webgl/                 Optional raw-WebGL renderer and quality policy
├── images/                        Static image assets imported by the app
├── tests/                         Dependency-free Python validators
├── .github/workflows/             GitHub Pages deployment workflow
├── dist/                          Vite build output; generated, not source
├── handoff.md                     Continuity notes for future agents
├── package.json                   Scripts and pinned dependencies
├── package-lock.json              Exact dependency resolution
├── vite.config.ts                 Vite build configuration
├── tsconfig.json                  Shared TypeScript configuration
├── tsconfig.app.json              Application TypeScript configuration
├── README.md                      Project-level overview
└── explanations.md                This architecture and syntax guide
```

### Why the source is inside `app/`

Vite is configured with `app/` as its root. This keeps the browser entry document and application source together while allowing the repository root to contain deployment files, tests, documentation, assets, and generated output.

`vite.config.ts` sets:

- `root: "app"`: Vite resolves the app from the `app` directory.
- `publicDir: false`: there is no separate copied public directory.
- `build.outDir: "../dist"`: the production build is written to the root-level `dist` directory.
- `base: "/"`: the site is deployed at the root of the GitHub user-site domain.

## 3. Runtime flow: from HTML to a page

The application starts in this order:

```text
app/index.html
  → app/src/main.tsx
  → app/src/app/App.tsx
  → useHashPage()
  → AppShell
  → selected page component
```

### `app/index.html`

This is the only HTML document used by the React application. It provides normal document metadata and a mount point:

```html
<div id="root"></div>
<script type="module" src="./src/main.tsx"></script>
```

The `type="module"` attribute tells the browser that the script uses modern JavaScript modules. Vite processes this file during development and production builds.

### `app/src/main.tsx`

`main.tsx` is the JavaScript entry point. It imports the global stylesheets, finds `#root`, creates a React root, and renders `<App />` inside `StrictMode`.

Important syntax:

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- `import` brings code from another module into this file.
- `document.getElementById` uses the browser DOM API.
- `!` is TypeScript’s non-null assertion. It tells TypeScript that the mount element is expected to exist.
- `<App />` is JSX: XML-like syntax that creates a React element.
- `StrictMode` enables extra development checks. It does not add visible UI.

### `app/src/app/App.tsx`

`App` is the top-level React component. It asks `useHashPage` which page is active, then conditionally renders that page inside `AppShell`.

```tsx
{page === "home" && <HomePage onNavigate={navigate} />}
```

The `&&` pattern means “render the JSX on the right only when the condition on the left is truthy.” There is no router package. The app uses the URL hash, such as `#work` or `#contact`, as its route.

### `app/src/hooks/useHashPage.ts`

This hook owns navigation state:

1. Read the initial hash.
2. Accept only the known `PageId` values.
3. Fall back to Home for an unknown or missing hash.
4. Listen for the browser’s `hashchange` event.
5. Update React state when the hash changes.
6. Animate scrolling to the top of the new page.
7. Use `document.startViewTransition` when the browser supports it.

The valid pages are:

```text
home, work, about, resume, contact
```

The page transition uses `requestAnimationFrame`, which schedules visual updates in sync with the browser’s rendering loop. The 520ms cubic ease makes navigation feel deliberate. When reduced motion is enabled, the hook jumps immediately instead.

### `app/src/components/AppShell.tsx`

`AppShell` is the shared frame around every page. Its render order is important:

1. `AeroEnvironmentCanvas`: optional decorative WebGL environment, transparent and pointer-inert.
2. `AmbientBackground`: authored CSS visual layers and fallback atmosphere.
3. `ScrollProgress`: desktop scroll line and draggable thumb.
4. `CustomCursor`: the cursor layer, portaled to `document.body`.
5. `Navigation`: sticky site navigation.
6. `<main id="main-content">`: the active page.
7. Footer.

The `key={activePage}` on `.page-transition` causes the page wrapper to remount when the page changes, allowing the page-entry animation to run again.

The `AeroEnvironmentCanvas` is a single `aria-hidden` canvas shared by all supported hash pages. It is enabled by default unless `VITE_AERO_WEBGL=false` or development `?webgl=0` is used, and it keeps the CSS background and glass layers as the fallback. The renderer uses one fullscreen triangle, a bounded animation cadence, and a fixed per-device render budget; reduced motion renders one static frame, while unsupported WebGL, print, hidden visibility, context loss, low-quality paths, and cleanup remove or pause the enhancement without changing page semantics. The standard path combines procedural water, a lightweight cursor-driven water highlight, and the authored CSS bubble ambience. GPU bubbles, caustics, the hero orb, and analytic refraction remain dormant experiments so page navigation does not recompile the background renderer.

The typed WebGL environment and CSS environment variables retain the same internal four-state model (`morning`, `midday`, `sunset`, `night`) for future experiments. Production currently selects `midday` once, with no clock or `?sky=` override, and their material values remain separate projections so CSS can render when WebGL is absent.

## 4. Pages and content

### `app/src/pages/`

Page components compose content but should not contain every low-level visual rule themselves.

- `HomePage.tsx`: hero, profile, all four projects, calls to action, and interests.
- `PortfolioPage.tsx`: filterable project collection.
- `AboutPage.tsx`: biography and interests.
- `ResumePage.tsx`: education, experience, skills, projects, honors, and the bundled PDF link.
- `ContactPage.tsx`: contact information and native HTML form.
- `BlogPage.tsx`: an older blog-style page that is exported but not currently reachable through `App` or the primary navigation.
- `index.ts`: page export barrel.

Home displays all four project records. The optional `featuredOnly` prop still exists in `ProjectGrid`, but Home currently calls the grid without that prop so the complete project set is visible.

### `app/src/data/`

Content is kept outside page markup so it can be changed without rewriting layout code.

`data/projects.ts` defines:

- `ProjectNotes`: eyebrow, title, and paragraphs for contextual notes.
- `Project`: the shape of a project record.
- `projects`: the four project records.
- Imported image assets and project metadata.

The `category` field is a string union:

```ts
category: "software" | "hardware" | "robotics";
```

A union type allows only one of the listed string values. This prevents typos and lets TypeScript check filter logic.

`data/site.ts` contains the navigation and interest constants. `as const` preserves literal values instead of widening them to generic `string` values. That allows types such as `PageId` to be derived directly from the data.

## 5. Components and responsibilities

### `AmbientBackground.tsx`

Creates decorative clouds, orbs, waves, and sixteen bubble elements. The parent is `aria-hidden="true"` because these shapes communicate atmosphere, not information. All layers use `pointer-events: none` so they never block links, buttons, or scrolling.

### `GlassSurface.tsx`

Provides a reusable polymorphic glass surface. “Polymorphic” means the component can render as different HTML elements, such as a `div`, `article`, `a`, or `button`, while sharing visual behavior.

It combines:

- A semantic HTML element.
- A glass class name.
- Optional interactivity.
- Pointer tilt through `usePointerTilt`.
- CSS custom properties for pointer position and tilt.

`ElementType` is a React TypeScript type representing a valid element or component type. The component uses a broad internal component variable because rendering a dynamic element is difficult to express perfectly in a small polymorphic helper.

### `GlassButton.tsx`

A convenience wrapper around `GlassSurface` for links and buttons. It keeps CTA styling consistent and allows the caller to supply either an `href` or button behavior.

### `Navigation.tsx`

Renders the brand link and navigation links. It measures the current link with `useLayoutEffect` and positions `.nav-active-indicator` over it. `useLayoutEffect` runs after DOM layout but before the browser paints, which prevents the indicator from visibly appearing in the wrong position first.

`aria-current="page"` identifies the active navigation item to assistive technology.

### `ProjectCard.tsx`

Receives one typed `Project` object and renders its image, category, title, summary, technologies, links, optional details, and optional notes button.

Local React state controls the “Peek inside” expansion:

```tsx
const [expanded, setExpanded] = useState(false);
```

- `useState(false)` creates state with an initial value of `false`.
- `expanded` is the current value.
- `setExpanded` changes it and schedules a re-render.

Notes are opened through a callback supplied by the card. This keeps the card responsible for opening the feature while the modal owns modal behavior.

### `ProjectGrid.tsx`

Maps the typed `projects` array into cards. `map` transforms each data record into JSX. A stable project ID is used as the React `key`, allowing React to track each card efficiently.

### `ProjectNotesModal.tsx`

The notes modal uses `createPortal` to render under `document.body` instead of inside the project card. This prevents card overflow and stacking contexts from clipping the dialog.

Behavior:

- Adds `role="dialog"` and `aria-modal="true"`.
- Labels itself with the modal heading through `aria-labelledby`.
- Locks body scrolling while open.
- Focuses the close button when opened.
- Closes with the X button, Escape, or a backdrop click.
- Restores the previously focused element after closing.
- Keeps the component mounted briefly during the exit animation.

The modal does not implement a complete focus trap. Its close button is focused first, but a future enhancement could constrain Tab navigation to the modal while it is open.

### `CustomCursor.tsx`

The cursor is enabled only for fine-pointer devices and is disabled for reduced-motion users. It is rendered through a portal into `document.body` so it can appear above the notes modal’s blurred backdrop. This matters because `.app-shell` uses `isolation: isolate`, which would otherwise trap the cursor in a lower stacking context.

The cursor:

- Tracks pointer movement with a `requestAnimationFrame` loop.
- Smooths movement with a low-pass interpolation function.
- Computes a small velocity-based tug.
- Caps tug at 8px and rotation at 2.5 degrees.
- Morphs around links, buttons, inputs, textareas, and selects.
- Releases after the pointer moves far enough from the locked target.
- Also morphs onto a keyboard-focused control through `focusin` and `focusout`.
- Uses `pointer-events: none` so it never blocks the real control beneath it.

The regular browser cursor is hidden only where the custom cursor is available:

```css
@media (pointer: fine) and (prefers-reduced-motion: no-preference) {
  body, body * { cursor: none; }
}
```

### `ScrollProgress.tsx`

This is a semantic custom scrollbar, not just decoration. Its root uses `role="scrollbar"`, `tabIndex={0}`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.

On fine-pointer desktop environments it provides:

- A thin fixed progress line.
- A transparent glass oval thumb.
- Pointer dragging.
- Track click-to-jump.
- Home, End, arrow, PageUp, and PageDown keyboard controls.
- A 1.6-second idle fade.
- Immediate mouse-controlled movement to avoid smooth-scroll jitter.

On mobile and coarse-pointer devices, the custom control is hidden and the native scrollbar remains available. Reduced-motion mode uses immediate movement and disables transition-heavy behavior.

## 6. Hooks and browser behavior

### `usePointerTilt.ts`

This hook attaches pointer listeners only when the device has a fine pointer and reduced motion is not requested. It calculates the pointer’s position relative to the element’s bounding rectangle, converts that position into bounded X/Y rotation, and writes CSS custom properties.

The hook uses `requestAnimationFrame` to batch DOM style updates. This is better than writing transforms on every raw pointer event because pointer events can arrive faster than the screen can paint.

### `useReducedMotion.ts`

Wraps the browser media query:

```text
(prefers-reduced-motion: reduce)
```

It listens for changes so the app responds if the user changes the preference while the page is open.

## 7. TypeScript and React syntax guide

### Imports and exports

```ts
import { useState } from "react";
export function ProjectCard() {}
```

- `import` reads a value or type from another module.
- `export` makes a declaration available to other files.
- Type-only imports can be written with `import type` so they disappear from runtime JavaScript.

### Types and interfaces

The project mostly uses `type` aliases:

```ts
type ScrollMetrics = {
  maxScroll: number;
  thumbHeight: number;
};
```

This describes the required fields without creating a runtime object. TypeScript checks that callers use the expected shapes.

### Optional properties

```ts
notes?: ProjectNotes;
```

The `?` means a project may omit `notes`. Components must check whether notes exist before rendering a notes button.

### Function parameters and return values

```ts
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
```

The parameter annotations document the accepted types. TypeScript infers the return type from the returned expression.

### Arrow functions

```ts
const update = () => {
  // work
};
```

Arrow functions provide compact callbacks and preserve the surrounding lexical `this`. They are common for event handlers, array methods, and React callbacks.

### Destructuring

```tsx
export function ProjectCard({ project }: { project: Project }) {}
```

The parameter immediately extracts `project` from the props object and gives it the `Project` type.

### Generics

```ts
useRef<HTMLDivElement>(null);
```

`HTMLDivElement` is supplied as a generic type argument so TypeScript knows what the ref will eventually contain.

### React hooks

- `useState`: stores component-local state.
- `useEffect`: performs browser subscriptions, timers, and cleanup after rendering.
- `useRef`: stores a DOM node or mutable value without causing a render when it changes.
- `useMemo`: caches derived values when appropriate.
- `useCallback`: keeps callback identity stable, especially when passed to effects or child components.
- `useLayoutEffect`: measures layout before paint.

An effect’s return value is cleanup:

```tsx
useEffect(() => {
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);
```

The empty dependency array means the subscription is created for the component’s lifetime. Cleanup prevents duplicate listeners and memory leaks.

### JSX

JSX attributes use camelCase names such as `tabIndex`, `aria-label`, and `onClick`. JavaScript expressions go inside braces:

```tsx
<button aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
  Peek inside
</button>
```

A component must return one React tree. Fragments (`<>...</>`) group multiple sibling elements without adding an extra DOM wrapper.

### Conditional rendering

```tsx
{notes && <button>Read build notes</button>}
```

The button exists only when `notes` is present. Ternaries are used when both branches need to be explicit:

```tsx
{expanded ? "Hide details" : "Peek inside"}
```

### Mapping data into elements

```tsx
projects.map((project) => (
  <ProjectCard key={project.id} project={project} />
))
```

`map` returns a new array of React elements. `key` gives React a stable identity for each item.

### DOM events

The code uses both React events (`onClick`, `onKeyDown`) and native browser events (`window.addEventListener`). Native listeners are used for global pointer, scroll, resize, and focus behavior that should not depend on a particular JSX element.

### Null safety syntax

```ts
observer?.disconnect();
```

Optional chaining calls `disconnect` only when `observer` is not `null` or `undefined`.

```ts
const value = maybeValue ?? fallback;
```

Nullish coalescing uses the fallback only when the left side is null or undefined.

## 8. CSS syntax and visual system

### Design tokens

`tokens.css` defines reusable custom properties on `:root`:

```css
:root {
  --aqua: #27bfc5;
  --radius-card: 1.65rem;
  --duration-fast: 180ms;
}
```

They are used with `var(--aqua)`. Centralizing colors, radii, shadows, easing, and durations makes the visual system consistent and easier to tune.

### Glass material

Glass surfaces deliberately use multiple layers:

1. A translucent background.
2. `backdrop-filter` for blur and saturation.
3. A bright border and upper rim.
4. An inset lower shadow for depth.
5. Pseudo-elements for glare and reflections.
6. An opaque fallback for browsers without backdrop-filter support.

The project uses CSS approximation rather than a WebGL LiquidGlass dependency. WebGL DOM capture would create a heavier runtime and performance cost for the small scrollbar and portfolio controls.

### Pseudo-elements

`.glass-surface::before` and `::after` create visual layers without extra markup. `content: ""` is required for generated pseudo-elements to appear. These layers use `pointer-events: none` so decorative reflections cannot block interaction.

### Layout syntax

The project uses:

- CSS Grid for page and card arrangements.
- Flexbox for navigation, action rows, and wrapping tags.
- `minmax(0, 1fr)` to prevent long content from forcing horizontal overflow.
- `clamp()` for fluid typography and spacing.
- Media queries at 760px for narrow layouts.
- `overflow-wrap: anywhere` and clipped horizontal overflow for resilient long content.

### Motion syntax

`@keyframes` defines named animation states. `animation` applies those states over time. `transition` animates changes between styles, such as hover, focus, opacity, and transform.

The reduced-motion media query disables ambient animation, page-entry animation, tilt, smooth scrolling, and other motion-heavy effects. Any new animation should have an equivalent reduced-motion behavior.

## 9. Design and development principles

### Separate responsibilities

- Pages compose sections.
- Components own reusable UI behavior.
- Data modules own content.
- Hooks own browser behavior and stateful logic.
- Tokens own shared visual values.
- CSS owns presentation.

This separation prevents a page file from becoming a mixture of content, event listeners, layout, and design constants.

### Prefer data-driven UI

Projects are records in `projects.ts`, not four copies of nearly identical JSX. Adding or editing a project should normally require changing one data record and, if needed, the shared card component.

### Prefer semantic HTML

Use headings, links, buttons, forms, landmarks, labels, and ARIA only where needed. A link navigates; a button performs an action. This improves keyboard behavior and screen-reader interpretation.

### Progressive enhancement

The site adds custom effects only when the device and user preference support them:

- Touch devices keep native scrolling and cursors.
- Reduced-motion users receive less animation and a static WebGL water frame.
- WebGL is default-on progressive enhancement, capability-gated, and keeps the CSS/DOM interface as fallback.
- Glass has an opaque fallback.
- Navigation works through ordinary URL hashes.
- The contact form still uses native browser validation.

### Keep decoration non-blocking

Background shapes, cursor layers, reflections, and progress visuals use `pointer-events: none` when they should not receive input. Decorative elements are hidden from assistive technology.

### Keep interaction compositor-friendly

Pointer and scroll effects should update transforms, opacity, and CSS variables rather than repeatedly forcing expensive layout changes. `requestAnimationFrame`, passive listeners, cleanup functions, and `ResizeObserver` are used where appropriate.

### Avoid unnecessary dependencies

React, React DOM, Vite, and TypeScript are enough for the current application. A `motion` dependency is installed for possible future use, but the current cursor and interactions use smaller custom logic. Do not add a router, CMS, animation framework, backend, analytics, or third-party glass renderer without a clear need.

### Preserve continuity

Before changing behavior, read `handoff.md` and inspect the implementation. After a meaningful task, update `handoff.md` with changed files, visual preferences, fixed issues, limitations, and validation results. Do not commit or push unless explicitly requested.

## 10. Accessibility and interaction details

Current accessibility features include:

- Semantic landmarks such as `header`, `main`, `footer`, and navigation.
- Meaningful heading structure.
- Accessible navigation label and active-page state.
- Labels and IDs for contact form fields.
- Native `required` and email validation.
- Meaningful image alt text.
- `aria-pressed` for portfolio filters.
- Dialog role, modal state, and labelled heading for notes.
- Keyboard controls for the custom scrollbar.
- Focus restoration after closing the notes dialog.
- Motion and pointer fallbacks.

The custom cursor is visual only and never replaces the actual pointer target. Its `pointer-events: none` rule ensures that clicking still reaches the button or link underneath.

## 11. Validation and development commands

Run commands from the repository root:

```bash
npm install
npm run dev
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```

What each command does:

- `npm install`: installs the locked dependency tree.
- `npm run dev`: starts Vite’s development server.
- `npm run check`: runs TypeScript with `--noEmit`.
- `npm run build`: type-checks and creates the production Vite bundle in `dist/`.
- `npm run preview`: serves the built bundle locally.
- `npm test`: runs the main Python validator.
- The `validate_*.py` loop runs each scope-specific static validator.
- `git diff --check`: detects whitespace errors in the Git diff.

The validators are dependency-free and mostly inspect source/configuration. They are not a replacement for testing the site in a browser with a real keyboard, fine pointer, coarse pointer, reduced-motion preference, narrow viewport, and screen reader.

## 12. Deployment

`.github/workflows/deploy.yml` deploys the site to GitHub Pages:

1. Trigger on pushes to `main` or manual dispatch.
2. Use Node 22.
3. Run `npm ci` for the locked dependency install.
4. Run `npm run build`.
5. Upload `dist/` as the Pages artifact.
6. Deploy through GitHub Pages Actions.

The repository is a GitHub user site, so the Vite base path is `/`. GitHub Pages must be configured to use GitHub Actions as its publishing source.

## 13. Current caveats

These are current facts, not necessarily bugs:

- `BlogPage.tsx` exists but is not reachable through the current route set. The old Notes content is now attached to the StarterPack project modal.
- The contact form validates in the browser but does not send or persist messages. A backend or form provider would be required for delivery.
- The notes dialog does not currently implement a complete focus trap.
- There is no browser end-to-end test suite or visual regression suite.
- The optional WebGL layer has passed repository checks but has not received browser visual, GLSL execution, GPU frame-time/dropped-frame, cross-device, or thermal profiling in this workspace.
- Google Fonts are imported from `tokens.css`, so typography may differ when offline or when the font request fails.
- The custom LiquidGlass treatment is CSS-based. True background refraction would require a heavier WebGL capture/shader pipeline; the current analytic refraction branch remains development-only and reject/defer for production.
- `motion` is installed but not currently imported by application source.

When documentation conflicts with the implementation, inspect the source and update this document rather than assuming an older description is correct.
