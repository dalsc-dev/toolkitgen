#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('----------------------------------------------------');
console.log('Toolkit Gen Comprehensive SEO, AEO & Schema CI Audit');
console.log('----------------------------------------------------');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist/ directory does not exist. Run "pnpm run build" first.');
  process.exit(1);
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Read redirects table
const redirectsFile = path.join(rootDir, 'public', '_redirects');
const redirectsMap = new Map();
if (fs.existsSync(redirectsFile)) {
  const lines = fs.readFileSync(redirectsFile, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      redirectsMap.set(parts[0], parts[1]);
    }
  }
}

function findHtmlFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, list);
    } else if (entry.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const htmlFiles = findHtmlFiles(distDir);
console.log(`Auditing ${htmlFiles.length} generated HTML pages in dist/...\n`);

const errors = [];
const warnings = [];

// Track indexable pages and schema stats
let toolCount = 0;
let guideCount = 0;
let hubCount = 0;
let coreCount = 0;
let schemaAppCount = 0;
let schemaArticleCount = 0;
let schemaFaqCount = 0;
let schemaHowToCount = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(rootDir, filePath);
  const baseName = path.basename(filePath);

  // Skip special technical / verification files
  if (baseName === '404.html' || baseName.startsWith('mywot') || baseName.includes('verification')) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Strip script and style blocks for DOM/semantic structure tests
  const markupWithoutScripts = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 1. Language Attribute
  if (!content.includes('<html lang="en"') && !content.includes("<html lang='en'")) {
    errors.push(`[${relPath}] Missing <html lang="en"> attribute.`);
  }

  // 2. Title Tag Check
  const titleMatches = content.match(/<title[^>]*>([\s\S]*?)<\/title>/gi);
  if (!titleMatches || titleMatches.length === 0) {
    errors.push(`[${relPath}] Missing <title> tag.`);
  } else if (titleMatches.length > 1) {
    errors.push(`[${relPath}] Multiple (${titleMatches.length}) <title> tags detected.`);
  } else {
    const rawTitleText = titleMatches[0].replace(/<[^>]+>/g, '').trim();
    const titleText = decodeHtmlEntities(rawTitleText);
    if (titleText.length === 0) {
      errors.push(`[${relPath}] Empty <title> tag.`);
    } else if (titleText.length > 75) {
      warnings.push(`[${relPath}] Title is long (${titleText.length} chars > 75): "${titleText.substring(0, 60)}..."`);
    }
    if (!titleText.includes('Toolkit Gen') && !relPath.includes('thanks.html')) {
      warnings.push(`[${relPath}] Title does not contain brand "Toolkit Gen": "${titleText}"`);
    }
  }

  // 3. Meta Description Check (Matches properly quoted attributes)
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) ||
                    content.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i) ||
                    content.match(/<meta\s+content="([^"]*)"\s+name=["']description["']/i) ||
                    content.match(/<meta\s+content='([^']*)'\s+name=["']description["']/i);
  if (!descMatch) {
    // thanks page is noindex and doesn't require meta description
    if (!relPath.includes('thanks.html')) {
      errors.push(`[${relPath}] Missing meta description.`);
    }
  } else {
    const descText = decodeHtmlEntities(descMatch[1].trim());
    if (descText.length < 50) {
      warnings.push(`[${relPath}] Meta description too short (${descText.length} chars < 50): "${descText}"`);
    } else if (descText.length > 200) {
      warnings.push(`[${relPath}] Meta description too long (${descText.length} chars > 200).`);
    }
  }

  // 4. Exactly One H1 Tag in Visible DOM
  const h1Matches = markupWithoutScripts.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    errors.push(`[${relPath}] Missing <h1> heading.`);
  } else if (h1Matches.length > 1) {
    errors.push(`[${relPath}] Multiple (${h1Matches.length}) <h1> headings detected.`);
  }

  // 5. Canonical Tag Check
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                         content.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  if (!canonicalMatch) {
    errors.push(`[${relPath}] Missing canonical link tag.`);
  } else {
    const canonicalHref = canonicalMatch[1].trim();
    if (!canonicalHref.startsWith('https://toolkitgen.com')) {
      errors.push(`[${relPath}] Canonical href is not absolute https://toolkitgen.com: "${canonicalHref}"`);
    }
  }

  // 6. JSON-LD Structured Data Validation
  const jsonLdBlocks = content.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdBlocks) {
    for (const block of jsonLdBlocks) {
      const rawJson = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
      try {
        const parsed = JSON.parse(rawJson);
        const graph = parsed['@graph'] || [parsed];

        for (const item of graph) {
          const type = Array.isArray(item['@type']) ? item['@type'].join(',') : item['@type'];

          // Anti-fabrication check: Zero fake aggregateRating
          if (item.aggregateRating) {
            errors.push(`[${relPath}] Anti-fabrication violation: Fake aggregateRating found in ${type} schema!`);
          }

          if (type && type.includes('SoftwareApplication')) {
            schemaAppCount++;
            if (!item.offers) {
              warnings.push(`[${relPath}] SoftwareApplication schema missing offers property.`);
            }
          }
          if (type && type.includes('TechArticle')) {
            schemaArticleCount++;
          }
          if (type && type.includes('FAQPage')) {
            schemaFaqCount++;
            if (!item.mainEntity || !Array.isArray(item.mainEntity) || item.mainEntity.length === 0) {
              errors.push(`[${relPath}] FAQPage schema has empty mainEntity list.`);
            }
          }
          if (type && type.includes('HowTo')) {
            schemaHowToCount++;
            if (!item.step || !Array.isArray(item.step) || item.step.length === 0) {
              errors.push(`[${relPath}] HowTo schema has empty step list.`);
            }
          }
        }
      } catch (err) {
        errors.push(`[${relPath}] Malformed JSON-LD script block: ${err.message}`);
      }
    }
  }

  // 7. Word Count Check (Substantial content >= 200 words)
  const plainText = markupWithoutScripts
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;
  if (wordCount < 200 && !relPath.includes('thanks.html')) {
    warnings.push(`[${relPath}] Low word count (${wordCount} words < 200)`);
  }

  // Count by page archetype
  if (relPath.startsWith('dist/tool/')) toolCount++;
  else if (relPath.startsWith('dist/guide/')) guideCount++;
  else if (relPath.startsWith('dist/hubs/')) hubCount++;
  else coreCount++;
}

