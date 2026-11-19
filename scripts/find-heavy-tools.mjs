import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.resolve(__dirname, '..', 'src', 'content', 'tools');

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));

console.log(`Scanning ${files.length} tools for immediate heavy on-load execution...`);

const culprits = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf8'));
  const id = content.id;
  const script = content.toolScript || '';
  const externalScripts = content.externalScripts || [];

  const reasons = [];

  // 1. External scripts in head blocking render
  if (externalScripts.length > 0) {
    reasons.push(`${externalScripts.length} blocking external script(s) loaded synchronously via <script is:inline>`);
  }

  // 2. Immediate loadFromUri or fetch of models
  if (/loadFromUri|forVisionTasks|createFromOptions|tf\.load|ort\.InferenceSession/.test(script)) {
    reasons.push('Immediately initiates neural network/WASM model loading on page load');
  }

  // 3. Immediate AudioContext creation on page load (can block / suspend in browsers)
  if (/(?:new\s+(?:window\.)?(?:AudioContext|webkitAudioContext))\s*\(\)/.test(script)) {
    // Check if it's called inside a function or immediately at top level
    const matchIndex = script.search(/(?:new\s+(?:window\.)?(?:AudioContext|webkitAudioContext))\s*\(\)/);
    const preceding = script.slice(Math.max(0, matchIndex - 60), matchIndex);
    if (!preceding.includes('function') && !preceding.includes('addEventListener') && !preceding.includes('onclick')) {
      reasons.push('Creates AudioContext immediately at top-level script execution');
    }
  }

  // 4. Immediate Canvas loop running before user action
  if (/requestAnimationFrame\s*\(\s*([a-zA-Z0-9_]+)\s*\)/.test(script)) {
    // Check if raf is invoked at top level
    const lines = script.split('\n');
    for (const line of lines) {
      if (/^\s*requestAnimationFrame\s*\(/.test(line) || /^\s*[a-zA-Z0-9_]+\s*\(\s*\);\s*$/.test(line)) {
        // could be top-level loop start
      }
    }
  }

  // 5. Heavy libraries loaded globally (Three.js, Leaflet, TensorFlow, MathJax, SQL.js)
  for (const ext of externalScripts) {
    if (ext.includes('tfjs') || ext.includes('face-api') || ext.includes('tasks-vision') || ext.includes('three.js') || ext.includes('sql-wasm') || ext.includes('mathjax')) {
      reasons.push(`Loads heavyweight runtime library: ${ext.split('/').pop()}`);
    }
  }

  if (reasons.length > 0) {
    culprits.push({ id, reasons });
  }
}

console.log(`Found ${culprits.length} tools with render-blocking or heavy on-load behavior:\n`);
for (const c of culprits) {
  console.log(`Tool: /tool/${c.id}`);
  for (const r of c.reasons) {
    console.log(`  - ${r}`);
  }
}
