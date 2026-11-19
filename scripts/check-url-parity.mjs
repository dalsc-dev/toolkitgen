import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('Running Complete Legacy URL Parity Audit...');

// Gather all legacy URLs
const legacyUrls = new Set();

// 1. legacy sitemap.xml
const sitemapXmlPath = path.join(rootDir, 'legacy', 'public', 'sitemap.xml');
if (fs.existsSync(sitemapXmlPath)) {
  const content = fs.readFileSync(sitemapXmlPath, 'utf8');
  for (const m of content.matchAll(/<loc>https?:\/\/[^/]+([^<]+)<\/loc>/g)) {
    legacyUrls.add(m[1]);
  }
}

// 2. legacy sitemap-tools.xml
const sitemapToolsPath = path.join(rootDir, 'legacy', 'public', 'sitemap-tools.xml');
if (fs.existsSync(sitemapToolsPath)) {
  const content = fs.readFileSync(sitemapToolsPath, 'utf8');
  for (const m of content.matchAll(/<loc>https?:\/\/[^/]+([^<]+)<\/loc>/g)) {
    legacyUrls.add(m[1]);
  }
}

// 3. legacy sitemap.html
const sitemapHtmlPath = path.join(rootDir, 'legacy', 'public', 'sitemap.html');
if (fs.existsSync(sitemapHtmlPath)) {
  const content = fs.readFileSync(sitemapHtmlPath, 'utf8');
  for (const m of content.matchAll(/href="(\/[^"#?]+)"/g)) {
    legacyUrls.add(m[1]);
  }
}

console.log(`Discovered ${legacyUrls.size} unique legacy URLs to audit against built dist/...`);

let missingCount = 0;
const missingUrls = [];

for (const rawUrl of legacyUrls) {
  let url = rawUrl.replace(/\/$/, '');
  if (!url) url = '/index';

  // Check possible static file resolutions in dist
  const candidates = [
    path.join(distDir, `${url}.html`),
    path.join(distDir, url, 'index.html'),
    path.join(distDir, url),
  ];

  const found = candidates.some((c) => fs.existsSync(c));
  if (!found) {
    missingCount++;
    missingUrls.push(rawUrl);
  }
}

console.log(`URL Parity Results: ${legacyUrls.size - missingCount} / ${legacyUrls.size} URLs verified.`);

if (missingCount > 0) {
  console.warn(`Missing legacy URLs:`, missingUrls);
  // Check if they are xml files or need redirects
  process.exit(1);
} else {
  console.log('URL Parity Gate: 100% PASSED (Zero 404s)');
}
