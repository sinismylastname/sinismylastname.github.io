# Implementation Plan: Frutiger Aero Portfolio

## Overview

Implement the approved Frutiger Aero visual system across the existing five-page static portfolio. Work remains limited to the existing HTML documents and shared `styles.css` for the deployed site; preserve all copy, meaningful links, form controls, resume/project entries, image assets, external-link attributes, and static GitHub Pages behavior. Do not add a framework, build step, backend, required JavaScript, new runtime dependency, tracking, autoplay media, or replacement content.

The implementation language is HTML5 and CSS3. Testing tasks may use repository-available static inspection or browser/a11y tooling, but no test tooling becomes a required site dependency.

## Tasks

- [x] 1. Establish the shared HTML/CSS baseline and semantic shell
  - [x] 1.1 Refine design tokens and base document rules in `styles.css`
    - Add the approved palette, panel/image/control radii, spacing, shadows, content widths, easing, and ambient-duration tokens; retain readable system/font fallbacks and optional external font loading.
    - Keep fallback surface colors, borders, and text contrast sufficient when blur or font loading is unavailable; preserve explicit dimensions already present on meaningful images.
    - Establish box sizing, safe wrapping, document sizing, and overflow rules without using decoration to hide content or interaction overflow.
    - _Requirements: 2.2–2.5, 3.2–3.3, 8.1–8.2, 9.1–9.2, 10.1, 10.4–10.5_

  - [x] 1.2 Normalize the shared shell and landmark markup across all five HTML documents
    - Preserve the five relative Primary_Navigation destinations and labels, and encode exactly one current link per document with both active styling and `aria-current="page"`; remove current-page state from every other link.
    - Ensure each document contains exactly one `main` landmark and exactly one named primary-navigation landmark, without relying on JavaScript to create, synchronize, or repair them during load or transition.
    - Preserve existing page content, form semantics, meaningful images, external-link `target` values, and existing `rel="noreferrer"` values while adding only justified authored decorative hooks.
    - _Requirements: 1.1–1.3, 2.1, 6.3–6.4, 9.1–9.4_

  - [x] 1.3 Implement the shared shell, typography, and focus presentation in `styles.css`
    - Style `.navbar`, `.logo`, `.nav-list`, navigation links, `main`, headings, links, and `.footer` as the common shell while keeping readable navigation labels at narrow widths and zoom.
    - Add a visible `:focus-visible` state for every link, button, form control, and keyboard-operable card interaction; keep focus indicators above glass and decoration and independent of hover.
    - Keep active/current, focus, validation, and reduced-motion state changes within unchanged layout bounds.
    - _Requirements: 1.1–1.3, 2.3–2.5, 3.1–3.3, 6.1–6.3_

  - [x] 1.4 Add structural navigation and landmark validation
    - Inspect every page and every normal navigation destination to assert exactly one `aria-current="page"` item, exactly one named primary-navigation landmark, exactly one `main`, matching active styling, and no duplicate current state.
    - Verify the five relative destinations remain present and navigation works without a server endpoint or JavaScript runtime.
    - **Property 1: Navigation consistency**
    - **Validates: Requirements 1.1–1.3**
    - **Property 6: Keyboard parity and landmarks**
    - **Validates: Requirement 6.3**
    - _Requirements: 1.1–1.3, 6.3_

- [x] 2. Build shared surfaces, controls, and page compositions
  - [x] 2.1 Consolidate glass surfaces and depth layering in `styles.css`
    - Apply translucent surfaces, visible edges, aqua shadows, rounded corners, and optional backdrop blur to `.about-text`, `.post`, `.project`, `.contact-layout`, and `.resume`.
    - Provide an opaque-enough non-blur fallback with readable contrast, and keep page ambience behind surfaces, surfaces above ambience, and text/focus indicators above surfaces.
    - Keep decorative layers from covering readable content at normal and zoomed layouts.
    - _Requirements: 2.3–2.5, 3.2–3.3, 6.5, 7.4, 8.1_

  - [x] 2.2 Implement controls, fields, cards, and stable visual states in `styles.css`
    - Style buttons, links, submit controls, inputs, textareas, project cards, images, metadata, and resume sections with recognizable affordances and readable contrast.
    - Implement hover and keyboard-focus outcomes within 300ms using only visual changes; keep translations at or below 4px and preserve identical layout bounds for default, hover, focus, active/current, validation, and other visual states.
    - Keep pointer and keyboard interaction outcomes equivalent without requiring JavaScript.
    - _Requirements: 2.4, 2.8–2.10, 4.2, 6.1–6.2, 6.5_

  - [x] 2.3 Implement the complete home sky-stage and its styling-failure indication
    - Preserve the hero title, avatar, introduction, and primary CTA while composing the sky-stage, glass surface, and nonessential peripheral decoration.
    - Add a perceivable, readable, keyboard-safe status/error indication for unavailable or failed complete sky-stage styling; do not silently present an unstyled result and do not hide or replace primary content while reporting the failure.
    - Keep the indication noninteractive unless it provides a real recovery action, and make it independent of a required runtime or timer.
    - _Requirements: 2.1, 2.6, 2.11, 6.3–6.4, 9.1–9.3_

  - [x] 2.4 Implement page-specific compositions in the existing HTML and `styles.css`
    - Preserve blog title/article content in a readable glass reading surface with peripheral decoration; preserve all four portfolio cards, images, metadata, descriptions, destinations, GitHub attributes, and stable image interaction states.
    - Preserve resume content and hierarchy in a print-friendly glass sheet; preserve contact copy, labels, IDs, names, controls, required attributes, and static form behavior in the split layout.
    - Keep meaningful imagery represented by real images with descriptive alternatives; never use decoration as the only content representation.
    - _Requirements: 2.1, 2.7–2.10, 3.1–3.3, 6.4, 7.4, 8.4, 9.3–9.4_

  - [x] 2.5 Add content, semantics, and sky-stage regression checks
    - Compare each HTML document with a content inventory or assert all headings, paragraphs, meaningful links, form controls, resume entries/lists, project cards, meaningful image alternatives, and external-link attributes remain present.
    - Assert the home page has either the complete sky-stage or a perceivable styling-failure indication without silently replacing hero content.
    - **Property 2: Content and sky-stage preservation**
    - **Validates: Requirements 2.1, 2.6, 2.11**
    - _Requirements: 2.1, 2.6–2.11, 6.4, 9.1–9.4_

