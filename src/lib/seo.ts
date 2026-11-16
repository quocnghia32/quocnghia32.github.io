import { profile } from '../data/profile';

/** Deployed origin. Must match `site` in astro.config.mjs. */
export const SITE = 'https://quocnghia32.github.io';

export const OG_IMAGE = {
  url: `${SITE}/og.png`,
  width: 1200,
  height: 630,
  alt: 'Nguyen Quoc Nghia, AI Engineer at MoMo: portfolio preview',
};

/**
 * Absolute canonical URL. GitHub Pages 301-redirects `/projects` to `/projects/`,
 * so canonicals, sitemap entries and internal links all use the trailing-slash form.
 */
export function canonicalUrl(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${SITE}/${clean}/` : `${SITE}/`;
}

/** WebSite (site name) + ProfilePage/Person (who this is) for the home page. */
export function structuredData() {
  const home = canonicalUrl('/');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        url: home,
        name: profile.name,
        alternateName: [profile.logo, 'Nguyễn Quốc Nghĩa'],
      },
      {
        '@type': 'ProfilePage',
        '@id': `${home}#profile`,
        url: home,
        name: `${profile.name} · AI Engineer at MoMo`,
        mainEntity: {
          '@type': 'Person',
          '@id': `${home}#person`,
          name: profile.name,
          alternateName: ['Nguyễn Quốc Nghĩa', 'Quoc-Nghia Nguyen', 'Nghia Nguyen'],
          url: home,
          image: `${SITE}/images/portrait.jpg`,
          jobTitle: 'AI Engineer',
          description:
            'AI Engineer at MoMo building LLM agents, LLM-as-a-judge evaluation and agent infrastructure. B.Sc. in Computer Science (APCS), University of Science, VNU-HCM.',
          worksFor: { '@type': 'Organization', name: 'MoMo', url: 'https://www.momo.vn/' },
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: 'University of Science, Vietnam National University Ho Chi Minh City',
          },
          address: { '@type': 'PostalAddress', addressLocality: 'Ho Chi Minh City', addressCountry: 'VN' },
          knowsAbout: ['LLM agents', 'LLM evaluation', 'Retrieval-augmented generation', 'Kubernetes', 'Competitive programming'],
          sameAs: [profile.links.github, profile.links.linkedin],
        },
      },
    ],
  };
}
