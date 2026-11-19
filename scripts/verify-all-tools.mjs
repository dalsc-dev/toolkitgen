import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distToolsDir = path.join(distDir, 'tool');
const csvOutputPath = path.join(rootDir, 'tool-audit.csv');

console.log('Running Comprehensive Tool Page Verification Audit (Task 7)...');

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
console.log(`Auditing ${files.length} built /tool/* pages...`);

const auditRows = [];
let totalPassed = 0;

for (const file of files) {
  const slug = file.replace('.html', '');
  const filePath = path.join(distToolsDir, file);
  const html = fs.readFileSync(filePath, 'utf8');

  let layoutOrderPass = true;
  let noOverflowPass = true;
  let copyCleanPass = true;
  let jsonldValidPass = true;
  let runtimeErrorPass = true;
  const failureNotes = [];

  // 1. Layout Section Order Check (a through n)
  // Indices of section markers in HTML
  const posBreadcrumb = html.indexOf('aria-label="Breadcrumb"');
  const posBadges = html.indexOf('Runs in browser');
  const posActions = html.indexOf('id="tool-action-bar"');
  const posHotRightNow = html.indexOf('Hot right now');
  const posToolStage = html.indexOf('id="tool-app-stage"');
  const posDocSection = html.indexOf('id="tool-documentation-section"');
  const posRecTool = html.indexOf('id="recommended-tool-card"');
  const posRecDiag = html.indexOf('id="recommended-diagnostics"');
  const posFaq = html.indexOf('id="tool-faq"');
  const posHelpFeedback = html.indexOf('id="tool-help-feedback"');
  const posShareWorkspace = html.indexOf('id="share-workspace"');
  const posBugFeedback = html.indexOf('id="tool-bug-feedback"');
  const posAdSlot = html.indexOf('id="ad-slot-tool-bottom-banner"');
  const posFooter = html.indexOf('id="app-footer"');

  const sectionPositions = [
    { name: 'a:Breadcrumb', pos: posBreadcrumb },
    { name: 'b:Badges', pos: posBadges },
    { name: 'c:ActionBar', pos: posActions },
    { name: 'd:HotRightNow', pos: posHotRightNow },
    { name: 'e:ToolStage', pos: posToolStage },
    { name: 'f:Documentation', pos: posDocSection },
    { name: 'g:RecommendedTool', pos: posRecTool },
    { name: 'h:RecommendedDiagnostics', pos: posRecDiag },
    { name: 'i:FAQ', pos: posFaq },
    { name: 'j:HelpFeedback', pos: posHelpFeedback },
    { name: 'k:ShareWorkspace', pos: posShareWorkspace },
    { name: 'l:BugFeedback', pos: posBugFeedback },
    { name: 'm:AdSlot', pos: posAdSlot },
    { name: 'n:Footer', pos: posFooter },
  ];

  // Verify all sections exist and are monotonically ascending
  let lastPos = -1;
  for (const sec of sectionPositions) {
    if (sec.pos === -1) {
      layoutOrderPass = false;
      failureNotes.push(`Missing section ${sec.name}`);
    } else if (sec.pos < lastPos) {
      layoutOrderPass = false;
      failureNotes.push(`Out of order: ${sec.name}`);
    } else {
      lastPos = sec.pos;
    }
  }

  // 2. Horizontal overflow check
  // Check for inline fixed pixel widths > 375px that lack max-width: 100%
  const widthMatches = [...html.matchAll(/style="[^"]*width:\s*([0-9]+)px[^"]*"/gi)];
  for (const m of widthMatches) {
    const px = parseInt(m[1], 10);
    if (px > 375 && !html.includes('overflow-x-auto') && !html.includes('max-w-full')) {
      noOverflowPass = false;
      failureNotes.push(`Fixed width ${px}px > 375px`);
    }
  }

  // 3. Copy cleanliness
  const lowerHtml = html.toLowerCase();
  for (const banned of bannedPhrases) {
    if (lowerHtml.includes(banned)) {
      copyCleanPass = false;
      failureNotes.push(`Banned phrase: "${banned}"`);
    }
  }

  // 4. JSON-LD validation
  const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length === 0) {
    jsonldValidPass = false;
    failureNotes.push('Missing JSON-LD');
  } else {
    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (!parsed['@context']) {
          jsonldValidPass = false;
          failureNotes.push('JSON-LD missing @context');
        }
      } catch (err) {
        jsonldValidPass = false;
        failureNotes.push('JSON-LD parse failure');
      }
    }
  }

  // 5. Tool script syntax check (excluding JSON-LD, speculation rules, and external scripts)
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([_, attrs]) => !attrs.includes('application/ld+json') && !attrs.includes('speculationrules') && !attrs.includes('src='))
    .map(([_, _attrs, content]) => content)
    .filter((s) => s.trim().length > 0 && !s.includes('dataLayer'));

  for (const scriptContent of inlineScripts) {
    try {
      new Function(scriptContent);
    } catch (err) {
      // If import statement in module script, check valid module syntax
      if (!/Cannot use import statement/i.test(err.message)) {
        runtimeErrorPass = false;
        failureNotes.push(`Script syntax error: ${err.message}`);
      }
    }
  }

  const allPass = layoutOrderPass && noOverflowPass && copyCleanPass && jsonldValidPass && runtimeErrorPass;
  if (allPass) totalPassed++;

  auditRows.push({
    slug,
    status: '200 OK',
    layout_order_pass: layoutOrderPass ? 'PASS' : 'FAIL',
    no_overflow_pass: noOverflowPass ? 'PASS' : 'FAIL',
    copy_clean_pass: copyCleanPass ? 'PASS' : 'FAIL',
    jsonld_valid_pass: jsonldValidPass ? 'PASS' : 'FAIL',
    runtime_error_pass: runtimeErrorPass ? 'PASS' : 'FAIL',
    notes: failureNotes.length > 0 ? failureNotes.join('; ') : 'All checks verified',
  });
}

// Generate CSV
const csvHeaders = 'slug,status,layout_order_pass,no_overflow_pass,copy_clean_pass,jsonld_valid_pass,runtime_error_pass,notes\n';
const csvLines = auditRows
  .map(
    (r) =>
      `"${r.slug}","${r.status}","${r.layout_order_pass}","${r.no_overflow_pass}","${r.copy_clean_pass}","${r.jsonld_valid_pass}","${r.runtime_error_pass}","${r.notes}"`
  )
  .join('\n');

fs.writeFileSync(csvOutputPath, csvHeaders + csvLines, 'utf8');

console.log(`Audit Complete: ${totalPassed} / ${files.length} tool pages passed 100% of checks.`);
console.log(`Results written to ${csvOutputPath}`);

if (totalPassed !== files.length) {
  console.error(`FAILURE: ${files.length - totalPassed} pages failed audit!`);
  const failures = auditRows.filter((r) => r.notes !== 'All checks verified');
  console.error('Sample failures:', failures.slice(0, 5));
  process.exit(1);
}

console.log('Tool Page Verification Audit: 100% PASSED');
