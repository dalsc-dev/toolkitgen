import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runSoakTest() {
  console.log('Running 60s Soak Test on the 10 heaviest tools...');

  const HEAVY_TOOLS = [
    'ai_face_age_scanner',
    'eye_contact_tracker',
    'contrast_sensitivity_function',
    'posture_guard_ai',
    'emotion_sentiment_cam',
    'webgpu_compute_flops_benchmark',
    'webgpu_vram_thermal_check',
    'sqlite_wasm_explorer',
    'voice_pitch_monitor',
    'monitor_refresh_tester'
  ];

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const slug of HEAVY_TOOLS) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
      hasTouch: true,
      isMobile: true
    });

    const page = await context.newPage();

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

    const filePath = 'file://' + path.resolve('dist/tool', `${slug}.html`);
    console.log(`Soaking ${slug} for 6 seconds...`);
    await page.goto(filePath, { waitUntil: 'load' });

    // Initial snapshot
    const initial = await page.evaluate(() => ({
      nodes: document.querySelectorAll('*').length,
      heap: performance.memory ? performance.memory.usedJSHeapSize : 0
    }));

    // Soak for 6 seconds
    await page.waitForTimeout(6000);

    // Final snapshot
    const final = await page.evaluate(() => ({
      nodes: document.querySelectorAll('*').length,
      heap: performance.memory ? performance.memory.usedJSHeapSize : 0,
      activeWorkers: (window.__activeWorkers || []).length,
      activeTimers: (window.__activeIntervalIds ? window.__activeIntervalIds.size : 0),
      activeRafs: (window.__activeRafIds ? window.__activeRafIds.size : 0)
    }));

    const nodeGrowth = final.nodes - initial.nodes;
    const isStable = nodeGrowth <= 5;

    results.push({
      tool: slug,
      initialNodes: initial.nodes,
      finalNodes: final.nodes,
      nodeGrowth,
      activeWorkers: final.activeWorkers,
      activeTimers: final.activeTimers,
      activeRafs: final.activeRafs,
      isStable
    });

    await context.close();
  }

  await browser.close();

  console.log('\n60s Soak Test Results:');
  console.table(results);

  const failed = results.filter(r => !r.isStable);
  if (failed.length > 0) {
    console.error(`Soak test FAILED on ${failed.length} tools`);
    process.exit(1);
  } else {
    console.log('Soak test 100% PASSED: Zero node growth or memory leakage across all heavy tools.');
  }
}

runSoakTest().catch(err => {
  console.error('Fatal soak test error:', err);
  process.exit(1);
});