- [x] 3. Implement isolated decoration and CSS-primary motion
  - [x] 3.1 Add isolated ambient layers and bounded visual-only animation
    - Use pseudo-elements or minimal authored decorative elements for bubbles, clouds, droplets, and glints; HTML decoration must be `aria-hidden="true"`, `pointer-events: none`, and non-focusable.
    - Animate only visual-only non-layout properties, including `transform`, `opacity`, applicable color/border/shadow/filter changes, pseudo-element transforms, or applicable SVG animation properties; do not animate layout properties.
    - Keep ambient loops within the approved counts, 12–20 second durations, and travel bounds; keep navigation, labels, long-form text, primary content, and controls stationary.
    - If an optional JavaScript timer fallback is introduced, retain CSS visual-only animation as the primary method and keep the fallback nonessential to operation.
    - _Requirements: 3.2–3.4, 4.1, 4.3–4.5, 7.1–7.4, 10.1–10.3_

  - [x] 3.2 Implement entrance, interaction, reduced-motion, and CSS-animation-failure rules
    - Allow a supported entrance animation to delay visual visibility only while it is running; ensure unsupported, blocked, or failed CSS animation exposes the final visible and operable state rather than leaving content hidden.
    - Under `prefers-reduced-motion: reduce`, disable continuous ambient loops and transform-based entrance effects or make entrances near-instant while retaining content visibility, navigation, forms, focus indicators, and non-motion states regardless of why reduced motion is active.
    - Add print overrides for `resume.html` to reduce gradients, ambience, blur, and shadows without clipping, overlap, or loss of hierarchy.
    - _Requirements: 4.1–4.2, 5.1–5.4, 8.3–8.4_

  - [x] 3.3 Add motion, fallback, and decorative-isolation validation
    - Inspect decorative HTML and pseudo-element responsibilities for assistive-technology hiding, `pointer-events: none`, no focus target, correct stacking, and no interception of readable content.
    - Verify visual-only non-layout animation, counts, durations, travel bounds, stationary content, CSS-primary animation behavior, and that any optional timer fallback is subordinate rather than required.
    - Verify supported entrance, failed/unsupported CSS animation, reduced-motion from any cause, and print states all leave primary content visible and operable.
    - **Property 4: Motion independence and stable interaction**
    - **Validates: Requirements 4.1–4.5**
    - **Property 5: Reduced-motion compliance**
    - **Validates: Requirements 5.1–5.4**
    - **Property 7: Decorative isolation**
    - **Validates: Requirements 7.1–7.4**
    - **Property 10: Performance discipline**
    - **Validates: Requirements 10.2–10.3**
    - _Requirements: 4.1–4.5, 5.1–5.4, 7.1–7.4, 8.3–8.4, 10.2–10.3_

- [x] 4. Make responsive layout, focus priority, and no-shift behavior safe
  - [x] 4.1 Complete mobile, desktop, and zoom behavior in `styles.css`
    - At 320–760px, stack every multi-column group, wrap readable navigation without horizontal scrolling, cap decorative density at five simultaneous elements, and cap continuous decorative travel at 16px or less.
    - At 320–2560px and 100%–400% zoom, use fluid widths and safe wrapping so layout, decoration, hover/focus states, validation states, and other visual states cause no horizontal overflow, clipping, overlap, or layout shift.
    - Ensure focus indicators take priority over decorative visibility, remain visible, and never depend on decoration being hidden by chance.
    - _Requirements: 3.1–3.4, 4.2, 6.1, 8.2, 10.2, 10.4_

  - [x] 4.2 Add layout-safety and state-bounds checks
    - Use representative viewport/zoom inspection or browser automation at 320, 375, 760, 1024, and 2560px and 100%–400% zoom-equivalent layouts.
    - Assert no horizontal overflow, decoration/content overlap, clipped focus ring, hidden primary content, or bounds change between default and hover/focus/active/validation/reduced-motion states.
    - **Property 3: Layout safety and focus priority**
    - **Validates: Requirements 3.1–3.4**
    - _Requirements: 3.1–3.4, 4.2, 6.1_

