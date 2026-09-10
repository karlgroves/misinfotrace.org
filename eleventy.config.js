import site from './src/_data/site.js';

// Fonts are self-hosted so visitors are never sent to a third-party font
// service; the privacy page promises no third-party requests. Every family
// still has a fallback stack in site.css.
const FONTS = [
  'newsreader/files/newsreader-latin-400-normal.woff2',
  'newsreader/files/newsreader-latin-400-italic.woff2',
  'newsreader/files/newsreader-latin-500-normal.woff2',
  'public-sans/files/public-sans-latin-500-normal.woff2',
  'public-sans/files/public-sans-latin-600-normal.woff2',
];

export default function (eleventyConfig) {
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });

  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  // Netlify reads response headers (the CSP among them) from _site/_headers;
  // scripts/serve.mjs applies the same file locally.
  eleventyConfig.addPassthroughCopy({ 'src/_headers': '_headers' });
  for (const font of FONTS) {
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/${font}`]: `assets/fonts/${font.split('/').pop()}` });
  }

  eleventyConfig.addFilter('absoluteUrl', (url) => new URL(url, site.url).href);

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
  };
}
