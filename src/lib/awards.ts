import type { Award } from '../data/types';
import { pad2 } from './format';

/** Newest first, like a judge status page; #01 is the oldest submission. Ties keep input order. */
export function buildLog(list: readonly Award[]): (Award & { n: string })[] {
  const sorted = list
    .map((a, i) => ({ a, i }))
    .sort((x, y) => y.a.year - x.a.year || x.i - y.i)
    .map(({ a }) => a);
  return sorted.map((a, i) => ({ ...a, n: pad2(sorted.length - i) }));
}

export function topAwards(list: readonly Award[]): Award[] {
  return list.filter((a) => a.featured);
}
