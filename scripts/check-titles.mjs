import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Running Site-Name Title Suffix CI Gate...');

const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Note: dist/ directory not found. Build first to run this check.');
  process.exit(0);
}

function findHtmlFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, list);
    } else if (entry.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const htmlFiles = findHtmlFiles(distDir);
const failures = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Strip allowed title tags and meta tags
  const sanitized = content
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:title["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');

  if (sanitized.includes('| Toolkit Gen')) {
    failures.push(path.relative(rootDir, file));
  }
}

if (failures.length > 0) {
  console.error(`FAILURE: Found ${failures.length} files with "| Toolkit Gen" outside allowed title tags:`);
  for (const f of failures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
}

console.log(`Site-Name Title Suffix CI Gate: PASSED (${htmlFiles.length} HTML files verified)`);
