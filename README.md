# Marvelous Living website

Multi-property website for Marvelous Living serviced apartments, Bengaluru.

Built with [Astro](https://astro.build), [GSAP](https://gsap.com) (ScrollTrigger, SplitText) and [Lenis](https://lenis.darkroom.engineering) smooth scrolling. Page-to-page morphs use the browser's native View Transitions.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Where things live

| What | File |
| --- | --- |
| Brand colours, type scale, buttons | `src/styles/global.css` |
| Properties (add a new stay here) | `src/data/properties.ts` |
| Site-wide copy, FAQ, stats | `src/data/site.ts` |
| Home | `src/pages/index.astro` |
| Stays list | `src/pages/stays/index.astro` |
| Property page template | `src/pages/stays/[slug].astro` |
| All animation | `src/scripts/motion.ts` |

## Photos

Photos are served from `public/images/` using the same file names as the current site
(`livingroom.webp`, `bedroom.webp`, `bedroom2.webp`, `tvunit.webp`, `interiordetail.webp`,
`dining.webp`, `kitchen.webp`, `kitchen2.webp`), converted from the photos on the current site. Higher-resolution originals (2000 px wide or more)
will make the large hero photos much sharper.

## Accessibility

- Target: WCAG 2.2 AA. Pages pass axe-core checks with no violations.
- All content is server-rendered and readable without JavaScript.
- With "reduce motion" switched on in the visitor's system settings, no scroll animation,
  smooth scrolling or page transition runs.
- Split-text animation keeps a single readable copy for screen readers.
- Hover effects also respond to keyboard focus; the photo viewer works with Esc and arrow keys.
