# Requirements Document

## Introduction

The Frutiger Aero Portfolio feature will evolve Andy Sin’s existing five-page static portfolio into a cohesive, accessible, and responsive visual experience. The feature applies a shared sky, water, glass, bubble, cloud, and glossy-highlight visual language to `index.html`, `blog.html`, `portfolio.html`, `resume.html`, and `contact.html` through the shared `styles.css` stylesheet. Existing page content, semantic structure, relative assets, navigation destinations, active-page state, and static GitHub Pages deployment remain authoritative.

The feature does not introduce a framework, build step, backend, required JavaScript runtime, data store, account system, autoplay media, or content rewrite.

## Glossary

- **Frutiger_Aero_Site**: The five-page static portfolio consisting of `index.html`, `blog.html`, `portfolio.html`, `resume.html`, `contact.html`, and the shared `styles.css` stylesheet.
- **Site_Page**: Any one of the five HTML documents in the Frutiger_Aero_Site.
- **Shared_Visual_System**: The common design tokens, typography, sky/water gradients, glass surfaces, rounded shapes, shadows, highlights, controls, and interaction states applied across Site_Page documents.
- **Glass_Surface**: A translucent light panel with a visible light edge, readable fallback background, soft aqua shadow, rounded corners, and optional backdrop blur.
- **Ambient_Decoration**: Non-content bubbles, cloud-like forms, water droplets, glints, gradients, and pseudo-elements placed behind or around content.
- **Primary_Navigation**: The navigation links for Home, Blog, Portfolio, Resume, and Contact.
- **Current_Page_State**: The state in which exactly one Primary_Navigation link identifies the current Site_Page using both active styling and `aria-current="page"`.
- **Meaningful_Image**: An image that communicates page or project content, including the avatar and portfolio project images.
- **Reduced_Motion_Mode**: The presentation state used when `(prefers-reduced-motion: reduce)` matches.
- **Readable_Content**: Text and controls that remain discernible, usable, and distinguishable from surrounding backgrounds at supported viewport widths and zoom levels.
- **Static_Host**: A host such as GitHub Pages that serves the repository’s HTML, CSS, and existing relative assets without a server-side runtime.
- **Compositor_Property**: A visual property suitable for low-cost animation, specifically `transform` or `opacity` in this feature; other visual-only properties that do not trigger layout may also be used.

## Requirements

### Requirement 1: Navigation consistency

**User Story:** As a visitor, I want to know which page is open and navigate between all portfolio sections, so that the site remains predictable.

#### Acceptance Criteria

1. WHEN a visitor opens a Site_Page, THE Frutiger_Aero_Site SHALL provide Primary_Navigation links labeled Home, Blog, Portfolio, Resume, and Contact with relative destinations `index.html`, `blog.html`, `portfolio.html`, `resume.html`, and `contact.html`, respectively.
2. WHEN a Site_Page loads or transitions to another Site_Page, THE Frutiger_Aero_Site SHALL mark exactly one Primary_Navigation link with the Current_Page_State by applying active styling and `aria-current="page"`, and SHALL apply neither current-page indicator to any other Primary_Navigation link.
3. WHEN a visitor activates a Primary_Navigation link, THE Frutiger_Aero_Site SHALL load the linked Site_Page using the relative destination without requiring a server endpoint or JavaScript runtime.

### Requirement 2: Shared visual language and content preservation

**User Story:** As a portfolio visitor, I want every page to share a recognizable visual language while retaining its purpose and content, so that visual improvements do not remove information or functionality.

#### Acceptance Criteria

1. THE Frutiger_Aero_Site SHALL preserve every existing heading, paragraph, meaningful link destination, form control, resume entry, project description, and Meaningful_Image while applying the Shared_Visual_System.
2. THE Frutiger_Aero_Site SHALL apply a shared palette containing pale sky and cloud tones, turquoise or deep-blue water accents, lime highlights, dark-blue ink, muted-blue supporting text, and translucent light surfaces.
3. THE Frutiger_Aero_Site SHALL apply the Shared_Visual_System to the body background, typography, Primary_Navigation, content panels, links, controls, project cards, and footer on every Site_Page.
4. THE Frutiger_Aero_Site SHALL render content panels with rounded corners and controls with pill-shaped styling while preserving readable text contrast and recognizable control affordances.
5. THE Frutiger_Aero_Site SHALL place page ambience behind content, Glass_Surfaces above Ambient_Decoration, and text and focus indicators above Glass_Surfaces.
6. WHEN a visitor opens `index.html`, THE Frutiger_Aero_Site SHALL present the existing hero title, avatar, introduction, and primary call to action within the complete sky-stage composition, including Glass_Surface styling and nonessential Ambient_Decoration.
7. WHEN a visitor opens `blog.html`, THE Frutiger_Aero_Site SHALL present the existing page title and article content in a readable Glass_Surface with Ambient_Decoration limited to peripheral areas that do not cover content.
8. WHEN a visitor opens `portfolio.html`, THE Frutiger_Aero_Site SHALL present all four existing project cards, project images, descriptions, technology metadata, and GitHub link using glossy card styling and image interaction states.
9. WHEN a visitor opens `resume.html`, THE Frutiger_Aero_Site SHALL present the existing resume introduction, link, sections, entries, and lists in a Glass_Surface with distinct section hierarchy and print-friendly styling.
10. WHEN a visitor opens `contact.html`, THE Frutiger_Aero_Site SHALL present the existing contact copy and form in a split Glass_Surface layout with visible field-focus states and submit-control states.
11. IF advanced styling required for the complete sky-stage composition is unavailable or fails, THEN THE Frutiger_Aero_Site SHALL indicate an error instead of silently presenting unstyled content.

