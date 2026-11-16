export type Category = 'ai' | 'quant' | 'systems';
export type ProjectFilter = 'all' | Category;

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  category: Category;
  tag: string;
  date: string;
  description: string;
  stack: string[];
  link?: Link;
}

export interface FeaturedProject {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  metrics: { label: string; value: string; accent?: boolean }[];
}

export interface Role {
  title: string;
  company: string;
  start: string;
  end: string | null;
  location: string;
  summary: string;
  current?: boolean;
  /** Either grouped highlights (cards) or a flat bullet list. */
  groups?: { name: string; bullets: string[] }[];
  bullets?: string[];
}

export interface Education {
  degree: string;
  school: string;
  start: string;
  end: string;
  note: string;
}

export interface SkillGroup {
  name: string;
  note: string;
  items: string[];
  wide?: boolean;
}

export interface Publication {
  id: string;
  year: number;
  venueShort: string;
  title: string;
  authors: string[];
  me: string;
  venue: string;
  abstract: string;
  bibtexType: 'inproceedings' | 'thesis';
  bibtexKey: string;
  bibtexFields: Record<string, string>;
  links: Link[];
}

export interface Award {
  year: number;
  contest: string;
  note: string;
  result: string;
  /** Short headline for the highlight cards, e.g. "Silver". */
  big?: string;
  featured?: boolean;
  /** Organiser logo for the highlight card, served from /public/logos. */
  logo?: { src: string; alt: string };
}
