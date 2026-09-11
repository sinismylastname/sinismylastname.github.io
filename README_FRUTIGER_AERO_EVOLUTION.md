# Frutiger Aero Portfolio — Visual Evolution & Experimentation Handoff

## Purpose

This document is a design and engineering handoff for the next stage of the portfolio at:

`https://sinismylastname.github.io/`

The site is already functional, performant, and visually coherent. The goal of this phase is **not** to add more features for the sake of adding features, and it is not to turn the site into a heavy WebGL demo.

The goal is to evolve the portfolio from:

> a modern portfolio with Frutiger Aero styling

into:

> a small, cohesive visual world with its own material system, atmosphere, interaction language, and playful experimentation tools.

The most important shift is conceptual:

**Do not ask “what feature is missing?”**

Ask instead:

- What material is this object made of?
- What environment is it reflecting?
- What should feel glossy, wet, plastic, glassy, metallic, or soft?
- How should the cursor affect the world around it?
- How can the interface feel alive without becoming visually noisy or computationally expensive?
- How can this become a playground that remains enjoyable to iterate on?

The current performance work should be preserved. Any new visual additions should be judged by both aesthetic value and rendering cost.

---

# 1. High-Level Direction

The site should move toward a design language that can be summarized as:

**modern portfolio structure + shameless 2007 material design**

The visual identity should draw from the broad Frutiger Aero family without becoming a direct Windows Vista/Windows 7 imitation.

The intended aesthetic includes:

- bright blue sky
- white cloud light
- turquoise water
- glossy translucent surfaces
- green environmental bounce
- bubbles and droplets
- candy-like plastic controls
- luminous gradients
- polished iconography
- soft atmospheric depth
- restrained motion
- playful skeuomorphic highlights

The site should feel like a **designed environment**, not merely a page using the same glass panel style everywhere.

---

# 2. Core Design Problem

The site already has strong glass styling. Adding even more blur or transparency everywhere would likely reduce clarity and make the design feel more generic.

The next major opportunity is **material contrast**.

Different interface objects should appear to be made of different materials.

Current risk:

> many surfaces can visually collapse into “translucent rounded rectangle with blur.”

Desired direction:

> some elements are frosted acrylic, some are thick polished glass, some are glossy plastic, some are bubble-like, some are enamel, some are wet/luminous, and some remain calm and nearly flat.

This variety will make the glassiest elements feel more glass-like without requiring stronger blur.

---

# 3. Primary Design Principles

## 3.1 Material contrast over universal glass

Do not apply the strongest glass effect to every surface.

Use distinct materials based on role.

Suggested mapping:

| UI Element | Material Direction |
|---|---|
| Navigation | thick Aero glass / polished acrylic |
| Primary CTA | glossy candy-like plastic |
| Secondary buttons | translucent soft plastic |
| Project cards | calmer frosted acrylic |
| Project image frame | clear gloss / polished coating |
| Cursor | optical lens / luminous droplet |
| Scroll thumb | transparent glass capsule |
| Filter pills | small polished plastic/glass capsules |
| Logo orb | enamel / lacquered plastic / glass orb |
| Ambient bubbles | soap-bubble / water-droplet material |
| Modal | deep translucent glass, less reflective than nav |
| Page background | environmental sky/water, not “glass” |

This should create a richer visual hierarchy while preserving performance.

---

## 3.2 Specularity matters more than blur

A common mistake in glassmorphism is to treat `backdrop-filter: blur()` as the primary indicator of glass.

For this project, the more important properties should be:

- bright upper rim
- curved white reflections
- narrow specular streaks
- faint environmental color reflections
- subtle inset highlights
- restrained shadowing
- selective translucency

In many cases, a static reflection will provide more Frutiger Aero character than increasing blur radius.

---

## 3.3 The interface should reflect an imaginary environment

All major materials should feel as though they exist in one shared world.

The imaginary environment is:

- bright sky above
- green earth / foliage below
- turquoise water nearby
- strong white cloud light

That means glass surfaces can receive:

- white/cyan upper reflection
- faint green lower bounce
- turquoise edge tint
- soft dark-blue underside shadow

