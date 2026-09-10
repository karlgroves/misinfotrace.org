#!/usr/bin/env node
// Serves _site/ the way Netlify will: pretty URLs, the 404 page, and the
// response headers from _site/_headers — the Content-Security-Policy
// included, so the browser tests fail on anything production would block.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '_site');
const PORT = Number(process.env.PORT ?? 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// Netlify's _headers format: an unindented path pattern, then indented
// "Name: value" lines. A trailing * matches any suffix.
function parseHeaders(text) {
  const rules = [];
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      rules.push({ pattern: line.trim(), headers: {} });
      continue;
    }
    const colon = line.indexOf(':');
    if (colon > 0 && rules.length) rules.at(-1).headers[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return rules;
}

const matches = (pattern, pathname) =>
  pattern.endsWith('*') ? pathname.startsWith(pattern.slice(0, -1)) : pathname === pattern;

const rules = parseHeaders(await readFile(path.join(ROOT, '_headers'), 'utf8').catch(() => ''));

async function resolve(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const file = path.join(ROOT, path.normalize(decoded));
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return null;
  if (path.basename(file) === '_headers') return null;
  const info = await stat(file).catch(() => null);
  if (info?.isFile()) return file;
  if (info?.isDirectory()) {
    const index = path.join(file, 'index.html');
    return (await stat(index).catch(() => null))?.isFile() ? index : null;
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  for (const rule of rules) {
    if (matches(rule.pattern, pathname)) for (const [name, value] of Object.entries(rule.headers)) res.setHeader(name, value);
  }

  let file = await resolve(pathname);
  // Netlify redirects a directory address without its trailing slash.
  if (file?.endsWith(`${path.sep}index.html`) && !pathname.endsWith('/')) {
    res.writeHead(301, { Location: `${pathname}/` });
    res.end();
    return;
  }
  let status = 200;
  if (!file) {
    status = 404;
    file = path.join(ROOT, '404.html');
  }
  const body = await readFile(file);
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  res.end(body);
}).listen(PORT, () => console.log(`Serving _site/ at http://localhost:${PORT}`));
