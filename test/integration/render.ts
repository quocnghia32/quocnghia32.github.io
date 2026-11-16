import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Home from '../../src/pages/index.astro';
import Projects from '../../src/pages/projects.astro';
import Experience from '../../src/pages/experience.astro';
import Skills from '../../src/pages/skills.astro';
import Publications from '../../src/pages/publications.astro';
import Awards from '../../src/pages/awards.astro';
import Contact from '../../src/pages/contact.astro';

export const PAGES = {
  '/': Home,
  '/projects': Projects,
  '/experience': Experience,
  '/skills': Skills,
  '/publications': Publications,
  '/awards': Awards,
  '/contact': Contact,
} as const;

export type Route = keyof typeof PAGES;

let container: AstroContainer | undefined;

export async function render(route: Route): Promise<string> {
  container ??= await AstroContainer.create();
  return container.renderToString(PAGES[route], {
    request: new Request(`http://localhost${route}`),
  });
}
