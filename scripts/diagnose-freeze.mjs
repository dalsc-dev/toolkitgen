import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const toolsDir = path.join(rootDir, 'src', 'content', 'tools');

const outputFile = process.argv.includes('--after')
  ? path.join(rootDir, 'freeze-report-after.csv')
  : path.join(rootDir, 'freeze-report.csv');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8'
};

async function run() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const toolFiles = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json')).sort();
  console.log(`Auditing ${toolFiles.length} tool pages for main-thread freezes and unresponsiveness...`);

  const results = [];
  const csvRows = [
    'slug,froze_on_load,froze_on_interact,max_block_ms,active_raf_2s,active_intervals_2s,dom_nodes,heap_mb,exact_culprit_file_and_line,root_cause'
  ];

  let processedCount = 0;

  for (const file of toolFiles) {
    const slug = file.replace('.json', '');
    processedCount++;

    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    });

    // In-memory route handler serving dist/
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      let pathname = url.pathname;
      if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
      if (!pathname.endsWith('.html') && !path.extname(pathname)) pathname += '.html';

      const filePath = path.join(distDir, pathname.startsWith('/') ? pathname.slice(1) : pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        route.fulfill({
          status: 200,
          contentType: mimeTypes[ext] || 'application/octet-stream',
          body: fs.readFileSync(filePath)
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/javascript; charset=utf-8',
          body: '/* mock */'
        });
      }
    });

    const page = await context.newPage();
    const cdp = await page.context().newCDPSession(page);

    // 4x CPU throttle
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    const consoleLogs = [];
    const exceptions = [];

    page.on('console', (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text().slice(0, 150)}`);
      if (consoleLogs.length > 50) consoleLogs.shift();
    });

    page.on('pageerror', (err) => {
      exceptions.push(err.message.slice(0, 200));
    });

    // Hook timers & rAF to detect pre-interaction unprompted background activity
    await page.addInitScript(() => {
      window.__activeRafCount = 0;
      window.__activeIntervalCount = 0;
      window.__longTasks = [];

      const origRaf = window.requestAnimationFrame;
      const origCancelRaf = window.cancelAnimationFrame;
      const activeRafIds = new Set();
      let rafSeq = 0;

      window.requestAnimationFrame = function (cb) {
        const id = ++rafSeq;
        activeRafIds.add(id);
        window.__activeRafCount = activeRafIds.size;
        return origRaf.call(window, (t) => {
          activeRafIds.delete(id);
          window.__activeRafCount = activeRafIds.size;
          cb(t);
        });
      };

      window.cancelAnimationFrame = function (id) {
        activeRafIds.delete(id);
        window.__activeRafCount = activeRafIds.size;
        origCancelRaf.call(window, id);
      };

      const origSetInterval = window.setInterval;
      const origClearInterval = window.clearInterval;
      const activeIntervals = new Set();

      window.setInterval = function (fn, ms, ...args) {
        const id = origSetInterval.call(window, fn, ms, ...args);
        activeIntervals.add(id);
        window.__activeIntervalCount = activeIntervals.size;
        return id;
      };

      window.clearInterval = function (id) {
        activeIntervals.delete(id);
        window.__activeIntervalCount = activeIntervals.size;
        origClearInterval.call(window, id);
      };

      try {
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__longTasks.push(entry.duration);
          }
        });
        po.observe({ type: 'longtask', buffered: true });
      } catch (e) {}
    });

    // Enable CDP profiler BEFORE navigation
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.start');

    let maxHeartbeatLag = 0;
    let frozeOnLoad = false;
    let frozeOnInteract = false;
    let culpritLocation = 'none';
    let rootCause = 'none';
    let activeRafAt2s = 0;
    let activeIntervalAt2s = 0;
    let domNodeCount = 0;
    let heapMb = 0;

    let watchdogActive = true;
    let currentPhase = 'load';

    const checkHeartbeat = async () => {
      while (watchdogActive) {
        const pingStart = Date.now();
        try {
          const pongPromise = page.evaluate(() => Date.now());
          await Promise.race([
            pongPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('HEARTBEAT_TIMEOUT')), 1500))
          ]);
          const lag = Date.now() - pingStart;
          if (lag > maxHeartbeatLag) maxHeartbeatLag = lag;

          if (lag > 1500) {
            if (currentPhase === 'load') frozeOnLoad = true;
            else frozeOnInteract = true;
          }
        } catch (e) {
          if (e.message === "HEARTBEAT_TIMEOUT") {
            const deadTime = Date.now() - pingStart;
            if (deadTime > maxHeartbeatLag) maxHeartbeatLag = deadTime;
            if (currentPhase === 'load') frozeOnLoad = true;
            else frozeOnInteract = true;
          }
        }
        await new Promise((r) => setTimeout(r, 250));
      }
    };

    const heartbeatPromise = checkHeartbeat();

    // Navigation phase (Load)
    try {
      await page.goto(`http://localhost:4321/tool/${slug}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      // Check active loops at 2s mark before user interaction
      await page.waitForTimeout(2000);
      const preMetrics = await page.evaluate(() => ({
        rafs: window.__activeRafCount || 0,
        intervals: window.__activeIntervalCount || 0,
        nodes: document.querySelectorAll('*').length,
        heap: window.performance && window.performance.memory ? (window.performance.memory.usedJSHeapSize / 1048576) : 0
      })).catch(() => ({ rafs: 0, intervals: 0, nodes: 0, heap: 0 }));

      activeRafAt2s = preMetrics.rafs;
      activeIntervalAt2s = preMetrics.intervals;
      domNodeCount = preMetrics.nodes;
      heapMb = Math.round(preMetrics.heap * 10) / 10;
    } catch (err) {
      frozeOnLoad = true;
      rootCause = `Navigation Error: ${err.message.slice(0, 100)}`;
    }

    // Interaction phase (Test interactions)
    currentPhase = 'interact';
    try {
      // 1. Click primary interactive button if present
      const btn = await page.$('#tool-app-stage button:not([disabled]), .tool-stage-card button:not([disabled])');
      if (btn) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
      }

      // 2. Type into first input if present
      const input = await page.$('#tool-app-stage input:not([disabled]), .tool-stage-card input:not([disabled])');
      if (input) {
        await input.fill('123', { timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
      }

      // 3. Scroll
      await page.evaluate(() => window.scrollBy(0, 500)).catch(() => {});
      await page.waitForTimeout(500);
    } catch (err) {
      frozeOnInteract = true;
      if (rootCause === 'none') rootCause = `Interaction Error: ${err.message.slice(0, 100)}`;
    }

    // Stop watchdog
    watchdogActive = false;
    await heartbeatPromise.catch(() => {});

    // Stop Profiler and parse top hot functions if frozen or elevated lag
    try {
      const { profile } = await cdp.send('Profiler.stop');
      if (frozeOnLoad || frozeOnInteract || maxHeartbeatLag > 250) {
        const nodes = profile.nodes || [];
        const samples = profile.samples || [];

        const hitCounts = {};
        samples.forEach((nodeId) => {
          hitCounts[nodeId] = (hitCounts[nodeId] || 0) + 1;
        });

        const nodeMap = new Map(nodes.map((n) => [n.id, n]));
        const sorted = Object.entries(hitCounts)
          .map(([id, hits]) => ({ node: nodeMap.get(Number(id)), hits }))
          .sort((a, b) => b.hits - a.hits)
          .filter((x) => x.node && x.node.callFrame && x.node.callFrame.url && !x.node.callFrame.url.includes('diagnose-freeze'));

        if (sorted.length > 0) {
          const top = sorted[0].node.callFrame;
          culpritLocation = `${path.basename(top.url || 'inline')}:${top.lineNumber}:${top.columnNumber} (${top.functionName || 'anonymous'})`;
          if (rootCause === 'none') {
            rootCause = `CPU hotspot in ${top.functionName || 'anonymous'} (${sorted[0].hits} samples)`;
          }
        }
      }
    } catch (profErr) {
      if (rootCause === 'none') rootCause = `Profiler error: ${profErr.message}`;
    }

    // Categorize Root Cause if not diagnosed
    if ((frozeOnLoad || frozeOnInteract || maxHeartbeatLag > 200) && rootCause === 'none') {
      if (activeRafAt2s > 0) {
        rootCause = `Unprompted continuous requestAnimationFrame loop (${activeRafAt2s} active)`;
      } else if (activeIntervalAt2s > 0) {
        rootCause = `Unprompted continuous setInterval loop (${activeIntervalAt2s} active)`;
      } else if (exceptions.length > 0) {
        rootCause = `Uncaught exception: ${exceptions[0]}`;
      } else {
        rootCause = `Main-thread latency (${maxHeartbeatLag}ms heartbeat lag)`;
      }
    }

    const row = {
      slug,
      froze_on_load: frozeOnLoad ? 'YES' : 'NO',
      froze_on_interact: frozeOnInteract ? 'YES' : 'NO',
      max_block_ms: maxHeartbeatLag,
      active_raf_2s: activeRafAt2s,
      active_intervals_2s: activeIntervalAt2s,
      dom_nodes: domNodeCount,
      heap_mb: heapMb,
      exact_culprit_file_and_line: culpritLocation,
      root_cause: rootCause
    };

    results.push(row);
    csvRows.push(
      `"${row.slug}","${row.froze_on_load}","${row.froze_on_interact}",${row.max_block_ms},${row.active_raf_2s},${row.active_intervals_2s},${row.dom_nodes},${row.heap_mb},"${row.exact_culprit_file_and_line}","${row.root_cause}"`
    );

    if (processedCount % 20 === 0 || row.froze_on_load === 'YES' || row.froze_on_interact === 'YES' || row.max_block_ms > 250 || row.active_raf_2s > 0) {
      console.log(`[${processedCount}/${toolFiles.length}] ${slug} -> maxBlock: ${row.max_block_ms}ms, rAF(2s): ${row.active_raf_2s}, intervals(2s): ${row.active_intervals_2s}, rootCause: ${row.root_cause}`);
    }

    await context.close();
  }

  fs.writeFileSync(outputFile, csvRows.join('\n') + '\n');
  console.log(`\nDiagnostic complete! Report written to ${outputFile}`);

  const frozenCount = results.filter((r) => r.froze_on_load === 'YES' || r.froze_on_interact === 'YES').length;
  const elevatedLag = results.filter((r) => r.max_block_ms > 200).length;
  const activeLoops = results.filter((r) => r.active_raf_2s > 0 || r.active_intervals_2s > 0).length;

  console.log(`Summary:`);
  console.log(`- Frozen pages (>1500ms heartbeat stall): ${frozenCount}`);
  console.log(`- Pages with elevated lag (>200ms): ${elevatedLag}`);
  console.log(`- Pages with active loops 2s after load: ${activeLoops}`);

  await browser.close();
}

run().catch((err) => {
  console.error('Fatal diagnostic error:', err);
  process.exit(1);
});
