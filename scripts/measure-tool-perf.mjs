import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distToolsDir = path.join(distDir, 'tool');

const outputFile = process.argv[2] || 'tool-perf-before.csv';
const isAfter = outputFile.includes('after');

console.log(`Starting Tool Performance Measurement (${isAfter ? 'AFTER' : 'BEFORE'}). Output target: ${outputFile}`);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

async function measureAll() {
  const toolFiles = fs.readdirSync(distToolsDir).filter((f) => f.endsWith('.html'));
  console.log(`Auditing ${toolFiles.length} tool pages with Mobile emulation, 4x CPU throttle, and Slow 4G...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const CONCURRENCY = 4;
  const results = [];
  const queue = [...toolFiles];
  let completed = 0;

  async function worker(workerId) {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      isMobile: true,
      hasTouch: true,
    });

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
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          route.fulfill({
            status: 200,
            contentType,
            body: fs.readFileSync(filePath),
          });
        } else {
          if (reqUrl.includes('google') || reqUrl.includes('pagead') || reqUrl.includes('doubleclick') || reqUrl.includes('googletagmanager')) {
            route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock ad/analytics */' });
          } else if (reqUrl.includes('@mediapipe') || reqUrl.includes('tasks-vision') || reqUrl.endsWith('.js') || reqUrl.includes('.js?')) {
            route.fulfill({
              status: 200,
              contentType: 'application/javascript',
              body: 'export default {}; export const FaceLandmarker = class { static createFromOptions() { return new this(); } detectForVideo() { return { faceLandmarks: [] }; } }; export const PoseLandmarker = class { static createFromOptions() { return new this(); } detectForVideo() { return { landmarks: [] }; } }; export const FilesetResolver = { forVisionTasks: async () => ({}) };',
            });
          } else {
            route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
          }
        }
      } catch (e) {
        route.abort();
      }
    });

    const page = await context.newPage();

    // Enable CDP CPU Throttling (4x) and Network Throttling (Slow 4G)
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (400 * 1024) / 8, // 400 kbps
      uploadThroughput: (400 * 1024) / 8,
      latency: 400, // 400 ms RTT
    });

    // Inject measurement hooks before any scripts execute
    await page.addInitScript(() => {
      window.__perf_stats = {
        timers: 0,
        intervals: 0,
        rafs: 0,
        activeIntervals: 0,
        activeTimers: 0,
        activeRafs: 0,
        mediaStreams: 0,
        audioContexts: 0,
        webglContexts: 0,
        webgpuContexts: 0,
        workers: 0,
        longTasks: [],
        longestTask: 0,
        tbt: 0,
      };

      const runningIntervals = new Set();
      const runningTimers = new Set();
      const runningRafs = new Set();

      const origSetInterval = window.setInterval;
      const origClearInterval = window.clearInterval;
      window.setInterval = function (fn, delay, ...args) {
        window.__perf_stats.intervals++;
        const id = origSetInterval.call(window, fn, delay, ...args);
        runningIntervals.add(id);
        return id;
      };
      window.clearInterval = function (id) {
        runningIntervals.delete(id);
        return origClearInterval.call(window, id);
      };

      const origSetTimeout = window.setTimeout;
      const origClearTimeout = window.clearTimeout;
      window.setTimeout = function (fn, delay, ...args) {
        window.__perf_stats.timers++;
        const id = origSetTimeout.call(window, (...a) => {
          runningTimers.delete(id);
          if (typeof fn === 'function') fn(...a);
        }, delay, ...args);
        runningTimers.add(id);
        return id;
      };
      window.clearTimeout = function (id) {
        runningTimers.delete(id);
        return origClearTimeout.call(window, id);
      };

      const origRAF = window.requestAnimationFrame;
      const origCancelRAF = window.cancelAnimationFrame;
      window.requestAnimationFrame = function (cb) {
        window.__perf_stats.rafs++;
        const id = origRAF.call(window, (t) => {
          runningRafs.delete(id);
          cb(t);
        });
        runningRafs.add(id);
        return id;
      };
      window.cancelAnimationFrame = function (id) {
        runningRafs.delete(id);
        return origCancelRAF.call(window, id);
      };

      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = function () {
          window.__perf_stats.mediaStreams++;
          const c = document.createElement('canvas');
          c.width = 320;
          c.height = 240;
          return Promise.resolve(c.captureStream ? c.captureStream(10) : new MediaStream());
        };
      }

      const OrigAC = window.AudioContext || window.webkitAudioContext;
      if (OrigAC) {
        window.AudioContext = class extends OrigAC {
          constructor(...args) {
            super(...args);
            window.__perf_stats.audioContexts++;
          }
        };
        window.webkitAudioContext = window.AudioContext;
      }

      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (typeof type === 'string' && (type.includes('webgl') || type.includes('experimental-webgl'))) {
          window.__perf_stats.webglContexts++;
        }
        return origGetContext.call(this, type, ...args);
      };

      if (navigator.gpu) {
        const origReqAdapter = navigator.gpu.requestAdapter?.bind(navigator.gpu);
        navigator.gpu.requestAdapter = function (...args) {
          window.__perf_stats.webgpuContexts++;
          return origReqAdapter ? origReqAdapter(...args) : Promise.resolve(null);
        };
      }

      const OrigWorker = window.Worker;
      if (OrigWorker) {
        window.Worker = class extends OrigWorker {
          constructor(url, opts) {
            super(url, opts);
            window.__perf_stats.workers++;
          }
        };
      }

      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__perf_stats.longTasks.push(entry.duration);
            if (entry.duration > window.__perf_stats.longestTask) {
              window.__perf_stats.longestTask = entry.duration;
            }
            if (entry.duration > 50) {
              window.__perf_stats.tbt += (entry.duration - 50);
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {}

      window.__snapshotPerf = () => {
        window.__perf_stats.activeIntervals = runningIntervals.size;
        window.__perf_stats.activeTimers = runningTimers.size;
        window.__perf_stats.activeRafs = runningRafs.size;
        return window.__perf_stats;
      };
    });

    while (queue.length > 0) {
      const file = queue.shift();
      const slug = file.replace('.html', '');
      const consoleErrors = [];
      let networkCount = 0;

      const onConsole = (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text().slice(0, 100));
        }
      };
      const onReq = () => { networkCount++; };

      page.on('console', onConsole);
      page.on('request', onReq);

      try {
        await page.goto(`http://toolkitgen.local/tool/${slug}`, {
          waitUntil: 'load',
          timeout: 15000,
        });

        // Wait 2000 ms to capture post-load timers, loops, and long tasks
        await page.waitForTimeout(2000);

        // Snapshot pre-click activity
        const preClickStats = await page.evaluate(() => window.__snapshotPerf());

        // Measure first click response & interaction latency
        const clickMetric = await page.evaluate(async () => {
          const btn = document.querySelector('#tool-app-stage button, #tool-app-stage input, #tool-app-stage [tabindex="0"]');
          if (!btn) return { responseTime: 0, inp: 0 };

          const start = performance.now();
          let processedTime = 0;

          return new Promise((resolve) => {
            const onPointerUp = () => {
              const duration = performance.now() - start;
              resolve({ responseTime: Math.round(duration), inp: Math.round(duration) });
            };
            btn.addEventListener('pointerup', onPointerUp, { once: true });
            btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
            setTimeout(() => {
              resolve({ responseTime: Math.round(performance.now() - start), inp: Math.round(performance.now() - start) });
            }, 300);
          });
        });

        // Heap size
        const heapMb = await page.evaluate(() => {
          return performance.memory ? (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) : 'N/A';
        });

        results.push({
          slug,
          tbt_ms: Math.round(preClickStats.tbt || 0),
          longest_task_ms: Math.round(preClickStats.longestTask || 0),
          long_tasks_count: preClickStats.longTasks.length,
          first_click_response_ms: clickMetric.responseTime || 0,
          inp_ms: clickMetric.inp || 0,
          js_heap_mb: heapMb,
          active_timers_2s: preClickStats.activeTimers,
          active_intervals_2s: preClickStats.activeIntervals,
          active_raf_2s: preClickStats.activeRafs,
          preclick_camera_mic: preClickStats.mediaStreams,
          preclick_audio_context: preClickStats.audioContexts,
          preclick_webgl: preClickStats.webglContexts,
          preclick_webgpu: preClickStats.webgpuContexts,
          preclick_workers: preClickStats.workers,
          network_requests: networkCount,
          console_errors: consoleErrors.length,
        });
      } catch (err) {
        console.error(`Error profiling ${slug}:`, err.message);
        results.push({
          slug,
          tbt_ms: 9999,
          longest_task_ms: 9999,
          long_tasks_count: 99,
          first_click_response_ms: 9999,
          inp_ms: 9999,
          js_heap_mb: 'N/A',
          active_timers_2s: 99,
          active_intervals_2s: 99,
          active_raf_2s: 99,
          preclick_camera_mic: 0,
          preclick_audio_context: 0,
          preclick_webgl: 0,
          preclick_webgpu: 0,
          preclick_workers: 0,
          network_requests: networkCount,
          console_errors: 1,
        });
      } finally {
        page.off('console', onConsole);
        page.off('request', onReq);
        completed++;
        if (completed % 20 === 0 || completed === toolFiles.length) {
          console.log(`Progress: ${completed}/${toolFiles.length} tool pages profiled...`);
        }
      }
    }

    await context.close();
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);
  await browser.close();

  // Sort by TBT descending
  results.sort((a, b) => b.tbt_ms - a.tbt_ms);

  // Write CSV
  const headers = [
    'slug',
    'tbt_ms',
    'longest_task_ms',
    'long_tasks_count',
    'first_click_response_ms',
    'inp_ms',
    'js_heap_mb',
    'active_timers_2s',
    'active_intervals_2s',
    'active_raf_2s',
    'preclick_camera_mic',
    'preclick_audio_context',
    'preclick_webgl',
    'preclick_webgpu',
    'preclick_workers',
    'network_requests',
    'console_errors',
  ];

  const csvRows = [
    headers.join(','),
    ...results.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
  ];

  fs.writeFileSync(path.join(rootDir, outputFile), csvRows.join('\n'));
  console.log(`Saved performance results to ${outputFile}`);

  console.log('\nTop 15 Offenders by TBT:');
  console.table(
    results.slice(0, 15).map((r) => ({
      Slug: r.slug,
      'TBT (ms)': r.tbt_ms,
      'Max Task (ms)': r.longest_task_ms,
      'Active Timers': r.active_timers_2s,
      'Active Raf': r.active_raf_2s,
      'Pre-click WebGL': r.preclick_webgl,
      'Pre-click Audio': r.preclick_audio_context,
      Errors: r.console_errors,
    }))
  );
}

measureAll().catch((err) => {
  console.error('Measurement failed:', err);
  process.exit(1);
});
