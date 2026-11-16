import { expect, test, type Page } from '@playwright/test';

const EVIDENCE = 'test/e2e/evidence';
const ROUTES = [
  { path: '/', label: 'Home', h1: /Nguyen Quoc Nghia/ },
  { path: '/experience', label: 'Experience', h1: /Where I've worked/ },
  { path: '/projects', label: 'Projects', h1: /Things I've built/ },
  { path: '/skills', label: 'Skills', h1: /Toolbox/ },
  { path: '/publications', label: 'Publications', h1: /Research/ },
  { path: '/awards', label: 'Awards', h1: /Accepted/ },
  { path: '/contact', label: 'Contact', h1: /has to be right/ },
];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  // Reveal all [data-reveal] blocks and let the blur-in transitions finish before screenshots.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1400);
}

test.describe('every route', () => {
  for (const r of ROUTES) {
    test(`${r.path} renders, has one active tab and no errors`, async ({ page }, info) => {
      const errors = trackErrors(page);
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveAccessibleName(r.h1);
      const active = page.locator('nav[aria-label="Primary"] [aria-current="page"]');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveText(r.label);

      // No horizontal scrolling at any width.
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);

      await settle(page);
      const name = r.path === '/' ? 'home' : r.path.slice(1);
      await page.screenshot({ path: `${EVIDENCE}/${info.project.name}-${name}.png`, fullPage: true });
      expect(errors).toEqual([]);
    });
  }
});

test('nav moves between all seven routes', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const r of ROUTES.slice(1)) {
    await page.locator('nav[aria-label="Primary"]').getByRole('link', { name: r.label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${r.path}/?$`));
    await expect(page.locator('h1')).toHaveAccessibleName(r.h1);
  }
  await page.getByRole('link', { name: 'nghia.nq' }).click();
  await expect(page).toHaveURL(/\/$/);
  test.info().annotations.push({ type: 'viewport', description: isMobile ? 'mobile' : 'desktop' });
});

test('home: socials are logo buttons and the CV downloads', async ({ page }) => {
  await page.goto('/');
  const socials = page.locator('[data-socials] a');
  await expect(socials).toHaveCount(3);
  await expect(socials.nth(0)).toHaveAttribute('href', 'https://github.com/quocnghia32');
  await expect(socials.nth(1)).toHaveAttribute('href', 'https://www.linkedin.com/in/quocnghia32/');
  await expect(socials.nth(2)).toHaveAttribute('href', 'mailto:nguyennghia3224.work@gmail.com');
  for (let i = 0; i < 3; i++) await expect(socials.nth(i).locator('svg')).toBeVisible();
  await expect(page.locator('[data-socials]')).not.toContainText('Codeforces');

  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: 'Download CV' }).click()]);
  expect(download.suggestedFilename()).toBe('cv.pdf');
});

test('home: portrait loads above the fold', async ({ page, isMobile }) => {
  await page.goto('/');
  const img = page.locator('img[data-portrait]');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth === 800)).toBe(true);
  const box = (await img.boundingBox())!;
  if (!isMobile) expect(box.y).toBeLessThan(900);
  expect(box.width / box.height).toBeCloseTo(0.8, 1);
});

test('home: name blurs in letter by letter', async ({ page }) => {
  await page.goto('/');
  const firstLetter = page.locator('h1 .ch').first();
  await expect(firstLetter).toHaveCSS('animation-name', 'letter');
  await page.waitForTimeout(1600);
  await expect(firstLetter).toHaveCSS('filter', /^(none|blur\(0px\))$/);
  await expect(firstLetter).toHaveCSS('opacity', '1');
});

test('projects: filter chips show and hide cards', async ({ page }) => {
  await page.goto('/projects');
  await settle(page);
  await page.getByRole('button', { name: 'Quant' }).click();
  await expect(page.getByRole('button', { name: 'Quant' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project]:visible')).toHaveCount(2);
  await expect(page.locator('[data-featured]')).toBeHidden();
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-projects-filter-quant.png`, fullPage: true });
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.locator('[data-project]:visible')).toHaveCount(7);
  await expect(page.locator('[data-featured]')).toBeVisible();
});

test('hovering a card never blurs or dims the others', async ({ page, isMobile }) => {
  test.skip(isMobile, 'hover only applies to pointer devices');
  await page.goto('/projects');
  await settle(page);
  const cards = page.locator('[data-project]');
  await cards.nth(0).hover();
  await page.waitForTimeout(400);
  await expect(cards.nth(1)).toHaveCSS('filter', 'none');
  await expect(cards.nth(1)).toHaveCSS('opacity', '1');
  await page.goto('/');
  await settle(page);
  const notes = page.locator('[data-strength]');
  await notes.nth(0).hover();
  await page.waitForTimeout(400);
  await expect(notes.nth(1)).toHaveCSS('filter', 'none');
  await expect(notes.nth(1)).toHaveCSS('opacity', '1');
});

