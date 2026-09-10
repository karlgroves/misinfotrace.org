#!/usr/bin/env node
// Renders the social-sharing card (1200×630) and the Apple touch icon
// (180×180) in headless Chromium, with the site's own fonts. Run `npm run og`
// after changing the headline or the mark; the PNGs are committed.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'assets');

const font = (file) =>
  `data:font/woff2;base64,${readFileSync(path.join(ROOT, 'node_modules', '@fontsource', file)).toString('base64')}`;
const FACES = `
  @font-face { font-family: "Newsreader"; font-weight: 500; src: url(${font('newsreader/files/newsreader-latin-500-normal.woff2')}); }
  @font-face { font-family: "Public Sans"; font-weight: 600; src: url(${font('public-sans/files/public-sans-latin-600-normal.woff2')}); }
`;

const mark = (height) =>
  `<svg width="${Math.round((height * 26) / 22)}" height="${height}" viewBox="0 0 26 22"><path d="M4 4 C9 4, 9 11, 14 11 M4 18 C9 18, 9 11, 14 11 M14 11 L24 11" fill="none" stroke="#1a1d1c" stroke-width="1.6"/><circle cx="4" cy="4" r="2.4" fill="#1a1d1c"/><circle cx="4" cy="18" r="2.4" fill="#1a1d1c"/><circle cx="14" cy="11" r="4.2" fill="#f4df4e" stroke="#1a1d1c" stroke-width="1.6"/></svg>`;

const CARD = `<!doctype html><html><head><style>${FACES}
  html, body { margin: 0; }
  body { box-sizing: border-box; width: 1200px; height: 630px; padding: 72px 80px 64px; display: flex; flex-direction: column; justify-content: space-between; background: #f2f3ef; color: #1a1d1c; border-bottom: 16px solid #1a1d1c; }
  .brand { display: flex; align-items: center; gap: 16px; font: 500 40px/1 "Newsreader", Georgia, serif; letter-spacing: -0.012em; }
  h1 { margin: 0; max-width: 1000px; font: 500 84px/1.04 "Newsreader", Georgia, serif; letter-spacing: -0.012em; }
  p { margin: 0; font: 600 26px/1.3 "Public Sans", Arial, sans-serif; color: #535956; }
</style></head><body>
  <div class="brand">${mark(40)}<span>Misinfo Trace</span></div>
  <h1>Misinformation is a system. We're studying how it works.</h1>
  <p>An open research project · Evidence before conclusions.</p>
</body></html>`;

const ICON = `<!doctype html><html><head><style>
  html, body { margin: 0; }
  body { width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; background: #f2f3ef; }
</style></head><body>${mark(104)}</body></html>`;

const browser = await chromium.launch();
try {
  for (const [html, width, height, file] of [
    [CARD, 1200, 630, 'og-image.png'],
    [ICON, 180, 180, 'apple-touch-icon.png'],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ASSETS, file) });
    console.log(`wrote src/assets/${file}`);
    await page.close();
  }
} finally {
  await browser.close();
}
