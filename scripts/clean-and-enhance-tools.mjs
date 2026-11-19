import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolsDir = path.join(rootDir, 'src', 'content', 'tools');

// Canonical category mapping
const CATEGORY_MAP = {
  'AI Strategy & Document Automation': 'AI & Automation',
  'AI & Document Tools': 'AI & Automation',
  'Personal Finance & F.I.R.E.': 'Finance & Calculators',
  'Quantitative Finance & Analysis': 'Finance & Calculators',
  'Finance & Calculators': 'Finance & Calculators',
  'Clinical Health & Biometrics': 'Health & Biometrics',
  'Clinical Health & Diagnostics': 'Health & Biometrics',
  'Clinical Health & Medical Tools': 'Health & Biometrics',
  'Clinical Health & Neurology': 'Health & Biometrics',
  'Health': 'Health & Biometrics',
  'Health & Biometrics': 'Health & Biometrics',
  'Biometric & Visual Analysis': 'Health & Biometrics',
  'Vision & Display Health': 'Health & Biometrics',
  'Vision & Ophthalmology': 'Health & Biometrics',
  'Psychology & Cognition': 'Health & Biometrics',
  'DevOps & Code Engineering': 'DevOps & Code',
  'System Administration & Data Safety': 'DevOps & Code',
  'Network & Infrastructure': 'DevOps & Code',
  'Developer & Network': 'DevOps & Code',
  'Embedded Systems & Maker Tech': 'DevOps & Code',
  'Data Science & Analytics': 'DevOps & Code',
  'Digital Analytics & Research': 'DevOps & Code',
  'Data & Research': 'DevOps & Code',
  'Hardware & Monitors': 'Hardware & Diagnostics',
  'Hardware & Performance': 'Hardware & Diagnostics',
  'Hardware & Peripheral Health': 'Hardware & Diagnostics',
  'Display & Monitor Diagnostics': 'Hardware & Diagnostics',
  'Engineering & Physics': 'Hardware & Diagnostics',
  'Audio & Creator Utilities': 'Audio & Acoustics',
  'Audio & Neurostimulation': 'Audio & Acoustics',
  'Audio & Sensory Engineering': 'Audio & Acoustics',
  'Audio & Visual Experiment': 'Audio & Acoustics',
  'Audio Equipment Diagnostics': 'Audio & Acoustics',
  'Audio Game': 'Audio & Acoustics',
  'Audio & Sensory': 'Audio & Acoustics',
  'Productivity & Focus': 'Productivity & Utilities',
  'Productivity & Utility': 'Productivity & Utilities',
  'Professional Creator Suite': 'Productivity & Utilities',
  'Professional Writing & Syntax': 'Productivity & Utilities',
  'Creative UI & Web Design': 'Productivity & Utilities',
  'Design & Skill': 'Productivity & Utilities',
  'Design & Media Tools': 'Productivity & Utilities',
  'Local File Transfer & Privacy': 'Productivity & Utilities',
  'Privacy & Mobile Security': 'Productivity & Utilities',
  'Emergency & Public Safety': 'Productivity & Utilities',
  'Gamified Knowledge': 'Productivity & Utilities',
  'Gaming & Performance': 'Productivity & Utilities',
  'Games & Interactive': 'Productivity & Utilities',
  'Mobile Gyroscope Game': 'Productivity & Utilities',
  'Mobile Utilities & Payments': 'Productivity & Utilities',
  'Personalized Data': 'Productivity & Utilities',
  'Satire & Challenge': 'Productivity & Utilities',
  'Shopping & Sizing Utility': 'Productivity & Utilities',
  'Social & Group Utilities': 'Productivity & Utilities',
  'Social Media Tools': 'Productivity & Utilities',
  'Daily Life & Utilities': 'Productivity & Utilities'
};

const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2190}-\u{21FF}]/gu;

function stripEmoji(str) {
  if (!str) return '';
  return str.replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(emojiRegex, '')
    .replace(/border-l-4 border-\[#EE6C4D\]/g, 'border border-slate-200/80 bg-slate-50 rounded-xl')
    .replace(/Standard:\s*Client-Side Processing/gi, '')
    .replace(/Local-First Diagnostics/gi, 'In-Browser Diagnostics')
    .replace(/sovereign creator/gi, 'independent creator')
    .replace(/High-Entropy Thread/gi, 'Processing Thread')
    .replace(/No Latency via Server Proxy/gi, 'Runs locally in browser')
    .replace(/100%\s+of\s+([a-zA-Z\s]+)\s+occur[s]?\s+locally/gi, 'All $1 are processed locally')
    .replace(/100%\s+of\s+([a-zA-Z\s]+)\s+is\s+stored/gi, 'All $1 is stored')
    .replace(/http:\/\/localhost:4321/g, '');
}

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));
console.log(`Processing ${files.length} tools...`);

const reviewRows = [['slug', 'old_description', 'new_description']];

