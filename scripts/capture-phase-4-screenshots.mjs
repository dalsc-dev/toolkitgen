import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = '/Users/dalsc2/.gemini/antigravity/brain/a7e662bd-249d-4d30-bd04-328d25225fda';
const distDir = path.resolve('dist');

async function capture() {
  const browser = await chromium.launch({ headless: true });

  const targets = [
    {
      htmlPath: path.join(distDir, 'tool', 'iphone_mobile_capability_report.html'),
      file: 'phase_4_iphone_capability_report_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(600);
      }
    },
    {
      htmlPath: path.join(distDir, 'tool', 'foldable_display_posture_tester.html'),
      file: 'phase_4_foldable_posture_tester_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(600);
      }
    },
    {
      htmlPath: path.join(distDir, 'guide', 'iphone-promotion-120hz-safari-web-guide.html'),
      file: 'phase_4_safari_promotion_guide_desktop.png',
      action: async (page) => {
        await page.waitForTimeout(500);
      }
    },
    {
      htmlPath: path.join(distDir, 'guide', 'foldable-phone-crease-hinge-posture-developer-guide.html'),
      file: 'phase_4_foldable_developer_guide_desktop.png',
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
  console.error('Phase 4 screenshot capture failed:', err);
  process.exit(1);
});
