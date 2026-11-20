import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = '/Users/dalsc2/.gemini/antigravity/brain/a7e662bd-249d-4d30-bd04-328d25225fda';
const distDir = path.resolve('dist');

const tools = [
  'llm_vram_calculator',
  'screenshot_secret_scanner',
  'c2pa_metadata_viewer',
  'x509_certificate_decoder'
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const slug of tools) {
    const htmlPath = path.join(distDir, 'tool', `${slug}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.error(`Missing HTML for ${slug}`);
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

    await page.goto(`file://${htmlPath}`, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    // If x509, click the "Load Sample" button to show the full parsed UI in the screenshot!
    if (slug === 'x509_certificate_decoder') {
      const sampleBtn = await page.$('#x509-sample-btn');
      if (sampleBtn) {
        await sampleBtn.click();
        await page.waitForTimeout(300);
      }
    }

    const outPath = path.join(artifactDir, `${slug}_desktop.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot to ${outPath}`);

    await context.close();
  }

  await browser.close();
  console.log('All Phase 3 screenshots captured successfully.');
}

capture();
