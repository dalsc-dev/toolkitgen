import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const checkSvg = '<svg class="w-4 h-4 inline-block text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
const warningSvg = '<svg class="w-4 h-4 inline-block text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
const crossSvg = '<svg class="w-4 h-4 inline-block text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';

const replacements = [
  // Arrows
  [/→/g, ' to '],
  [/←/g, ' back '],
  [/↑/g, 'Up'],
  [/↓/g, 'Down'],
  [/↻/g, 'Sync'],
  [/↩️?/g, 'Back'],
  [/➔/g, ''],
  
  // Checks and symbols
  [/✓/g, checkSvg],
  [/✔/g, checkSvg],
  [/✕/g, crossSvg],
  [/✖/g, crossSvg],
  [/⚠(?:️)?/g, warningSvg],
  
  // Specific tool text emoji
  [/TOO DARK ☀/g, 'TOO DARK (Low Light)'],
  [/☕ Caffeine Solution/g, 'Caffeine Solution'],
  [/👁️ Peptide Complex/g, 'Peptide Complex'],
  [/♪_/g, '_'],
  [/Strike Price Axis →/g, 'Strike Price Axis (Horizontal)'],
  [/← Days to Exp/g, 'Days to Expiration (Vertical)'],
  [/Green clearer → Over-focused/g, 'Green clearer: Over-focused'],
  [/Red clearer → Under-focused/g, 'Red clearer: Under-focused'],
  [/Colors equal → Well-focused/g, 'Colors equal: Well-focused'],
  [/Continue to Test →/g, 'Continue to Test'],
  [/Next Location →/g, 'Next Location'],
  [/← Check Another Date/g, 'Check Another Date'],
  [/20Hz → 20kHz/g, '20Hz to 20kHz'],
  [/arrow\.innerText = "→"/g, 'arrow.innerText = ">"'],
  
  // Wiki speed racer temperature indicators
  [/❄️/g, 'Cold'],
  [/🔥/g, 'Hot'],
  [/🌡️/g, 'Warm'],
  [/😐/g, 'Neutral'],
  [/🏎️/g, 'Fast'],
  [/💨/g, 'Dash'],
  
  // Generic emoji removals
  [/💡/g, ''],
  [/🚀/g, ''],
  [/💤/g, ''],
  [/📱/g, ''],
  [/🎮/g, ''],
  [/🗂/g, ''],
  [/📂/g, ''],
  [/🔗/g, ''],
  [/🎂/g, ''],
  [/🌈/g, ''],
  [/📺/g, ''],
  [/🎵/g, ''],
  [/📚/g, ''],
  [/🛰/g, ''],
  [/🚨/g, ''],
  [/🎤/g, ''],
  [/🏆/g, ''],
  [/😈/g, ''],
  [/📩/g, ''],
  [/🎉/g, ''],
  [/☀/g, ''],
  [/👓/g, ''],
  [/🍊/g, ''],
  [/🥕/g, ''],
  [/💆/g, ''],
  [/💧/g, ''],
  [/☕/g, ''],
  [/👁/g, ''],
  [/🍯/g, ''],
  [/🧴/g, ''],
  [/🍃/g, ''],
  [/♪/g, '']
];

function cleanString(str) {
  if (typeof str !== 'string') return str;
  let res = str;
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(res)) {
      res = res.replace(pattern, replacement);
    }
  }
  return res;
}

function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  }
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      result[key] = cleanString(val);
    } else if (typeof val === 'object' && val !== null) {
      result[key] = cleanObject(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'legacy') {
        processDir(fullPath);
      }
    } else if (entry.name.endsWith('.json')) {
      try {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const parsed = JSON.parse(raw);
        const cleaned = cleanObject(parsed);
        const newRaw = JSON.stringify(cleaned, null, 2);
        if (newRaw !== raw) {
          fs.writeFileSync(fullPath, newRaw);
          console.log(`Cleaned JSON emoji: ${path.relative(rootDir, fullPath)}`);
        }
      } catch (e) {
        console.error('Failed to parse JSON:', fullPath, e.message);
      }
    } else if (/\.(astro|tsx|ts|js|html|md|mdx)$/.test(entry.name) && !entry.name.endsWith('strip-all-emoji.mjs')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = cleanString(content);
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Cleaned text emoji: ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

processDir(path.join(rootDir, 'src'));
console.log('Finished stripping emoji with JSON safety.');
