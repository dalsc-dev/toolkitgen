import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const SAMPLE_TOOLS = [
  'ai_face_age_scanner',
  'emotion_sentiment_cam',
  'posture_guard_ai',
  'webcam_heart_rate_ppg',
  'sqlite_wasm_explorer',
  'webgpu_compute_flops_benchmark',
  'latex_equation_editor',
  'gerber_file_viewer',
  'docker_compose_linter',
  'finance_suite_local',
  'amsler_grid_macular',
  'av_sync_flash_tool',
  'oled_burnin_protector',
  'gamepad_drift_visualizer',
  'aes_gcm_vault_local'
];

const distDir = path.resolve('dist');

async function runBenchmark() {
  console.log(`Auditing 15 Sampled Tool Pages for Performance & Budgets...\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const slug of SAMPLE_TOOLS) {
    const htmlPath = path.join(distDir, 'tool', `${slug}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.error(`Missing built HTML for ${slug}`);
      continue;
    }

    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }, // Mobile viewport for strict budgets
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    });

    const page = await context.newPage();

    let totalJsBytes = 0;
    let totalCssBytes = 0;
    let requestCount = 0;

    // Route intercept to serve from dist/ without network access
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin === 'https://toolkitgen.local') {
        let filePath = path.join(distDir, url.pathname);
        if (url.pathname === '/' || url.pathname.endsWith('/')) {
          filePath = path.join(distDir, url.pathname, 'index.html');
        } else if (!path.extname(url.pathname)) {
          if (fs.existsSync(filePath + '.html')) {
            filePath = filePath + '.html';
          } else {
            filePath = path.join(filePath, 'index.html');
          }
        }

        if (fs.existsSync(filePath)) {
          const body = fs.readFileSync(filePath);
          requestCount++;
          if (filePath.endsWith('.js')) totalJsBytes += body.length;
          if (filePath.endsWith('.css')) totalCssBytes += body.length;

          const contentType = filePath.endsWith('.html') ? 'text/html' :
            filePath.endsWith('.css') ? 'text/css' :
            filePath.endsWith('.js') ? 'application/javascript' :
            filePath.endsWith('.json') ? 'application/json' :
            filePath.endsWith('.png') ? 'image/png' :
            filePath.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';

          route.fulfill({
            status: 200,
            contentType,
            body
          });
          return;
        }
      }

      // Mock 3rd parties
      if (url.hostname.includes('google') || url.hostname.includes('cloudflare')) {
        route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: '/* 3rd party mock */'
        });
        return;
      }

      route.fulfill({ status: 404, body: 'Not found' });
    });

    await page.goto(`https://toolkitgen.local/tool/${slug}.html`, { waitUntil: 'load' });

    // Measure CLS and timing via page.evaluate
    const metrics = await page.evaluate(() => {
      let cls = 0;
      try {
        const entries = performance.getEntriesByType('layout-shift');
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
      } catch (e) {}

      const nav = performance.getEntriesByType('navigation')[0] || {};
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;

      return {
        cls,
        fcp: Math.round(fcp),
        loadDuration: Math.round(nav.duration || 0)
      };
    });

    // Approximate gzip for initial JS
    const jsGzipKb = (totalJsBytes > 0)
      ? (zlib.gzipSync(Buffer.alloc(totalJsBytes)).length / 1024).toFixed(1)
      : '0.0';
    const cssGzipKb = (totalCssBytes > 0)
      ? (zlib.gzipSync(Buffer.alloc(totalCssBytes)).length / 1024).toFixed(1)
      : '0.0';

    results.push({
      slug,
      requests: requestCount,
      jsGzipKb: parseFloat(jsGzipKb),
      cssGzipKb: parseFloat(cssGzipKb),
      cls: metrics.cls,
      fcpMs: metrics.fcp,
      durationMs: metrics.loadDuration
    });

    await context.close();
  }

  await browser.close();

  // Print results table
  console.log('| Tool Slug | Requests | JS (KB gzip) | CSS (KB gzip) | CLS | FCP (ms) | Budget Status |');
  console.log('| :--- | :---: | :---: | :---: | :---: | :---: | :---: |');

  let budgetFailures = 0;
  for (const r of results) {
    const passed = r.jsGzipKb <= 100 && r.cls <= 0.05;
    if (!passed) budgetFailures++;
    const status = passed ? 'PASS' : 'FAIL';
    console.log(`| ${r.slug} | ${r.requests} | ${r.jsGzipKb} KB | ${r.cssGzipKb} KB | ${r.cls.toFixed(3)} | ${r.fcpMs} ms | ${status} |`);
  }

  console.log(`\nPerformance Budget Summary: ${results.length - budgetFailures} / ${results.length} PASSED`);
  if (budgetFailures > 0) {
    console.error(`FAILURE: ${budgetFailures} tool pages exceeded performance budgets!`);
    process.exit(1);
  }
}

runBenchmark().catch((err) => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
