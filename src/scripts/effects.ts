/** Cards with [data-spotlight] get --x/--y so a CSS radial glow follows the pointer. */
export function initSpotlight(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-spotlight]')) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - r.left}px`);
      el.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  }
}

/** Frosted-glass header once the page is scrolled. */
export function initHeaderScroll(win: Window, header: HTMLElement | null, threshold = 8): void {
  if (!header) return;
  const update = () => (header.dataset.scrolled = String(win.scrollY > threshold));
  win.addEventListener('scroll', update, { passive: true });
  update();
}

/** Blur-in reveal for [data-reveal]; without IntersectionObserver everything shows at once. */
export function initReveal(root: ParentNode, IO: typeof IntersectionObserver | undefined): void {
  const els = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (!IO) {
    for (const el of els) el.classList.add('is-visible');
    return;
  }
  const io = new IO(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  for (const el of els) io.observe(el);
}

