# Andy Sin's Interactive Portfolio

This is Andy Sin's interactive Frutiger Aero portfolio. It combines a cloudy, medium-transparency glass material with aqua/lime sky layers, typed project data, and gentle pointer-reactive depth.

## Pages and content

The React app provides:

- Home with introduction and featured projects
- Portfolio with typed project cards and category filters
- About with current interests
- Resume with the existing education, experience, skills, projects, honors, and PDF download
- Contact with native browser validation

The supported hash routes are `#home`, `#work`, `#about`, `#resume`, and `#contact`. `BlogPage.tsx` remains an unreachable legacy export; the old Notes content is attached to the StarterPack project modal.

The React app and its progressive raw-WebGL water environment are the only site implementation in the repository. They build into `dist/` and publish through GitHub Pages; the original static implementation was removed after the migration so there is one source of truth.

## Built with

- React
- TypeScript
- Vite
- Motion for React dependency, reserved for future spring/gesture expansion
- CSS custom properties, gradients, pseudo-elements, and `backdrop-filter`
- GitHub Actions and GitHub Pages

## Local development

```bash
npm install
npm run dev
```

The Vite development server runs the app from `app/`. To verify a production build:

```bash
npm run check
npm run build
npm run preview
```

## Interaction and accessibility

Interactive glass surfaces respond to fine-pointer movement with capped tilt and a shifting reflection. Touch devices receive regular pressed/focus states instead of simulated cursor tracking. The default WebGL layer is a daytime-only procedural water environment behind the authored CSS ambience and glass; reduced-motion preferences render one static water frame while preserving the same content and controls. The glass uses an opaque fallback when backdrop blur is unavailable, and the contact form remains native HTML.

### Environment previews (development)

The site uses a permanent midday/daytime Aero environment. WebGL water is enabled automatically in development and production; use `/?webgl=0#home` in development to compare the CSS-only fallback. The fixed environment remains internal and future-ready, but there is no automatic clock-based switching or production night mode.

### WebGL quality policy

When the WebGL layer is enabled, it chooses a conservative `high`, `balanced`, or `low` startup tier from viewport size, estimated render-pixel budget, hardware-concurrency hints, and device-pixel ratio. The tier stays fixed for that renderer session, caps render resolution, bounds animation cadence, and scales wave complexity; the authored CSS/DOM interface remains the fallback, including its original bubble ambience. GPU bubbles, caustics, the hero orb, and refraction remain dormant experiments, while cursor lighting uses a lightweight local water highlight so the normal path stays smooth. Non-high conservative floors may be remembered for seven days, with storage failures ignored safely. This is not measured runtime FPS adaptation: browser smoke checks confirm the ready/fallback states, but GPU frame-time/dropped-frame and thermal profiling have not been performed in this workspace.

## Publish

Push to `main` to run `.github/workflows/deploy.yml`, or trigger the workflow manually from GitHub Actions. GitHub Pages must be configured to use **GitHub Actions** as its source.

[Visit the website](https://sinismylastname.github.io)
