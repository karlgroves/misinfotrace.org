// Netlify sets URL to the site's primary address during every build; locally
// the dev server's address stands in. Canonical links, the sitemap and the
// social cards are built from it, so a deploy never points at localhost.
export default {
  name: 'Misinfo Trace',
  tagline: 'Evidence before conclusions.',
  description:
    'Misinfo Trace is an open research project studying how misinformation originates and spreads, holding every claim to the same standard whichever side it favors.',
  url: process.env.URL ?? 'http://localhost:8080',
  locale: 'en_US',
};
