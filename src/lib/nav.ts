export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/experience/', label: 'Experience' },
  { href: '/projects/', label: 'Projects' },
  { href: '/skills/', label: 'Skills' },
  { href: '/publications/', label: 'Publications' },
  { href: '/awards/', label: 'Awards' },
  { href: '/contact/', label: 'Contact' },
];

export function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Home is active only on "/"; other items match their route and anything below it. */
export function isActive(currentPath: string, href: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(target + '/');
}
