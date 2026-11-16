import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, isActive, normalizePath } from '../../src/lib/nav';
import { CATEGORY_FILTERS, filterProjects, numberProjects, showsFeatured } from '../../src/lib/projects';
import { pad2, formatMonth, formatRange } from '../../src/lib/format';
import { buildLog, topAwards } from '../../src/lib/awards';
import { splitAuthors, toBibtex } from '../../src/lib/publications';
import { buildMailto, validateMessage } from '../../src/lib/contact';
import { CONTACT_ROWS, SOCIALS, iconFor } from '../../src/lib/socials';
import { SITE, canonicalUrl, structuredData } from '../../src/lib/seo';
import type { Award, Project, Publication } from '../../src/data/types';

const p = (slug: string, category: Project['category']): Project => ({
  slug, title: slug, category, tag: '', date: '', description: '', stack: [],
});

describe('nav', () => {
  it('lists the seven routes in order', () => {
    expect(NAV_ITEMS.map((n) => n.href)).toEqual([
      '/', '/experience/', '/projects/', '/skills/', '/publications/', '/awards/', '/contact/',
    ]);
  });

  it('normalizes trailing slashes and empty paths', () => {
    expect(normalizePath('/projects/')).toBe('/projects');
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
  });

  it('marks home active only on the exact root', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/projects', '/')).toBe(false);
  });

  it('marks a section active on its route and sub-routes', () => {
    expect(isActive('/projects/', '/projects')).toBe(true);
    expect(isActive('/projects/angi', '/projects')).toBe(true);
    expect(isActive('/projectsx', '/projects')).toBe(false);
    expect(isActive('/skills', '/projects')).toBe(false);
  });
});

describe('projects', () => {
  const list = [p('a', 'ai'), p('b', 'quant'), p('c', 'systems'), p('d', 'ai')];

  it('exposes all/ai/systems/quant filters, quant last', () => {
    expect(CATEGORY_FILTERS.map((f) => f.id)).toEqual(['all', 'ai', 'systems', 'quant']);
  });

  it('returns every project for "all"', () => {
    expect(filterProjects(list, 'all')).toHaveLength(4);
  });

  it('filters by category without mutating the input', () => {
    expect(filterProjects(list, 'ai').map((x) => x.slug)).toEqual(['a', 'd']);
    expect(filterProjects(list, 'quant').map((x) => x.slug)).toEqual(['b']);
    expect(list).toHaveLength(4);
  });

  it('numbers projects with two digits starting after the featured one', () => {
    expect(numberProjects(list).map((x) => x.num)).toEqual(['02', '03', '04', '05']);
    expect(numberProjects(list, 1)[0].num).toBe('01');
  });

  it('shows the featured thesis only for all and ai', () => {
    expect(showsFeatured('all')).toBe(true);
    expect(showsFeatured('ai')).toBe(true);
    expect(showsFeatured('quant')).toBe(false);
    expect(showsFeatured('systems')).toBe(false);
  });
});

describe('format', () => {
  it('pads numbers to two digits', () => {
    expect(pad2(3)).toBe('03');
    expect(pad2(12)).toBe('12');
  });

  it('formats yyyy-mm months', () => {
    expect(formatMonth('2026-02')).toBe('Feb 2026');
    expect(formatMonth('2025-12')).toBe('Dec 2025');
  });

  it('rejects malformed months', () => {
    expect(() => formatMonth('2026-13')).toThrow();
    expect(() => formatMonth('Feb 2026')).toThrow();
  });

  it('formats ranges, using "now" for open-ended roles', () => {
    expect(formatRange('2026-02', null)).toBe('Feb 2026 → now');
    expect(formatRange('2025-08', '2026-01')).toBe('Aug 2025 → Jan 2026');
  });
});

describe('awards', () => {
  const list: Award[] = [
    { year: 2021, contest: 'old', note: '', result: 'x' },
    { year: 2025, contest: 'new', note: '', result: 'y', featured: true, big: 'Y' },
    { year: 2022, contest: 'mid', note: '', result: 'z', featured: true, big: 'Z' },
  ];

  it('builds a newest-first log numbered from the oldest', () => {
    const log = buildLog(list);
    expect(log.map((l) => l.contest)).toEqual(['new', 'mid', 'old']);
    expect(log.map((l) => l.n)).toEqual(['03', '02', '01']);
  });

  it('keeps input order for awards in the same year', () => {
    const same: Award[] = [
      { year: 2022, contest: 'first', note: '', result: '' },
      { year: 2022, contest: 'second', note: '', result: '' },
    ];
    expect(buildLog(same).map((l) => l.contest)).toEqual(['first', 'second']);
  });

  it('returns featured awards in their original order', () => {
    expect(topAwards(list).map((a) => a.contest)).toEqual(['new', 'mid']);
  });
});

