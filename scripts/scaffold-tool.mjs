import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const slug = process.argv[2];

if (!slug) {
  console.error('Usage: pnpm new:tool <slug>');
  console.error('Example: pnpm new:tool network_speed_tester');
  process.exit(1);
}

// Convert slug to PascalCase for component name
const pascalCase = slug
  .split('_')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');

const readableName = slug
  .split('_')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join(' ');

console.log(`Scaffolding new tool: ${slug} (${pascalCase})...`);

// 1. Tool Directory
const toolDir = path.join(rootDir, 'src', 'tools', slug);
fs.mkdirSync(toolDir, { recursive: true });

// 2. logic.ts
const logicPath = path.join(toolDir, 'logic.ts');
const logicContent = `export interface ${pascalCase}State {
  status: 'idle' | 'running' | 'completed';
  result: string | null;
}

export function createInitialState(): ${pascalCase}State {
  return {
    status: 'idle',
    result: null,
  };
}

export function process${pascalCase}Input(input: string): string {
  if (!input.trim()) return 'No input provided';
  return \`Processed \${input.trim().length} characters locally.\`;
}
`;
fs.writeFileSync(logicPath, logicContent);

// 3. logic.test.ts
const testPath = path.join(toolDir, 'logic.test.ts');
const testContent = `import { describe, it, expect } from 'vitest';
import { createInitialState, process${pascalCase}Input } from './logic';

describe('${readableName} Logic', () => {
  it('initializes in idle state', () => {
    const state = createInitialState();
    expect(state.status).toBe('idle');
    expect(state.result).toBeNull();
  });

  it('processes input correctly', () => {
    expect(process${pascalCase}Input('')).toBe('No input provided');
    expect(process${pascalCase}Input('hello')).toContain('5 characters');
  });
});
`;
fs.writeFileSync(testPath, testContent);

// 4. Island.tsx
const islandPath = path.join(toolDir, `${pascalCase}Island.tsx`);
const islandContent = `import { useState } from 'preact/hooks';
import { createInitialState, process${pascalCase}Input } from './logic';

export default function ${pascalCase}Island() {
  const [state, setState] = useState(createInitialState());
  const [input, setInput] = useState('');

  const handleRun = () => {
    const res = process${pascalCase}Input(input);
    setState({ status: 'completed', result: res });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-4">
      <h3 className="text-lg font-bold text-slate-900">${readableName}</h3>
      <textarea
        value={input}
        onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]"
        placeholder="Enter data for local processing..."
        rows={4}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRun}
          className="px-5 py-2 text-xs font-bold text-white bg-[#EE6C4D] hover:bg-[#d75a3c] rounded-xl transition-colors"
        >
          Process Locally
        </button>
      </div>
      {state.result && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800">
          {state.result}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(islandPath, islandContent);

// 5. Content JSON
const contentDir = path.join(rootDir, 'src', 'content', 'tools');
fs.mkdirSync(contentDir, { recursive: true });
const contentJsonPath = path.join(contentDir, `${slug}.json`);
const contentJson = {
  id: slug,
  name: readableName,
  title: `${readableName} | Online Free Utility`,
  description: `Free, 100% private online ${readableName.toLowerCase()} tool. Fast client-side browser execution with zero server logging.`,
  category: 'Utilities',
  tags: [slug, 'online tool', 'free utility'],
  featured: false,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  author: 'ToolkitGen Engineering Team',
  quickAnswer: `${readableName} is a client-side utility that operates directly in browser memory without sending user data to remote servers.`,
  features: [
    '100% Client-Side Processing',
    'Zero Data Logging',
    'Instant Local Execution',
    'Offline Capable'
  ],
  howTo: [
    { name: 'Open Tool', text: `Navigate to the ${readableName} interface.` },
    { name: 'Input Parameters', text: 'Enter your values or upload files directly into the client workspace.' },
    { name: 'Execute', text: 'Review results computed instantly on-device.' }
  ],
  faq: [
    { q: `Is my data private when using ${readableName}?`, a: 'Yes. All computation is performed locally in your browser memory.' }
  ],
  related: [],
  adSlots: { top: true, sidebar: true, bottom: true },
  articleHtml: `<section><h2>Overview</h2><p>Comprehensive guide for ${readableName}.</p></section>`
};
fs.writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));

console.log(`Successfully scaffolded ${slug}!`);
console.log(`- Logic: src/tools/${slug}/logic.ts`);
console.log(`- Unit Test: src/tools/${slug}/logic.test.ts`);
console.log(`- Island: src/tools/${slug}/${pascalCase}Island.tsx`);
console.log(`- Content: src/content/tools/${slug}.json`);
