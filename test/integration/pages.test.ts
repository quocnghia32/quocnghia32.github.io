// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { PAGES, render, type Route } from './render';
import { projects } from '../../src/data/projects';
import { awards } from '../../src/data/awards';
import { skillGroups } from '../../src/data/skills';
import { publications } from '../../src/data/publications';

async function dom(route: Route): Promise<Document> {
  const html = await render(route);
  return new DOMParser().parseFromString(html, 'text/html');
}

const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('every route', () => {
  for (const route of Object.keys(PAGES) as Route[]) {
    it(`${route} renders the shared shell with the right tab active`, async () => {
      const d = await dom(route);
      expect(d.documentElement.lang).toBe('en');
      expect(d.title).toMatch(/Nguyen Quoc Nghia/);
      expect(text(d.querySelector('[data-logo]'))).toBe('nghia.nq');
      const links = [...d.querySelectorAll('nav[aria-label="Primary"] [data-nav-link]')];
      expect(links).toHaveLength(7);
      const current = links.filter((a) => a.getAttribute('aria-current') === 'page');
      expect(current).toHaveLength(1);
      expect(current[0].getAttribute('href')).toBe(route);
      expect(d.querySelectorAll('main')).toHaveLength(1);
      expect(d.querySelectorAll('h1')).toHaveLength(1);
      expect(d.querySelector('footer')).not.toBeNull();
      expect(text(d.querySelector('footer'))).not.toContain('built with Astro');
      expect(text(d.querySelector('footer'))).toContain('AI Engineer @ MoMo · Ho Chi Minh City, Vietnam');
      expect(d.querySelector('a[href*="codeforces"]')).toBeNull();
      expect(d.querySelector('meta[name="description"]')?.getAttribute('content')?.length).toBeGreaterThan(20);
    });
  }
});

describe('404', () => {
  it('renders a not-found page with a way back home and no active tab', async () => {
    const { experimental_AstroContainer } = await import('astro/container');
    const NotFound = (await import('../../src/pages/404.astro')).default;
    const c = await experimental_AstroContainer.create();
    const html = await c.renderToString(NotFound, { request: new Request('http://localhost/nope') });
    const d = new DOMParser().parseFromString(html, 'text/html');
    expect(text(d.querySelector('h1'))).toContain('404');
    expect(d.querySelector('main a[href="/"]')).not.toBeNull();
    expect(d.querySelectorAll('[aria-current="page"]')).toHaveLength(0);
  });
});

describe('home', () => {
  it('keeps the hero short: name, role, one-line bio, CTAs, logo socials', async () => {
    const d = await dom('/');
    expect(text(d.querySelector('h1'))).toContain('Quoc Nghia');
    expect(text(d.body)).not.toMatch(/latency|18s/i);
    const socials = [...d.querySelectorAll('[data-socials] a')];
    expect(socials.map((a) => a.getAttribute('aria-label'))).toEqual(['GitHub', 'LinkedIn', 'Email']);
    for (const a of socials) expect(a.querySelector('svg path')).not.toBeNull();
    expect(d.querySelector('a[href="/projects"]')).not.toBeNull();
    expect(d.querySelector('a[href="/cv.pdf"]')?.hasAttribute('download')).toBe(true);
  });

  it('splits strengths into an AI column and a Software column, three each', async () => {
    const d = await dom('/');
    const cols = [...d.querySelectorAll('[data-strength-col]')];
    expect(cols.map((c) => c.getAttribute('data-strength-col'))).toEqual(['ai', 'sw']);
    const titles = (c: Element) => [...c.querySelectorAll('[data-strength] h3')].map((h) => text(h));
    expect(titles(cols[0])).toEqual(['Agentic AI', 'Evaluation', 'Memory & harness']);
    expect(titles(cols[1])).toEqual(['Shipping to production', 'Scalable systems', 'Reliable by design']);
    for (const el of d.querySelectorAll('[data-strength]')) expect(text(el.querySelector('p')).length).toBeGreaterThan(20);
    const venn = d.querySelector('[data-venn]');
    expect(venn?.getAttribute('role')).toBe('img');
    expect(venn?.getAttribute('aria-label')).toMatch(/AI.*software/i);
    expect(venn?.querySelector('[data-lens]')).not.toBeNull();
    expect([...venn!.querySelectorAll('[data-venn-part]')].map((e) => e.getAttribute('data-venn-part'))).toEqual(['ai', 'sw', 'both']);
    expect(d.querySelector('[data-fact]')).toBeNull();
  });

  it('hero bio covers school, APCS, current role, MoMo work and strengths', async () => {
    const d = await dom('/');
    const bio = text(d.querySelector('[data-bio]'));
    for (const must of ['University of Science', 'APCS', 'AI Engineer', 'MoMo', 'agentic AI', 'evaluation', 'memory', 'harness', 'production', 'scalable', 'reliable']) {
      expect(bio).toContain(must);
    }
  });

  it('shows the portrait with fixed dimensions and alt text, with the terminal card beside it', async () => {
    const d = await dom('/');
    const img = d.querySelector('[data-hero-visual] img[data-portrait]');
    expect(img?.getAttribute('src')).toBe('/images/portrait.jpg');
    expect(img?.getAttribute('alt')).toMatch(/Nguyen Quoc Nghia/);
    expect(img?.getAttribute('width')).toBe('800');
    expect(img?.getAttribute('height')).toBe('1000');
    expect(d.querySelector('[data-hero-visual] [data-terminal]')).not.toBeNull();
  });

  it('shows a two-command terminal card', async () => {
    const d = await dom('/');
    expect(d.querySelectorAll('[data-terminal] [data-cmd]')).toHaveLength(2);
  });
});

