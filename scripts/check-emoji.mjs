import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Running Zero-Emoji & Glyph CI Gate (Expanded)...');

const targetDir = path.join(rootDir, 'dist');
if (!fs.existsSync(targetDir)) {
  console.log('Note: dist/ directory not found. Build first to run this check.');
  process.exit(0);
}

// Banned unicode ranges:
// - All Emoji & Extended Pictographs (\u{1F300}-\u{1FAFF})
// - Miscellaneous Symbols (\u{2600}-\u{26FF})
// - Dingbats (\u{2700}-\u{27BF})
// - Arrows (\u{2190}-\u{21FF})
// - Geometric Shapes (\u{25A0}-\u{25FF})
// - Miscellaneous Technical (\u{2300}-\u{23FF})
const bannedGlyphRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{2300}-\u{23FF}]/u;

// Explicit allow-list for legitimate mathematical operators:
// U+00D7: Multiplication Sign (×)
// U+00B7: Middle Dot (·)
// U+2212: Minus Sign (−)
// U+2215: Division Slash (∕)
// U+2248: Almost Equal To (≈)
// U+2264: Less-than or equal (≤)
// U+2265: Greater-than or equal (≥)
// U+00B1: Plus-Minus Sign (±)
// U+00B0: Degree Sign (°)
// U+00B5: Micro Sign (µ)
const allowedMathCodepoints = new Set([
  0x00D7, 0x00B7, 0x2212, 0x2215, 0x2248, 0x2264, 0x2265, 0x00B1, 0x00B0, 0x00B5
]);

function findFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(full, list);
    } else if (
      entry.name.endsWith('.html') ||
      entry.name.endsWith('.txt') ||
      entry.name.endsWith('.xml') ||
      entry.name.endsWith('.json') ||
      entry.name.endsWith('.js') ||
      entry.name.endsWith('.css')
    ) {
      list.push(full);
    }
  }
  return list;
}

const files = findFiles(targetDir);
const failures = [];

for (const file of files) {
  // Skip font files or binary assets if any
  if (file.includes('assets/katex') && !file.endsWith('.css') && !file.endsWith('.js')) {
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');

  // Strip compiled KaTeX math blocks and annotations (they contain valid TeX mathematical symbols)
  content = content
    .replace(/<span\s+class=["'][^"']*katex[^"']*["']>[\s\S]*?<\/span>\s*<\/span>\s*<\/span>/gi, '')
    .replace(/<math[^>]*>[\s\S]*?<\/math>/gi, '')
    .replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, '');

  // Check CSS content: properties
  if (file.endsWith('.css')) {
    const contentPropMatches = content.match(/content\s*:\s*["']([^"']*)["']/g) || [];
    for (const match of contentPropMatches) {
      for (const char of match) {
        const cp = char.codePointAt(0);
        if (bannedGlyphRegex.test(char) && !allowedMathCodepoints.has(cp)) {
          failures.push({
            file: path.relative(rootDir, file),
            context: `CSS property: ${match}`,
            char,
            code: `U+${cp.toString(16).toUpperCase()}`
          });
        }
      }
    }
  }

  // Check every character
  for (const char of content) {
    const cp = char.codePointAt(0);
    if (allowedMathCodepoints.has(cp)) {
      continue;
    }
    if (bannedGlyphRegex.test(char)) {
      failures.push({
        file: path.relative(rootDir, file),
        char,
        code: `U+${cp.toString(16).toUpperCase()}`
      });
      break;
    }
  }
}

if (failures.length > 0) {
  console.error(`FAILURE: Found ${failures.length} files containing disallowed glyphs/emoji:`);
  for (const f of failures.slice(0, 30)) {
    console.error(`  - ${f.file}: ${f.char} (${f.code})${f.context ? ` [${f.context}]` : ''}`);
  }
  if (failures.length > 30) {
    console.error(`  ... and ${failures.length - 30} more`);
  }
  process.exit(1);
}

console.log(`Zero-Emoji & Glyph CI Gate: PASSED (${files.length} output files verified with zero banned glyphs)`);