This makes separate components feel physically related.

---

## 3.4 Fewer, better decorative objects

Do not increase ambient particle count simply because performance has improved.

Prefer:

- fewer bubbles
- higher visual quality
- more depth variation
- better highlights
- more deliberate placement

Four beautifully shaded bubbles are preferable to sixteen generic bubbles.

---

## 3.5 Motion should communicate material

Animation should answer questions like:

- does this object feel suspended?
- does it feel glossy?
- does it feel elastic?
- does light glide across it?
- does the cursor act like a moving light source?

Avoid motion that exists only because animation is possible.

---

# 4. Priority Visual Improvements

## 4.1 Environmental reflections on glass

This is the highest-value visual improvement.

### Objective

Make glass surfaces subtly reflect the world around them.

### Desired appearance

Upper edge:

- bright white highlight
- very faint cyan tint

Lower edge:

- pale lime/green reflected light
- slight aqua undertone

Center:

- mostly neutral translucent surface

### Important note

The green should be extremely subtle.

The user should not consciously think:

> “this card is green.”

The intended subconscious read is:

> sky above + transparent object + green environment below

### Example concept

```css
.glass-surface {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(157, 235, 92, 0.22),
    0 14px 35px rgba(8, 100, 145, 0.14);
}

.glass-surface::before {
  background:
    radial-gradient(
      ellipse 70% 28% at 28% 0%,
      rgba(255,255,255,.58),
      transparent 70%
    ),
    linear-gradient(
      to top,
      rgba(139,229,83,.10),
      transparent 23%
    ),
    linear-gradient(
      145deg,
      rgba(255,255,255,.28),
      rgba(109,220,241,.07)
    );
}
```

### Performance requirement

Prefer static gradients and compositor-friendly transformed reflection layers.

Do not add continuous per-pixel distortion.

---

# 5. Material Taxonomy

A reusable material system should be introduced rather than continuing to treat all translucent surfaces identically.

Suggested conceptual classes/tokens:

```text
material-glass-heavy
material-glass-soft
material-plastic-glossy
material-enamel
material-bubble
material-acrylic
material-lens
```

These do not have to be literal CSS class names. They can instead become component variants, data attributes, or token groups.

The point is to make the distinction explicit in the design system.

## 5.1 Heavy glass

Use for:

- navigation
- important floating controls
- perhaps modal framing

Properties:

- stronger white edge
- moderate blur
- visible reflection
- deeper inner shadow
- subtle environment tint

## 5.2 Soft acrylic

Use for:

- project cards
- content panels

Properties:

- lower blur
- more opaque base
- static specular highlight
- minimal dynamic reflection

## 5.3 Glossy plastic

Use for:

- buttons
- small pills
- CTA controls

Properties:

- bright top highlight
- saturated body color
- darker lower edge
- almost no backdrop blur
- subtle inset shadow

## 5.4 Enamel / lacquer

Use for:

- logo orb
- small decorative identity marks

Properties:

- stronger color saturation
- sharp highlight
- dark rim
- glossy spot reflection

## 5.5 Bubble material

Use for:

- ambient bubbles
- cursor-adjacent droplets

Properties:

- almost transparent center
- bright crescent reflection
- thin cyan edge
- faint rainbow thin-film tint
- soft interior reflection

## 5.6 Optical lens

Use for:

- cursor
- special focus/hover effects

Properties:

- localized shine
- subtle distortion only if cheap
- brighter directional rim
- luminous center/edge relationship

---

# 6. Make the Bubbles Better, Not More Numerous

The bubbles are one of the strongest Frutiger Aero motifs available to the project.

The next iteration should focus on **bubble quality**.

## Desired changes

Each bubble should have a combination of:

- one strong white crescent reflection
- one much smaller secondary highlight
- faint cyan shadow rim
- extremely subtle magenta/yellow thin-film tint
- varied transparency
- varied blur
- varied scale

Some bubbles should be:

- close and large
- distant and small
- partially clipped by the viewport edge
- partially hidden behind content

This creates foreground/midground/background depth.

### Avoid

