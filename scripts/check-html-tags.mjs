import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.resolve(__dirname, '../src/content/tools');

console.log('Running HTML Tag Balance CI Gate...');

const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json'));
const tags = ['div', 'section', 'article', 'header', 'aside', 'table', 'p', 'a', 'button'];

let totalErrors = 0;
const errors = [];

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const field of ['articleHtml', 'toolHtml']) {
    const html = data[field] || '';
    for (const tag of tags) {
      const oRegex = new RegExp(`<${tag}[\\s>]`, 'gi');
      const cRegex = new RegExp(`</${tag}>`, 'gi');
      const opens = (html.match(oRegex) || []).length;
      const closes = (html.match(cRegex) || []).length;

      if (opens !== closes) {
        errors.push(`${file} (${field}) <${tag}>: ${opens} open vs ${closes} close (diff: ${opens - closes})`);
        totalErrors++;
      }
    }
  }
}

if (totalErrors > 0) {
  console.error(`HTML Tag Balance Gate FAILED with ${totalErrors} tag mismatches:`);
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
}

console.log(`HTML Tag Balance Gate: PASSED (All ${files.length} tools verified with 100% balanced markup)`);
