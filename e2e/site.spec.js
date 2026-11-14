import { playwrightAdapter } from '@afixt/a11y-assert';
import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/methodology/',
  '/privacy/',
  '/contact/',
  '/support/',
  '/support/thanks/',
  '/subscribed/',
  '/thanks/',
  '/404.html',
];

/**
 * Rules skipped on specific pages, each with its reason.
 *
 * - STRUCTURE-07 on the home page. Its multiple-sentence heuristic flags any
 *   heading containing three or more sentences, and two home-page headings
 *   are deliberately three short fragments: "Identify. Investigate. Trace."
 *   (29 characters) and "Same claim. Same evidence. Same standard." (41).
 *   Those are concise headings, not paragraph content — the detector's own
 *   paragraph threshold is 200 characters. Remove this entry once the
 *   detector stops flagging short fragment headings.
 */
const IGNORED_BY_PAGE = { '/': ['STRUCTURE-07'] };

/**
 * Run the a11y-assert automated rules against the current page state. Throws
 * on any violation, failing the test. useEngine: true evaluates the rules in
 * the real browser, so style-dependent rules such as contrast are computed.
 */
async function assertNoA11yViolations(page, url) {
  await playwrightAdapter(page, undefined, { useEngine: true, ignoreTests: IGNORED_BY_PAGE[url] ?? [] });
}

const hasNoHorizontalScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

// The site's own behaviour under the production headers from _site/_headers.
// A Content-Security-Policy violation surfaces as a console error, so an empty
// list means nothing on the page is blocked by the CSP.
test.describe('every page, under the production CSP', () => {
  for (const url of PAGES) {
    test(`${url} loads with no console errors`, async ({ page }) => {
      const errors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });
  }
});

// The accessibility audits inject inline styles while they measure the page
// (zoom, focus, contrast). The CSP rightly blocks those, which would quietly
// degrade the audit, so audits run with the CSP bypassed. CSP compliance is
// tested separately above, without the bypass.
test.describe('accessibility, desktop', () => {
  test.use({ bypassCSP: true });

  for (const url of PAGES) {
    test(`${url} has no accessibility violations`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await assertNoA11yViolations(page, url);
    });
  }
});

test.describe('phone width', () => {
  test.use({ viewport: { width: 390, height: 844 }, bypassCSP: true });

  for (const url of PAGES) {
    test(`${url} fits the screen without sideways scrolling`, async ({ page }) => {
      await page.goto(url);
      expect(await hasNoHorizontalScroll(page)).toBe(true);
    });
  }

  test('the home page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await assertNoA11yViolations(page, '/');
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 }, bypassCSP: true });

  test('the menu button opens the navigation and Escape closes it', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Menu' });
    const research = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research', exact: true });

    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(research).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(research).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(research).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('choosing a link closes the menu', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Menu' });
    await button.click();
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research', exact: true }).click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  // Opened from the keyboard, the way a keyboard user reaches this state.
  // After a mouse click, Chromium stops matching :focus-visible for scripted
  // focus, so a rule that focuses each element programmatically would see no
  // indicator on any of them — a property of the click, not of the page.
  test('the open menu has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
    await assertNoA11yViolations(page, '/');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test('the navigation links stay visible and there is no menu button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Research', exact: true }),
    ).toBeVisible();
  });
});

test('an unknown address gets the 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});
