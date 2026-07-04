# Soumyadeep Biswas — Portfolio

**Live site: [imsoumya.netlify.app](https://imsoumya.netlify.app)**

Personal portfolio site for Soumyadeep Biswas, ML Engineer. Built as a single-page
React app with a separate "Beyond Code" section for hobbies (currently: trekking).

## Stack

- **React 18 + Vite** — app shell and build tooling
- **React Router** — client-side routing (`/` and `/treks`)
- **Tailwind CSS** — styling
- **Framer Motion** + **GSAP** — scroll-triggered and page animations
- **Three.js** via `@react-three/fiber` — the animated neural-net canvas in the hero
- **Lenis** — smooth scrolling

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` (Vite picks the next free port if that one's
taken). To make it reachable from another device on the same network (e.g. to
check on your phone):

```bash
npm run dev -- --host
```

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Editing content

Almost everything on the site — name, tagline, work history, skills, projects,
achievements, contact links, and all trek data — lives in one place:

```
src/data/profile.json
```

Edit that file and the site updates; no need to touch component code for
content changes. Images live in `src/assets/images/` and are referenced from
there.

## Project structure

```
src/
  components/   Home page sections (Hero, About, Experience, Skills, ...)
  pages/        Route-level pages (TreksPage for /treks)
  data/         profile.json — single source of truth for content
  assets/       Images
public/         Static files copied as-is (favicons, _redirects)
```

## Deployment

Deployed on Netlify at [imsoumya.netlify.app](https://imsoumya.netlify.app):

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- `public/_redirects` handles the SPA fallback so deep links like `/treks`
  don't 404 on refresh or direct visit.
