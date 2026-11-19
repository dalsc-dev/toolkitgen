import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.resolve(__dirname, '..', 'src', 'content', 'tools');

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));

const extScriptsList = new Set();
for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf8'));
  const scripts = content.externalScripts || [];
  for (const s of scripts) {
    extScriptsList.add(s);
  }
}

console.log(`Found ${extScriptsList.size} unique external scripts across 132 tools:`);
for (const s of extScriptsList) {
  console.log(`- ${s}`);
}