- [x] 5. Verify JavaScript-independent progressive baseline and static fallbacks
  - [x] 5.1 Preserve native navigation, forms, primary content, and enhanced-reading degradation
    - Validate that links navigate through relative HTML destinations, forms retain native controls and operation, and primary content is available without JavaScript.
    - If enhanced reading functionality exists, make it optional and ensure its absence with JavaScript disabled degrades to the underlying readable document rather than blocking reading or navigation.
    - Do not use JavaScript for current-page ownership, content visibility, animation failure recovery, home-stage failure indication, core form operation, or navigation; do not add JavaScript timers or scroll listeners for core behavior.
    - _Requirements: 1.3, 4.1, 8.3, 9.2–9.5_

  - [x] 5.2 Add fallback and progressive-baseline checks
    - Disable JavaScript, backdrop filtering, external fonts, and CSS animation in validation environments and assert readable content, operable controls, native navigation/forms, graceful enhanced-reading degradation, and immediate final-state visibility.
    - Check that no required endpoint, bundle, data store, tracking, autoplay media, or new dependency is referenced and that every existing relative asset resolves from static hosting.
    - **Property 8: Visual and print fallback**
    - **Validates: Requirements 8.1–8.4**
    - **Property 9: Static deployability and progressive baseline**
    - **Validates: Requirements 9.1–9.5**
    - _Requirements: 8.1–8.4, 9.1–9.5_

- [x] 6. Run integrated structural, accessibility, visual, and performance validation
  - [x] 6.1 Execute final HTML and accessibility validation
    - Validate parseable HTML, unique titles, exactly one `main`, exactly one named primary-navigation landmark, exactly one current navigation item per page, heading structure, image alternatives, form associations, contrast, and focus visibility.
    - Verify navigation, forms, primary content, and enhanced reading remain available without JavaScript or degrade gracefully, and verify external-link attributes and relative asset paths remain intact.
    - _Requirements: 1.1–1.3, 6.1–6.5, 9.1–9.4_

  - [x] 6.2 Run the complete property-oriented regression suite
    - Run the checks from Tasks 1.4, 2.5, 3.3, 4.2, and 5.2 against final HTML/CSS and report affected page, selector/state, requirement clause, and property number for failures.
    - Confirm coverage of Correctness Properties 1–10, including exact current navigation/landmarks, home-stage failure indication, content preservation, focus-priority layout safety, motion/reduced-motion behavior, decorative isolation, fallbacks, progressive baseline, and CSS-primary performance discipline.
    - _Requirements: 1.1–10.5_

  - [x] 6.3 Run final visual, interaction, and print regression checks
    - Inspect default, reduced-motion, unsupported-animation, fallback, and print renderings of all five pages at representative mobile, tablet, desktop, and zoomed widths.
    - Verify keyboard/pointer parity, stable layout bounds for every visual state, decoration pointer isolation, focus priority, CSS-animation failure behavior, home-stage failure indication, and resume print output.
    - _Requirements: 3.1–3.4, 4.1–4.5, 5.1–5.4, 6.1–6.5, 7.1–7.4, 8.1–8.4, 9.3_

- [x] 7. Checkpoint - Ensure all tests pass, ask the user if questions arise.
  - Confirm only intended implementation and validation files changed; do not alter `requirements.md`, `design.md`, `.config.kiro`, existing assets, or unrelated site code.
  - Confirm the site remains deployable from the repository root as static files with no required JavaScript, timer, endpoint, bundle, or build step.

## Notes

- Tasks marked with `*` are optional test/validation tasks and may be skipped for a faster MVP; core implementation tasks are not optional.
- Every implementation task preserves existing content, semantics, relative assets, and external-link attributes unless a minimal authored hook is required by the approved design.
- Correctness Properties 1–10 are taken from `design.md`; each property-oriented task names the property and the requirement clause it checks.
- Animation tasks intentionally require visual-only non-layout properties rather than layout-triggering properties. CSS remains the primary ambient animation method; an optional timer fallback must never be required for operation.
- Supported entrance animation may delay visual visibility only while it runs; unsupported, blocked, or failed animation must reveal the final state. Reduced-motion handling must preserve content visibility regardless of cause.
- Checkpoint tasks and top-level parent tasks are not included in the dependency graph; only decimal-numbered leaf tasks are included.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["1.4", "2.1"] },
    { "id": 4, "tasks": ["2.2"] },
    { "id": 5, "tasks": ["2.3"] },
    { "id": 6, "tasks": ["2.4"] },
    { "id": 7, "tasks": ["2.5", "3.1"] },
    { "id": 8, "tasks": ["3.2"] },
    { "id": 9, "tasks": ["3.3", "4.1"] },
    { "id": 10, "tasks": ["4.2", "5.1"] },
    { "id": 11, "tasks": ["5.2", "6.1"] },
    { "id": 12, "tasks": ["6.2", "6.3"] }
  ]
}
```
