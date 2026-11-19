import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distToolsDir = path.join(rootDir, 'dist', 'tool');

async function pingIndexNow() {
  console.log('Running IndexNow Build-Time Ping...');
  if (!fs.existsSync(distToolsDir)) {
    console.log('dist/tool not found, skipping IndexNow ping.');
    return;
  }

  const files = fs.readdirSync(distToolsDir).filter(f => f.endsWith('.html'));
  const urls = [
    'https://toolkitgen.com/',
    'https://toolkitgen.com/tool',
    'https://toolkitgen.com/about',
    'https://toolkitgen.com/sitemap',
    ...files.map(f => `https://toolkitgen.com/tool/${f.replace('.html', '')}`)
  ];

  const payload = {
    host: 'toolkitgen.com',
    key: '4675079345370949indexnowkey2026',
    keyLocation: 'https://toolkitgen.com/4675079345370949indexnowkey2026.txt',
    urlList: urls.slice(0, 100), // IndexNow batch
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    console.log(`IndexNow ping responded with status: ${res.status}`);
  } catch (err) {
    console.log(`IndexNow ping skipped (offline or sandbox mode): ${err.message}`);
  }
}

pingIndexNow();
