import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

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
        const ext = path.extname(filePath);
        route.fulfill({
          status: 200,
          contentType: MIME_TYPES[ext] || 'text/plain',
          body: fs.readFileSync(filePath),
        });
      } else {
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mock */' });
      }
    } catch (e) {
      route.abort();
    }
  });

  const page = await context.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleMessages.push(`[PAGEERROR] ${err.message}`));

  await page.goto('http://toolkitgen.local/tool/color_mixer_challenge', { waitUntil: 'domcontentloaded' });

  // Check initial state
  const targetBg = await page.$eval('#target-swatch', el => el.style.backgroundColor);
  const userBg = await page.$eval('#user-swatch', el => el.style.backgroundColor);
  console.log('Initial targetBg:', targetBg);
  console.log('Initial userBg:', userBg);

  // Move sliders
  await page.fill('#slider-c', '80');
  await page.dispatchEvent('#slider-c', 'input');
  await page.fill('#slider-m', '20');
  await page.dispatchEvent('#slider-m', 'input');
  await page.fill('#slider-y', '50');
  await page.dispatchEvent('#slider-y', 'input');

  const updatedUserBg = await page.$eval('#user-swatch', el => el.style.backgroundColor);
  console.log('Updated userBg after slider move:', updatedUserBg);

  // Take screenshot before guess
  const artifactDir = '/Users/dalsc2/.gemini/antigravity/brain/a7e662bd-249d-4d30-bd04-328d25225fda';
  await page.screenshot({ path: path.join(artifactDir, 'color_mixer_before_guess.png') });

  // Click submit guess
  const guessBtn = await page.$('#btn-submit');
  if (guessBtn) {
    await guessBtn.click();
    console.log('Clicked submitGuess button');
  } else {
    console.log('No submitGuess button found!');
  }

  await page.waitForTimeout(300);

  const overlayOpacity = await page.$eval('#result-overlay', el => window.getComputedStyle(el).opacity);
  const accuracyText = await page.$eval('#result-score', el => el.innerText);
  const feedbackText = await page.$eval('#feedback-text', el => el.innerText);
  console.log('Overlay opacity after guess:', overlayOpacity);
  console.log('Accuracy text:', accuracyText);
  console.log('Feedback text:', feedbackText);

  // Take screenshot after guess
  await page.screenshot({ path: path.join(artifactDir, 'color_mixer_after_guess.png') });

  // Click next round
  const nextBtn = await page.$('#btn-next');
  if (nextBtn) {
    await nextBtn.click();
    console.log('Clicked nextRound button');
  }
  await page.waitForTimeout(300);

  const newTargetBg = await page.$eval('#target-swatch', el => el.style.backgroundColor);
  console.log('New targetBg after next round:', newTargetBg);

  console.log('Console logs:', consoleMessages);
  await browser.close();
  console.log('TEST COMPLETED SUCCESSFULLY');
}

run().catch(console.error);
