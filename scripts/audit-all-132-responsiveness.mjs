import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolsDir = path.join(rootDir, 'src', 'content', 'tools');
const distDir = path.join(rootDir, 'dist');

const toolFiles = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json'));
console.log(`Starting responsiveness audit of all ${toolFiles.length} tools...`);

import('playwright').then(async ({ chromium }) => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let pathname = url.pathname;
    if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    if (!pathname.endsWith('.html') && !path.extname(pathname)) pathname += '.html';
    
    const filePath = path.join(distDir, pathname.startsWith('/') ? pathname.slice(1) : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.svg': 'image/svg+xml',
        '.json': 'application/json'
      };
      route.fulfill({ status: 200, contentType: mimeTypes[ext] || 'text/plain', body: fs.readFileSync(filePath) });
    } else {
      route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
    }
  });

  const offenders = [];
  let checkedCount = 0;

  for (const file of toolFiles) {
    const slug = file.replace('.json', '');
    const page = await context.newPage();
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    let maxTaskMs = 0;
    let tbtMs = 0;

    await page.exposeFunction('__recordTask', (duration) => {
      if (duration > maxTaskMs) maxTaskMs = duration;
      if (duration > 50) tbtMs += (duration - 50);
    });

    await page.addInitScript(() => {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (window.__recordTask) window.__recordTask(entry.duration);
          }
        });
        observer.observe({ type: 'longtask', buffered: true });
      } catch (e) {}
    });

    const start = Date.now();
    try {
      await page.goto(`http://localhost:4321/tool/${slug}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForTimeout(300);
      const loadMs = Date.now() - start;

      checkedCount++;
      if (checkedCount % 25 === 0) {
        console.log(`Audited ${checkedCount}/${toolFiles.length} tools...`);
      }

      if (pageErrors.length > 0 || consoleErrors.length > 0 || maxTaskMs > 150 || tbtMs > 100 || loadMs > 2500) {
        offenders.push({
          slug,
          loadMs,
          maxTaskMs: Math.round(maxTaskMs),
          tbtMs: Math.round(tbtMs),
          pageErrors,
          consoleErrors
        });
      }
    } catch (err) {
      offenders.push({
        slug,
        loadMs: 5000,
        maxTaskMs: 5000,
        tbtMs: 5000,
        pageErrors: [`TIMEOUT OR UNRESPONSIVE: ${err.message}`],
        consoleErrors: []
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n=== AUDIT COMPLETE ===');
  console.log(`Total tools checked: ${checkedCount}`);
  console.log(`Flagged tools: ${offenders.length}`);
  if (offenders.length > 0) {
    console.table(offenders.map(o => ({
      slug: o.slug,
      loadMs: o.loadMs,
      maxTask: o.maxTaskMs,
      tbt: o.tbtMs,
      errors: o.pageErrors.length + o.consoleErrors.length
    })));
  }
});
