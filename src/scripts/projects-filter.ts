import { showsFeatured } from '../lib/projects';
import type { ProjectFilter } from '../data/types';

export function initProjectFilter(root: ParentNode): void {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  if (!buttons.length) return;
  const cards = [...root.querySelectorAll<HTMLElement>('[data-project]')];
  const featured = root.querySelector<HTMLElement>('[data-featured]');

  const apply = (filter: ProjectFilter) => {
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
    for (const c of cards) c.hidden = filter !== 'all' && c.dataset.category !== filter;
    if (featured) featured.hidden = !showsFeatured(filter);
    for (const g of root.querySelectorAll<HTMLElement>('[data-project-group]')) {
      g.hidden = ![...g.querySelectorAll<HTMLElement>('[data-project]')].some((c) => !c.hidden);
    }
  };

  for (const b of buttons) b.addEventListener('click', () => apply(b.dataset.filter as ProjectFilter));
}
