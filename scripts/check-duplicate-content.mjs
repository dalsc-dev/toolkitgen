import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');

console.log('Running Cross-Tool Article Paragraph Similarity Audit...');

const files = fs.readdirSync(contentToolsDir).filter(f => f.endsWith('.json'));

// Extract paragraphs from each article
const toolParagraphs = new Map();

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(contentToolsDir, file), 'utf8'));
  const html = data.articleHtml || '';
  // Strip tags and extract substantial paragraphs (> 40 chars)
  const pMatches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 40);

  toolParagraphs.set(data.id, pMatches);
}

// Compare paragraph duplicate rate across tools
let maxDuplicateRate = 0;
let worstPair = null;

const allSlugs = Array.from(toolParagraphs.keys());

for (let i = 0; i < allSlugs.length; i++) {
  const slugA = allSlugs[i];
  const pA = toolParagraphs.get(slugA) || [];
  if (pA.length === 0) continue;

  for (let j = i + 1; j < allSlugs.length; j++) {
    const slugB = allSlugs[j];
    const pB = toolParagraphs.get(slugB) || [];
    if (pB.length === 0) continue;

    let duplicateCount = 0;
    for (const textA of pA) {
      if (pB.some(textB => textA === textB || (textA.length > 60 && textB.includes(textA)))) {
        duplicateCount++;
      }
    }

    const similarityRate = duplicateCount / Math.min(pA.length, pB.length);
    if (similarityRate > maxDuplicateRate) {
      maxDuplicateRate = similarityRate;
      worstPair = { slugA, slugB, similarityRate, duplicateCount };
    }
  }
}

console.log(`Max duplicate paragraph rate between any pair: ${(maxDuplicateRate * 100).toFixed(1)}%`);
if (worstPair) {
  console.log(`Highest similarity pair: ${worstPair.slugA} vs ${worstPair.slugB} (${worstPair.duplicateCount} duplicate paragraphs)`);
}

if (maxDuplicateRate > 0.30) {
  console.error(`FAILURE: Duplicate paragraph rate (${(maxDuplicateRate * 100).toFixed(1)}%) exceeds 30% threshold!`);
  process.exit(1);
}

console.log('Cross-Tool Article Paragraph Similarity Audit: PASSED (<30% duplicate content)');
