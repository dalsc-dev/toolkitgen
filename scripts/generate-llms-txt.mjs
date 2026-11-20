import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

console.log('Generating automated llms.txt and llms-full.txt manifests...');

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
    tools.push(tool);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}

// Group tools by category
const categoryMap = new Map();
for (const tool of tools) {
  const cat = tool.category || 'General Utilities';
  if (!categoryMap.has(cat)) {
    categoryMap.set(cat, []);
  }
  categoryMap.get(cat).push(tool);
}

// 1. Generate llms.txt (Concise agent directory)
let llmsTxt = `# ToolkitGen

> Free, high-performance browser-based tools, calculators, and hardware diagnostics. Every tool executes client-side in browser memory with no server uploads.

## Documentation & AI Manifests
- [Machine-Readable Tools Registry](https://toolkitgen.com/tools.json): JSON catalog of all tools, capabilities, parameters, and input/output contracts.
- [Full Documentation Manifest](https://toolkitgen.com/llms-full.txt): Comprehensive technical descriptions, feature specifications, and procedures.
- [XML Sitemap Index](https://toolkitgen.com/sitemap-index.xml): Authoritative index of all static tool and guide endpoints.

`;

for (const [category, catTools] of categoryMap.entries()) {
  llmsTxt += `## ${category}\n`;
  catTools.sort((a, b) => a.name.localeCompare(b.name));
  for (const tool of catTools) {
    const desc = tool.description ? tool.description.replace(/\n+/g, ' ').trim() : 'Client-side utility.';
    llmsTxt += `- [${tool.name}](https://toolkitgen.com/tool/${tool.id}): ${desc}\n`;
  }
  llmsTxt += '\n';
}

// 2. Generate llms-full.txt (In-depth reference for LLM agents)
let llmsFullTxt = `# ToolkitGen - Full System Manifest

> Complete directory of browser-based utilities, hardware benchmarks, and client-side calculators. All processing occurs locally in browser memory with no server telemetry.

## System Details
- Homepage: https://toolkitgen.com
- Framework: Static Astro Architecture
- Execution Boundary: Client-side JavaScript / WebAssembly / Web APIs (WebHID, WebCodecs, WebGPU, WebCrypto)
- Total Active Tools: ${tools.length}

`;

for (const [category, catTools] of categoryMap.entries()) {
  llmsFullTxt += `## Category: ${category}\n\n`;
  catTools.sort((a, b) => a.name.localeCompare(b.name));
  for (const tool of catTools) {
    llmsFullTxt += `### ${tool.name}\n`;
    llmsFullTxt += `- URL: https://toolkitgen.com/tool/${tool.id}\n`;
    if (tool.description) llmsFullTxt += `- Summary: ${tool.description}\n`;
    if (tool.quickAnswer) llmsFullTxt += `- Overview: ${tool.quickAnswer}\n`;

    if (Array.isArray(tool.features) && tool.features.length > 0) {
      llmsFullTxt += `- Key Capabilities:\n`;
      for (const feat of tool.features) {
        llmsFullTxt += `  * ${feat}\n`;
      }
    }

    if (Array.isArray(tool.howTo) && tool.howTo.length > 0) {
      llmsFullTxt += `- Procedure Steps:\n`;
      for (const step of tool.howTo) {
        llmsFullTxt += `  * ${step.name}: ${step.text}\n`;
      }
    }

    if (Array.isArray(tool.faq) && tool.faq.length > 0) {
      llmsFullTxt += `- Frequent Questions:\n`;
      for (const item of tool.faq.slice(0, 3)) {
        llmsFullTxt += `  * Q: ${item.q}\n    A: ${item.a}\n`;
      }
    }

    llmsFullTxt += '\n';
  }
}

// Write outputs to public/
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt.trim() + '\n', 'utf8');
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullTxt.trim() + '\n', 'utf8');
console.log(`Saved public/llms.txt and public/llms-full.txt (${tools.length} tools indexed).`);

// If dist/ exists, write directly to dist/ as well
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxt.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(distDir, 'llms-full.txt'), llmsFullTxt.trim() + '\n', 'utf8');
  console.log('Synchronized llms.txt and llms-full.txt into dist/.');
}