- many equally sized bubbles
- identical opacity
- identical animation paths
- overly visible rainbow gradients
- fast motion

### Performance principle

Reduce object count before increasing shading complexity.

A small number of high-quality CSS bubbles should remain inexpensive if their animation uses only `transform` and `opacity`.

---

# 7. Glossy Aero Iconography

Introduce a small original icon system.

The icons should be custom to this portfolio rather than direct copies of legacy Windows icons.

Potential icons:

- Projects → glossy folder / device / cube
- About → green person orb / profile bubble
- Resume → polished document tile
- Contact → translucent mail bubble
- Robotics → bright green/blue mechanical orb
- Hardware → chrome/aqua circuit tile
- Software → blue glass window / code tile

## Technical format

Prefer inline or imported SVG.

SVG advantages:

- tiny asset size
- gradient support
- scalable
- sharp at high DPI
- easy to theme with CSS variables

## Style

Use:

- 2–4 gradient layers
- one major white highlight
- one darker lower edge
- subtle cyan shadow
- restrained glow

Do not build hyper-detailed icons that visually compete with project content.

---

# 8. Project-Specific Reflection Colors

Project cards should subtly inherit identity from their content.

Each project may define visual tokens such as:

```ts
reflectionColor
accentColor
glowColor
```

or CSS variables:

```css
--project-accent
--project-glow
--project-reflection
```

Possible examples:

```text
Robotics      → lime + cyan
Hardware      → electric blue + teal
Software      → aqua + sky blue
StarterPack   → blue + soft yellow
```

These colors can influence:

- lower glass reflection
- tag/pill edge
- tiny card glow
- image outline
- focus state
- title accent

### Important

Do not repaint the entire card with the project color.

Color should feel reflected, not painted.

---

# 9. Local-Time Sky System

A major optional feature is a lightweight environment system based on the visitor's local time.

This should not be a dark-mode replacement.

Instead, it should represent **the same Frutiger Aero world at different times of day**.

Suggested states:

```text
morning
midday
sunset
night
```

## 9.1 Morning

Palette:

- pale cyan
- soft yellow sunlight
- white cloud highlights
- mint green bounce

Mood:

- clean
- bright
- gentle

## 9.2 Midday

Palette:

- saturated blue
- turquoise
- white
- vivid lime bounce

Mood:

- classic Frutiger Aero
- energetic

## 9.3 Sunset

Palette:

- peach
- cyan
- warm white
- lavender shadows

Mood:

- nostalgic
- warm
- dreamy

## 9.4 Night

Palette:

- deep marine blue
- aqua glow
- moonlit white
- cyan reflections

Mood:

- luminous
- aquatic
- calm

## Implementation guidance

Evaluate time once on page load.

Set one root class or data attribute.

Example:

```ts
document.documentElement.dataset.sky = "sunset";
```

Then rely on CSS variables.

```css
:root[data-sky="sunset"] {
  --sky-top: ...;
  --sky-bottom: ...;
  --environment-highlight: ...;
  --environment-bounce: ...;
}
```

### Performance requirement

Do not continuously update the environment every minute.

A one-time calculation on load is sufficient.

If desired, refresh only on visibility return after a very long idle period.

---

# 10. Cursor as the Shared Light Source

The cursor should evolve conceptually from:

> an animated pointer that causes independent hover effects

into:

> a moving light source interacting with nearby materials

This is one of the strongest opportunities for making the entire site feel physically coherent.

## Desired behaviors

When the pointer approaches a surface:

- the nearest rim becomes slightly brighter
- the specular reflection shifts toward the cursor
- glossy icons receive a faint glint
- buttons gain a directional highlight
- the cursor itself appears optically related to these reflections

The effect should remain subtle.

The page should not look like every component has a flashlight attached to it.

## Implementation strategy

Use normalized pointer coordinates.

Example conceptual values:

```text
--light-x: -1 → 1
--light-y: -1 → 1
```

or local component coordinates:

```text
--pointer-x: 0 → 1
--pointer-y: 0 → 1
```

Derive:

- highlight translation
- rim strength
- reflection position
- tiny shadow direction