describe('projects', () => {
  it('renders filters, the featured thesis and one card per project', async () => {
    const d = await dom('/projects');
    expect([...d.querySelectorAll('[data-filter]')].map((b) => b.getAttribute('data-filter'))).toEqual(['all', 'ai', 'systems', 'quant']);
    expect(d.querySelector('[data-filter="all"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(text(d.querySelector('[data-featured]'))).toContain('PoTKD');
    const cards = d.querySelectorAll('[data-project]');
    expect(cards).toHaveLength(projects.length);
    expect(text(cards[0])).toContain('02');
  });

  it('groups projects into main work and a "built for fun" quant group', async () => {
    const d = await dom('/projects');
    const groups = [...d.querySelectorAll('[data-project-group]')];
    expect(groups.map((g) => g.getAttribute('data-project-group'))).toEqual(['main', 'fun']);
    expect([...groups[1].querySelectorAll('[data-project]')].every((c) => c.getAttribute('data-category') === 'quant')).toBe(true);
    expect([...groups[0].querySelectorAll('[data-project]')].some((c) => c.getAttribute('data-category') === 'quant')).toBe(false);
    expect(text(groups[1].querySelector('h2'))).toMatch(/fun/i);
  });

  it('puts the side-project quant strategies last', async () => {
    const d = await dom('/projects');
    const cats = [...d.querySelectorAll('[data-project]')].map((c) => c.getAttribute('data-category'));
    const firstQuant = cats.indexOf('quant');
    expect(firstQuant).toBeGreaterThan(0);
    expect(cats.slice(firstQuant).every((c) => c === 'quant')).toBe(true);
  });

  it('links out only where a project has a public link, opening in a new tab', async () => {
    const d = await dom('/projects');
    const outbound = [...d.querySelectorAll('[data-project] a[href^="http"]')];
    expect(outbound).toHaveLength(projects.filter((p) => p.link).length);
    for (const a of outbound) expect(a.getAttribute('rel')).toContain('noopener');
  });
});

describe('experience', () => {
  it('lists both MoMo roles newest first, then education', async () => {
    const d = await dom('/experience');
    const items = [...d.querySelectorAll('[data-timeline] > li')];
    expect(items).toHaveLength(3);
    expect(text(items[0])).toContain('AI Engineer I');
    expect(text(items[0])).toContain('Feb 2026 → now');
    expect(text(items[1])).toContain('Aug 2025 → Jan 2026');
    expect(text(items[2])).toContain('University of Science');
    expect(items[0].querySelectorAll('[data-group]')).toHaveLength(4);
  });
});

describe('skills', () => {
  it('renders every skill group and a decorative marquee', async () => {
    const d = await dom('/skills');
    expect(d.querySelectorAll('[data-skill-group]')).toHaveLength(skillGroups.length);
    expect(d.querySelector('[data-marquee]')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('publications', () => {
  it('renders each paper with my name highlighted and hidden abstract/bibtex panels', async () => {
    const d = await dom('/publications');
    const items = d.querySelectorAll('[data-pub]');
    expect(items).toHaveLength(publications.length);
    expect(text(items[0].querySelector('strong'))).toBe('Quoc-Nghia Nguyen');
    const bib = d.querySelector('#bib-soict2024');
    expect(bib?.hasAttribute('hidden')).toBe(true);
    expect(text(bib)).toContain('@inproceedings{mai2024aigen');
    expect(d.querySelector('[aria-controls="abs-soict2024"]')?.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('awards', () => {
  it('renders three highlight cards and a full judge log', async () => {
    const d = await dom('/awards');
    const top = [...d.querySelectorAll('[data-top-award]')];
    expect(top).toHaveLength(3);
    for (const card of top) expect(card.querySelector('svg[data-medal]')).not.toBeNull();
    expect(top.map((c) => c.querySelector('img[data-org-logo]')?.getAttribute('src') ?? null)).toEqual(['/logos/icpc.svg', '/logos/moet.svg', null]);
    for (const img of d.querySelectorAll('img[data-org-logo]')) expect(img.getAttribute('alt')!.length).toBeGreaterThan(2);
    const rows = d.querySelectorAll('[data-log] tbody tr');
    expect(rows).toHaveLength(awards.length);
    expect(text(rows[0])).toContain('2025');
    expect(text(rows[0])).toContain('Accepted');
    expect(d.querySelector('[data-log] .log-head')).toBeNull();
    expect(d.querySelector('[data-log] > .scroll > table > thead')).not.toBeNull();
  });
});

describe('contact', () => {
  it('has a labelled form, copy button and social rows with logos', async () => {
    const d = await dom('/contact');
    for (const id of ['c-name', 'c-email', 'c-message']) {
      expect(d.querySelector(`label[for="${id}"]`)).not.toBeNull();
      expect(d.getElementById(id)).not.toBeNull();
    }
    expect(d.querySelector('[data-copy]')?.getAttribute('data-copy')).toBe('nguyennghia3224.work@gmail.com');
    expect(d.querySelectorAll('[data-social-row] svg')).toHaveLength(2);
    expect(d.querySelector('[data-social-row][href^="mailto:"]')).toBeNull();
  });
});
