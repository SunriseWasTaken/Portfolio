# Aria Voss — Portfolio

A cinematic, interactive portfolio experience — built to feel like a product, not a page.

It opens on a fullscreen typographic hero with layered parallax and restrained glitch,
scrolls as one continuous story, and lets you expand any project into a fullscreen,
shared-element case study without ever leaving the page.

## Highlights

- **Layered hero** — a solid, gradient-filled identity in front of a much larger
  outlined duplicate. Both react to the pointer with independent parallax and
  perspective, and separate on scroll to reveal the content beneath.
- **Living background** — drifting gradient orbs, an animated grid, a canvas
  particle constellation that parallaxes to the cursor, a vignette, and fine noise.
- **Floating project cards** — hover to zoom the preview, glow the border, deepen
  the shadow, and shift the typography.
- **Shared-element project views** — clicking a card expands it in place into a
  fullscreen case study (overview, problem, solution, process, challenges, features,
  tech, gallery, timeline, links). No page reload — just a new layer of the same
  experience.
- **Animated About timeline** — milestones (education, internships, hackathons,
  work, independent) reveal alternately along a spine that fills as you scroll.
- **Interactive skills network** — technologies as connected nodes; hover one to
  highlight related skills and the projects that shipped them.
- **Terminal contact** — a developer-terminal interface with a fully accessible,
  functional contact form (composes a `mailto:` message on submit).
- **Considered motion** — a custom cursor, smooth inertial scrolling (Lenis),
  GSAP-scrubbed transitions, and a full `prefers-reduced-motion` fallback.

## Tech

- [Next.js 14](https://nextjs.org/) (App Router, static export)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP + ScrollTrigger](https://gsap.com/) — pinned/scrubbed timeline animations
- [Framer Motion](https://www.framer.com/motion/) — interface + shared-element transitions
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # static site emitted to ./out
```

The site is a fully static export (`output: "export"`), so it can be hosted on any
static host. A `netlify.toml` is included (`publish = "out"`).

## Customising

All content lives in [`lib/data.ts`](lib/data.ts) — profile, projects, milestones,
and skills. Cover/gallery art is generated as inline SVG so the site has zero
external image dependencies. Swap in real screenshots by replacing the `cover` and
`gallery` fields with image paths under `public/`.
