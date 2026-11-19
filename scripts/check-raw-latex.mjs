import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Running Raw-LaTeX Verification Gate...');

const targetDir = fs.existsSync(path.join(rootDir, 'dist', 'tool'))
  ? path.join(rootDir, 'dist', 'tool')
  : path.join(rootDir, 'src', 'content', 'tools');

console.log(`Scanning target: ${path.relative(rootDir, targetDir)}`);

const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html') || f.endsWith('.json'));
const terms = ['$$', '\\(', '\\[', '\\frac', '\\sqrt', '\\left', '\\times'];

const failures = [];

for (const file of files) {
  const fullPath = path.join(targetDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Strip non-visible regions
  const visibleText = content
    .replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<code[^>]*>[\s\S]*?<\/code>/gi, '')
    .replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, '')
    .replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  for (const t of terms) {
    if (visibleText.includes(t)) {
      failures.push({
        file: file,
        term: t
      });
    }
  }
}

if (failures.length > 0) {
  console.error(`FAILURE: Found ${failures.length} raw LaTeX marker(s) in visible text:`);
  for (const f of failures) {
    console.error(`  - ${f.file}: ${f.term}`);
  }
  process.exit(1);
}

console.log(`Raw-LaTeX Verification Gate: PASSED (${files.length} files checked, 0 raw LaTeX matches)`);
