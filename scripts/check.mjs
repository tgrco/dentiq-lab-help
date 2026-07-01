import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ORIGIN = 'https://help.dentiqlab.vn';
const reg = JSON.parse(readFileSync(join(ROOT, 'scripts/pages.json'), 'utf8'));
const shell = readFileSync(join(ROOT, 'assets/docs-shell.js'), 'utf8');
const errors = [];

const href = (k) => (k === 'overview' ? 'index.html' : `${k}.html`);

let search = [];
const searchPath = join(ROOT, 'assets/search-data.json');
if (existsSync(searchPath)) search = JSON.parse(readFileSync(searchPath, 'utf8'));
const searchKeys = new Set(search.map((e) => e.key));

let sitemap = '';
const sitemapPath = join(ROOT, 'sitemap.xml');
if (existsSync(sitemapPath)) sitemap = readFileSync(sitemapPath, 'utf8');

for (const p of reg.pages) {
  const file = join(ROOT, href(p.key));
  if (!existsSync(file)) { errors.push(`[missing-file] ${href(p.key)}`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes(`data-page="${p.key}"`))
    errors.push(`[bad-data-page] ${href(p.key)} missing data-page="${p.key}"`);
  if (!shell.includes(`key: '${p.key}'`) && !shell.includes(`key:'${p.key}'`))
    errors.push(`[nav-unregistered] ${p.key} not in docs-shell.js NAV`);
  if (!searchKeys.has(p.key))
    errors.push(`[search-missing] ${p.key} not in search-data.json`);
  if (sitemap && !sitemap.includes(`${SITE_ORIGIN}/${href(p.key)}`))
    errors.push(`[sitemap-missing] ${p.key} not in sitemap.xml`);
}

const validKeys = new Set(reg.pages.map((p) => p.key));
const relMatch = shell.match(/const RELATED = \{([\s\S]*?)\n  \};/);
if (relMatch) {
  for (const m of relMatch[1].matchAll(/'([^']+)'/g)) {
    if (!validKeys.has(m[1])) errors.push(`[related-bad-key] '${m[1]}' not a known page`);
  }
}

for (const p of reg.pages) {
  const file = join(ROOT, href(p.key));
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="([a-z0-9-]+)\.html"/g)) {
    const target = join(ROOT, `${m[1]}.html`);
    if (!existsSync(target)) errors.push(`[broken-link] ${href(p.key)} → ${m[1]}.html`);
  }
}

if (errors.length) {
  console.error(`FAIL — ${errors.length} issue(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`OK — ${reg.pages.length} pages registered, all links resolve.`);
