import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.resolve(__dirname, '..', 'src', 'content', 'tools');

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));

console.log(`Inspecting ${files.length} tools for external scripts and auto-running loops...`);

const report = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf8'));
  const id = content.id;
  const externalScripts = content.externalScripts || [];
  const script = content.toolScript || '';

  const issues = [];

  // Check external scripts
  if (externalScripts.length > 0) {
    issues.push(`External scripts: ${externalScripts.join(', ')}`);
  }

  // Check for immediate while loops
  if (/while\s*\(true\)/.test(script) || /while\s*\(1\)/.test(script)) {
    issues.push('Contains while(true) or while(1)');
  }

  // Check for setInterval with small delay running immediately
  const setIntervalMatches = [...script.matchAll(/setInterval\s*\(([^,]+),\s*(\d+)\)/g)];
  for (const m of setIntervalMatches) {
    const delay = parseInt(m[2], 10);
    if (delay < 20) {
      issues.push(`Fast setInterval detected (${delay}ms)`);
    }
  }

  // Check for immediate camera / audio / worker / heavy API calls on load
  if (/navigator\.mediaDevices\.getUserMedia/.test(script) && !/function|addEventListener|onclick/.test(script.split('getUserMedia')[0].slice(-50))) {
    // Might be running immediately
  }

  // Check for heavy canvas animation loop running immediately outside of a start/stop button
  if (/requestAnimationFrame/.test(script)) {
    // check if it starts immediately on load
    const lines = script.split('\n');
    const rafLines = lines.filter(l => l.includes('requestAnimationFrame') && !l.includes('function '));
    if (rafLines.length > 0) {
      // Could be running continuously
    }
  }

  if (issues.length > 0) {
    report.push({ id, file, issues });
  }
}

console.log(`Tools with external scripts or potential loop issues (${report.length}):`);
for (const item of report) {
  console.log(`- ${item.id}:`);
  for (const iss of item.issues) {
    console.log(`    * ${iss}`);
  }
}
