import { initProjectFilter } from './projects-filter';
import { initPubToggles } from './publications';
import { initContactForm, initCopy } from './contact';
import { initHeaderScroll, initReveal, initSpotlight } from './effects';

/** Runs on every page load, including client-side navigations from the view-transition router. */
export function initAll(): void {
  initReveal(document, window.IntersectionObserver);
  initSpotlight(document);
  initHeaderScroll(window, document.querySelector<HTMLElement>('[data-site-header]'));
  initProjectFilter(document);
  initPubToggles(document);
  initCopy(document);
  initContactForm(document);
}
