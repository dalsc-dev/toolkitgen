import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = '/Users/dalsc2/.gemini/antigravity/brain/a7e662bd-249d-4d30-bd04-328d25225fda';
const distDir = path.resolve('dist');

async function capture() {
  const browser = await chromium.launch({ headless: true });

  const targets = [
    {
      htmlPath: path.join(distDir, 'tool', 'framerate_judder_pacing_test.html'),
      file: 'phase_3_framerate_judder_test_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(1000);
      }
    },
    {
      htmlPath: path.join(distDir, 'hubs', 'gaming.html'),
      file: 'phase_3_gaming_hub_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(500);
      }
    },
    {
      htmlPath: path.join(distDir, 'guide', '30fps-vs-40fps-oled-judder-guide.html'),
      file: 'phase_3_oled_judder_guide_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(500);
      }
    },
    {
      htmlPath: path.join(distDir, 'guide', 'console-storage-planning-preload-guide.html'),
      file: 'phase_3_console_storage_guide_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(500);
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
          return route.fulfill({
            status: 200,
            contentType: fileName.endsWith('.css') ? 'text/css' : 'application/javascript',
            body: fs.readFileSync(p)
          });
        }
      }
      return route.continue();
    });

    await page.goto(`file://${t.htmlPath}`, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    if (t.action) {
      await t.action(page);
    }

    const outPath = path.join(artifactDir, t.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot to ${outPath}`);
    await context.close();
  }

  await browser.close();
}

capture().catch(err => {
  console.error('Phase 3 screenshot capture failed:', err);
  process.exit(1);
});
