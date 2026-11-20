import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

console.log('Generating machine-readable tools.json manifest for AI agents...');

if (!fs.existsSync(contentToolsDir)) {
  console.error(`Error: Directory not found at ${contentToolsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(contentToolsDir).filter(f => f.endsWith('.json'));
const tools = [];

for (const file of files) {
  const filePath = path.join(contentToolsDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const tool = JSON.parse(raw);
    tools.push({
      id: tool.id,
      name: tool.name,
      title: tool.title,
      description: tool.description,
      category: tool.category,
      url: `https://toolkitgen.com/tool/${tool.id}`,
      tags: Array.isArray(tool.tags) ? tool.tags : [],
      features: Array.isArray(tool.features) ? tool.features : [],
      howTo: Array.isArray(tool.howTo) ? tool.howTo : [],
      faq: Array.isArray(tool.faq) ? tool.faq : [],
      clientSideOnly: true,
      noServerUploads: true,
    });
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}

tools.sort((a, b) => a.id.localeCompare(b.id));

const manifest = {
  $schema: 'https://toolkitgen.com/schemas/tools-v1.json',
  name: 'ToolkitGen Machine-Readable Tools Registry',
  version: '2.0.0',
  description: 'Structured index of client-side web utilities, calculators, and hardware diagnostics designed for autonomous LLM agents and human developers.',
  homepage: 'https://toolkitgen.com',
  totalTools: tools.length,
  generatedAt: new Date().toISOString(),
  tools,
};

const jsonStr = JSON.stringify(manifest, null, 2);

fs.writeFileSync(path.join(publicDir, 'tools.json'), jsonStr + '\n', 'utf8');
console.log(`Saved public/tools.json (${tools.length} tools registered).`);

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'tools.json'), jsonStr + '\n', 'utf8');
  console.log('Synchronized tools.json into dist/.');
}
