import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distToolsDir = path.join(distDir, 'tool');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

async function testLoad() {
  const files = fs.readdirSync(distToolsDir).filter((f) => f.endsWith('.html'));
  console.log(`Testing load times across ${files.length} built tools...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const slowTools = [];
  const networkRequests = new Map();

  await context.route('**/*', (route) => {
    const reqUrl = route.request().url();
    try {
      const url = new URL(reqUrl);
      let filePath = path.join(distDir, url.pathname);
      if (url.pathname === '/' || url.pathname === '') {
        filePath = path.join(distDir, 'index.html');
      } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        route.fulfill({
          status: 200,
          contentType: MIME_TYPES[ext] || 'text/plain',
          body: fs.readFileSync(filePath),
        });
      } else {
        // Track external network requests
        if (reqUrl.startsWith('http')) {
          const origin = url.origin;
          networkRequests.set(origin, (networkRequests.get(origin) || 0) + 1);
        }
        // Fulfill with empty mock so it doesn't hang in tests
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
      }
    } catch (e) {
      route.abort();
    }
  });

  for (const f of files) {
    const slug = f.replace('.html', '');
    const page = await context.newPage();
    const start = Date.now();

    try {
      await page.goto(`http://toolkitgen.local/tool/${slug}`, { waitUntil: 'load', timeout: 5000 });
      const elapsed = Date.now() - start;
      if (elapsed > 500) {
        slowTools.push({ slug, elapsed });
      }
    } catch (err) {
      slowTools.push({ slug, error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('--- EXTERNAL REQUEST ORIGINS DETECTED ON PAGE LOAD ---');
  for (const [origin, count] of networkRequests.entries()) {
    console.log(`${origin}: ${count} requests`);
  }

  console.log(`\nSlow / Hanging tools (${slowTools.length}):`);
  for (const s of slowTools) {
    console.log(s);
  }
}

testLoad().catch(console.error);