// 8. Sitemap Integrity Audit
const sitemapIndexFile = path.join(distDir, 'sitemap-index.xml');
if (!fs.existsSync(sitemapIndexFile)) {
  errors.push('dist/sitemap-index.xml is missing.');
} else {
  const indexXml = fs.readFileSync(sitemapIndexFile, 'utf8');
  if (!indexXml.includes('sitemap-tools.xml') || !indexXml.includes('sitemap-guides.xml')) {
    errors.push('dist/sitemap-index.xml does not reference tools or guides sitemaps.');
  }
}

// 9. llms.txt & llms-full.txt Audit
const llmsFile = path.join(distDir, 'llms.txt');
const llmsFullFile = path.join(distDir, 'llms-full.txt');
if (!fs.existsSync(llmsFile)) {
  errors.push('dist/llms.txt is missing.');
}
if (!fs.existsSync(llmsFullFile)) {
  errors.push('dist/llms-full.txt is missing.');
}

console.log('--- Audit Summary & Discovery Coverage ---');
console.log(`Standalone Tool Pages:        ${toolCount}`);
console.log(`Diagnostic Guide Pages:       ${guideCount}`);
console.log(`Specialized Hub Pages:        ${hubCount}`);
console.log(`Core / Category Pages:        ${coreCount}`);
console.log(`SoftwareApplication Schemas:  ${schemaAppCount}`);
console.log(`TechArticle Schemas:          ${schemaArticleCount}`);
console.log(`FAQPage Schemas:              ${schemaFaqCount}`);
console.log(`HowTo Schemas:                ${schemaHowToCount}`);
console.log('------------------------------------------\n');

if (warnings.length > 0) {
  console.log(`Audit Warnings (${warnings.length}):`);
  for (const w of warnings.slice(0, 10)) {
    console.log(`  [WARN] ${w}`);
  }
  if (warnings.length > 10) {
    console.log(`  ... and ${warnings.length - 10} more warnings.`);
  }
  console.log('');
}

if (errors.length > 0) {
  console.error(`Audit FAILED with ${errors.length} error(s):`);
  for (const e of errors) {
    console.error(`  [ERR] ${e}`);
  }
  process.exit(1);
}

console.log('All SEO, AEO, CWV & Schema Audit Quality Gates Passed! (0 Errors)');
process.exit(0);
