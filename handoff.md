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

## Continuity protocol for future agents

Before making changes, read this handoff and inspect the current implementation rather than relying on older assumptions. After every meaningful task, update this file with:

- What changed, including the exact files and user-visible behavior.
- The user’s current visual and interaction preferences.
- Issues fixed, including the previous behavior and the new behavior.
- Known limitations, unresolved visual concerns, and safe follow-up ideas.
- Validation commands run and whether they passed.

Preserve the React/Vite architecture, hash navigation, fine-pointer/reduced-motion cursor gates, keyboard accessibility, opaque fallbacks, and non-interactive decorative background layers. Do not reintroduce the deleted root HTML/CSS site or create commits/pushes unless explicitly requested. When changing motion, verify reduced-motion behavior and run the full validation suite before handing off.

## Current state update — September 2026

### Changes in this session

- Home now renders all four projects instead of filtering to the three `featured` projects.
- The standalone Notes link/page was removed from primary navigation. The existing reflection is now attached to the hack4impact StarterPack project as `Read build notes ↗`.
- Project notes use a portal-based glass dialog with a blurred backdrop, Escape support, an X close button, outside-click dismissal, focus restoration, body-scroll locking, and smooth open/close transitions.
- Page navigation now scrolls to the top over a slower 900ms eased animation rather than relying on the browser’s default smooth-scroll timing.
- Added a fixed translucent blue-glass scroll-progress line at the right edge. The native `html` scrollbar remains available and is styled as a slimmer transparent blue-glass track and thumb.

### Preferences reinforced

Keep the portfolio playful and tactile, but avoid giant cursor morphs around cards or panels. Cursor morphing should remain useful for compact controls and links. Glass should be translucent with visible reflections, cool blue/aqua highlights, readable contrast, and graceful reduced-motion behavior. Notes should feel like contextual project knowledge, not a separate blog destination unless the user asks to restore that route.

### Past interaction issues and current fixes

- Large glass surfaces previously attracted the cursor into awkward oversized morphs; current targeting is limited to native compact controls.
- Scroll could leave a morph visually behind its target; the cursor should synchronize directly to the target’s current viewport bounds during scroll/resize.
- Pointer exit previously animated toward a hidden top-left origin; release now uses the last known pointer coordinates.
- The Peek control was previously hard to understand/click while the card was morphed; it is now a compact glass control with its own morph target and parent-tilt isolation.
- The previous Notes content was only reachable through a separate navigation page; it is now contextualized beside its related StarterPack project.

### Validation status

Run `npm run check`, `npm run build`, `npm test`, each `tests/validate_*.py` script, and `git diff --check` before final handoff. The current session’s implementation should be considered incomplete until those commands pass.

### Final validation for this handoff

The current implementation passed `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check` after the changes above. Files added or changed in this session include `app/src/components/ProjectNotesModal.tsx`, `app/src/components/ScrollProgress.tsx`, `app/src/components/AppShell.tsx`, `app/src/components/ProjectCard.tsx`, `app/src/data/projects.ts`, `app/src/data/site.ts`, `app/src/hooks/useHashPage.ts`, `app/src/pages/HomePage.tsx`, `app/src/app/App.tsx`, `app/src/styles/components.css`, `app/src/styles/globals.css`, and `handoff.md`.

### Scrollbar replacement update — September 2026

The scrollbar now follows Andy’s supplied diagram: on hover-capable fine-pointer desktop environments, the native scrollbar is hidden and `ScrollProgress.tsx` renders a thin fixed vertical line inset from the right edge with a centered translucent glass oval thumb. The thumb represents viewport position and document length, supports pointer dragging, track click-to-jump, and keyboard Home/End, arrow, and PageUp/PageDown controls through `role="scrollbar"` and ARIA values. Mobile/coarse-pointer environments keep the native scrollbar and hide the custom replacement. The line/thumb is the only pointer-interactive decorative affordance; other background decoration remains pointer-transparent.

This scrollbar-specific behavior supersedes the earlier “decorative progress line plus visible native scrollbar” description above. Preserve the diagram’s simple centered-line/oval composition when tuning the visual treatment.

Validation for this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Transparent LiquidGlass-style scrollbar update — September 2026

The custom desktop scrollbar material was refined in `app/src/styles/globals.css` after the previous scrollbar edit was reverted. The track is now a lighter, lower-alpha glass line, and the draggable oval uses substantially more transparent layered gradients so the page background remains visible through it. Backdrop blur, saturation, translucent inner rim lighting, cool chromatic edge tinting, and a soft specular highlight provide the LiquidGlass-inspired depth without turning the thumb into an opaque blue pill.

