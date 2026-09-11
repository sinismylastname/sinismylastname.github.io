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
