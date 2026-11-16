import type { Publication } from '../data/types';

export function splitAuthors(authors: readonly string[], me: string) {
  const i = authors.indexOf(me);
  if (i < 0) throw new Error(`${me} is not an author`);
  const before = authors.slice(0, i).join(', ');
  const after = authors.slice(i + 1).join(', ');
  return {
    before: before ? `${before}, ` : '',
    me,
    after: after ? `, ${after}` : '',
  };
}

/** "Quoc-Nghia Nguyen" → "Nguyen, Quoc-Nghia" (family name is the last word). */
function bibName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const last = parts.pop()!;
  return parts.length ? `${last}, ${parts.join(' ')}` : last;
}

export function toBibtex(pub: Publication): string {
  const fields: [string, string][] = [
    ['title', pub.title],
    ['author', pub.authors.map(bibName).join(' and ')],
    ...Object.entries(pub.bibtexFields),
    ['year', String(pub.year)],
  ];
  const width = Math.max(...fields.map(([k]) => k.length));
  const body = fields.map(([k, v]) => `  ${k.padEnd(width)} = {${v}}`).join(',\n');
  return `@${pub.bibtexType}{${pub.bibtexKey},\n${body}\n}`;
}
