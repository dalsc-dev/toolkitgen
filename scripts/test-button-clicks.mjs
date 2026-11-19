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

async function testButtons() {
  const files = fs.readdirSync(distToolsDir).filter((f) => f.endsWith('.html'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  await context.route('**/*', (route) => {
    const reqUrl = route.request().url();
    try {
      const url = new URL(reqUrl);
      let filePath = path.join(distDir, url.pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        route.fulfill({
          status: 200,
          contentType: MIME_TYPES[ext] || 'text/plain',
          body: fs.readFileSync(filePath),
        });
      } else {
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
      }
    } catch (e) {
      route.abort();
    }
  });

  const brokenTools = [];

  for (const f of files) {
    const slug = f.replace('.html', '');
    const page = await context.newPage();
    const pageErrors = [];

    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('google') && !text.includes('doubleclick')) {
          pageErrors.push(text);
        }
      }
    });

    try {
      await page.goto(`http://toolkitgen.local/tool/${slug}`, { waitUntil: 'domcontentloaded' });
      const buttons = await page.$$('#tool-app-stage button');
      for (const btn of buttons.slice(0, 3)) {
        try {
          await btn.click({ timeout: 500 });
          await page.waitForTimeout(50);
        } catch (e) {}
      }

      const inputs = await page.$$('#tool-app-stage input[type=range]');
      for (const input of inputs.slice(0, 2)) {
        try {
          await input.fill('50');
          await page.waitForTimeout(50);
        } catch (e) {}
      }

      if (pageErrors.length > 0) {
        brokenTools.push({ slug, errors: pageErrors });
      }
    } catch (err) {
      brokenTools.push({ slug, errors: [err.message] });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`Audited ${files.length} tools for interactive button/slider clicks.`);
  console.log(`Found ${brokenTools.length} tools with click exceptions:`);
  console.log(JSON.stringify(brokenTools, null, 2));
}

testButtons().catch(console.error);
