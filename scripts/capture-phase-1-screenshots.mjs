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
      file: 'phase_1_support_page_desktop.png',
      action: async (page) => {}
    },
    {
      htmlPath: path.join(distDir, 'thanks.html'),
      file: 'phase_1_thanks_page_desktop.png',
      action: async (page) => {}
    },
    {
      htmlPath: path.join(distDir, 'tool', 'mouse_dpi_deviation_analyzer.html'),
      file: 'phase_1_tool_callout_desktop.png',
      action: async (page) => {
        // Show the subtle callout for screenshot verification
        await page.evaluate(() => {
          const callout = document.getElementById('tool-support-callout');
          if (callout) {
            callout.classList.remove('hidden');
            callout.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        });
        await page.waitForTimeout(300);
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

    // Route assets
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
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
