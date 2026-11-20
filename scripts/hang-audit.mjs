import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let p = path.join('dist', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(p) && fs.existsSync(p + '.html')) p += '.html';
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

async function runAudit() {
  await new Promise(resolve => server.listen(4328, resolve));
  console.log('Audit static server listening on port 4328');

  // Collect all tool slugs and hub slugs
  const toolFiles = fs.readdirSync('src/content/tools').filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
  const hubFiles = fs.readdirSync('src/content/hubs').filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
  
  const allTargets = [
    ...toolFiles.map(s => ({ type: 'tool', slug: s, url: `http://localhost:4328/tool/${s}` })),
    ...hubFiles.map(s => ({ type: 'hub', slug: s, url: `http://localhost:4328/hubs/${s}` }))
  ];

  console.log(`Starting hang audit across ${allTargets.length} pages (132 tools + ${hubFiles.length} hubs)...`);

  const browser = await chromium.launch({ headless: true });
  const results = [];
  const hangStacks = {};

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

    // Mock 3rd party scripts so network timeouts do not skew CPU measurement
    await page.route('**/*', route => {
      const u = route.request().url();
      if (u.includes('googlesyndication.com') || u.includes('googletagmanager.com') || u.includes('google-analytics.com') || u.includes('adtrafficquality.google')) {
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.adsbygoogle = window.adsbygoogle || [];' });
      }
      route.continue();
    });

    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });

    // Injected heartbeat & monitoring instrumentation
    await page.addInitScript(() => {
      window.__heartbeat = {
        maxGap: 0,
        lastTick: performance.now(),
        tickCount: 0,
        longTasks: [],
        mutations: 0,
        duplicateInits: 0,
        initCalls: {},
        activeTimers: 0,
        activeRafs: 0,
        domNodesStart: 0,
        domNodesEnd: 0
      };

      // 50ms Heartbeat
      setInterval(() => {
        const now = performance.now();
        const gap = now - window.__heartbeat.lastTick;
        if (gap > window.__heartbeat.maxGap) {
          window.__heartbeat.maxGap = gap;
        }
        window.__heartbeat.lastTick = now;
        window.__heartbeat.tickCount++;
      }, 50);

      // Long Tasks Observer
      try {
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__heartbeat.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
        po.observe({ type: 'longtask', buffered: true });
      } catch (e) {}

      // Mutation Counter
      try {
        const mo = new MutationObserver((muts) => {
          window.__heartbeat.mutations += muts.length;
        });
        mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
      } catch (e) {}

      // Timer & RAF Tracking
      const origSetInterval = window.setInterval;
      const origClearInterval = window.clearInterval;
      let openIntervals = new Set();
      window.setInterval = function(fn, ms, ...args) {
        const id = origSetInterval.call(window, fn, ms, ...args);
        openIntervals.add(id);
        window.__heartbeat.activeTimers = openIntervals.size;
        return id;
      };
      window.clearInterval = function(id) {
        openIntervals.delete(id);
        window.__heartbeat.activeTimers = openIntervals.size;
        origClearInterval.call(window, id);
      };

      const origRaf = window.requestAnimationFrame;
      const origCancelRaf = window.cancelAnimationFrame;
      let openRafs = new Set();
      window.requestAnimationFrame = function(cb) {
        let id;
        id = origRaf.call(window, (t) => {
          openRafs.delete(id);
          window.__heartbeat.activeRafs = openRafs.size;
          cb(t);
        });
        openRafs.add(id);
        window.__heartbeat.activeRafs = openRafs.size;
        return id;
      };
      window.cancelAnimationFrame = function(id) {
        openRafs.delete(id);
        window.__heartbeat.activeRafs = openRafs.size;
        origCancelRaf.call(window, id);
      };
    });

    while (index < allTargets.length) {
      const item = allTargets[index++];
      try {
        const t0 = performance.now();
        await page.goto(item.url, { waitUntil: 'load', timeout: 15000 });
        const loadDuration = performance.now() - t0;

        // Record initial DOM nodes
        await page.evaluate(() => {
          window.__heartbeat.domNodesStart = document.querySelectorAll('*').length;
        });

        // Let the page settle and run timers for 2.5 seconds
        await page.waitForTimeout(2500);

        // Extract metrics
        const metrics = await page.evaluate(() => {
          window.__heartbeat.domNodesEnd = document.querySelectorAll('*').length;
          const maxLongTask = window.__heartbeat.longTasks.reduce((max, t) => Math.max(max, t.duration), 0);
          return {
            maxGap: Math.round(window.__heartbeat.maxGap),
            maxLongTask: Math.round(maxLongTask),
            longTaskCount: window.__heartbeat.longTasks.length,
            mutations: window.__heartbeat.mutations,
            activeTimers: window.__heartbeat.activeTimers,
            activeRafs: window.__heartbeat.activeRafs,
            domGrowth: window.__heartbeat.domNodesEnd - window.__heartbeat.domNodesStart,
            totalDomNodes: window.__heartbeat.domNodesEnd,
            hasErrorFallback: !document.getElementById('tool-error-fallback')?.classList.contains('hidden')
          };
        });

        let culprit = 'none';
        let rootCause = 'Normal';
        if (metrics.maxGap > 1000 || metrics.maxLongTask > 500) {
          culprit = `${item.slug}.json`;
          rootCause = 'Heavy synchronous initialization or unthrottled loop';
        } else if (metrics.maxGap > 500) {
          culprit = `${item.slug}.json`;
          rootCause = 'Main thread bottleneck on 6x throttle';
        }

        results.push({
          slug: item.slug,
          type: item.type,
          loadDurationMs: Math.round(loadDuration),
          maxGapMs: metrics.maxGap,
          longestTaskMs: metrics.maxLongTask,
          longTaskCount: metrics.longTaskCount,
          mutationsPerSec: Math.round(metrics.mutations / 2.5),
          activeTimers: metrics.activeTimers,
          activeRafs: metrics.activeRafs,
          domGrowth: metrics.domGrowth,
          totalDomNodes: metrics.totalDomNodes,
          culprit,
          rootCause
        });

        if (metrics.maxGap > 2000) {
          hangStacks[item.slug] = {
            slug: item.slug,
            maxGap: metrics.maxGap,
            longestTask: metrics.maxLongTask,
            timestamp: new Date().toISOString()
          };
        }

        if (index % 10 === 0 || index === allTargets.length) {
          console.log(`[Worker ${workerId}] Progress: ${index}/${allTargets.length} pages audited...`);
        }
      } catch (err) {
        console.error(`[Worker ${workerId}] Error auditing ${item.slug}:`, err.message);
        results.push({
          slug: item.slug,
          type: item.type,
          loadDurationMs: -1,
          maxGapMs: 9999,
          longestTaskMs: 9999,
          longTaskCount: -1,
          mutationsPerSec: -1,
          activeTimers: -1,
          activeRafs: -1,
          domGrowth: -1,
          totalDomNodes: -1,
          culprit: `${item.slug}.json`,
          rootCause: `Timeout or crash: ${err.message}`
        });
        hangStacks[item.slug] = {
          slug: item.slug,
          error: err.message,
          timestamp: new Date().toISOString()
        };
      }
    }

    await context.close();
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  await browser.close();
  server.close();

  // Sort by maxGapMs descending
  results.sort((a, b) => b.maxGapMs - a.maxGapMs);

  // Generate CSV
  const csvHeaders = 'slug,type,loadDurationMs,maxGapMs,longestTaskMs,longTaskCount,mutationsPerSec,activeTimers,activeRafs,domGrowth,totalDomNodes,culprit,rootCause';
  const csvRows = results.map(r => 
    `${r.slug},${r.type},${r.loadDurationMs},${r.maxGapMs},${r.longestTaskMs},${r.longTaskCount},${r.mutationsPerSec},${r.activeTimers},${r.activeRafs},${r.domGrowth},${r.totalDomNodes},"${r.culprit}","${r.rootCause}"`
  );
  fs.writeFileSync('hang-audit.csv', [csvHeaders, ...csvRows].join('\n') + '\n');
  fs.writeFileSync('hang-stacks.json', JSON.stringify(hangStacks, null, 2) + '\n');

  console.log(`Hang audit complete! Wrote hang-audit.csv and hang-stacks.json`);
  console.log('\nTop 15 Worst Offenders (by max main-thread gap):');
  console.table(results.slice(0, 15).map(r => ({
    slug: r.slug,
    maxGapMs: r.maxGapMs,
    longestTaskMs: r.longestTaskMs,
    longTasks: r.longTaskCount,
    timers: r.activeTimers,
    rafs: r.activeRafs,
    culprit: r.culprit,
    rootCause: r.rootCause
  })));
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
