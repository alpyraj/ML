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
  window.addEventListener('menu:open', () => lenis.stop());
  window.addEventListener('menu:close', () => lenis.start());
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

/** Home hero: the photo eases in, the split wordmark rises from behind its
 *  mask, and on scroll the two words drift apart as the photo sinks away. */
function hero() {
  const heroEl = document.querySelector('[data-hero]');
  if (!heroEl) return;
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('[data-hero-media]', { clipPath: 'inset(12% 8% 12% 8%)', duration: 1.8 }, 0)
    .from('[data-hero-media] .slide.is-active', { scale: 1.3, duration: 2.6 }, 0)
    .from('[data-hero-rise]', { yPercent: 105, duration: 1.4, stagger: 0.14 }, 0.2)
    .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.8);

  // The wavy rust line starts as a short stroke on load, then draws itself
  // across the photo as the visitor scrolls (like the guest-section line).
  heroEl.querySelectorAll<SVGPathElement>('[data-hero-draw]').forEach((wave) => {
    const length = wave.getTotalLength();
    gsap.set(wave, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(wave, { strokeDashoffset: length * 0.85, duration: 1.4, ease: 'power2.out', delay: 0.8 });
    gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: '40% top', scrub: 0.6 } })
      .fromTo(wave, { strokeDashoffset: length * 0.85 }, { strokeDashoffset: 0, ease: 'none', immediateRender: false }, 0)
      .to(wave, { yPercent: -6, ease: 'none' }, 0);
  });

  gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } })
    .to('[data-hero-word="left"]', { xPercent: -18, ease: 'none' }, 0)
    .to('[data-hero-word="right"]', { xPercent: 18, ease: 'none' }, 0)
    .to('[data-hero-media]', { yPercent: 25, ease: 'none' }, 0)
    .to('[data-hero-fade]', { autoAlpha: 0, ease: 'none', duration: 0.5 }, 0);
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

/** The accent line draws itself as the section scrolls past. */
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
