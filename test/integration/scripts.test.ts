// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, type Route } from './render';
import { initProjectFilter } from '../../src/scripts/projects-filter';
import { initPubToggles } from '../../src/scripts/publications';
import { defaultNavigate, initContactForm, initCopy } from '../../src/scripts/contact';
import { initHeaderScroll, initReveal, initSpotlight } from '../../src/scripts/effects';
import { initAll } from '../../src/scripts/main';

async function mount(route: Route) {
  const html = await render(route);
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  document.body.innerHTML = parsed.body.innerHTML;
}

const visible = (el: Element) => !(el as HTMLElement).hidden;

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('project filter on the rendered /projects page', () => {
  beforeEach(() => mount('/projects'));

  it('shows only quant projects and hides the featured thesis', () => {
    initProjectFilter(document);
    (document.querySelector('[data-filter="quant"]') as HTMLButtonElement).click();
    const shown = [...document.querySelectorAll('[data-project]')].filter(visible);
    expect(shown.length).toBe(2);
    for (const c of shown) expect(c.getAttribute('data-category')).toBe('quant');
    expect(visible(document.querySelector('[data-featured]')!)).toBe(false);
    expect(document.querySelector('[data-filter="quant"]')!.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('[data-filter="all"]')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('brings everything back on "all" and keeps the thesis for "ai"', () => {
    initProjectFilter(document);
    (document.querySelector('[data-filter="systems"]') as HTMLButtonElement).click();
    (document.querySelector('[data-filter="ai"]') as HTMLButtonElement).click();
    expect(visible(document.querySelector('[data-featured]')!)).toBe(true);
    (document.querySelector('[data-filter="all"]') as HTMLButtonElement).click();
    expect([...document.querySelectorAll('[data-project]')].every(visible)).toBe(true);
  });

  it('hides a whole group when none of its cards match', () => {
    initProjectFilter(document);
    const main = document.querySelector('[data-project-group="main"]') as HTMLElement;
    const fun = document.querySelector('[data-project-group="fun"]') as HTMLElement;
    (document.querySelector('[data-filter="ai"]') as HTMLButtonElement).click();
    expect(fun.hidden).toBe(true);
    expect(main.hidden).toBe(false);
    (document.querySelector('[data-filter="quant"]') as HTMLButtonElement).click();
    expect(main.hidden).toBe(true);
    expect(fun.hidden).toBe(false);
  });

  it('is a no-op on pages without filters', () => {
    document.body.innerHTML = '<p>nothing</p>';
    expect(() => initProjectFilter(document)).not.toThrow();
  });
});

describe('publication toggles on /publications', () => {
  beforeEach(() => mount('/publications'));

  it('opens and closes the abstract and bibtex panels independently', () => {
    initPubToggles(document);
    const absBtn = document.querySelector('[aria-controls="abs-soict2024"]') as HTMLButtonElement;
    const bibBtn = document.querySelector('[aria-controls="bib-soict2024"]') as HTMLButtonElement;
    absBtn.click();
    expect(absBtn.getAttribute('aria-expanded')).toBe('true');
    expect(visible(document.getElementById('abs-soict2024')!)).toBe(true);
    expect(visible(document.getElementById('bib-soict2024')!)).toBe(false);
    bibBtn.click();
    expect(visible(document.getElementById('bib-soict2024')!)).toBe(true);
    absBtn.click();
    expect(absBtn.getAttribute('aria-expanded')).toBe('false');
    expect(visible(document.getElementById('abs-soict2024')!)).toBe(false);
  });
});

describe('contact page', () => {
  beforeEach(() => mount('/contact'));

  it('copies the email and resets the label', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    initCopy(document, { writeText, resetMs: 1000 });
    const btn = document.querySelector('[data-copy]') as HTMLButtonElement;
    const before = btn.textContent!.trim();
    btn.click();
    await vi.runAllTicks();
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith('nguyennghia3224.work@gmail.com');
    expect(btn.textContent!.trim()).toBe('Copied ✓');
    vi.advanceTimersByTime(1000);
    expect(btn.textContent!.trim()).toBe(before);
  });

  it('reports a copy failure instead of throwing', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    initCopy(document, { writeText, resetMs: 10 });
    const btn = document.querySelector('[data-copy]') as HTMLButtonElement;
    btn.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(btn.textContent!.trim()).toBe('Copy failed');
  });

  it('shows inline errors on an empty submit and does not navigate', () => {
    const navigate = vi.fn();
    initContactForm(document, navigate);
    const form = document.querySelector('[data-contact]') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(navigate).not.toHaveBeenCalled();
    expect(document.querySelector('[data-error-for="name"]')!.textContent).toMatch(/name/);
    expect(document.getElementById('c-email')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('opens a filled mailto on a valid submit and clears errors', () => {
    const navigate = vi.fn();
    initContactForm(document, navigate);
    const form = document.querySelector('[data-contact]') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    (document.getElementById('c-name') as HTMLInputElement).value = 'An';
    (document.getElementById('c-email') as HTMLInputElement).value = 'an@x.io';
    (document.getElementById('c-message') as HTMLTextAreaElement).value = 'Hello';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toMatch(/^mailto:nguyennghia3224\.work@gmail\.com\?subject=/);
    expect(document.querySelector('[data-error-for="name"]')!.textContent).toBe('');
    expect(document.getElementById('c-email')!.hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('mailto navigation', () => {
  it('hands the URL to the test hook when one is installed', () => {
    const seen: string[] = [];
    (window as unknown as { __onMailto?: (u: string) => void }).__onMailto = (u) => seen.push(u);
    defaultNavigate('mailto:a@b.co');
    expect(seen).toEqual(['mailto:a@b.co']);
    delete (window as unknown as { __onMailto?: unknown }).__onMailto;
  });

  it('falls back to location.assign', () => {
    const assign = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
    defaultNavigate('mailto:a@b.co');
    expect(assign).toHaveBeenCalledWith('mailto:a@b.co');
    assign.mockRestore();
  });

  it('does nothing on pages without the contact form', () => {
    document.body.innerHTML = '<p>no form</p>';
    expect(() => initContactForm(document, vi.fn())).not.toThrow();
  });
});

describe('effects', () => {
  it('moves the spotlight with the pointer', async () => {
    await mount('/projects');
    initSpotlight(document);
    const card = document.querySelector('[data-spotlight]') as HTMLElement;
    card.getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 50 } as DOMRect);
    card.dispatchEvent(new PointerEvent('pointermove', { clientX: 60, clientY: 45, bubbles: true }));
    expect(card.style.getPropertyValue('--x')).toBe('50px');
    expect(card.style.getPropertyValue('--y')).toBe('25px');
  });

  it('marks the header as scrolled past the threshold', async () => {
    await mount('/');
    const header = document.querySelector('[data-site-header]') as HTMLElement;
    initHeaderScroll(window, header);
    Object.defineProperty(window, 'scrollY', { value: 40, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(header.dataset.scrolled).toBe('true');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(header.dataset.scrolled).toBe('false');
  });

  it('reveals elements when they intersect', async () => {
    await mount('/skills');
    let callback: IntersectionObserverCallback = () => {};
    const observe = vi.fn();
    const unobserve = vi.fn();
    class FakeIO {
      constructor(cb: IntersectionObserverCallback) { callback = cb; }
      observe = observe;
      unobserve = unobserve;
      disconnect() {}
    }
    initReveal(document, FakeIO as unknown as typeof IntersectionObserver);
    const els = [...document.querySelectorAll('[data-reveal]')];
    expect(observe).toHaveBeenCalledTimes(els.length);
    callback([{ isIntersecting: true, target: els[0] } as unknown as IntersectionObserverEntry, { isIntersecting: false, target: els[1] } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(els[0].classList.contains('is-visible')).toBe(true);
    expect(els[1].classList.contains('is-visible')).toBe(false);
    expect(unobserve).toHaveBeenCalledWith(els[0]);
  });

  it('reveals everything immediately without IntersectionObserver', async () => {
    await mount('/skills');
    initReveal(document, undefined);
    expect([...document.querySelectorAll('[data-reveal]')].every((e) => e.classList.contains('is-visible'))).toBe(true);
  });
});

describe('main wiring', () => {
  it('initialises every behaviour on astro:page-load', async () => {
    await mount('/projects');
    initAll();
    (document.querySelector('[data-filter="quant"]') as HTMLButtonElement).click();
    expect(document.querySelector('[data-filter="quant"]')!.getAttribute('aria-pressed')).toBe('true');
  });
});
