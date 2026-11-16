import { siGithub } from 'simple-icons';
import { profile } from '../data/profile';

export type SocialId = 'github' | 'linkedin' | 'email';

export interface Icon {
  /** SVG path data on a 24×24 viewBox. */
  path: string;
  /** "fill" icons are brand marks; "stroke" icons are outline glyphs. */
  mode: 'fill' | 'stroke';
}

// simple-icons dropped LinkedIn, so this is a plain geometric "in" mark (rounded square, i, n).
const LINKEDIN =
  'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1.5 7.5V19h3V9.5h-3ZM7 4.75a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM10.5 9.5V19h3v-5c0-1.4.8-2.2 1.9-2.2 1.1 0 1.6.8 1.6 2.2v5h3v-5.7c0-2.7-1.4-4-3.5-4-1.4 0-2.4.6-3 1.5V9.5h-3Z';

const MAIL = 'M3 6.5h18v11H3z M3 7l9 6.5L21 7';

const ICONS: Record<SocialId, Icon> = {
  github: { path: siGithub.path, mode: 'fill' },
  linkedin: { path: LINKEDIN, mode: 'fill' },
  email: { path: MAIL, mode: 'stroke' },
};

export function iconFor(id: SocialId): Icon {
  const icon = ICONS[id];
  if (!icon) throw new Error(`Unknown icon: ${id}`);
  return icon;
}

export const SOCIALS: readonly { id: SocialId; label: string; handle: string; href: string }[] = [
  { id: 'github', label: 'GitHub', handle: 'quocnghia32', href: profile.links.github },
  { id: 'linkedin', label: 'LinkedIn', handle: '/in/quocnghia32', href: profile.links.linkedin },
  { id: 'email', label: 'Email', handle: profile.email, href: `mailto:${profile.email}` },
];

/** The hero's CONNECT row shows every social. */
export const HERO_SOCIALS = SOCIALS;

/** /contact already has a copy-email box, so its link rows skip email. */
export const CONTACT_ROWS = SOCIALS.filter((s) => s.id !== 'email');
