/**
 * Site-wide motion. Every effect here is decorative: content is fully visible
 * and usable without JavaScript, and nothing runs when the visitor has asked
 * their system for reduced motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

function smoothScroll() {
  const lenis = new Lenis({ lerp: 0.1, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Headings and statements rise in line by line. SplitText keeps an aria-label
 *  with the full text on the parent, so screen readers hear one sentence. */
function revealLines() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      // Headings take an aria-label; other elements get a screen-reader-only copy.
      aria: /^H[1-6]$/.test(el.tagName) ? 'auto' : 'hidden',
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}

function revealBlocks() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
  });
}

/** Home hero: the two halves of the wordmark drift apart and the photo opens up. */
function hero() {
  const heroEl = document.querySelector('[data-hero]');
  if (!heroEl) return;
  const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } });
  intro
    .from('[data-hero-word="left"]', { yPercent: 40, autoAlpha: 0 })
    .from('[data-hero-word="right"]', { yPercent: 40, autoAlpha: 0 }, '<0.1')
    .from('[data-hero-photo]', { clipPath: 'inset(18% 18% 18% 18% round 48px)', scale: 1.08 }, '<0.05');

  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } })
      .to('[data-hero-word="left"]', { xPercent: -18, ease: 'none' }, 0)
      .to('[data-hero-word="right"]', { xPercent: 18, ease: 'none' }, 0)
      .to('[data-hero-photo]', { scale: 1.12, yPercent: 8, ease: 'none' }, 0);
  });
}

/** Coloured bands start inset with rounded corners and open to full width. */
function bands() {
  document.querySelectorAll<HTMLElement>('[data-band]').forEach((band) => {
    const wrap = band.parentElement as HTMLElement;
    gsap.fromTo(
      wrap,
      { '--band-inset': 'clamp(1rem, 6vw, 6rem)' },
      { '--band-inset': '0px', ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'top 25%', scrub: true } }
    );
    gsap.fromTo(
      band,
      { '--band-radius': '48px' },
      { '--band-radius': '0px', ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'top 25%', scrub: true } }
    );
  });
}

/** Property photos open from a smaller rounded window, then drift gently on scroll. */
function grow() {
  const figs = gsap.utils.toArray<HTMLElement>('[data-grow]');
  if (!figs.length) return;
  gsap.from(figs, {
    clipPath: 'inset(12% 12% 12% 12% round 32px)',
    duration: 1.4,
    ease: 'expo.out',
    stagger: 0.12,
  });
  figs.forEach((fig) => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { scale: 1.08 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/** The gold line draws itself as the section scrolls past. */
function drawLines() {
  document.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path) => {
    const length = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('section'), start: 'top 80%', end: 'bottom 40%', scrub: true } }
    );
  });
}

function init() {
  if (reduced.matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  smoothScroll();
  hero();
  revealLines();
  revealBlocks();
  bands();
  grow();
  drawLines();
}

if (document.fonts?.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}

// If someone switches reduced motion on mid-visit, reload into the calm version.
reduced.addEventListener('change', () => window.location.reload());
