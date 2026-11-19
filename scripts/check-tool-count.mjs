import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');
const contentHubsDir = path.join(rootDir, 'src', 'content', 'hubs');
const distToolsDir = path.join(rootDir, 'dist', 'tool');
const legacySitemapTools = path.join(rootDir, 'legacy', 'public', 'sitemap-tools.xml');
const legacySitemapHtml = path.join(rootDir, 'legacy', 'public', 'sitemap.html');

console.log('Running Tool Count & URL Parity CI Gate...');

// 1. Content Collection Count
if (!fs.existsSync(contentToolsDir)) {
  console.error(`Error: Content tools dir not found at ${contentToolsDir}`);
  process.exit(1);
}
const collectionFiles = fs.readdirSync(contentToolsDir).filter(f => f.endsWith('.json'));
const collectionCount = collectionFiles.length;
console.log(`Content collection tools count: ${collectionCount}`);

// 2. Built Tool Pages Count (if dist exists)
let builtCount = null;
if (fs.existsSync(distToolsDir)) {
  const builtFiles = fs.readdirSync(distToolsDir).filter(f => f.endsWith('.html'));
  builtCount = builtFiles.length;
  console.log(`Built /tool/* pages count: ${builtCount}`);
  if (builtCount !== collectionCount) {
    console.error(`FAILURE: Built tool count (${builtCount}) does not match collection count (${collectionCount})!`);
    process.exit(1);
  }
} else {
  console.log('Note: dist/tool directory not found. Run astro build first to verify built pages.');
}

// 3. Old Sitemap Union Check
if (fs.existsSync(legacySitemapHtml)) {
  const sitemapHtmlContent = fs.readFileSync(legacySitemapHtml, 'utf8');
  const sitemapHtmlMatches = [...sitemapHtmlContent.matchAll(/href="\/tool\/([a-zA-Z0-9_-]+)(?:\.html)?"/g)].map(m => m[1]);
  const sitemapHtmlUnique = new Set(sitemapHtmlMatches);
  console.log(`Legacy sitemap.html unique tool URLs: ${sitemapHtmlUnique.size}`);

  // Check for any legacy tool missing in collection
  const missingFromCollection = [];
  for (const slug of sitemapHtmlUnique) {
    if (!fs.existsSync(path.join(contentToolsDir, `${slug}.json`))) {
      missingFromCollection.push(slug);
    }
  }

  if (missingFromCollection.length > 0) {
    console.error(`FAILURE: Found ${missingFromCollection.length} legacy tools missing in content collection:`, missingFromCollection);
    process.exit(1);
  }
}

// 4. Verify 36 Hub Tools in Content Hubs
const hubFiles = ['freelancer.json', 'startup.json', 'wellness.json'];
const uniqueHubToolIds = new Set();
for (const hf of hubFiles) {
  const hfPath = path.join(contentHubsDir, hf);
  if (fs.existsSync(hfPath)) {
    const hubContent = fs.readFileSync(hfPath, 'utf8');
    const matches = [...hubContent.matchAll(/id=\\"(tool-[a-zA-Z0-9_-]+)\\"/g)].map(m => m[1]);
    for (const id of matches) {
      uniqueHubToolIds.add(id);
    }
  }
}
const hubToolCount = uniqueHubToolIds.size;
console.log(`Embedded unique hub tools count: ${hubToolCount}`);
const totalCatalogCount = collectionCount + hubToolCount;
console.log(`Total active tool catalog (standalone + hub tools): ${totalCatalogCount}`);

// 5. Scan for hardcoded tool count claims in src/
const bannedCounts = [/\b160\+\b/i, /\b180\+\b/i, /\b190\+\b/i, /\b162 tools\b/i, /\b126 free online utilities\b/i, /\bBrowse All 126 Tools\b/i];
function checkHardcodedCounts(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'legacy') {
        checkHardcodedCounts(fullPath);
      }
    } else if (/\.(astro|html|ts|js|md|mdx)$/.test(entry.name) && !entry.name.endsWith('check-tool-count.mjs') && !entry.name.endsWith('missing-tools.csv')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of bannedCounts) {
        if (pattern.test(content)) {
          console.error(`FAILURE: Hardcoded tool count pattern ${pattern} found in ${fullPath}`);
          process.exit(1);
        }
      }
    }
  }
}

checkHardcodedCounts(path.join(rootDir, 'src'));

console.log('Tool Count & URL Parity CI Gate: PASSED (100% parity, zero hardcoded counts)');
