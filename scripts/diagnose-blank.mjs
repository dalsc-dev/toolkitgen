import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const toolsDir = path.join(rootDir, 'src', 'content', 'tools');

const outputFile = process.argv.includes('--after')
  ? path.join(rootDir, 'blank-audit-after.csv')
  : path.join(rootDir, 'blank-audit.csv');

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

const toolFiles = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json')).sort();
const tools = toolFiles.map((f) => ({ slug: f.replace('.json', ''), path: `/tool/${f.replace('.json', '')}` }));
const hubs = ['freelancer', 'startup', 'wellness', 'gaming'].map((h) => ({ slug: `hub_${h}`, path: `/hubs/${h}` }));
const allPages = [...tools, ...hubs];

// Blank Detector shared helper
async function evaluateBlankness(page) {
  return await page.evaluate(() => {
    const failures = [];

    // 1. Expected Landmarks
    const header = document.querySelector('header, nav, #app-header');
    const h1 = document.querySelector('h1');
    const toolArea = document.querySelector('#tool-app-stage, .tool-stage-card, .tool-card, main');
    const article = document.querySelector('article, #tool-documentation-section, [data-article]');
    const faq = document.querySelector('#tool-faq-section, section:has(details), [id*="faq"]');
    const footer = document.querySelector('footer, #app-footer');

    if (!header || header.offsetHeight === 0) failures.push('header_missing_or_hidden');
    if (!h1 || h1.offsetHeight === 0 || window.getComputedStyle(h1).visibility === 'hidden') failures.push('h1_missing_or_hidden');
    if (!toolArea || toolArea.offsetHeight === 0) failures.push('tool_area_missing_or_hidden');
    if (!footer || footer.offsetHeight === 0) failures.push('footer_missing_or_hidden');

    // For tool pages, article & FAQ should be present
    if (window.location.pathname.startsWith('/tool/')) {
      if (!article || article.offsetHeight === 0) {
        // Check if content-visibility caused it to be 0 or unrendered
        const artEl = document.querySelector('#tool-documentation-section');
        if (artEl) {
          const comp = window.getComputedStyle(artEl);
          if (comp.contentVisibility === 'auto') failures.push('article_content_visibility_auto');
          else failures.push('article_hidden_or_empty');
        } else {
          failures.push('article_missing');
        }
      }
    }

    // 2. Body content length
    const bodyText = document.body ? document.body.innerText.trim() : '';
    if (bodyText.length < 300) failures.push(`body_text_too_short_${bodyText.length}`);

    // 3. Screen overlays blocking UI
    const allElements = document.querySelectorAll('div, section, main, body > *');
    for (const el of allElements) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const coversViewport = rect.width >= window.innerWidth && rect.height >= window.innerHeight;
      if (coversViewport && (style.opacity === '0' || style.visibility === 'hidden') && style.pointerEvents !== 'none') {
        failures.push(`blocking_fullscreen_hidden_element_${el.tagName}`);
        break;
      }
    }

    return {
      passed: failures.length === 0,
      failures,
      bodyLength: bodyText.length,
      hasH1: Boolean(h1 && h1.offsetHeight > 0),
      hasTool: Boolean(toolArea && toolArea.offsetHeight > 0),
      hasArticle: Boolean(article && article.offsetHeight > 0)
    };
  });
}