### Requirement 3: Responsive layout safety

**User Story:** As a visitor, I want the portfolio to remain usable on phones, tablets, desktops, and zoomed displays, so that content does not become clipped or obscured.

#### Acceptance Criteria

1. WHEN a Site_Page is displayed at a viewport width from 320 through 760 pixels inclusive, THE Frutiger_Aero_Site SHALL stack every multi-column content group and SHALL keep Primary_Navigation labels visible without horizontal scrolling.
2. WHEN a Site_Page is displayed at a viewport width from 320 through 2560 pixels inclusive, THE Frutiger_Aero_Site SHALL present Readable_Content without horizontal overflow caused by layout, Ambient_Decoration, or interaction states.
3. WHEN a Site_Page is displayed at browser zoom from 100% through 400%, THE Frutiger_Aero_Site SHALL keep focus indicators visible, SHALL allow focus indicators to take priority over Ambient_Decoration visibility when both conflict, and SHALL prevent Ambient_Decoration from covering meaningful content.
4. WHEN a Site_Page is displayed at a viewport width from 320 through 760 pixels inclusive, THE Frutiger_Aero_Site SHALL display no more than five simultaneous decorative elements and SHALL limit continuous decorative travel to 16 pixels or less.

### Requirement 4: Motion independence and purposeful interaction

**User Story:** As a visitor, I want motion to clarify interaction and add life without disrupting reading, so that the portfolio feels responsive and calm.

#### Acceptance Criteria

1. THE Frutiger_Aero_Site SHALL keep all primary content and controls visible and operable immediately without waiting for an entrance or Ambient_Decoration animation to complete.
2. WHEN a visitor hovers over or keyboard-focuses a link, card, or button, THE Frutiger_Aero_Site SHALL display an interaction state change within 300 milliseconds using elevation, shadow, color, border, or a transform of no more than 4 pixels without producing a layout shift, while permitting visual changes outside hover and focus interactions.
3. THE Frutiger_Aero_Site SHALL run no more than three simultaneous continuous Ambient_Decoration effects, SHALL assign each effect a duration from 12 through 20 seconds inclusive, and SHALL limit each effect’s positional change to 12 pixels or less.
4. THE Frutiger_Aero_Site SHALL animate continuous Ambient_Decoration using visual-only properties that do not trigger layout, including Compositor_Property values, transforms on pseudo-elements, or applicable SVG animation properties.
5. THE Frutiger_Aero_Site SHALL keep Primary_Navigation, form labels, and long-form text stationary during continuous motion.

### Requirement 5: Reduced-motion support

**User Story:** As a visitor who prefers reduced motion, I want the portfolio to reduce nonessential movement while preserving state changes and content, so that the site remains comfortable and usable.

#### Acceptance Criteria

1. WHEN `(prefers-reduced-motion: reduce)` matches, THE Frutiger_Aero_Site SHALL disable all continuous Ambient_Decoration loops.
2. WHEN `(prefers-reduced-motion: reduce)` matches, THE Frutiger_Aero_Site SHALL disable transform-based entrance effects or reduce entrance transitions to a near-instant duration.
3. WHEN Reduced_Motion_Mode is active, THE Frutiger_Aero_Site SHALL preserve content visibility regardless of cause, navigation operation, form operation, visible focus indicators, and non-motion state changes.
4. WHEN a reduced-motion preference cannot be detected, THE Frutiger_Aero_Site SHALL keep motion nonessential to reading, navigation, form operation, and content comprehension.

### Requirement 6: Keyboard parity and accessible presentation

**User Story:** As a keyboard or assistive-technology user, I want the portfolio’s content and controls to remain understandable and operable, so that visual decoration does not create access barriers.

#### Acceptance Criteria

1. THE Frutiger_Aero_Site SHALL provide a visible `:focus-visible` state for every link, button, form control, and keyboard-operable card interaction.
2. WHEN a visitor uses keyboard navigation or pointer interaction on the same link, button, card, or form control, THE Frutiger_Aero_Site SHALL provide the same meaningful interaction outcome through both input methods.
3. THE Frutiger_Aero_Site SHALL expose exactly one main content landmark on every Site_Page regardless of content type and exactly one named Primary_Navigation landmark on every Site_Page.
4. THE Frutiger_Aero_Site SHALL provide descriptive alternative text for every Meaningful_Image and SHALL keep purely decorative imagery outside the meaningful content model.
5. THE Frutiger_Aero_Site SHALL provide a contrast ratio of at least 4.5:1 for normal text and a contrast ratio of at least 3:1 for focus indicators and control boundaries against adjacent backgrounds.

