import fs from 'node:fs';
import path from 'node:path';

const BANNED_RULES = [
  { regex: /never touch a server/i, label: 'never touch a server' },
  { regex: /zero[- ]server/i, label: 'zero server / zero-server' },
  { regex: /100%\s*(strictly\s*)?private/i, label: '100% private / 100% strictly private' },
  { regex: /nothing is tracked/i, label: 'nothing is tracked' },
  { regex: /never tracked/i, label: 'never tracked' },
  { regex: /absolute data privacy/i, label: 'absolute data privacy' },
  { regex: /zero data retention/i, label: 'zero data retention' },
  { regex: /military-grade/i, label: 'military-grade' },
  { regex: /unhackable/i, label: 'unhackable' },
  { regex: /\bguaranteed\b/i, label: 'guaranteed' },
  { regex: /cloudflare secured/i, label: 'Cloudflare Secured' },
  { regex: /verified by analytics/i, label: 'Verified by Analytics' },
  { regex: /\b(160\+|180\+|190\+)\b/, label: 'hardcoded tool count (e.g. 160+, 180+, 190+)' },
];

const SCAN_DIRS = ['src', 'public'];
const EXCLUDE_FILES = [
  'src/lib/copy.ts',
  'scripts/check-copy.mjs',
  'public/mywot73343469a463c45df71b.html',
  'public/ads.txt',
];

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

let totalViolations = 0;
const violationsByFile = new Map();

for (const dir of SCAN_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = getFiles(dir);
  for (const file of files) {
    if (EXCLUDE_FILES.includes(file)) continue;
    if (file.endsWith('.png') || file.endsWith('.ico') || file.endsWith('.gz') || file.endsWith('.svg') || file.endsWith('.jpg')) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineIdx) => {
      for (const rule of BANNED_RULES) {
        if (rule.regex.test(line)) {
          totalViolations++;
          if (!violationsByFile.has(file)) {
            violationsByFile.set(file, []);
          }
          violationsByFile.get(file).push({
            line: lineIdx + 1,
            label: rule.label,
            snippet: line.trim().slice(0, 120),
          });
        }
      }
    });
  }
}

if (totalViolations > 0) {
  console.error(`\n❌ Corporate Copy Standard Violation: Found ${totalViolations} banned phrase occurrence(s) across ${violationsByFile.size} file(s):\n`);
  for (const [file, items] of violationsByFile.entries()) {
    console.error(`File: ${file}`);
    for (const item of items) {
      console.error(`  Line ${item.line} [${item.label}]: "${item.snippet}"`);
    }
    console.error('');
  }
  process.exit(1);
} else {
  console.log('✅ Corporate Copy Standard check: PASSED. Zero banned phrases detected.');
  process.exit(0);
}