test('home: hovering a side of the Venn lights up that side and its notes', async ({ page, isMobile }) => {
  test.skip(isMobile, 'hover only applies to pointer devices');
  const BLUE = 'rgb(35, 72, 224)';
  await page.goto('/');
  await settle(page);
  const venn = page.locator('[data-venn]');
  await venn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const box = (await venn.boundingBox())!;
  const at = (x: number) => ({ x: box.x + (box.width * x) / 440, y: box.y + box.height / 2 });
  const aiTitle = page.locator('[data-strength-col="ai"] [data-strength] h3').first();
  const swTitle = page.locator('[data-strength-col="sw"] [data-strength] h3').first();

  await page.mouse.move(at(100).x, at(100).y);
  await expect(aiTitle).toHaveCSS('color', BLUE);
  // Notes light up in place; they must not slide.
  await page.waitForTimeout(500);
  await expect(page.locator('[data-strength-col="ai"] [data-strength]').first()).toHaveCSS('transform', 'none');
  await expect(swTitle).not.toHaveCSS('color', BLUE);
  await expect(page.locator('.ring-ai')).toHaveCSS('stroke', BLUE);
  await expect(swTitle).toHaveCSS('filter', 'none');
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-venn-hover-ai.png` });

  await page.mouse.move(at(340).x, at(340).y);
  await expect(swTitle).toHaveCSS('color', BLUE);
  await expect(aiTitle).not.toHaveCSS('color', BLUE);
  await expect(page.locator('.ring-sw')).toHaveCSS('stroke', BLUE);
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-venn-hover-sw.png` });

  await page.mouse.move(at(220).x, at(220).y);
  await expect(aiTitle).toHaveCSS('color', BLUE);
  await expect(swTitle).toHaveCSS('color', BLUE);
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-venn-hover-both.png` });
});

test('publications: abstract and bibtex open in place', async ({ page }) => {
  await page.goto('/publications');
  const abs = page.locator('#abs-soict2024');
  const bib = page.locator('#bib-soict2024');
  await expect(abs).toBeHidden();
  await page.locator('[aria-controls="abs-soict2024"]').click();
  await expect(abs).toBeVisible();
  await page.locator('[aria-controls="bib-soict2024"]').click();
  await expect(bib).toContainText('@inproceedings{mai2024aigen');
  await settle(page);
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-publications-open.png`, fullPage: true });
  await page.locator('[aria-controls="abs-soict2024"]').click();
  await expect(abs).toBeHidden();
});

test('awards: judge log lists every award, newest first', async ({ page }) => {
  await page.goto('/awards');
  const rows = page.locator('[data-log] tbody tr');
  await expect(rows).toHaveCount(10);
  await expect(rows.first()).toContainText('Netcompany');
  await expect(rows.first()).toContainText('Accepted');
  const bg = (sel: string) => page.locator(sel).first().evaluate((el) => getComputedStyle(el).backgroundColor);
  const odd = await rows.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor);
  const even = await rows.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(odd).not.toBe(even);
  expect(await rows.nth(2).evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(odd);
  const thead = await bg('[data-log] thead tr');
  expect(thead).not.toBe(odd);
  expect(thead).not.toBe(even);
  // Header belongs to the dark status block, so it is far darker than any body row.
  const lum = (c: string) => c.match(/\d+/g)!.slice(0, 3).map(Number).reduce((x, y) => x + y, 0);
  expect(lum(thead)).toBeLessThan(lum(even) - 300);
  await expect(page.locator('[data-top-award]')).toHaveCount(3);
  const logos = page.locator('[data-top-award] img[data-org-logo]');
  await expect(logos).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    await logos.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => logos.nth(i).evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('[data-top-award] svg[data-medal]')).toHaveCount(3);
});

test('experience: header turns to frosted glass after scrolling', async ({ page }) => {
  await page.goto('/experience');
  const header = page.locator('[data-site-header]');
  await expect(header).toHaveAttribute('data-scrolled', 'false');
  await page.mouse.wheel(0, 600);
  await expect(header).toHaveAttribute('data-scrolled', 'true');
  await expect(header).toHaveCSS('backdrop-filter', /blur/);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-experience-scrolled-header.png` });
});

test('contact: copy email, validate, then open a filled mailto', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only here');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    (window as unknown as { __mailto: string[]; __onMailto: (u: string) => void }).__mailto = [];
    (window as unknown as { __onMailto: (u: string) => void }).__onMailto = (u) =>
      (window as unknown as { __mailto: string[] }).__mailto.push(u);
  });
  await page.goto('/contact');

  const copy = page.getByRole('button', { name: 'Copy email' });
  await copy.click();
  await expect(page.locator('[data-copy]')).toHaveText('Copied ✓');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('nguyennghia3224.work@gmail.com');

  await page.getByRole('button', { name: /Send message/ }).click();
  await expect(page.locator('[data-error-for="name"]')).toHaveText('Please tell me your name.');
  await expect(page.locator('#c-email')).toHaveAttribute('aria-invalid', 'true');
  await settle(page);
  await page.screenshot({ path: `${EVIDENCE}/${test.info().project.name}-contact-errors.png`, fullPage: true });

  await page.getByLabel('Name', { exact: true }).fill('Test Visitor');
  await page.getByLabel('Email', { exact: true }).fill('visitor@example.com');
  await page.getByLabel('Message', { exact: true }).fill('Hello from the E2E test');
  await page.getByRole('button', { name: /Send message/ }).click();
  const mailto = await page.evaluate(() => (window as unknown as { __mailto: string[] }).__mailto);
  expect(mailto).toHaveLength(1);
  const url = new URL(mailto[0]);
  expect(url.protocol).toBe('mailto:');
  expect(url.searchParams.get('subject')).toBe('Portfolio message from Test Visitor');
  expect(url.searchParams.get('body')).toContain('Hello from the E2E test');
  await expect(page.locator('[data-error-for="name"]')).toHaveText('');
});

test('reduced motion: content is visible without waiting for animations', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${test.info().project.use.baseURL}/skills`);
  const tile = page.locator('[data-skill-group]').last();
  await expect(tile).toHaveCSS('opacity', '1');
  await expect(tile).toHaveCSS('filter', 'none');
  await ctx.close();
});

test('unknown routes return the 404 page', async ({ page }) => {
  const res = await page.goto('/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
  await page.getByRole('link', { name: /Back home/ }).click();
  await expect(page).toHaveURL(/\/$/);
});