## Critical performance constraint

Do not dynamically regenerate large gradients when possible.

Prefer:

- transform existing pseudo-element highlight layers
- update opacity
- update small CSS variables feeding transforms

Avoid:

- large-area filters changing every frame
- layout properties
- large continuously repainted backgrounds

---

# 11. The Aero Lab

The most important long-term feature in this document is an optional hidden **Aero Lab**.

The purpose of Aero Lab is not primarily user-facing functionality.

It is a creative development tool that turns the site into a visual experimentation playground.

This addresses an important project reality:

> the owner enjoys working on the site even when there is no obvious feature left to add.

Instead of forcing random permanent features into production, create a controlled environment for experimentation.

---

## 11.1 Activation

Possible activation methods:

- `Shift + A`
- clicking the logo five times
- URL hash such as `#aero-lab`
- local development only
- a hidden settings button in a debug mode

Recommended default:

`Shift + A`

This should toggle a compact floating panel.

---

## 11.2 Suggested controls

### Glass

- opacity
- blur
- reflection strength
- border brightness
- upper-rim intensity
- lower green bounce
- shadow depth
- saturation

### Environment

- sky saturation
- sky brightness
- horizon green
- cloud brightness
- atmosphere contrast
- bubble density
- bubble opacity
- bubble speed

### Interaction

- card tilt strength
- pointer light intensity
- cursor tug
- cursor morph strength
- shine travel distance
- shine opacity
- hover lift

### Material

- acrylic opacity
- plastic gloss strength
- enamel highlight strength
- bubble edge intensity
- lens reflection strength

---

## 11.3 Persistence

Use `localStorage`.

Example:

```text
aeroLab.settings.v1
```

Settings should persist across reloads.

Add:

- Reset defaults
- Copy settings
- Import settings
- Export settings

A copied preset could simply be JSON.

---

## 11.4 Example panel

```text
AERO LAB

Glass
Opacity           ━━━━●━━━━
Reflection        ━━━━━━●━━
Blur              ━━━●━━━━━
Upper rim         ━━━━━●━━━
Green bounce      ━━●━━━━━━

Environment
Sky saturation    ━━━━━●━━━
Cloud light       ━━━━●━━━━
Bubble density    ━━●━━━━━━
Bubble speed      ━━━●━━━━━

Interaction
Tilt              ━━━●━━━━━
Cursor tug        ━━━━━●━━━
Shine travel      ━━━━●━━━━
Pointer light     ━━━━━●━━━

[ Reset ] [ Copy JSON ]
```

---

## 11.5 Why Aero Lab is valuable

It creates a repeatable design workflow:

1. Open site.
2. Enter Aero Lab.
3. Experiment visually.
4. Find a compelling configuration.
5. Export settings.
6. Compare against defaults.
7. Promote successful values into production design tokens.

This prevents arbitrary hard-coded tweaking across CSS files.

It also makes the design system itself a hobby project.

---

# 12. Design Tokens to Consider Adding

A future token system could include:

```css
:root {
  --glass-opacity-soft: .58;
  --glass-opacity-heavy: .42;

  --glass-rim-top: rgba(255,255,255,.86);
  --glass-rim-bottom: rgba(143,231,93,.16);

  --reflection-white: rgba(255,255,255,.58);
  --reflection-cyan: rgba(160,240,255,.22);
  --reflection-green: rgba(151,232,91,.13);

  --plastic-gloss: .72;
  --enamel-gloss: .84;

  --pointer-light-strength: .35;
  --pointer-light-distance: 140px;

  --bubble-rim: rgba(170,245,255,.55);
  --bubble-highlight: rgba(255,255,255,.82);

  --ambient-depth-near: 1;
  --ambient-depth-mid: .65;
  --ambient-depth-far: .35;
}
```

These values are examples only.

Aero Lab should eventually control many of them.

---

# 13. Performance Philosophy

The recent optimizations should be treated as protected work.

Do not spend newly available performance headroom just because it exists.

The target should be:

> more visual richness per unit of rendering cost

not:

> more rendering because the system can now handle it

