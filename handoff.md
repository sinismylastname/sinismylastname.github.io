# Handoff: Interactive Frutiger Aero Glass Portfolio

## Project direction

This is Andy Sin’s personal portfolio, redesigned as an interactive Frutiger Aero/glassmorphism site. The visual reference is the supplied Webflow Glass Button example:

- Soft cloudy translucent glass rather than opaque white cards.
- Bright outer and upper rim highlights.
- Darker lower inner bevel.
- Soft cast shadow.
- Visible blurred background through the material.
- Subtle reflected/ghosted label treatment.
- Smooth, physical-feeling interaction rather than sharp neon effects.

The site should feel playful, tactile, and attention-grabbing while remaining professional, readable, performant, keyboard-accessible, and comfortable for reduced-motion users.

## Current architecture

The repository is now a React/Vite/TypeScript application:

- React
- Vite
- TypeScript
- CSS custom properties and regular CSS
- Native `pointermove` and `requestAnimationFrame` for cursor/card interactions
- `motion` is installed as a dependency for possible future spring/gesture work, but the current cursor uses a deliberately small custom animation loop
- GitHub Actions + GitHub Pages
- Hash-based navigation instead of React Router

The app source is under `app/src/` and Vite builds it to `dist/`.

Important configuration files:

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `.github/workflows/deploy.yml`

The repository is a GitHub user site (`sinismylastname.github.io`), so the Vite base path is `/`.

## Legacy cleanup

The old competing root implementation was removed. These files no longer exist:

- `index.html`
- `blog.html`
- `portfolio.html`
- `resume.html`
- `contact.html`
- `styles.css`

The React app is the only site implementation. Existing assets remain:

- `images/andy-avatar.svg`
- `images/project-preview.svg`
- `images/sinnerpad.png`
- `images/lockednloaded.png`
- `images/robot.jpg`
- `resume.pdf`

The old static implementation was removed only after the Vite build/deployment path was working.

## React source structure

```text
app/
  index.html
  src/
    app/App.tsx
    components/
      AmbientBackground.tsx
      AppShell.tsx
      CustomCursor.tsx
      GlassButton.tsx
      GlassSurface.tsx
      Navigation.tsx
      ProjectCard.tsx
      ProjectGrid.tsx
      SectionHeading.tsx
    data/
      projects.ts
      site.ts
    hooks/
      useHashPage.ts
      usePointerTilt.ts
      useReducedMotion.ts
    pages/
      AboutPage.tsx
      BlogPage.tsx
      ContactPage.tsx
      HomePage.tsx
      PortfolioPage.tsx
      ResumePage.tsx
      index.ts
    styles/
      tokens.css
      globals.css
      components.css
    main.tsx
```

## Existing content preserved

The React app preserves the original portfolio’s main content:

- Andy Sin identity and Computer Engineering / Cal Poly SLO introduction.
- Avatar image and meaningful alt text.
- Four projects:
  - hack4impact StarterPack
  - SinnerPad
  - Shiba Arcade Game & Custom Cabinet
  - FRC Team 3598 Robot Software
- Project imagery, summaries, technical metadata, and expandable details.
- Portfolio filtering by software, hardware, and robotics.
- Notes/blog reflection about building the first personal website.
- About page and current interests.
- Resume education, experience, skills, projects, honors, and bundled `resume.pdf`.
- Contact form with native labels, IDs, required fields, and browser validation.
- GitHub external links with `target="_blank"` and `rel="noreferrer"`.

## Visual system

The main glass material is implemented in `app/src/styles/components.css` and `app/src/styles/tokens.css`.

Variants:

- `glass-nav`: strong translucent navigation capsule.
- `glass-button`: strong glass CTA/control with reflected label shadow.
- `glass-card`: strong project-card glass.
- `glass-panel`: calmer glass for reading-heavy content.

Layering order:

```text
Frutiger Aero sky/water gradient
  -> ambient orbs, clouds, wave bands, and bubbles
  -> backdrop blur and translucent glass tint
  -> bright upper/outer rim
  -> darker lower inner bevel
  -> pointer glare/reflection
  -> readable content
  -> focus indicators above everything
```

Do not revert the system to flat opaque white cards or rely on blur alone. Preserve an opaque fallback for browsers without `backdrop-filter`.

## Cursor behavior and preferences

`app/src/components/CustomCursor.tsx` contains the current custom cursor.

Required behavior:

- Desktop fine pointers only.
- Native cursor remains on touch/coarse-pointer devices.
- Completely disabled for `prefers-reduced-motion: reduce`.
- Small idle circle is visible when moving over ordinary content.
- On an interactive target, the cursor morphs around the target’s bounds and stays anchored to that target’s center.
- The target capsule should not chase the pointer.
- Pointer velocity adds only a subtle, smoothed tug and slight rotation.
- Current maximum tug is `8px`.
- Current maximum rotation is `2.5deg`.
- The cursor uses a low-pass velocity filter and a single `requestAnimationFrame` interpolation loop.
- It releases after the pointer moves more than `76px` away from the locked element.
- On release it must smoothly return to the original 24px circle.
- Do not reintroduce direct per-event CSS writes or a second competing CSS transform transition; that was the source of the previous jank.

