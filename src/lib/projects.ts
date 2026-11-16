import type { Project, ProjectFilter } from '../data/types';
import { pad2 } from './format';

export const CATEGORY_FILTERS: readonly { id: ProjectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & LLM' },
  { id: 'systems', label: 'Systems' },
  { id: 'quant', label: 'Quant' },
];

export function filterProjects(list: readonly Project[], filter: ProjectFilter): Project[] {
  return filter === 'all' ? [...list] : list.filter((p) => p.category === filter);
}

/** Numbering starts at 02 by default because the featured thesis is 01. */
export function numberProjects(list: readonly Project[], start = 2): (Project & { num: string })[] {
  return list.map((p, i) => ({ ...p, num: pad2(start + i) }));
}

/** The featured thesis is an AI project, so it shows under "All" and "AI & LLM". */
export function showsFeatured(filter: ProjectFilter): boolean {
  return filter === 'all' || filter === 'ai';
}