---

## 13.1 Preferred animation properties

Strong preference:

```text
transform
opacity
```

Acceptable when proven inexpensive:

```text
small box-shadow transitions
small filter transitions
border color
background color
```

Use caution with:

```text
backdrop-filter
large-area filter
animated gradients
background-position
box-shadow on large moving elements
```

Avoid for continuous animation:

```text
top
left
width
height
margin
padding
layout-changing properties
```

---

## 13.2 Reflection strategy

Dynamic reflection should generally mean:

> move an already-painted reflection layer

rather than:

> regenerate the reflection every frame

Use pseudo-elements larger than their parent, then translate them.

Example concept:

```css
.glass-surface::after {
  content: "";
  position: absolute;
  inset: -35%;

  background:
    linear-gradient(
      115deg,
      transparent 39%,
      rgba(255,255,255,.08) 43%,
      rgba(255,255,255,.48) 49%,
      rgba(190,245,255,.18) 53%,
      transparent 60%
    );

  opacity: var(--reflection-opacity, .6);

  transform:
    translate3d(
      var(--reflection-x, 0px),
      var(--reflection-y, 0px),
      0
    )
    rotate(12deg);
}
```

---

## 13.3 Animation count

Do not add many new continuously animated objects.

Suggested soft target:

```text
Desktop: 4–6 prominent continuously moving decorative objects
Mobile: 2–3 prominent continuously moving decorative objects
```

Other decorative elements should remain static or respond only to user interaction.

---

# 14. Reduced Motion

All new visual systems must preserve the existing reduced-motion philosophy.

Under:

```css
@media (prefers-reduced-motion: reduce)
```

Disable or substantially reduce:

- bubble drift
- continuous background drift
- cursor tug/springiness if necessary
- large reflection travel
- floating icon motion
- entrance translations

Keep:

- static glass reflections
- material distinctions
- visible focus states
- color changes
- static environmental bounce
- content visibility

The design should still look intentionally Frutiger Aero even when almost entirely static.

---

# 15. Accessibility Guardrails

Visual experimentation must not weaken usability.

Preserve:

- keyboard focus visibility
- semantic buttons/links
- reduced-motion behavior
- coarse-pointer fallbacks
- readable contrast
- clear project text
- non-blocking decorative layers

All decorative elements should remain:

```text
pointer-events: none
aria-hidden when represented in HTML
non-focusable
```

No glass or highlight layer should obscure text.

Do not rely on color alone to indicate interaction state.

---

# 16. Proposed Development Phases

## Phase 1 — Material Pass

Goal:

Create visual distinction between major categories of UI.

Tasks:

- define material taxonomy
- assign material roles to major components
- reduce unnecessary identical glass styling
- strengthen static upper reflections
- introduce subtle lower green environmental bounce
- make buttons more plastic-like
- make nav more premium/glassy
- keep project cards calmer

Success criteria:

The page should visibly contain multiple materials even in a static screenshot.

---

## Phase 2 — Bubble Quality Pass

Goal:

Improve ambience without increasing animation load.

Tasks:

- reduce bubble count if needed
- add crescent highlight
- add secondary highlight
- add subtle cyan rim
- vary blur and depth
- introduce 1–2 large foreground bubbles near edges
- keep movement slow

Success criteria:

Bubbles should read as objects rather than generic circles.

---

## Phase 3 — Project Color Reflection

Goal:

Give individual cards identity without introducing visual noise.

Tasks:

- add project accent tokens
- feed accent into edge/reflection styles
- vary tag/metadata accents
- preserve shared structure

Success criteria:

Each project feels distinct, but the grid remains cohesive.

---

## Phase 4 — Cursor as Light Source

Goal:

Unify interactive visual response.

Tasks:

- expose global/local pointer-light variables
- orient rim brightness toward pointer
- shift reflection layers subtly
- add optional icon glint
- avoid expensive gradient regeneration

Success criteria:

Multiple components appear to respond to one shared light source.

---

## Phase 5 — Aero Icon System

Goal:

Create original visual identity.

Tasks:

