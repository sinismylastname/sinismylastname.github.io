# Andy Sin's Interactive Portfolio

This is Andy Sin's interactive Frutiger Aero portfolio. It combines a cloudy, medium-transparency glass material with aqua/lime sky layers, typed project data, and gentle pointer-reactive depth.

## Pages and content

The React app provides:

- Home with introduction and featured projects
- Notes with the original personal-site reflection
- Portfolio with typed project cards and category filters
- About with current interests
- Resume with the existing education, experience, skills, projects, honors, and PDF download
- Contact with native browser validation

The original root-level HTML/CSS site remains in the repository as a static rollback/reference baseline. The deploy workflow builds the interactive app into `dist/` and publishes that artifact through GitHub Pages.

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

Interactive glass surfaces respond to fine-pointer movement with capped tilt and a shifting reflection. Touch devices receive regular pressed/focus states instead of simulated cursor tracking. Reduced-motion preferences disable tilt and ambient loops while preserving the same content and controls. The glass uses an opaque fallback when backdrop blur is unavailable, and the contact form remains native HTML.

## Publish

Push to `main` to run `.github/workflows/deploy.yml`, or trigger the workflow manually from GitHub Actions. GitHub Pages must be configured to use **GitHub Actions** as its source.

[Visit the website](https://sinismylastname.github.io)
