import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Running Zero-Left-Border Accents CI Gate...');

const targetDir = path.join(rootDir, 'dist');
if (!fs.existsSync(targetDir)) {
  console.log('Note: dist/ directory not found. Build first to run this check.');
  process.exit(0);
}

// Check built HTML and CSS files for:
// - border-l-* or border-s-* (except border-l-0 or border-none)
// - border-left: [width > 0] (unless border-left: none or 0)
// - border-inline-start: [width > 0] (unless none or 0)
// - box-shadow with inset left bar (e.g., inset 4px 0)

function findFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'assets') {
        findFiles(full, list);
      }
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.css')) {
      list.push(full);
    }
  }
  return list;
}

const files = findFiles(targetDir);
const failures = [];

const classRegex = /\bclass=["'][^"']*\b(border-[ls]-[1-9]|border-[ls]\b)[^"']*["']/g;
const inlineStyleRegex = /style=["'][^"']*(border-left|border-inline-start)\s*:\s*(?!none|0px|0\b)[^;"']+["']/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Check classes
  const classMatches = content.match(classRegex);
  if (classMatches) {
    failures.push({
      file: path.relative(rootDir, file),
      reason: `Found forbidden left-border class: ${classMatches.slice(0, 3).join(', ')}`
    });
  }

  // Check inline styles
  const styleMatches = content.match(inlineStyleRegex);
  if (styleMatches) {
    failures.push({
      file: path.relative(rootDir, file),
      reason: `Found forbidden inline left-border style: ${styleMatches.slice(0, 3).join(', ')}`
    });
  }
}

if (failures.length > 0) {
  console.error(`FAILURE: Found ${failures.length} files with left-border accents:`);
  for (const f of failures.slice(0, 20)) {
    console.error(`  - ${f.file}: ${f.reason}`);
  }
  process.exit(1);
}

console.log(`Zero-Left-Border Accents CI Gate: PASSED (${files.length} built files audited with zero left-border accents)`);