The cursor recognizes:

```text
a, button, input, textarea, select, [data-cursor-interactive]
```

`GlassSurface` adds `data-cursor-interactive="true"` to interactive glass surfaces.

## Background motion

`AmbientBackground.tsx` and `globals.css` currently provide:

- Ten staggered rising bubble streams.
- Varied bubble sizes, delays, speeds, and horizontal drift.
- Slowly moving cloud bands.
- Large translucent wave layers.
- Slowly shifting sky gradient.
- Ambient orbs and the existing large fixed background form.

All ambient layers are decorative, use `pointer-events: none`, and are hidden from assistive technology through the parent’s `aria-hidden="true"`.

Reduced motion disables:

- Gradient flow.
- Bubble movement.
- Cloud movement.
- Wave movement.
- Orb movement.
- Page-entry movement.
- Cursor rendering.

Do not add attention effects that obscure text, create layout shifts, or make the background more visually dominant than the portfolio content.

## Page transitions

Hash navigation is implemented by `useHashPage.ts`.

Current transition behavior:

- Hash navigation updates the active page without React Router.
- `document.startViewTransition` is used when supported.
- `.page-transition` provides a CSS fallback for browsers without the View Transition API.
- The page scrolls back to the top on navigation.
- Reduced motion uses an immediate transition and non-smooth scrolling.

Keep hash navigation unless there is a strong reason to introduce a router. GitHub Pages direct-route behavior was one reason to avoid React Router initially.

## Scrollbar

The browser scrollbar was visually out of place, so `globals.css` now provides a themed scrollbar:

- Firefox: `scrollbar-width: thin` and `scrollbar-color`.
- Chromium/WebKit: styled track and thumb using `::-webkit-scrollbar` selectors.
- Aqua/white glass thumb with lime hover state.
- Scrolling and keyboard behavior are preserved.
- Do not hide the scrollbar entirely unless a replacement scroll affordance is implemented and accessibility is explicitly reviewed.

## Accessibility and performance constraints

Preserve these behaviors:

- `prefers-reduced-motion` support.
- Visible `:focus-visible` indicators.
- Keyboard operation for navigation, filters, expandable project details, buttons, and forms.
- Native contact-form validation.
- Meaningful image alt text.
- Decorative background and cursor layers excluded from assistive technology.
- No pointer interception by decoration.
- No animation-dependent content visibility.
- No large layout shifts from hover/cursor effects.
- No horizontal overflow at narrow widths or zoomed layouts.
- Keep long-form text readable and mostly stationary.
- Keep cursor/card effects bounded and compositor-friendly.

## Validation commands

Run from the repository root:

```bash
npm install
npm run check
npm run build
npm test
```

The migrated dependency-free validators can also be run individually:

```bash
python3 tests/validate_app.py
python3 tests/validate_accessibility.py
python3 tests/validate_content.py
python3 tests/validate_fallbacks.py
python3 tests/validate_layout.py
python3 tests/validate_motion.py
python3 tests/validate_navigation.py
```

The current implementation has passed all of these checks plus:

```bash
git diff --check
```

For visual inspection, run:

```bash
npm run dev
```

The workflow builds and deploys `dist/` through GitHub Pages:

```text
.github/workflows/deploy.yml
```

GitHub Pages must use **GitHub Actions** as the publishing source.

## Testing preferences for the next agent

1. Always test the cursor on a real fine-pointer device at normal speed and during rapid movement.
2. Verify the cursor remains anchored while the pointer is just outside a target, then returns to the small idle circle after the release threshold.
3. Test navigation, project-card expansion, filters, form controls, and the custom scrollbar with keyboard input.
4. Check reduced-motion mode before adding any new continuous animation.
5. Prefer one smoothed animation loop over multiple event-driven transforms.
6. Prefer CSS pseudo-elements and CSS custom properties for material/reflection effects.
7. Keep the Webflow glass-button reference as the source of truth for glass material—not a generic frosted-white card.
8. Preserve medium translucency so aqua, lime, bubbles, and waves remain visible behind glass.
9. Keep strong glass on navigation, buttons, and project cards; use calmer glass for long-form panels.
10. Do not add Tailwind, React Router, GSAP, a CMS, backend, analytics, or paid services without an explicit decision.
11. Do not restore the deleted root HTML/CSS implementation.
12. Do not commit, amend, push, or change Git configuration unless explicitly requested.

## Known follow-up opportunities

- Visually tune cursor `RELEASE_DISTANCE`, `MAX_TUG`, and `FOLLOW_EASE` after testing on the actual deployed site.
- Consider using the installed Motion package only if more complex spring/gesture behavior is truly needed; avoid adding it just to replace the current stable rAF loop.
- Add real project source/demo/write-up URLs only when Andy supplies or confirms them.
- Consider adding screenshot-based visual regression only if browser tooling becomes available.
- Keep the current app architecture simple until more portfolio content justifies additional routing or a CMS.
