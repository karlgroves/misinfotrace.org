#!/usr/bin/env node
// Measures every foreground/background pair src/assets/css/site.css uses
// against WCAG 2.2 AA for its size and role. Add a pair here before a new
// colour or combination goes into the CSS.

const T = {
  paper: '#F2F3EF',
  band: '#E9EBE6',
  card: '#FBFBF8',
  ink: '#1A1D1C',
  text: '#2E3331',
  slate: '#535956',
  onInk: '#F2F3EF',
  onInkMuted: '#CDD1CC',
  black: '#000000',
};

// [foreground, background, minimum ratio, where]
const TEXT = 4.5;
const NON_TEXT = 3;
const PAIRS = [
  ['ink', 'paper', TEXT, 'headings, links, body text'],
  ['text', 'paper', TEXT, 'secondary body text'],
  ['slate', 'paper', TEXT, 'eyebrows, captions, planned status'],
  ['ink', 'band', TEXT, 'text on How it works and concerns bands'],
  ['text', 'band', TEXT, 'body text on bands'],
  ['slate', 'band', TEXT, 'eyebrows on bands'],
  ['ink', 'card', TEXT, 'card titles, form input text, assessment box'],
  ['text', 'card', TEXT, 'card body text'],
  ['slate', 'card', TEXT, 'diagram labels, assessment note'],
  ['onInk', 'ink', TEXT, 'buttons, researching status, methodology boxes, footer'],
  ['onInkMuted', 'ink', TEXT, 'footer tagline, methodology box detail'],
  ['onInk', 'black', TEXT, 'button hover'],
  ['ink', 'paper', NON_TEXT, 'focus ring, input and tag borders'],
  ['ink', 'band', NON_TEXT, 'focus ring and step markers on bands'],
  ['slate', 'paper', NON_TEXT, 'dashed planned borders'],
  ['onInk', 'ink', NON_TEXT, 'focus ring in the footer'],
];

const channel = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
for (const [fg, bg, min, where] of PAIRS) {
  const r = ratio(T[fg], T[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (needs ${min}:1)  ${fg} on ${bg} — ${where}`);
}
console.log(failed ? `\n${failed} pair(s) fail.` : `\nAll ${PAIRS.length} pairs pass.`);
process.exit(failed ? 1 : 0);
