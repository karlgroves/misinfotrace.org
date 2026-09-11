# Misinfo Trace — landing site

The public website for Misinfo Trace, an open research project studying how
misinformation originates and spreads. It is a small static site built with
[Eleventy](https://www.11ty.dev/) and deployed on Netlify.

The research itself lives in the separate `misinfo-trace` repository. Claims on
this site must match what that research has actually produced; see
[docs/mvp-landing-page-scope.md](docs/mvp-landing-page-scope.md) for the scope
of this first release.

## Requirements

- Node per [.nvmrc](.nvmrc) (24; `@afixt/a11y-assert` needs 24.15 or later),
  npm 11 or later
- Access to the private `@afixt` packages on npm (`npm login`), for the
  browser tests
- Chromium for Playwright, for the browser tests: `npx playwright install chromium`

## Commands

| Command                  | What it does                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| `npm start`              | Build and serve with live reload at `http://localhost:8080`      |
| `npm run build`          | Build the site into `_site/`                                     |
| `npm run serve`          | Serve `_site/` with the production headers from `src/_headers`   |
| `npm run check:contrast` | Check every colour pair in the stylesheet against WCAG 2.2 AA    |
| `npm run check:site`     | Check the build: links, anchors, metadata, forms, CSP compliance |
| `npm run test:e2e`       | Build, then run the accessibility and navigation browser tests   |
| `npm run check`          | Everything above plus Markdown lint — the bar for any change     |
| `npm run check:launch`   | `check:site`, also failing on placeholders and localhost URLs    |
| `npm run og`             | Regenerate the social card and Apple touch icon PNGs             |

## Structure

- `src/index.njk` — the landing page; `methodology`, `privacy`, `contact`,
  `subscribed`, `thanks` and `404` are the other pages.
- `src/_includes/` — the base layout, header, footer and logo mark.
- `src/assets/css/site.css` — all styles. The Content-Security-Policy allows
  styles only from this file, so there are no `style` attributes anywhere.
- `src/assets/js/site.js` — the mobile menu. The site works fully without it.
- `src/_headers` — response headers for Netlify, including the CSP.
- `design/` — the design canvas sources (`*.dc.html`, `canvas.json`).

Fonts (Newsreader and Public Sans) are self-hosted from `@fontsource`, so the
site makes no third-party requests.

## Deploying on Netlify

1. Create a Netlify site from this repository. `netlify.toml` sets the build
   command (`npm run build`) and publish directory (`_site`); Netlify reads the
   Node version from `.nvmrc`. It also sets `NPM_FLAGS=--omit=dev`, so Netlify
   installs only `dependencies`: the build needs nothing else, and the private
   `@afixt` test packages would fail to download there. Keep anything the
   build needs in `dependencies`.
2. Turn on **form detection** (Site configuration → Forms). The site has two
   forms: `updates` (email signup) and `contact`. Set up notifications for both
   so submissions reach someone.
3. Turn on **Netlify Analytics** if you want the page-view counts the privacy
   page describes. It works from server logs, with no cookies or script. If you
   choose not to use it, remove that sentence from `src/privacy.njk`.
4. Point the domain at the site. Netlify sets `URL` during builds, and
   canonical links, the sitemap and social cards are built from it.

## Before launch

Run `npm run check:launch` with `URL` set to the production address
(`https://misinfotrace.org`). It fails on any bracketed placeholder left on a
page and on canonical URLs that still point at localhost.

Two decisions no check can make for you:

- Have the privacy page reviewed.
- Decide where the `updates` signups go. Netlify Forms stores the addresses; a
  mailing-list tool is needed to actually send updates.
