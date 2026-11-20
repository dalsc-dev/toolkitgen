import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = '/Users/dalsc2/.gemini/antigravity/brain/a7e662bd-249d-4d30-bd04-328d25225fda';
const distDir = path.resolve('dist');

async function capture() {
  const browser = await chromium.launch({ headless: true });

  const targets = [
    {
      htmlPath: path.join(distDir, 'support.html'),
      file: 'phase_5_support_page_paypal_amounts_desktop.png',
      action: async (page) => {
        // Type custom amount 25 and test dynamic preview
        const amountInput = page.locator('#custom-support-amount');
        if (await amountInput.count() > 0) {
          await amountInput.fill('25');
          await page.evaluate(() => {
            const input = document.getElementById('custom-support-amount');
            if (input) input.dispatchEvent(new Event('input'));
          });
        }
        await page.waitForTimeout(600);
      }
    },
    {
      htmlPath: path.join(distDir, 'tool', 'framerate_judder_pacing_test.html'),
      file: 'phase_5_tool_support_donate_callout_desktop.png',
      action: async (page) => {
        // Trigger support callout display by dispatching copy event
        await page.evaluate(() => {
          const callout = document.getElementById('tool-support-callout');
          if (callout) callout.classList.remove('hidden');
        });
        await page.waitForTimeout(600);
      }
    },
    {
      htmlPath: path.join(distDir, 'guide', 'ps5-xbox-tv-calibration-hgig-guide.html'),
      file: 'phase_5_guide_seo_schema_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(600);
      }
    }
  ];

  for (const t of targets) {
    if (!fs.existsSync(t.htmlPath)) {
      console.error(`Missing HTML for ${t.htmlPath}`);
      continue;
    }

    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 }
    });

    const page = await context.newPage();

    // Route assets locally
    await page.route('**/*', route => {
      const u = route.request().url();
      if (u.includes('/_astro/')) {
        const fileName = u.split('/_astro/')[1].split('?')[0];
        const p = path.resolve(distDir, '_astro', fileName);
        if (fs.existsSync(p)) {
          return route.fulfill({ status: 200, body: fs.readFileSync(p) });
        }
      }
      route.continue();
    });

    await page.goto(`file://${t.htmlPath}`, { waitUntil: 'load' });
    if (t.action) {
      await t.action(page);
    }

    const outPath = path.join(artifactDir, t.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Captured screenshot: ${outPath}`);
    await context.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