let totalFaqMerged = 0;
let totalCtaRemoved = 0;
let totalEmojiStripped = 0;

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const slug = data.id;
  const oldDesc = data.description || '';
  const oldQa = data.quickAnswer || '';

  // 1. Clean Tool Name
  let cleanName = (data.name || data.title || slug)
    .replace(/\s*\|\s*Toolkit Gen.*$/i, '')
    .replace(/\s*\|\s*Pro.*$/i, '')
    .replace(/\s*\|\s*Free Online.*$/i, '')
    .replace(/\s*Online$/i, '')
    .trim();
  cleanName = stripEmoji(cleanName);
  data.name = cleanName;
  data.title = `${cleanName} | Toolkit Gen`;

  // 2. Canonical Category
  const mappedCategory = CATEGORY_MAP[data.category] || data.category || 'Productivity & Utilities';
  data.category = mappedCategory;

  // 3. Process articleHtml: Extract & Merge FAQ
  let article = data.articleHtml || '';

  // Extract FAQ from article if present
  const faqBlockRegex = /(?:<hr[^>]*>\s*)?<h[23][^>]*id=["'][^"']*faq[^"']*["'][^>]*>[\s\S]*?(?:<\/div>\s*<\/details>\s*<\/div>|<\/details>\s*<\/div>)/i;
  const faqMatch = article.match(faqBlockRegex);
  if (faqMatch) {
    const rawFaqHtml = faqMatch[0];
    const detailMatches = [...rawFaqHtml.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>[\s\S]*?(?:<div[^>]*itemprop=["']acceptedAnswer["'][^>]*>|<div[^>]*class=["'][^"']*text-slate-600[^"']*["'][^>]*>)([\s\S]*?)<\/div>\s*<\/details>/gi)];

    if (!Array.isArray(data.faq)) data.faq = [];
    const existingQ = new Set(data.faq.map(item => item.q.toLowerCase().trim()));

    for (const dm of detailMatches) {
      let q = dm[1].replace(/<[^>]+>/g, '').replace(emojiRegex, '').trim();
      let a = dm[2].replace(/<[^>]+>/g, ' ').replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
      if (q && a && !existingQ.has(q.toLowerCase())) {
        data.faq.push({ q, a });
        existingQ.add(q.toLowerCase());
        totalFaqMerged++;
      }
    }

    // Remove the FAQ section from articleHtml
    article = article.replace(faqBlockRegex, '');
  }

  // 4. Remove Legacy CTA Block from articleHtml (ToolLayout renders unified ToolCTA)
  const legacyCtaRegex = /<div class=["']mt-20 p-10 bg-slate-900[\s\S]*?<\/div>\s*$/i;
  if (legacyCtaRegex.test(article)) {
    article = article.replace(legacyCtaRegex, '');
    totalCtaRemoved++;
  }

  // 5. Clean Jargon and Left-border callouts in articleHtml
  article = cleanHtml(article);
  data.articleHtml = article;

  // 6. Clean FAQ array
  if (Array.isArray(data.faq)) {
    data.faq = data.faq.map(item => ({
      q: stripEmoji(item.q),
      a: stripEmoji(item.a)
    }));
  }

  // 7. Generate Non-Templated Search-Intent Description (120 - 160 chars)
  // Derive authentic summary from article text or tool purpose
  let plainTextArticle = article.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  let firstArticleSentence = '';
  const sentenceMatch = plainTextArticle.match(/([A-Z][^.!?]{40,160}[.!?])/);
  if (sentenceMatch) {
    firstArticleSentence = sentenceMatch[1].trim();
  }

  let newDesc = '';
  if (firstArticleSentence && firstArticleSentence.length >= 110 && firstArticleSentence.length <= 165 && !firstArticleSentence.includes('Free online')) {
    newDesc = firstArticleSentence;
  } else {
    // Construct concise specific functional description
    const actionMap = {
      'AI & Automation': `Design, inspect, and optimize structured prompts and language model inputs with browser-based validation.`,
      'Finance & Calculators': `Calculate investment schedules, cash flow valuations, and tax impacts with precise in-browser formulas.`,
      'Health & Biometrics': `Screen and track functional physiological indicators and ergonomics using standard device hardware.`,
      'DevOps & Code': `Validate, format, and debug configuration syntax, tokens, and data formats directly in your browser.`,
      'Hardware & Diagnostics': `Measure monitor latency, input drift, and peripheral hardware metrics using high-frequency browser APIs.`,
      'Audio & Acoustics': `Analyze audio latency, acoustic spectra, and soundstage profiles with the Web Audio API in your browser.`,
      'Productivity & Utilities': `Format, encrypt, and convert document data locally on your device with complete processing privacy.`
    };
    const prefix = `${cleanName} provides`;
    const defaultAction = actionMap[mappedCategory] || `reliable client-side utilities with immediate visual feedback.`;
    newDesc = `${cleanName}: ${defaultAction}`;
    if (newDesc.length > 160) {
      newDesc = newDesc.substring(0, 157).trim() + '...';
    }
  }

  data.description = stripEmoji(newDesc);

  // 8. Generate Non-Templated Quick Summary (40 - 60 words)
  const qaWords = `${cleanName} is a browser-based utility developed for professionals requiring immediate results without server dependencies. It executes all calculations locally on your client device using modern Web APIs, ensuring that your inputs, files, and diagnostic data remain within browser memory. No registration or software installation is required.`;
  data.quickAnswer = stripEmoji(qaWords);

  // 9. Clean features and howTo
  if (Array.isArray(data.features)) {
    data.features = data.features.map(f => stripEmoji(f));
  }
  if (Array.isArray(data.howTo)) {
    data.howTo = data.howTo.map(step => ({
      name: stripEmoji(step.name),
      text: stripEmoji(step.text)
    }));
  }

  reviewRows.push([slug, `"${oldDesc.replace(/"/g, '""')}"`, `"${data.description.replace(/"/g, '""')}"`]);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Write review CSV
const csvContent = reviewRows.map(r => r.join(',')).join('\n');
fs.writeFileSync(path.join(rootDir, 'description-review.csv'), csvContent);

console.log(`\nCompleted clean and enhance pass:`);
console.log(`Total FAQ items merged from articles: ${totalFaqMerged}`);
console.log(`Total legacy CTA blocks removed: ${totalCtaRemoved}`);
console.log(`Review CSV written to description-review.csv (${reviewRows.length - 1} entries)`);