async function run() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  console.log(`Starting forensic blank-screen audit across ${allPages.length} pages...`);

  const results = [];
  const csvRows = [
    'slug,condition,width,failed_signal,first_error,root_cause_class'
  ];

  // We test the top representative conditions across viewports
  // Conditions:
  // a: cold_cache (375 & 1280)
  // b: sw_upgrade (old cache simulating upgrade)
  // c: throttled_slow4g (4x CPU + slow network)
  // d: third_parties_blocked (ad blocker simulation)
  // e: offline (offline after initial cache)

  const testConditions = [
    { name: 'cold_cache', width: 375, height: 667, throttle: false, blockThirdParty: false, offline: false },
    { name: 'cold_cache_desktop', width: 1280, height: 800, throttle: false, blockThirdParty: false, offline: false },
    { name: 'third_parties_blocked', width: 375, height: 667, throttle: false, blockThirdParty: true, offline: false },
    { name: 'throttled_slow4g', width: 375, height: 667, throttle: true, blockThirdParty: false, offline: false }
  ];

  for (const cond of testConditions) {
    console.log(`\nEvaluating condition: ${cond.name} (${cond.width}x${cond.height})...`);
    let condFailures = 0;

    const BATCH_SIZE = 8;
    for (let i = 0; i < allPages.length; i += BATCH_SIZE) {
      const batch = allPages.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async ({ slug, path: pagePath }) => {
        const context = await browser.newContext({
          viewport: { width: cond.width, height: cond.height },
          isMobile: cond.width < 768,
          hasTouch: cond.width < 768,
          userAgent: cond.width < 768
            ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
            : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const pageErrors = [];
        const consoleErrors = [];
        const failedRequests = [];

        await context.route('**/*', (route) => {
          const urlStr = route.request().url();
          const url = new URL(urlStr);

          // Third-party blocking simulation
          if (cond.blockThirdParty) {
            if (
              url.hostname.includes('googlesyndication') ||
              url.hostname.includes('google-analytics') ||
              url.hostname.includes('googletagmanager') ||
              url.hostname.includes('clarity.ms') ||
              url.hostname.includes('webpushr') ||
              url.hostname.includes('cloudflareinsights')
            ) {
              route.abort('blockedbyclient');
              return;
            }
          }

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

        page.on('pageerror', (err) => pageErrors.push(err.message));
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('requestfailed', (req) => {
          if (!cond.blockThirdParty) failedRequests.push(req.url());
        });

        if (cond.throttle) {
          const cdp = await page.context().newCDPSession(page);
          await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
          await cdp.send('Network.emulateNetworkConditions', {
            offline: false,
            latency: 400,
            downloadThroughput: (400 * 1024) / 8,
            uploadThroughput: (400 * 1024) / 8
          });
        }

        let failedSignal = 'NONE';
        let firstError = 'NONE';
        let rootCauseClass = 'NONE';

        try {
          await page.goto(`http://localhost:4321${pagePath}`, {
            waitUntil: 'domcontentloaded',
            timeout: 10000
          });

          await page.waitForTimeout(200);

          const check = await evaluateBlankness(page);

          if (!check.passed) {
            failedSignal = check.failures.join(';');
            condFailures++;

            if (pageErrors.length > 0) {
              firstError = pageErrors[0];
              rootCauseClass = '(2) uncaught exception or hydration mismatch';
            } else if (check.failures.some((f) => f.includes('content_visibility'))) {
              firstError = 'content-visibility: auto causing unpainted article section';
              rootCauseClass = '(4) CSS hiding (content-visibility/purged class)';
            } else if (check.failures.some((f) => f.includes('article') || f.includes('h1'))) {
              firstError = 'Incomplete DOM render or layout collapse';
              rootCauseClass = '(4) CSS hiding (opacity/animation/content-visibility)';
            } else if (cond.blockThirdParty && consoleErrors.length > 0) {
              firstError = consoleErrors[0];
              rootCauseClass = '(6) third-party interference (ad blocker dependency)';
            } else {
              firstError = consoleErrors[0] || 'Unknown DOM blankness';
              rootCauseClass = '(2) uncaught exception or hydration mismatch';
            }
          }
        } catch (err) {
          failedSignal = 'PAGE_LOAD_CRASH_OR_TIMEOUT';
          firstError = err.message;
          rootCauseClass = '(5) crash or memory or GPU';
          condFailures++;
        }

        results.push({
          slug,
          condition: cond.name,
          width: cond.width,
          failed_signal: failedSignal,
          first_error: firstError,
          root_cause_class: rootCauseClass
        });

        csvRows.push(
          `"${slug}","${cond.name}",${cond.width},"${failedSignal}","${firstError.replace(/"/g, '""')}","${rootCauseClass}"`
        );

        if (failedSignal !== 'NONE') {
          console.log(`FAIL [${slug}] (${cond.name}): signal=${failedSignal} | error=${firstError} | class=${rootCauseClass}`);
        }

        await context.close();
      }));
    }

    console.log(`Condition ${cond.name} complete. Total failures: ${condFailures}/${allPages.length}`);
  }

  fs.writeFileSync(outputFile, csvRows.join('\n') + '\n');
  console.log(`\nAudit complete! Results written to ${outputFile}`);

  const totalFailures = results.filter((r) => r.failed_signal !== 'NONE').length;
  console.log(`Total tests: ${results.length}. Total failed runs: ${totalFailures}`);

  await browser.close();
}

run().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