- design 4–8 original SVG icons
- define shared gradient language
- introduce them sparingly
- make icons inherit environment/project tokens where useful

Success criteria:

Icons look like they belong to this site rather than a generic icon pack.

---

## Phase 6 — Local-Time Environment

Goal:

Make the site feel alive without continuous computation.

Tasks:

- implement morning/midday/sunset/night states
- update environment variables at load
- theme reflections with environment
- test text contrast in all states

Success criteria:

The atmosphere changes noticeably while the structure remains identical.

---

## Phase 7 — Aero Lab

Goal:

Create a permanent experimentation system.

Tasks:

- hidden activation gesture
- slider panel
- CSS variable bridge
- localStorage persistence
- reset defaults
- JSON export/import

Success criteria:

The site owner can meaningfully redesign visual characteristics live without editing source files.

---

# 17. Aero Lab Architecture Suggestion

A possible implementation could use:

```text
AeroLab.tsx
useAeroSettings.ts
useAeroHotkey.ts
aeroSettings.ts
```

Suggested data shape:

```ts
export type AeroSettings = {
  glassOpacity: number;
  glassReflection: number;
  glassBlur: number;
  upperRim: number;
  greenBounce: number;

  skySaturation: number;
  cloudBrightness: number;

  bubbleDensity: number;
  bubbleSpeed: number;

  tiltStrength: number;
  cursorTug: number;
  shineTravel: number;
  pointerLight: number;
};
```

Create a single function that maps state to CSS custom properties.

Avoid using React re-renders for every animation frame.

A slider update is infrequent enough for React state.

Continuous cursor interaction should stay outside normal React render flow.

---

# 18. Experimental Ideas for Later

These are deliberately optional.

They should not be implemented before the core material work is successful.

## 18.1 Water-caustic light patch

A very subtle static or slowly transformed caustic texture behind one section.

Prefer CSS/SVG.

Do not cover the entire page.

---

## 18.2 Tiny glass droplets on image frames

A few decorative droplets could appear around selected project images.

Keep them static.

---

## 18.3 Polished chrome detail

Introduce one small chrome material, perhaps in a divider or icon.

Chrome should be rare.

Its purpose is to increase material diversity.

---

## 18.4 Hover condensation

On a very small number of surfaces, hover could reveal faint tiny droplets or fogging.

This should be experimental and disabled if visually distracting.

---

## 18.5 Lens flare glint

One-pixel/very-small glints can appear on specific edges as the cursor crosses them.

Avoid full lens-flare effects.

---

## 18.6 Sky reflection bands

Introduce very faint curved horizontal reflection bands into large glass surfaces.

This can simulate reflected cloud layers without dynamic capture.

---

# 19. What Not to Add

Avoid the following unless there is a very strong reason:

## Full-site WebGL

Do not introduce a permanent WebGL rendering layer simply because performance has improved.

## Full DOM refraction

Do not continuously capture and distort the DOM behind every glass card.

## More particle density

More bubbles is not automatically better.

## Continuous motion everywhere

Navigation, text, and major content should remain visually stable.

## Excessive blur

Blur is not the aesthetic goal.

## Windows clone behavior

The site should remain a personal portfolio, not a literal Windows Vista/7 recreation.

## Heavy animation libraries without a concrete need

Do not add dependencies simply to reproduce effects already achievable with small CSS/TypeScript utilities.

---

# 20. Performance Validation Workflow

Every major visual phase should be tested before proceeding.

## Test scenarios

Profile:

1. idle home page
2. pointer moving over empty background
3. pointer moving over project cards
4. pointer rapidly crossing multiple controls
5. scrolling through the project grid
6. opening/closing modal
7. switching pages
8. reduced-motion mode
9. mobile/coarse pointer if available

## Watch for

- large green paint flashes
- repeated layout events
- layer explosion
- high GPU memory
- excessive compositing
- frame drops during pointer movement
- idle CPU use

## Principle

If a decorative effect causes the site to lose smoothness while the cursor moves, it is not worth keeping in its current form.

Try to redesign the effect before removing the visual idea entirely.

---

# 21. Visual Evaluation Checklist