describe('publications', () => {
  const pub: Publication = {
    id: 'x', year: 2024, venueShort: 'V', title: 'A {Title}', authors: ['Ann Lee', 'Me Too', 'Bo Chen'], me: 'Me Too',
    venue: 'v', abstract: 'a', bibtexType: 'inproceedings', bibtexKey: 'k1',
    bibtexFields: { booktitle: 'Conf', pages: '1--2' }, links: [],
  };

  it('splits authors around my name', () => {
    expect(splitAuthors(pub.authors, 'Me Too')).toEqual({ before: 'Ann Lee, ', me: 'Me Too', after: ', Bo Chen' });
  });

  it('handles me being first, last or alone', () => {
    expect(splitAuthors(['Me', 'B'], 'Me')).toEqual({ before: '', me: 'Me', after: ', B' });
    expect(splitAuthors(['A', 'Me'], 'Me')).toEqual({ before: 'A, ', me: 'Me', after: '' });
    expect(splitAuthors(['Me'], 'Me')).toEqual({ before: '', me: 'Me', after: '' });
  });

  it('throws when I am not an author', () => {
    expect(() => splitAuthors(['A'], 'Me')).toThrow(/Me/);
  });

  it('renders BibTeX with "Last, First" authors and aligned fields', () => {
    const bib = toBibtex(pub);
    expect(bib.startsWith('@inproceedings{k1,\n')).toBe(true);
    expect(bib).toContain('author    = {Lee, Ann and Too, Me and Chen, Bo}');
    expect(bib).toContain('title     = {A {Title}}');
    expect(bib).toContain('booktitle = {Conf}');
    expect(bib).toContain('year      = {2024}');
    expect(bib.trim().endsWith('}')).toBe(true);
  });

  it('keeps hyphenated given names intact', () => {
    const bib = toBibtex({ ...pub, authors: ['Quoc-Nghia Nguyen'], me: 'Quoc-Nghia Nguyen' });
    expect(bib).toContain('{Nguyen, Quoc-Nghia}');
  });
});

describe('contact', () => {
  it('builds an encoded mailto link', () => {
    const url = buildMailto('me@x.dev', { name: 'An Le', email: 'an@y.com', message: 'Hi & bye\nline2' });
    expect(url.startsWith('mailto:me@x.dev?')).toBe(true);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toBe('Portfolio message from An Le');
    expect(params.get('body')).toBe('Hi & bye\nline2\n\nAn Le <an@y.com>');
    expect(url).not.toContain('+');
  });

  it('validates required fields and email shape', () => {
    expect(validateMessage({ name: '', email: 'bad', message: ' ' })).toEqual({
      name: 'Please tell me your name.',
      email: 'Please enter a valid email.',
      message: 'Please write a message.',
    });
    expect(validateMessage({ name: 'A', email: 'a@b.co', message: 'hi' })).toEqual({});
  });
});

describe('socials', () => {
  it('lists github, linkedin and email in that order (no Codeforces)', () => {
    expect(SOCIALS.map((s) => s.id)).toEqual(['github', 'linkedin', 'email']);
  });

  it('gives every social an svg path and an accessible label', () => {
    for (const s of SOCIALS) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(iconFor(s.id).path.length).toBeGreaterThan(10);
    }
  });

  it('contact rows skip email, which already has its own copy box', () => {
    expect(CONTACT_ROWS.map((s) => s.id)).toEqual(['github', 'linkedin']);
  });

  it('points email at a mailto link', () => {
    expect(SOCIALS.find((s) => s.id === 'email')!.href.startsWith('mailto:')).toBe(true);
  });

  it('throws on an unknown icon id', () => {
    // @ts-expect-error testing a bad id on purpose
    expect(() => iconFor('myspace')).toThrow();
  });
});

describe('seo', () => {
  it('builds absolute canonical URLs with the trailing slash GitHub Pages redirects to', () => {
    expect(SITE).toBe('https://quocnghia32.github.io');
    expect(canonicalUrl('/')).toBe('https://quocnghia32.github.io/');
    expect(canonicalUrl('/projects')).toBe('https://quocnghia32.github.io/projects/');
    expect(canonicalUrl('/projects/')).toBe('https://quocnghia32.github.io/projects/');
    expect(canonicalUrl('')).toBe('https://quocnghia32.github.io/');
  });

  it('describes the site and the person as a WebSite + ProfilePage graph', () => {
    const data = structuredData();
    expect(data['@context']).toBe('https://schema.org');
    const types = data['@graph'].map((n) => n['@type']);
    expect(types).toEqual(['WebSite', 'ProfilePage']);
    const site = data['@graph'][0];
    expect(site.url).toBe('https://quocnghia32.github.io/');
    expect(site.name).toBe('Nguyen Quoc Nghia');
    const person = data['@graph'][1].mainEntity;
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Nguyen Quoc Nghia');
    expect(person.alternateName).toContain('Nguyễn Quốc Nghĩa');
    expect(person.jobTitle).toBe('AI Engineer');
    expect(person.worksFor.name).toBe('MoMo');
    expect(person.alumniOf.name).toMatch(/University of Science/);
    expect(person.image).toBe('https://quocnghia32.github.io/images/portrait.jpg');
    expect(person.sameAs).toEqual(['https://github.com/quocnghia32', 'https://www.linkedin.com/in/quocnghia32/']);
  });
});
