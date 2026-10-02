#!/usr/bin/env node
// Reproduces the Netlify install and build (#4). Netlify installs with
// NPM_FLAGS=--omit=dev (see netlify.toml), so the build can only use packages
// in `dependencies`. `npm run check` always has devDependencies installed and
// cannot see a build package that was put in devDependencies; this can.
//
// The tracked files are copied into a temporary directory, which is then
// installed with `npm ci --omit=dev` against an empty npm cache and empty
// user and global configs, and every npm_* / NPM_* variable is dropped from
// the environment. A developer's npm login or cached private tarballs therefore
// cannot make the check pass when Netlify would fail.
//
// A passing build is not enough: Eleventy copies the @fontsource packages
// with a passthrough copy, which silently copies nothing when the package is
// missing. So every /assets/ file the built HTML and CSS reference must exist.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-netlify-'));
const work = path.join(tmp, 'site');
const cache = path.join(tmp, 'npm-cache');
// npm refuses one file as both user and global config, so two empty ones.
const userConfig = path.join(tmp, 'user-npmrc');
const globalConfig = path.join(tmp, 'global-npmrc');

const fail = (message) => {
  console.error(`check:netlify: ${message}`);
  process.exitCode = 1;
};

/** A clean environment: nothing that could carry npm auth, config or cache. */
const env = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) => !/^npm_/i.test(key) && !['NODE_AUTH_TOKEN', 'NPM_TOKEN'].includes(key),
  ),
);
Object.assign(env, {
  NPM_CONFIG_USERCONFIG: userConfig,
  NPM_CONFIG_GLOBALCONFIG: globalConfig,
  NPM_CONFIG_CACHE: cache,
});

/** /assets/ paths referenced from the built HTML and CSS that are not in the build. */
const missingAssets = (site) => {
  const refs = /(?:href|src)="(\/assets\/[^"#?]+)"|url\(\s*["']?(\/assets\/[^"')#?]+)/g;
  const missing = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(?:html|css)$/.test(entry.name)) {
        for (const m of fs.readFileSync(full, 'utf8').matchAll(refs)) {
          const ref = m[1] ?? m[2];
          if (!fs.existsSync(path.join(site, ref))) missing.add(ref);
        }
      }
    }
  };
  walk(site);
  return [...missing].sort();
};

const run = (cmd, args) => {
  console.log(`check:netlify: ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { cwd: work, env, stdio: 'inherit' });
  return result.status === 0;
};

try {
  fs.writeFileSync(userConfig, '');
  fs.writeFileSync(globalConfig, '');
  fs.mkdirSync(cache);

  // Tracked files only, as they are in the working tree: untracked files such
  // as a local .npmrc never reach Netlify, so they must not reach this copy.
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
  for (const file of files) {
    const from = path.join(root, file);
    if (!fs.existsSync(from)) continue; // deleted in the working tree
    const to = path.join(work, file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }

  if (!run('npm', ['ci', '--omit=dev', '--cache', cache, '--no-audit', '--no-fund'])) {
    fail('`npm ci --omit=dev` failed, as it would on Netlify.');
  } else if (!run('npm', ['run', 'build'])) {
    fail(
      'the build failed with only `dependencies` installed. A package the build ' +
        'imports is probably in `devDependencies`; Netlify would fail the same way.',
    );
  } else if (!fs.existsSync(path.join(work, '_site', 'index.html'))) {
    fail('the build succeeded but produced no _site/index.html.');
  } else {
    const missing = missingAssets(path.join(work, '_site'));
    if (missing.length > 0) {
      fail(
        `the build is missing ${missing.length} referenced asset(s), probably because a ` +
          `package it copies from is in \`devDependencies\`:\n  ${missing.join('\n  ')}`,
      );
    } else {
      console.log('check:netlify: ok — the site installs and builds as Netlify does.');
    }
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
