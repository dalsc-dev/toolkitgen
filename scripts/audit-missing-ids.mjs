import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.resolve(__dirname, '..', 'src', 'content', 'tools');

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));

console.log(`Auditing ${files.length} tool JSON files for missing DOM IDs...`);

const missingReport = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf8'));
  const html = content.toolHtml || '';
  const script = content.toolScript || '';

  // Extract all IDs in toolHtml
  const htmlIdMatches = [...html.matchAll(/id=["']([a-zA-Z0-9_-]+)["']/g)].map(m => m[1]);
  const htmlIds = new Set(htmlIdMatches);

  // Extract all getElementById calls in script
  const scriptGetElMatches = [...script.matchAll(/getElementById\s*\(\s*["'`]([a-zA-Z0-9_-]+)["'`]\s*\)/g)].map(m => m[1]);
  
  // Extract querySelector('#...')
  const querySelMatches = [...script.matchAll(/querySelector(?:All)?\s*\(\s*["'`]#([a-zA-Z0-9_-]+)["'`]\s*\)/g)].map(m => m[1]);

  const allScriptIds = new Set([...scriptGetElMatches, ...querySelMatches]);

  const missing = [];
  for (const id of allScriptIds) {
    if (!htmlIds.has(id)) {
      missing.push(id);
    }
  }

  if (missing.length > 0) {
    missingReport.push({
      file,
      id: content.id,
      missingIds: missing
    });
  }
}

console.log(`Found ${missingReport.length} tools where toolScript references IDs not in toolHtml:`);
for (const item of missingReport) {
  console.log(`- ${item.id} (${item.file}): ${item.missingIds.join(', ')}`);
}
