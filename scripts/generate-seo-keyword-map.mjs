import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolsDir = path.join(rootDir, 'src', 'content', 'tools');
const outputFile = path.join(rootDir, 'seo-keyword-map.csv');

console.log('Generating Per-Tool SEO Keyword Map & Content Depth Audit...');

const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json'));
console.log(`Analyzing ${files.length} tools...`);

const rows = [];
const thinPages = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  const data = JSON.parse(content);
  const slug = data.id || file.replace('.json', '');

  const cleanName = (data.name || data.title || slug)
    .replace(/\s*\|\s*Toolkit Gen.*$/i, '')
    .trim();

  // Optimized Title <= 60 chars
  let title = `${cleanName} | Toolkit Gen`;
  if (title.length > 60) {
    title = cleanName.length <= 46 ? `${cleanName} | Toolkit Gen` : cleanName.slice(0, 57) + '...';
  }

  // Description 140-160 chars
  let desc = data.description || '';
  if (desc.length < 140) {
    desc = `${desc} Runs locally in browser memory with zero server uploads and instant client calculation.`;
  }
  if (desc.length > 160) {
    desc = desc.slice(0, 157) + '...';
  }

  // Natural phrasing keywords (free, online, calculator, generator, checker, test)
  const baseTerm = cleanName.toLowerCase();
  const primaryKeyword = `free online ${baseTerm}`;

  const secondaryKeywords = [
    `${baseTerm} calculator`,
    `online ${baseTerm} checker`,
    `${baseTerm} tool`,
    `free ${baseTerm} test`,
    `browser ${baseTerm} generator`,
  ].slice(0, 5);

  // Content word count (Article + QuickAnswer + FAQ + HowTo)
  const textPool = [
    data.quickAnswer || '',
    (data.howTo || []).map((h) => `${h.name} ${h.text}`).join(' '),
    (data.faq || []).map((f) => `${f.q} ${f.a}`).join(' '),
    (data.articleHtml || '').replace(/<[^>]+>/g, ' '),
  ].join(' ');

  const words = textPool.trim().split(/\s+/).filter(Boolean).length;
  const isThin = words < 400;
  if (isThin) {
    thinPages.push({ slug, words });
  }

  rows.push({
    slug,
    title,
    title_length: title.length,
    description: desc,
    description_length: desc.length,
    category: data.category || 'Utility',
    primary_keyword: primaryKeyword,
    secondary_keywords: secondaryKeywords.join('; '),
    total_words: words,
    thin_content: isThin ? 'YES' : 'NO',
  });
}

// Sort by total words ascending to highlight thin content
rows.sort((a, b) => a.total_words - b.total_words);

const headers = [
  'slug',
  'title',
  'title_length',
  'description',
  'description_length',
  'category',
  'primary_keyword',
  'secondary_keywords',
  'total_words',
  'thin_content',
];

const csvContent = [
  headers.join(','),
  ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
].join('\n');

fs.writeFileSync(outputFile, csvContent);
console.log(`Saved SEO keyword map to ${outputFile}`);
console.log(`Audit Summary: ${rows.length} tools analyzed.`);
console.log(`Thin content (<400 words): ${thinPages.length} tools.`);
if (thinPages.length > 0) {
  console.log('Thin pages list:', thinPages);
}
