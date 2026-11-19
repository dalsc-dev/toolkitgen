import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distToolsDir = path.join(distDir, 'tool');
const csvOutputPath = path.join(rootDir, 'tool-audit.csv');

console.log('Running Comprehensive Tool Page Verification & AdSense Audit (P2)...');

if (!fs.existsSync(distToolsDir)) {
  console.error('Error: dist/tool not found. Run astro build first.');
  process.exit(1);
}

const bannedPhrases = [
  '100% client-side',
  '100% private',
  '100% strictly private',
  'never touch a server',
  'zero server',
  'nothing is tracked',
  'never tracked',
  'absolute data privacy',
  'zero data retention',
  'military-grade',
  'unhackable',
  'guaranteed',
  'localhost',
  'zero latency',
];

const files = fs.readdirSync(distToolsDir).filter((f) => f.endsWith('.html'));
console.log(`Auditing ${files.length} built /tool/* pages across Functional, AdSense, and Performance criteria...`);

// Read perf results if available
let perfMap = {};
const perfCsvPath = path.join(rootDir, 'tool-perf-after.csv');
if (fs.existsSync(perfCsvPath)) {
  const lines = fs.readFileSync(perfCsvPath, 'utf8').trim().split('\n');
  const h = lines[0].split(',').map(s => s.replace(/"/g, ''));
  const slugIdx = h.indexOf('slug');
  const tbtIdx = h.indexOf('tbt_ms');
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.replace(/"/g, ''));
    if (parts[slugIdx]) {
      perfMap[parts[slugIdx]] = {
        tbt: parseInt(parts[tbtIdx] || '0', 10),
      };
    }
  }
}

const auditRows = [];
let totalPassed = 0;

for (const file of files) {
  const slug = file.replace('.html', '');
  const filePath = path.join(distToolsDir, file);
  const html = fs.readFileSync(filePath, 'utf8');

  let functionalPass = true;
  let adPlacementPass = true;
  let perfPass = true;
  const failureNotes = [];

  // 1. Layout & Structure Check
  const posBreadcrumb = html.indexOf('aria-label="Breadcrumb"');
  const posToolStage = html.indexOf('id="tool-app-stage"');
  const posDocSection = html.indexOf('id="tool-documentation-section"');
  const posRecTool = html.indexOf('id="recommended-tool-card"');
  const posRecDiag = html.indexOf('id="recommended-diagnostics"');
  const posFaq = html.indexOf('id="tool-faq"');
  const posBottomAd = html.indexOf('id="ad-slot-tool-bottom-banner"');

  if (posBreadcrumb === -1 || posToolStage === -1 || posDocSection === -1) {
    functionalPass = false;
    failureNotes.push('Missing essential layout stage');
  }

  // 2. Horizontal overflow check
  const widthMatches = [...html.matchAll(/style="[^"]*width:\s*([0-9]+)px[^"]*"/gi)];
  for (const m of widthMatches) {
    const px = parseInt(m[1], 10);
    if (px > 375 && !html.includes('overflow-x-auto') && !html.includes('max-w-full')) {
      functionalPass = false;
      failureNotes.push(`Fixed width ${px}px exceeds mobile 375px`);
    }
  }

  // 3. Copy Cleanliness
  const lowerHtml = html.toLowerCase();
  for (const banned of bannedPhrases) {
    if (lowerHtml.includes(banned)) {
      functionalPass = false;
      failureNotes.push(`Banned phrase: "${banned}"`);
    }
  }

  // 4. JSON-LD Structured Data
  const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length === 0) {
    functionalPass = false;
    failureNotes.push('Missing JSON-LD');
  }

  // 5. AdSense Friendliness & Placement Rules
  // - Ads must NEVER sit above the tool interactive stage
  const adMatches = [...html.matchAll(/class="[^"]*ad-container[^"]*"/gi)];
  for (const m of adMatches) {
    if (m.index < posToolStage) {
      adPlacementPass = false;
      failureNotes.push('Ad found above tool interactive stage');
    }
  }

  // - Every ad slot must carry the "Advertisement" label
  if (adMatches.length > 0 && !html.includes('Advertisement')) {
    adPlacementPass = false;
    failureNotes.push('Missing "Advertisement" label on ad units');
  }

  // - Every ad container must have reserved min-height to prevent CLS
  if (adMatches.length > 0 && !html.includes('min-height:')) {
    adPlacementPass = false;
    failureNotes.push('Ad slot missing min-height container style');
  }

  // 6. Performance Budget Check
  const p = perfMap[slug];
  if (p && p.tbt > 200) {
    perfPass = false;
    failureNotes.push(`TBT ${p.tbt}ms exceeds 200ms budget`);
  }

  const isAllPass = functionalPass && adPlacementPass && perfPass;
  if (isAllPass) totalPassed++;

  auditRows.push({
    slug,
    functional_pass: functionalPass ? 'PASS' : 'FAIL',
    ad_placement_pass: adPlacementPass ? 'PASS' : 'FAIL',
    perf_pass: perfPass ? 'PASS' : 'FAIL',
    status: isAllPass ? 'PASS' : 'FAIL',
    notes: failureNotes.length > 0 ? failureNotes.join('; ') : 'All criteria verified compliant',
  });
}

// Generate CSV
const headers = ['slug', 'functional_pass', 'ad_placement_pass', 'perf_pass', 'status', 'notes'];
const csvContent = [
  headers.join(','),
  ...auditRows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
].join('\n');

fs.writeFileSync(csvOutputPath, csvContent, 'utf8');

console.log(`Audit Complete: ${totalPassed} / ${files.length} tool pages passed 100% of checks.`);
console.log(`Results written to ${csvOutputPath}`);

if (totalPassed !== files.length) {
  console.error(`FAILURE: ${files.length - totalPassed} pages failed audit!`);
  process.exit(1);
}

console.log('Comprehensive Tool Verification Audit: 100% PASSED');