After each phase, ask:

### Material

- Can I tell glass from plastic from acrylic?
- Do the bubbles look like objects?
- Does the logo have its own material identity?

### Environment

- Do surfaces appear to reflect a shared world?
- Is there a subtle sense of sky above and green below?
- Does the page feel atmospheric rather than merely blue?

### Interaction

- Does the cursor feel integrated into the environment?
- Do hover effects appear physically related?
- Are effects subtle enough not to distract from reading?

### Hierarchy

- Are project cards still easy to scan?
- Are calls to action clearly recognizable?
- Is the navigation visually important without dominating the page?

### Performance

- Is pointer movement consistently smooth?
- Does idle CPU settle down?
- Are continuous animations limited?

### Accessibility

- Does reduced motion still look intentional?
- Are focus states clear?
- Is text contrast preserved?

---

# 22. Suggested First Implementation Session

If beginning work immediately, do the following in order.

## Step 1

Do not touch the cursor logic yet.

Create a static material pass first.

## Step 2

Add environment tokens:

```text
sky reflection
cloud highlight
green bounce
aqua edge
```

## Step 3

Apply a subtle green lower rim to selected glass surfaces.

## Step 4

Make navigation more optically rich than cards.

## Step 5

Make primary buttons more plastic than glass.

## Step 6

Rework one bubble until it looks excellent.

Use that as the visual template for the others.

## Step 7

Profile.

Only after the static material direction looks good should dynamic pointer-light work begin.

---

# 23. Suggested Second Implementation Session

Implement cursor-as-light-source behavior.

Start with only one component type.

Recommended first target:

**project cards**

Then:

- measure performance
- tune reflection distance
- reduce intensity
- add nav behavior only if it remains smooth

Do not wire every component simultaneously.

---

# 24. Suggested Third Implementation Session

Build the first version of Aero Lab.

MVP controls:

```text
glass opacity
reflection strength
green bounce
sky saturation
tilt strength
pointer light
bubble density
```

Do not begin with dozens of controls.

A small functional panel is more useful than a large unfinished one.

---

# 25. Long-Term Identity Goal

The ideal end state is not merely:

> “this website looks Frutiger Aero.”

The ideal end state is:

> “this website has a recognizable visual system inspired by Frutiger Aero, and I can tell it belongs specifically to Andy’s portfolio.”

That identity should emerge from:

- shared environmental lighting
- original iconography
- material distinctions
- project-specific reflections
- the cursor-light relationship
- playful but restrained atmosphere
- the Aero Lab experimentation workflow

---

# 26. Definition of Done for This Evolution

This visual evolution can be considered successful when:

- major component categories have visibly distinct materials
- environmental reflections unify the interface
- the site has stronger Frutiger Aero character without relying on stronger blur
- bubble quality improves without increasing decorative density
- cursor interaction feels physically connected to nearby surfaces
- project cards subtly inherit project identity
- optional time-of-day environments work without heavy runtime cost
- Aero Lab allows live tuning of the major visual parameters
- reduced-motion remains polished
- mobile remains usable
- pointer movement remains smooth
- the site still feels like a portfolio rather than a visual demo

---

# 27. Final Philosophy

Do not optimize for the maximum number of effects.

Optimize for **coherence**.

A small number of believable materials, reflections, highlights, bubbles, and interactions will create more visual impact than a large number of unrelated animations.

The next phase should be fun to work on.

This project has already moved beyond a simple portfolio implementation and is becoming a small personal design system and rendering playground.

That is a strength, not something that needs to be “finished” quickly.

The best next step is to make the system easier to experiment with while protecting the performance work that already made the experience smooth.



---

# Production decision — fixed Aero preset

The optional Aero Lab described earlier in this evolution document is not shipped in the production portfolio. The tuning panel, Shift+A listener, JSON import/export flow, and localStorage settings override were removed after the visual direction was finalized.

The accepted preset below is now the permanent production configuration. It is defined statically through the root CSS variables and shared settings defaults rather than user-editable runtime state:

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

Earlier Aero Lab sections remain as design history and should not be interpreted as current UI requirements.