### Requirement 7: Decorative isolation

**User Story:** As an assistive-technology user, I want decorative effects excluded from navigation and content interpretation, so that visual styling does not add noise or unexpected interaction targets.

#### Acceptance Criteria

1. WHEN Ambient_Decoration is represented by an HTML element, THE Frutiger_Aero_Site SHALL mark the element as hidden from assistive technology.
2. WHEN Ambient_Decoration is represented by an HTML element, THE Frutiger_Aero_Site SHALL set `pointer-events: none` so the element does not intercept pointer interaction with readable content.
3. WHEN Ambient_Decoration is represented by an HTML element, THE Frutiger_Aero_Site SHALL prevent the element from becoming a keyboard focus target.
4. THE Frutiger_Aero_Site SHALL keep Ambient_Decoration behind Readable_Content and SHALL not use Ambient_Decoration as the only representation of meaningful information.

### Requirement 8: Visual fallbacks and print presentation

**User Story:** As a visitor using a browser with limited CSS or font support, I want the portfolio to remain readable and recognizable, so that visual enhancements do not become functional dependencies.

#### Acceptance Criteria

1. IF backdrop filtering is unavailable, THEN THE Frutiger_Aero_Site SHALL provide Glass_Surface legibility using an opaque-enough surface color, visible border, shadow, and text with a contrast ratio of at least 4.5:1 against the surface.
2. IF the external font import is unavailable, THEN THE Frutiger_Aero_Site SHALL use the defined local or system font fallback while preserving readable hierarchy and layout across viewport widths from 320 through 2560 pixels inclusive.
3. IF CSS animation is unsupported, THEN THE Frutiger_Aero_Site SHALL display primary content and controls immediately in an operable final state.
4. WHEN `resume.html` is printed, THE Frutiger_Aero_Site SHALL omit or reduce decorative gradients, Ambient_Decoration, and shadows while preserving resume content, readable contrast, and document hierarchy without clipped or overlapping sections.

### Requirement 9: Static deployability and progressive baseline

**User Story:** As a site owner, I want the redesigned portfolio to deploy through the existing static hosting model, so that the visual feature does not add operational dependencies.

#### Acceptance Criteria

1. THE Frutiger_Aero_Site SHALL remain implementable using only the existing five HTML documents, the shared `styles.css` stylesheet, and the existing relative image and PDF assets.
2. THE Frutiger_Aero_Site SHALL load every Site_Page and existing relative asset from a Static_Host without a server-side endpoint, database, build step, or JavaScript bundle.
3. WHEN JavaScript is disabled, THE Frutiger_Aero_Site SHALL keep navigation, form controls, and primary content available and operable, and SHALL keep enhanced reading functionality available without JavaScript or degrade enhanced reading functionality gracefully.
4. THE Frutiger_Aero_Site SHALL preserve the existing `target` values for external links and SHALL preserve `rel="noreferrer"` where currently present.
5. THE Frutiger_Aero_Site SHALL introduce no required data collection, tracking, third-party runtime, autoplay audio, or video background.

### Requirement 10: Performance discipline

**User Story:** As a visitor, I want the portfolio to load and animate efficiently, so that visual polish does not make a small static site feel slow or unstable.

#### Acceptance Criteria

1. THE Frutiger_Aero_Site SHALL use CSS gradients, pseudo-elements, or existing assets for visual decoration and SHALL add no raster background asset larger than 1 megabyte.
2. THE Frutiger_Aero_Site SHALL use no more than six simultaneously animated decorative elements at desktop widths and no more than three simultaneously animated decorative elements at mobile widths.
3. WHERE a JavaScript timer fallback is used, THE Frutiger_Aero_Site SHALL retain visual-only non-layout CSS animation as the primary Ambient_Decoration animation method.
4. THE Frutiger_Aero_Site SHALL retain explicit dimensions for every existing Meaningful_Image element where dimensions are already provided.
5. THE Frutiger_Aero_Site SHALL use one shared `styles.css` stylesheet and cacheable relative assets for the visual system.

## Design Traceability

The requirement numbering intentionally aligns with the approved design document’s correctness properties:

- **Property 1: Navigation consistency** → Requirements 1.1–1.3
- **Property 2: Content preservation** → Requirement 2.1
- **Property 3: Layout safety** → Requirements 3.1–3.4
- **Property 4: Motion independence** → Requirements 4.1–4.5
- **Property 5: Reduced-motion compliance** → Requirements 5.1–5.4
- **Property 6: Keyboard parity** → Requirements 6.1–6.2
- **Property 7: Decorative isolation** → Requirements 7.1–7.4
- **Property 8: Contrast fallback** → Requirement 8.1
- **Property 9: Static deployability** → Requirements 9.1–9.5
- **Property 10: Performance discipline** → Requirements 10.1–10.5

The visual-language and page-specific criteria in Requirement 2 provide the design intent for the shared visual system and all five page compositions. Requirements 6.3–6.5 provide the landmark, image-alternative, and contrast accessibility checks described by the design’s assertions.
