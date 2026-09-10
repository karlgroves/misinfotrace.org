#!/usr/bin/env node
// Checks the built site in _site/ for what a static site most often gets
// wrong without anyone noticing: broken internal links and anchors, missing
// search and social metadata, forms Netlify cannot process, unlabeled fields,
// and markup the Content-Security-Policy in src/_headers would block.
//
// `--launch` also fails on bracketed placeholders such as [OPERATOR NAME] and
// on canonical URLs that still point at localhost. Run it (with URL set to
// the production address) before the site goes public.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, '_site');
const LAUNCH = process.argv.includes('--launch');
if (!existsSync(OUT)) {
  console.error('No _site/ directory. Run `npm run build` first.');
  process.exit(2);
}

const failures = [];
const notes = [];
const fail = (message) => failures.push(message);

const unescape = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const pages = new Map();
for (const file of walk(OUT)) {
  if (!file.endsWith('.html')) continue;
  const rel = path.relative(OUT, file).split(path.sep).join('/');
  const url = `/${rel.replace(/(^|\/)index\.html$/, '$1')}`;
  const html = readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => unescape(m[1]));
  pages.set(url, {
    html,
    ids: new Set(ids),
    duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
    links: [...html.matchAll(/\s(?:href|action)="([^"]+)"/g)].map((m) => unescape(m[1])),
  });
}

// 1. Structure and metadata every page needs.
const REQUIRED_META = [
  ['<html lang="en"', 'lang attribute'],
  ['<meta name="description" content="', 'meta description'],
  ['<link rel="canonical" href="', 'canonical link'],
  ['<meta property="og:title" content="', 'og:title'],
  ['<meta property="og:description" content="', 'og:description'],
  ['<meta property="og:image" content="', 'og:image'],
  ['<meta name="twitter:card" content="', 'twitter:card'],
];
for (const [url, page] of pages) {
  const h1s = (page.html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(`${url}: ${h1s} h1 elements (expected 1)`);
  for (const id of new Set(page.duplicateIds)) fail(`${url}: id "${id}" is used more than once`);
  if (!/<title>[^<]+<\/title>/.test(page.html)) fail(`${url}: empty or missing <title>`);
  for (const [needle, what] of REQUIRED_META) {
    if (!page.html.includes(needle)) fail(`${url}: missing ${what}`);
  }
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(page.html)?.[1] ?? '';
  if (LAUNCH && canonical.includes('localhost')) fail(`${url}: canonical URL is ${canonical} — build with URL set to the production address`);
}

// 2. Nothing the Content-Security-Policy would block: styles come only from
//    site.css and scripts only from files, so no style attributes, <style>
//    blocks, inline scripts or event-handler attributes.
for (const [url, page] of pages) {
  if (/\sstyle="/.test(page.html)) fail(`${url}: style attribute (blocked by style-src 'self')`);
  if (/<style[\s>]/.test(page.html)) fail(`${url}: <style> block (blocked by style-src 'self')`);
  for (const m of page.html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!attr(m[0], 'src') || m[2].trim()) fail(`${url}: inline script (blocked by script-src 'self')`);
  }
  if (/\son[a-z]+="/.test(page.html)) fail(`${url}: event-handler attribute (blocked by script-src 'self')`);
}

// 3. Every internal link, form action and asset reference resolves, and every
//    fragment points at an element on its page.
let linksChecked = 0;
for (const [url, page] of pages) {
  for (const href of page.links) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) continue;
    linksChecked++;
    const target = new URL(href, `https://site.invalid${url}`);
    const pathname = decodeURIComponent(target.pathname);
    if (pathname.startsWith('/assets/')) {
      if (!existsSync(path.join(OUT, pathname))) fail(`${url}: missing asset ${href}`);
      continue;
    }
    const dest = pages.get(pathname);
    if (!dest) {
      fail(`${url}: link to missing page ${href}`);
      continue;
    }
    if (target.hash && !dest.ids.has(decodeURIComponent(target.hash.slice(1)))) {
      fail(`${url}: link to missing anchor ${href}`);
    }
  }
}

// 4. Forms Netlify can detect and process, with every field labelled.
let formsChecked = 0;
for (const [url, page] of pages) {
  for (const m of page.html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)) {
    const [open, , body] = [m[0].slice(0, m[0].indexOf('>') + 1), m[1], m[2]];
    const name = attr(open, 'name');
    formsChecked++;
    if (attr(open, 'data-netlify') !== 'true') fail(`${url}: form "${name}" lacks data-netlify="true"`);
    if (!name) fail(`${url}: a form has no name attribute`);
    if (!body.includes(`<input type="hidden" name="form-name" value="${name}">`)) {
      fail(`${url}: form "${name}" has no hidden form-name input matching its name`);
    }
    const honeypot = attr(open, 'netlify-honeypot');
    if (!honeypot || !body.includes(`name="${honeypot}"`)) fail(`${url}: form "${name}" has no honeypot field`);
    for (const control of body.matchAll(/<(input|textarea|select)\b[^>]*>/g)) {
      if (['hidden', 'submit', 'button'].includes(attr(control[0], 'type'))) continue;
      const id = attr(control[0], 'id');
      if (!id || !body.includes(`<label class="field-label" for="${id}">`) && !body.includes(`<label for="${id}">`)) {
        fail(`${url}: form "${name}" has a ${control[1]} without a <label for>`);
      }
    }
  }
}

// 5. Crawling and headers.
if (!existsSync(path.join(OUT, 'robots.txt'))) fail('no robots.txt');
const sitemap = existsSync(path.join(OUT, 'sitemap.xml')) ? readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8') : '';
if (!sitemap) fail('no sitemap.xml');
for (const [url, page] of pages) {
  const noindex = page.html.includes('<meta name="robots" content="noindex">');
  const listed = sitemap.includes(`${url}</loc>`);
  if (noindex && listed) fail(`sitemap.xml lists ${url}, which is noindex`);
  if (!noindex && !listed) fail(`sitemap.xml does not list ${url}`);
}
const headers = existsSync(path.join(OUT, '_headers')) ? readFileSync(path.join(OUT, '_headers'), 'utf8') : '';
if (!headers.includes('Content-Security-Policy:')) fail('_site/_headers has no Content-Security-Policy');

// 6. Placeholders still waiting for a real value.
for (const [url, page] of pages) {
  const text = page.html.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const m of text.matchAll(/\[[A-Z][A-Z0-9 &'-]{2,}\]/g)) {
    (LAUNCH ? fail : (msg) => notes.push(msg))(`${url}: placeholder ${m[0]} still needs a real value`);
  }
}

if (notes.length) {
  console.log(`Before launch (${notes.length}):`);
  for (const n of notes) console.log(`  ${n}`);
  console.log('');
}
console.log(`${pages.size} pages, ${linksChecked} internal links, ${formsChecked} forms checked.`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('All checks pass.');