The existing `ScrollProgress.tsx` DOM, centered line/oval geometry, pointer dragging, track click-to-jump, keyboard controls, ARIA semantics, reduced-motion behavior, and native mobile/coarse-pointer fallback remain unchanged. The [LiquidGlass reference](https://liquid-glass.ybouane.com/) uses a WebGL DOM-capture and shader pipeline for true refraction; this implementation intentionally remains a dependency-free CSS approximation because a continuously captured WebGL context would be disproportionate for this small scrollbar control. Reconsider the full library only if actual background distortion is required and its runtime/performance cost is accepted.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Scrollbar idle state and Frutiger Aero saturation update — September 2026

`ScrollProgress.tsx` now keeps the custom fine-pointer desktop scrollbar visible while the page is actively scrolling or the control is being used, then adds the `is-idle` class after 1.6 seconds without activity. `globals.css` fades the track and thumb out with opacity and disables pointer interception while idle; scroll, focus, pointer entry, and pointer use restore it. Keyboard focus remains protected from hiding, and the native mobile/coarse-pointer fallback is unchanged.

Mouse track jumps and thumb dragging now use an explicit immediate-scroll helper that temporarily overrides the page’s global smooth-scroll setting. This removes the short-distance jitter caused by smooth scrolling repeatedly chasing pointer movement. Keyboard scrollbar controls retain smooth scrolling when motion is allowed, while reduced-motion users still get immediate movement.

The background palette in `globals.css` is more saturated: the sky uses a stronger cyan-to-aqua gradient, the lower field uses a more vivid green, and the fixed aqua/lime ambient highlights have increased color presence while preserving readable foreground contrast and the existing reduced-motion rules.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Notes modal cursor layering update — September 2026

The custom cursor was being composited beneath the notes modal’s blurred backdrop because `.notes-modal-backdrop` uses `z-index: 200`, while the cursor layers previously used `z-index: 100` and `101`. `app/src/styles/components.css` now places `.custom-cursor` at `z-index: 300` and `.custom-cursor-ghost` at `z-index: 301`, keeping both visible above the modal blur. They remain `pointer-events: none`, so the modal close button, outside-click dismissal, Escape handling, and focus behavior are unchanged.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Corrected notes-modal cursor layering — September 2026

The earlier z-index-only fix was insufficient because `.app-shell` uses `isolation: isolate`, trapping the cursor inside the app-shell stacking context. The notes modal is rendered through a portal directly under `document.body`, so its backdrop could still composite above and blur the cursor even when the cursor had a larger local z-index.

`app/src/components/CustomCursor.tsx` now uses `createPortal` to render `.custom-cursor` and `.custom-cursor-ghost` directly into `document.body`. Their existing z-index values of 300 and 301 now participate in the same top-level stacking context as the notes modal backdrop at 200, so the cursor remains sharp and visible when `Read build notes` opens. Both layers remain `pointer-events: none`; the close X remains a normal interactive button, and outside-click, Escape, focus restoration, and modal transitions are unchanged.

Validation after this correction passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Keyboard focus and cursor morph update — September 2026

The unwanted lime/green focus visuals were coming from the global `:focus-visible` outline, the interactive glass surface `:focus-within` outline, and the lime contact-field focus halo. On fine-pointer, non-reduced-motion devices, the green focus outline is now suppressed and the custom cursor listens for `focusin`/`focusout`, morphing onto the focused link, button, input, textarea, or select. Keyboard tab order and control reachability remain unchanged; the cursor provides the visual focus affordance rather than removing focusability. Coarse-pointer and reduced-motion modes retain the fallback focus-visible treatment, and contact fields use an aqua focus halo instead of lime.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Resume-backed project and resume detail update — September 2026

Expanded portfolio and resume content using the readable text extracted from `resume.pdf` as the source of truth.

Changes:

- `app/src/data/projects.ts`: expanded SinnerPad with the Seeed XIAO RP2040, Cherry MX-compatible switches, four SK6812MINI-E RGB LEDs, KiCad PCB, Onshape two-piece enclosure, KMK shortcuts, one-day build context, and verification details.
- `app/src/data/projects.ts`: expanded Shiba Arcade with its top-30 placement among 8,000+ participants, all-expenses-paid Japan trip, Godot/GDScript fixed-turret wave shooter, procedural gameplay, original art/audio, and Raspberry Pi 4 8 GB arcade cabinet details.
- `app/src/data/projects.ts`: expanded FRC Team 3598 Robot Software with the LabVIEW-to-WPILib command-based Java migration, drivetrain and mechanism scope, NetworkTables, SwerveDrivePoseEstimator, Limelight AprilTag fusion, distance-scaled vision uncertainty, Phoenix Tuner X, PathPlanner, Choreo, and strategist/alliance-captain experience.
- `app/src/pages/ResumePage.tsx`: expanded the professional summary, dated FRC roles, outreach metrics, technical skills, project descriptions, and dated honors exactly from the resume.
- `app/src/styles/components.css`: increased the expanded project-details maximum height from 20rem to 40rem so the added project detail is not clipped.

No unsupported project claims were added. The StarterPack project remains based on existing portfolio content because it is not described in the supplied resume PDF.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Cursor mode toggle update — September 2026

Added a persistent bottom-left glass toggle so fine-pointer desktop users can choose between the smooth morphing cursor and the native browser cursor after concerns about responsiveness or familiarity with the custom interaction.

Changes:

- `app/src/components/AppShell.tsx`: owns the shared `nativeCursor` state, reads and writes the `andy-sin-portfolio-cursor-mode` local-storage key, applies `data-cursor-mode` to the document body, passes `enabled={!nativeCursor}` to `CustomCursor`, and renders the toggle.
- `app/src/components/CursorModeToggle.tsx`: adds the fixed glass button with a clear `Cursor: Smooth` / `Cursor: Native` status, a real keyboard-operable button, `aria-pressed`, an accessible action label, and a visual switch indicator.
- `app/src/components/CustomCursor.tsx`: accepts the shared enabled state, returns no portal when native mode is selected, includes the state in its effect lifecycle, and cancels any active animation frame when the mode changes.
- `app/src/styles/components.css`: styles the bottom-left translucent glass control and restores native cursor values across body descendants and body-level portals when native mode is active.

Behavior:

- Smooth mode remains the default when no preference is stored.
- Selecting native mode immediately removes the custom cursor portal and restores browser cursor behavior, including controls rendered through portals such as the notes modal.
- The selected mode persists across page reloads through local storage. Storage errors are caught so private-browsing restrictions cannot break the interface.
- The toggle is displayed only for fine pointers when reduced motion is not requested. Coarse-pointer and reduced-motion users continue to use the native cursor fallback without an unnecessary control.
- Keyboard focus and activation remain available through the real button; the cursor toggle itself retains a visible aqua focus indicator.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Mobile navigation and typography refinement — September 2026

The phone layout was refined after the navigation links wrapped inside the glass capsule and the hero typography consumed too much mobile space. The screenshot’s `Contact` second-row wrap is addressed without changing the desktop navigation design.

Changes:

- `app/src/components/Navigation.tsx`: added React `isMenuOpen` state, a real Menu/Close button, `aria-expanded`, `aria-controls="primary-navigation-links"`, an accessible changing label, and a stable dropdown ID. Selecting a navigation link intentionally leaves the mobile menu open; pressing the same button toggles it closed.
- `app/src/styles/components.css`: preserved inline navigation at 640px and above, added tighter tablet navigation sizing through 760px, and added a below-640px compact horizontal glass header with a vertical glass dropdown. Mobile links are no-wrap, full-width, and have touch-friendly minimum heights. The desktop active indicator is hidden in the mobile dropdown, where the active link styling remains visible.
- `app/src/styles/components.css`: added targeted mobile density rules for hero text, section headings, leads, actions, buttons, filters, project cards, technology tags, resume sections, contact fields, interests, and the notes modal. The mobile glass treatment and existing desktop hierarchy remain intact.
- `app/src/styles/globals.css`: added a below-640px body baseline using `clamp(.9375rem, 3.8vw, 1rem)`, reduced mobile section-heading scale, tightened main/footer widths and spacing, and retained the existing 320px minimum HTML width and overflow protection.

Responsive behavior:

- At 640px and wider, the existing inline glass navigation remains available.
- Below 640px, the AS brand mark and menu button remain in one compact row; the five page links appear in a vertical glass dropdown only when the button is opened.
- The dropdown remains open after page selection and closes only through the menu button, as requested.
- Body copy bottoms out around 15px on the smallest screens and returns toward 16px at wider phone widths. Headings and controls scale independently so labels stay readable and touch targets remain usable.
- Existing coarse-pointer, reduced-motion, keyboard-focus, hash-navigation, active-page, modal, and custom-cursor behavior remains unchanged.

Validation after this update passed:

- `npm run check`
- `npm run build`
- `npm test`
- Every `tests/validate_*.py` script
- `git diff --check`

The source was reviewed against the requested 375px, 390px, 430px, 639px, 640px, and 320px boundary cases. No browser automation or device emulator is available in this environment, so final visual confirmation should still be performed on a real phone or responsive browser preview.

### Mobile menu contrast and blur refinement — September 2026

The open mobile menu was still too transparent over hero copy and decorative artwork. The menu now uses a heavier glass treatment and a controlled blur layer so the navigation labels remain visually dominant and easy to distinguish.

Changes:

- `app/src/components/Navigation.tsx`: added an `aria-hidden` `.mobile-menu-backdrop` sibling controlled by the existing `isMenuOpen` state. It is non-interactive and appears only while the mobile menu is open.
- `app/src/styles/components.css`: added a subtle fixed blur layer beneath the mobile navigation, with a masked lower edge so the content immediately behind the menu is softened without blocking the page.
- `app/src/styles/components.css`: increased the mobile dropdown fill to approximately 90% opacity, increased its backdrop blur to 30px, and strengthened its border, inner highlight, and cast shadow.
- `app/src/styles/components.css`: mobile navigation labels now use dark navy text, a white highlight/text shadow, translucent individual link surfaces, and stronger hover/current/focus separation.

The existing below-640px menu behavior is unchanged: the menu stays open after link selection and closes only through the Menu/Close button. Desktop navigation, keyboard semantics, reduced-motion behavior, coarse-pointer fallback, custom cursor layering, and hash navigation remain unchanged.

Validation after this update passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.

### Mobile menu icon alignment correction — September 2026

The mobile Menu/Close icon bars were uneven when transforming from the hamburger into an `X`. The original implementation kept the bars in grid flow and applied different `translateY` offsets during rotation, so the diagonals crossed from different vertical centers.

`app/src/styles/components.css` now uses a fixed `1rem × 1rem` relative icon box. Each bar is absolutely positioned at the same horizontal center, with equal length and height. The closed state uses symmetrical vertical offsets; the open state rotates the first and last bars from the shared center at `45deg` and `-45deg`, while the middle bar fades out. The menu behavior, button semantics, focus treatment, reduced-motion rules, and surrounding styling remain unchanged.

Validation after this correction passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.


### Conservative whole-site performance pass — September 2026

This performance pass was based on the supplied `Trace-20260911T091450.json.gz` and the current React/Vite source. The trace parsed as a Chromium trace with approximately 91,991 events and included rendering-related event families plus several events over 50ms. It did not reliably expose a trustworthy recording duration, pointer/mouse interaction coverage, or source-level attribution to `CustomCursor`, `usePointerTilt`, layout, paint, or compositing. The changes below are therefore conservative source-based optimizations rather than claims of a measured frame-rate improvement.

Files changed:

- `app/src/hooks/usePointerTilt.ts`
  - Pointer events now store the latest coordinates and schedule one RAF.
  - The RAF reads `getBoundingClientRect()` once, computes the same pointer percentages and tilt range, and writes the four CSS custom properties together.
  - Ignored-target reset behavior, pointer-leave reset behavior, reduced-motion gating, fine-pointer gating, and cleanup are preserved.
- `app/src/components/AmbientBackground.tsx`
  - Added a `visibilitychange` listener that applies `data-page-hidden="true"` to the document root while the tab is backgrounded.
  - The listener and attribute are cleaned up when the component unmounts.
- `app/src/components/CustomCursor.tsx`
  - Active target bounds and computed border radius are cached when a target is locked.
  - The cache refreshes when the target changes and on viewport scroll/resize invalidation instead of reading geometry for every pointer event.
  - Existing morphing, velocity tug, release distance, focus behavior, portal rendering, native-cursor mode, and settled RAF sleeping remain intact.
- `app/src/styles/components.css`
  - The glass base reflection is static rather than using pointer coordinates as radial-gradient geometry.
  - The moving glass sheen is anchored and moved through `transform`, not `left`.
  - The moving sheen no longer uses the 10px blur filter; its softness comes from translucent gradient stops.
  - The cursor ghost now uses transform-driven `translate3d` positioning instead of `top`/`left` coordinates.
- `app/src/styles/globals.css`
  - The large body sky gradient is static instead of animating `background-position`.
  - Sky-light drift remains visible through transform animation on the fixed pseudo-element.
  - A hidden-document selector pauses body, pseudo-element, and ambient animations while the tab is backgrounded.
  - Existing reduced-motion, responsive, print, fallback, and pointer-inert decoration behavior remains in place.

Behavior preserved:

- Full Frutiger Aero sky, clouds, waves, bubbles, orbs, glass surfaces, pointer tilt, custom cursor morphing, and native cursor fallback.
- Fine-pointer and `prefers-reduced-motion` gates.
- Keyboard focus behavior, portal layering, mobile behavior, print styles, and opaque glass fallbacks.
- Ambient animation resumes when the document becomes visible again.

Validation completed successfully after this pass:

```text
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```

No additional trace was available, so this handoff intentionally does not claim a numeric FPS, paint-time, or frame-time improvement. The next useful measurement would be a controlled before/after browser trace covering pointer movement, glass-card interaction, cursor morphing, scrolling, and stationary idle, but the implementation does not depend on obtaining another trace.


### Cursor responsiveness tuning — September 2026

The custom cursor and interactive-target morph were slightly too smooth, so their response was made modestly faster without changing the visual design or interaction bounds.

Changes:

- `app/src/components/CustomCursor.tsx`: increased `FOLLOW_EASE` from `0.16` to `0.21` so the cursor follows pointer movement more promptly.
- `app/src/components/CustomCursor.tsx`: increased rotation interpolation from `0.12` to `0.16` so velocity rotation settles slightly faster.
- `app/src/styles/components.css`: shortened cursor width, height, radius, color, and shadow transitions from `220ms` to `180ms`, with opacity reduced to `150ms`.
- `app/src/styles/components.css`: shortened ghost size/opacity transitions from `180ms` to `150ms`.

Cursor size, morph target bounds, release distance, velocity tug, rotation limits, native-cursor mode, reduced-motion behavior, and fine-pointer gating are unchanged.

Validation after this tuning passed: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.


### Frutiger Aero material and environment evolution — September 2026

Implemented the first visual evolution pass from `README_FRUTIGER_AERO_EVOLUTION.md` without adding WebGL, DOM capture, new continuous animation systems, or Aero Lab yet.

Changes:

- `app/src/styles/tokens.css`
  - Added grouped environment tokens for sky, cloud, aqua reflection, green bounce, and edge tint.
  - Added explicit material-role tokens for heavy glass, acrylic, plastic, enamel, lens, and bubbles.
  - Current midday values remain the default baseline.
  - Added morning, midday, sunset, and night environment overrides.
  - Night overrides include lighter text colors and darker glass fallbacks so content remains readable against the deep sky.
- `app/src/styles/components.css`
  - Navigation now uses the heavier polished-glass material role.
  - Buttons use a distinct glossy-plastic treatment with a stronger upper highlight and lower inset depth.
  - Project cards and reading panels use calmer acrylic treatment rather than sharing the strongest button/navigation styling.
  - The logo uses a more enamel/lacquer-like highlight and rim treatment.
  - The cursor uses the lens highlight/tint tokens; cursor logic and interaction behavior are unchanged.
- `app/src/styles/globals.css`
  - The body sky and ambient lighting now consume environment tokens.
  - Bubble material now includes a static crescent highlight, secondary highlight, cyan environmental tint, rim, and inset depth.
  - All 16 bubble elements remain present with their existing positions, sizes, timings, transform/opacity animation, responsive rules, and pointer-inert behavior.
- `app/src/data/sky.ts`
  - Added pure `SkyState` helpers and deterministic hour mapping:
    - morning: 05:00–10:59
    - midday: 11:00–16:59
    - sunset: 17:00–20:59
    - night: 21:00–04:59
- `app/src/main.tsx`
  - Sets `html[data-sky]` once during initialization based on local time.
  - In development, `?sky=morning`, `?sky=midday`, `?sky=sunset`, or `?sky=night` forces a state for visual inspection and testing.
  - No timer or continuous time-based computation was added.

Preserved behavior:

- Existing pointer tilt and custom cursor behavior.
- Native cursor/coarse-pointer fallback and reduced-motion behavior.
- Keyboard focus indicators and modal/mobile-menu accessibility.
- Opaque/fallback material behavior and print styles.
- Pointer-inert decorative background layers.
- Hidden-document animation pausing.
- Current lively bubble count; bubble quality improved without increasing density or motion.

Validation after the evolution pass passed:

```text
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```

This pass does not claim measured performance gains because no reliable before/after interaction trace is available. Aero Lab, project-specific reflection colors, original iconography, and future optional effects remain intentionally deferred until the material/environment foundation is reviewed.


### Smoothed glass hover shadow — September 2026

The hover shadow on interactive glass surfaces appeared too sudden because the acrylic base shadow had two shadow layers while the hover shadow had four. CSS could not interpolate between the two shadow-list shapes smoothly, so the change could appear discrete despite the existing transition.

Changes:

- `app/src/styles/tokens.css`: changed the acrylic base shadow to four matching layers while keeping it visually softer than the hover state.
- `app/src/styles/components.css`: changed the glossy button base shadow to four matching layers so its hover state also interpolates correctly.
- `app/src/styles/components.css`: increased the glass surface shadow transition from `260ms ease` to `360ms var(--ease-spring)` and the border transition to `300ms ease`.

Hover and keyboard-focus states continue to use the same target shadow, focus behavior, reduced-motion rules, and material styling; only the transition path is smoother.

Validation passed after this fix: `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, and `git diff --check`.


## Mobile navbar correction (September 2026)

The compact mobile navbar’s diagonal beam came from the generic glass surface treatment being applied to navigation: `.glass-surface::after` creates a tall, rotated sheen intended for larger glass panels, and translucent mobile navigation also allowed ambient/background layers to remain visible through that sheen. The navigation is now decoupled from `GlassSurface` and renders as a standalone `<nav className="glass-nav site-nav">`, with its own border, radius, shadow, stacking context, and desktop blur.

At widths up to 639px, the navbar now uses an opaque light glass fallback (`#f6fdff`) with no background image, no backdrop sampling, and explicit suppression of both possible nav pseudo-elements. The mobile body light layers and the large ambient clouds, waves, and orbs are reduced/hidden at mobile widths. The compact dropdown remains separately styled and positioned with `overflow: visible` on the navbar, and all bubble streams remain present so the mobile atmosphere stays lively. Desktop glass behavior is unchanged.

Validation completed after the final isolation rule:

- `npm run check`
- `npm run build`
- `npm test`
- Every `tests/validate_*.py` validator
- `git diff --check`

All completed successfully. Source inspection also confirms that `Navigation.tsx` no longer imports or renders `GlassSurface`, and the generated build is produced from the corrected standalone navigation. A browser computed-style/DOM inspection tool is not available in this environment, so if an already-open preview still shows the old beam, refresh it or restart the preview against the latest build before judging the visual result.


### Full Frutiger Aero evolution pass — September 2026

Implemented the README_FRUTIGER_AERO_EVOLUTION.md direction through the existing lightweight React/Vite architecture without adding WebGL, a new dependency, or continuous sky computation.

Changes:

- `app/src/styles/tokens.css`: increased the saturation and contrast of the cyan sky, turquoise reflection, lime horizon, sunset, and night states; preserved the one-time local-time `data-sky` system; added explicit Aero Lab variables for glass, environment, interaction, material, bubble, and lens tuning.
- `app/src/styles/globals.css`: applied the stronger environment color to the sky-light layer; improved the retained 16 bubble streams with a white crescent, secondary highlight, subtle pink/yellow thin-film tint, cyan rim, varied blur/depth, configurable opacity, and configurable slow speed. Bubble motion remains transform/opacity based, visibility pausing remains intact, and mobile/reduced-motion reductions remain intact.
- `app/src/styles/components.css`: reinforced the material taxonomy: heavy navigation glass, calmer acrylic cards/panels, glossy plastic CTAs, enamel logo treatment, bubble material, and optical-lens reflection variables. Static upper reflections, pale green lower bounce, aqua edge tint, blue underside shadow, and pointer-driven pre-painted reflection movement now share the same environment. The mobile navbar’s opaque fill, disabled backdrop sampling, pseudo-element suppression, dropdown overflow, and z-index isolation were left intact.
- `app/src/data/projects.ts` and `app/src/components/ProjectCard.tsx`: added project-specific accent, glow, reflection, and tag-background tokens. Cards now use those tokens for their image sheen, category marker, index, metadata pills, and reflected color while retaining the shared layout and readable content.
- `app/src/components/AeroIcon.tsx` and `app/src/components/Navigation.tsx`: added a small original inline SVG icon language for software, hardware, robotics, projects, about, resume, and contact. Icons are decorative, non-focusable, and used sparingly in navigation and project categories.
- `app/src/hooks/usePointerTilt.ts` and `app/src/components/CustomCursor.tsx`: exposed local reflection coordinates, global pointer-light coordinates, configurable tilt strength, configurable reflection travel, and configurable cursor tug through the existing requestAnimationFrame paths. No per-frame React rendering or per-pixel distortion was added.
- `app/src/data/aeroSettings.ts`, `app/src/hooks/useAeroSettings.ts`, `app/src/components/AeroLab.tsx`, and `app/src/components/AppShell.tsx`: added the hidden `Shift + A` Aero Lab. It provides grouped glass, environment, interaction, and material sliders; localStorage persistence under `aeroLab.settings.v1`; reset; JSON copy; JSON export; JSON import; and safe range clamping for imported presets. The panel is keyboard-operable, labelled, and visually isolated above the site without blocking normal content.
- `app/src/hooks/useHashPage.ts`: reduced automatic page-top scrolling after hash navigation from 900ms to 520ms. The cubic ease-out, cancellation on interrupted navigation, `startViewTransition` support, and immediate reduced-motion behavior remain. The animation temporarily locks the root `scroll-behavior` to `auto` and restores it on completion, interruption, or cleanup so browser smooth scrolling cannot compound the custom timing.

Validation after the final implementation passed:

- `npm run check`
- `npm run build`
- `npm test`
- Every `tests/validate_*.py` script
- `git diff --check`

The current implementation follows the README's static-first material, bubble quality, project reflection, cursor-light, icon, local-time environment, Aero Lab, accessibility, reduced-motion, mobile, and performance guidance. No commit, push, or Git configuration change was made.

## Current state update — trace-informed performance correction

### Changes in this session

- Added `app/src/data/aeroRuntime.ts`, a shared cached snapshot for the JavaScript interaction settings (`tiltStrength`, `cursorTug`, and `shineTravel`). `useAeroSettings` invalidates the snapshot whenever Aero Lab writes new root variables, so live tuning still updates immediately without computed-style reads in pointer hot paths.
- Updated `usePointerTilt.ts` to cache each surface’s `getBoundingClientRect()` result. Bounds are invalidated on pointer re-entry, relevant document scrolling, and resize, while pointer events remain coalesced through one `requestAnimationFrame`.
- Updated `CustomCursor.tsx` to use the shared settings snapshot, coalesce locked-target geometry refreshes during scroll/resize, and stop its interpolation RAF once the cursor reaches its desired state instead of running continuously while visible. The fine-pointer gate, reduced-motion gate, compact-target morphing, `MAX_TUG` behavior, and portal stacking remain unchanged.
- Reduced lower-priority `.glass-card` and `.glass-panel` backdrop blur to 6px and 8px respectively, while retaining stronger blur for navigation and modal surfaces. The 16 lively ambient bubbles and mobile navbar isolation were not changed.
- Neutralized the shared glass-surface reflection so project-specific colors no longer bleed across entire cards. Project reflection colors remain bounded to `.project-media::after`, with accents still used for categories, indices, and tags.

### Trace context and limitations

The local Chrome trace pointed to repeated pointer/layout work and compositing pressure, including `usePointerTilt.ts`, `CustomCursor.tsx`, `UpdateLayoutTree`, animation frames, and GPU tasks. DevTools/V8 profiler and browser extension activity were present, so the trace is directional rather than a clean production benchmark; capture a fresh production-style trace to quantify the before/after delta.

### Validation

Passed from the repository root:

```text
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```

## Current state update — neutral glass interaction refinement

### Changes in this session

- Glass reflection is hidden at rest and appears only on interactive surfaces during `:hover` or `:focus-within`, so inactive cards and panels no longer carry a persistent diagonal shine. Keyboard focus retains the same active reflection state alongside the existing border/focus treatment.
- Reduced-motion mode keeps the reflection static and subdued: it remains hidden at rest, uses a lower opacity only for hover/focus states, and does not animate the reflection transition.
- Reworked the daylight glass material from blue-tinted acrylic to a neutral pearlescent white with a soft green edge and neutralized shadows. Buttons, the Aero Lab, and notes modal now use the same white/soft-green material direction.
- The saturated sky, bubbles, environmental aqua, and intentional project accents remain colorful; night glass overrides, mobile navbar isolation, fine-pointer gating, and the previous pointer/layout performance safeguards remain unchanged.

### Validation

Passed after this refinement:

```text
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```

## Current state update — fixed Aero production preset

### Changes in this session

- Removed the Aero Lab panel and its Shift+A keyboard listener from the application.
- Removed the `useAeroSettings` localStorage/settings hook, so old `aeroLab.settings.v1` browser data can no longer override the production design.
- Simplified `aeroSettings.ts` to retain only the shared settings shape and the accepted fixed defaults. The static `:root` variables in `tokens.css` are now the authoritative configuration source.
- Kept `aeroRuntime.ts` for the tilt, cursor tug, and shine-travel JavaScript consumers; it now reads the static root variables without a live invalidation path.
- Removed Aero Lab-only CSS while preserving the glass interaction, neutral pearlescent material, reduced-motion behavior, mobile navbar isolation, pointer safeguards, and 16-bubble background.

### Permanent accepted preset

```json
{
  "glassOpacity": 0.72,
  "glassReflection": 1.5,
  "glassBlur": 0.55,
  "upperRim": 1.5,
  "greenBounce": 1,
  "skySaturation": 1.2,
  "cloudBrightness": 1.4,
  "bubbleDensity": 1,
  "bubbleSpeed": 0.88,
  "tiltStrength": 1.5,
  "cursorTug": 1.16,
  "shineTravel": 1.18,
  "pointerLight": 1.19,
  "acrylicOpacity": 1,
  "plasticGloss": 1.5,
  "enamelHighlight": 1.06,
  "bubbleEdge": 1.6,
  "lensReflection": 1
}
```

The former Aero Lab documentation is historical; visual tuning is intentionally fixed for the satisfied production direction.

### Validation

Passed after removing Aero Lab and freezing the preset:

```text
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```



### Aero Media Center and blue Aero world update — September 2026

Implemented the approved small-detail visual pass inspired by Andy’s supplied Frutiger Aero reference: bright blue water and sky, floating bubbles, bridge/infrastructure curves, skyline depth, airborne shapes, and an AIMP/Winamp/Windows-era media-console feeling.

Files added:

- `app/src/components/AeroMediaCenter.tsx`
  - Adds a persistent bottom-right media gadget opposite the left-side cursor-mode toggle.
  - Compact by default and expandable through a real keyboard-operable button.
  - Uses `aria-expanded`, `aria-controls`, an accessible region label, Escape-to-close, and focus restoration to the launcher.
  - Includes a blue beveled display, status LED, static spectrum meter, technical readouts, disabled transport controls, queue rows, and genre badges.
  - Explicitly states that playback is not configured; there is no autoplay, audio element, third-party embed, or fake playing state.
  - The widget remains available across hash-based page navigation and adapts to narrow screens and safe-area insets.

- `app/src/data/media.ts`
  - Defines typed future-facing media queue metadata.
  - Uses fictional/descriptive standby entries based on Andy’s stated interests: swancore, orchestral, and Frutiger Aero core.
  - Does not ship copyrighted audio or commit the site to an external music provider.

- `app/src/components/AeroWorldScene.tsx`
  - Adds an original decorative inline SVG scene to the Home hero only.
  - Includes transparent bubble rings, haze, a distant technical skyline, bridge-like arcs, reflective water bands, and abstract airborne shapes.
  - The scene is `aria-hidden`, pointer-transparent, static-first, and does not use WebGL, a large JPEG background, or a new continuous animation loop.

Files updated:

- `app/src/components/AppShell.tsx`: mounts the persistent media center with the existing global controls.
- `app/src/pages/HomePage.tsx`: mounts the Aero world scene behind the existing hero copy and profile card.
- `app/src/styles/tokens.css`: adds semantic scene and media-console roles plus morning, midday, sunset, and night scene overrides. The scene does not force a permanent green horizon; its water, haze, skyline, bridge, and reflection colors adapt with the existing day/night system.
- `app/src/styles/components.css`: adds the media-console chrome, responsive positioning, hero-scene layering, reduced-motion-safe behavior, and print hiding while preserving the existing glass, cursor, navigation, and ambient systems.
- `tests/validate_app.py`: adds source contracts for the media console, no-autoplay standby behavior, decorative scene semantics, scene tokens, and homepage mounting.

User preferences preserved:

- Existing day/night cycle remains authoritative.
- Existing glassmorphism, morphing cursor, native cursor toggle, bubbles, and general layout remain in place.
- The portfolio remains Frutiger-Aero-first, with stronger Windows 7, Windows Media Player, Winamp, and keygen-era visual language added as supporting detail rather than a full fake desktop shell.
- Audio remains intentionally undecided and is not included in this visual-first pass. Any future audio must use owned/permitted or appropriately licensed sources and explicit user-initiated controls.

Known limitations:

- No real playback is available yet; the media center is an honest visual standby console.
- The supplied reference image is used as a composition and mood reference, not shipped as a background asset or copied directly.
- The hero scene uses original SVG geometry and static reflection bands rather than live water simulation or WebGL refraction.
- Browser/device visual inspection is not available in this environment. Final follow-up inspection should cover desktop fine pointers, native cursor mode, mobile/coarse pointers, reduced motion, all four `?sky=` states, widget keyboard behavior, and print output.

Validation completed successfully after this update:

```text
npm run check
npm run build
npm test
for test in tests/validate_*.py; do python3 "$test" || exit 1; done
git diff --check
```

The production build emitted the React/Vite bundle successfully. No commit, push, or Git configuration change was made.



### Corrective Winamp reference refinement — September 2026

The previously documented blue Aero world scene was rejected and is no longer part of the implementation. `AeroWorldScene.tsx` is absent, `HomePage.tsx` does not mount a scene, and the rejected scene selectors/tokens were removed from the active source. The portfolio keeps its existing ambient background, day/night cycle, glass surfaces, morphing cursor, and layout.

The persistent media detail was refined against Andy's new Winamp-style reference image:

- `app/src/components/AeroMediaCenter.tsx`
  - Keeps a circular glass launcher in the collapsed state and hides it completely while the player window is open.
  - Uses a bright `WINAMP` title bar with separate minimize, maximize/restore, and close buttons.
  - Uses one restrained dark teal inset for the display; the shell, controls, and playlist are pale cyan/white glass.
  - Adds CSS-generated Aero artwork, a segmented equalizer, time readout, repeat/shuffle affordances, large transport controls, a volume slider, and a playlist toggle.
  - Keeps playlist rows formatted as number → two-line title/metadata → duration, but keeps the queue closed by default so it does not compete with the main player surface.
  - Remains visual-only standby: no audio element, autoplay, external embed, or fake playback state.

- `app/src/styles/components.css`
  - Adds a final canonical reference-alignment layer for the glossy cyan Winamp composition, desktop width, mobile viewport fit, internal scrolling, safe-area spacing, and reduced-motion behavior.
  - The player is fixed bottom-right opposite the cursor-mode toggle. The open panel owns its whole window footprint; no launcher bar remains underneath it.

- `app/src/styles/tokens.css`
  - Retains only the active environment/material roles and pale media-console roles. Rejected scene water, skyline, bridge, and reflection tokens are gone.

- `tests/validate_app.py`
  - Verifies the current media structure, responsive media styles, and absence of the rejected scene CSS/token contracts.

Browser/device visual inspection was not available in this terminal session; restart the dev server or hard-refresh any already-running preview to clear stale Vite CSS.



### Aero song-player removal — September 2026

The experimental Aero/Winamp song player has been removed at the user's request after repeated visual and layout issues. The global `AppShell` mount, player component, media queue data, media tokens, and validator contracts are no longer active. The portfolio's existing Aero background, day/night cycle, glass surfaces, morphing cursor, navigation, and page layout remain unchanged.

No audio behavior, third-party music service, autoplay, or player UI remains part of the product direction. Any future media treatment should be reconsidered from a fresh, smaller concept rather than extending the removed implementation.

### WebGL water visibility pass — September 2026

The WebGL architecture is now used for a visibly stronger default daytime environment rather than an opt-in demo. The canvas enables automatically in development and production unless `VITE_AERO_WEBGL=false`; development `?webgl=0` provides the CSS-only comparison. The fixed production environment remains midday/daytime, with the internal environment model retained for future use but no clock-based visual switching.

The standard renderer path combines a narrow aqua horizon, stronger turquoise lower field, three slow low-frequency wave terms on high quality (fewer on lower tiers), finite-difference normals, broad and tight white/cyan sunlight reflections, moving ripple ribbons, and restrained lime environmental bounce. Water opacity is intentionally strong enough to remain visible behind the existing CSS ambience and glass. Quality-gated GPU bubbles and subtle caustics share the same draw pass; pointer lighting is shared module state, and the home page can replace only its authored orb with one analytic reflective orb on desktop high/balanced tiers. The old CSS ambient-wave bands are hidden only while the WebGL canvas is ready; CSS bubbles/orb are hidden only when their matching GPU replacement is active, while clouds and all DOM content remain intact.

The refraction branch is an isolated analytic development comparison (`?refraction=1` or `VITE_AERO_REFRACTION=true`) for the same home orb; it does not capture DOM pixels and remains reject/defer for production. Aero Lab and the song player remain removed and must not be restored or referenced.

Reduced-motion mode renders one static daytime water frame, while hidden-tab pause/resume, context recovery, print hiding, capped DPR, one canvas/context/renderer/fullscreen draw, and CSS fallback behavior remain preserved.

Validation after this pass must include `npm run check`, `npm run build`, `npm test`, every `tests/validate_*.py` script, `git diff --check`, and browser comparison of the normal preview against `?webgl=0` at desktop and mobile sizes. The development `?gpu-bubbles=0` and `?refraction=1` comparisons isolate the optional branches. Browser visual, frame-time, dropped-frame, cross-device, and thermal evidence should be recorded before promoting any heavier refraction or DOM-capture milestone.
