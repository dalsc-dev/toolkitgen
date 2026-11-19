import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('Running Cloudflare Workers Free-Tier limit checks on dist/...');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

const MAX_FILES = 20000;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MiB
const SAFE_FILE_LIMIT = 15000;
const SAFE_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MiB

let totalFiles = 0;
let totalSizeBytes = 0;
let maxFileSize = 0;
let largestFile = '';

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else {
      totalFiles++;
      const stats = fs.statSync(fullPath);
      totalSizeBytes += stats.size;
      if (stats.size > maxFileSize) {
        maxFileSize = stats.size;
        largestFile = path.relative(distDir, fullPath);
      }
      if (stats.size > MAX_FILE_SIZE_BYTES) {
        console.error(`FAILURE: File exceeds Cloudflare 25 MiB limit: ${fullPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
        process.exit(1);
      }
    }
  }
}

scanDir(distDir);

console.log(`Total output files: ${totalFiles} (Cloudflare Free limit: ${MAX_FILES})`);
console.log(`Total deployment size: ${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Largest file: ${largestFile} (${(maxFileSize / 1024).toFixed(1)} KB)`);

if (totalFiles > SAFE_FILE_LIMIT) {
  console.warn(`WARNING: File count (${totalFiles}) is approaching safe free limit (${SAFE_FILE_LIMIT})`);
}

if (maxFileSize > SAFE_FILE_SIZE_BYTES) {
  console.warn(`WARNING: Largest file (${(maxFileSize / (1024 * 1024)).toFixed(2)} MB) is approaching 25 MiB free limit`);
}

console.log('Cloudflare Workers Free-Tier limit checks: PASSED');
