import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runHangGuard() {
  console.log('Running Hang-Guard CI Verification across all tools...');

  const toolFiles = fs.readdirSync('dist/tool').filter(f => f.endsWith('.html'));
  console.log(`Discovered ${toolFiles.length} built tool pages in dist/tool/`);

  const browser = await chromium.launch({ headless: true });
  const results = [];
  const CONCURRENCY = 4;
  let index = 0;

  async function worker(workerId) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
      hasTouch: true,
      isMobile: true
    });

    const page = await context.newPage();

    // Zero-network file routing directly to dist
    await page.route('**/*', route => {
      const u = route.request().url();
      if (u.includes('/_astro/')) {
        const fileName = u.split('/_astro/')[1].split('?')[0];
        const p = path.resolve('dist/_astro', fileName);
        if (fs.existsSync(p)) {
          return route.fulfill({
            status: 200,
            contentType: fileName.endsWith('.css') ? 'text/css' : 'application/javascript',
            body: fs.readFileSync(p)
          });
        }
      }
      if (u.includes('/assets/')) {
        const sub = u.split('/assets/')[1].split('?')[0];
        const p = path.resolve('dist/assets', sub);
        if (fs.existsSync(p)) {
          return route.fulfill({
            status: 200,
            contentType: p.endsWith('.css') ? 'text/css' : 'application/octet-stream',
            body: fs.readFileSync(p)
          });
        }
      }
      if (u.includes('googlesyndication.com') || u.includes('googletagmanager.com') || u.includes('google-analytics.com')) {
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.adsbygoogle = window.adsbygoogle || [];' });
      }
      route.continue();
    });

    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });

    await page.addInitScript(() => {
      window.__heartbeat = {
        maxGap: 0,
        lastTick: performance.now(),
        longTasks: [],
        domStart: 0,
        domEnd: 0
      };

      setInterval(() => {
        const now = performance.now();
        const gap = now - window.__heartbeat.lastTick;
        if (gap > window.__heartbeat.maxGap) {
          window.__heartbeat.maxGap = gap;
        }
        window.__heartbeat.lastTick = now;
      }, 50);

      try {
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__heartbeat.longTasks.push(entry.duration);
          }
        });
        po.observe({ type: 'longtask', buffered: true });
      } catch (e) {}
    });

    while (index < toolFiles.length) {
      const file = toolFiles[index++];
      const slug = file.replace('.html', '');
      const filePath = 'file://' + path.resolve('dist/tool', file);

      try {
        const t0 = performance.now();
        await page.goto(filePath, { waitUntil: 'load', timeout: 10000 });
        const loadDuration = performance.now() - t0;

        await page.evaluate(() => {
          window.__heartbeat.domStart = document.querySelectorAll('*').length;
        });

        await page.waitForTimeout(1500);

        const metrics = await page.evaluate(() => {
          window.__heartbeat.domEnd = document.querySelectorAll('*').length;
          const longestTask = window.__heartbeat.longTasks.reduce((max, d) => Math.max(max, d), 0);
          const stage = document.getElementById('tool-app-stage');
          const isInitialized = Boolean(stage && stage.offsetHeight > 50);

          return {
            maxGap: Math.round(window.__heartbeat.maxGap),
            longestTask: Math.round(longestTask),
            domGrowth: window.__heartbeat.domEnd - window.__heartbeat.domStart,
            isInitialized
          };
        });

        results.push({
          slug,
          loadDurationMs: Math.round(loadDuration),
          maxGapMs: metrics.maxGap,
          longestTaskMs: metrics.longestTask,
          domGrowth: metrics.domGrowth,
          isInitialized: metrics.isInitialized,
          pass: metrics.maxGap <= 1000 && metrics.isInitialized
        });

        if (index % 25 === 0 || index === toolFiles.length) {
          console.log(`[Hang-Guard] Checked ${index}/${toolFiles.length} tools...`);
        }
      } catch (err) {
        console.error(`[Hang-Guard] Failed on ${slug}:`, err.message);
        results.push({
          slug,
          loadDurationMs: -1,
          maxGapMs: 9999,
          longestTaskMs: 9999,
          domGrowth: -1,
          isInitialized: false,
          pass: false
        });
      }
    }

    await context.close();
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  await browser.close();

  // Generate hang-audit-after.csv
  results.sort((a, b) => b.maxGapMs - a.maxGapMs);
  const csvHeaders = 'slug,loadDurationMs,maxGapMs,longestTaskMs,domGrowth,isInitialized,pass';
  const csvRows = results.map(r => `${r.slug},${r.loadDurationMs},${r.maxGapMs},${r.longestTaskMs},${r.domGrowth},${r.isInitialized},${r.pass}`);
  fs.writeFileSync('hang-audit-after.csv', [csvHeaders, ...csvRows].join('\n') + '\n');

  console.log('Hang-Guard run complete! Wrote hang-audit-after.csv');

  const failed = results.filter(r => !r.pass);
  if (failed.length > 0) {
    console.error(`Hang-Guard FAILED on ${failed.length} tools:`);
    console.table(failed);
    process.exit(1);
  } else {
    console.log(`Hang-Guard PASSED: All ${results.length} tools verified with max-gap <= 1000ms on 6x throttle and successful initialization.`);
  }
}

runHangGuard().catch(err => {
  console.error('Fatal Hang-Guard failure:', err);
  process.exit(1);
});
