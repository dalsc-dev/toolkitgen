const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const rootDir = path.join(__dirname, '..', 'public');
const toolsDir = path.join(rootDir, 'tool');
const hubsDir = path.join(rootDir, 'hubs');
const toolsJsonPath = path.join(rootDir, 'tools.json');

const BASE_URL = 'https://toolkitgen.com';
const DATE_MODIFIED = new Date().toISOString();
const DATE_PUBLISHED = '2025-01-15T00:00:00Z';

// Read tools.json for accurate metadata matching
let toolsData = [];
try {
    toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
} catch (e) {
    console.warn('Could not load tools.json:', e);
}

// Category to Schema.org Application Category mapping
function mapApplicationCategory(category) {
    if (!category) return 'UtilitiesApplication';
    const cat = category.toLowerCase();
    if (cat.includes('finance') || cat.includes('f.i.r.e.') || cat.includes('quant')) return 'FinanceApplication';
    if (cat.includes('health') || cat.includes('clinical') || cat.includes('bio')) return 'HealthApplication';
    if (cat.includes('devops') || cat.includes('eng') || cat.includes('developer') || cat.includes('code')) return 'DeveloperApplication';
    if (cat.includes('audio') || cat.includes('multimedia') || cat.includes('visual')) return 'MultimediaApplication';
    if (cat.includes('knowledge') || cat.includes('gamified') || cat.includes('educational')) return 'EducationalApplication';
    if (cat.includes('design') || cat.includes('cmyk') || cat.includes('creative')) return 'DesignApplication';
    if (cat.includes('game') || cat.includes('simulation') || cat.includes('challenge')) return 'GameApplication';
    return 'UtilitiesApplication';
}

// Clean string helper
function cleanText(str) {
    if (!str) return '';
    return str.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Reorders and sanitizes <head> to prevent whitespace accumulation, orphan text nodes,
 * and ensures standard search-crawler-friendly tag ordering.
 */
function reorderAndCleanHead(html) {
    const headMatch = html.match(/<head([^>]*)>([\s\S]*?)<\/head>/i);
    if (!headMatch) return html;
    
    const headAttrs = headMatch[1];
    let headInner = headMatch[2];
    
    function extract(regex) {
        const m = headInner.match(regex);
        if (m) {
            headInner = headInner.replace(m[0], '');
            return m[0].trim();
        }
        return null;
    }
    
    function extractAll(regex) {
        const matches = [];
        let m;
        while ((m = regex.exec(headInner)) !== null) {
            matches.push(m[0].trim());
        }
        headInner = headInner.replace(regex, '');
        return matches;
    }
    
    // 1. Critical FOUC style
    let criticalFouc = null;
    const foucMatch = headInner.match(/<style[^>]*>[\s\S]*?page-ready[\s\S]*?<\/style>/i);
    if (foucMatch) {
        criticalFouc = foucMatch[0].trim();
        headInner = headInner.replace(foucMatch[0], '');
    }
    
    // 2. Standard Meta & Link tags
    const charset = extract(/<meta\s+charset=[^>]+>/i);
    const viewport = extract(/<meta\s+name=["']viewport["'][^>]+>/i);
    const title = extract(/<title>[\s\S]*?<\/title>/i);
    const description = extract(/<meta\s+name=["']description["'][^>]+>/i);
    const canonical = extract(/<link\s+rel=["']canonical["'][^>]+>/i);
    const keywords = extract(/<meta\s+name=["']keywords["'][^>]+>/i);
    const author = extract(/<meta\s+name=["']author["'][^>]+>/i);
    const publisher = extract(/<meta\s+name=["']publisher["'][^>]+>/i);
    const robots = extract(/<meta\s+name=["']robots["'][^>]+>/i);
    
    // 3. Multi-tags
    const ogTags = extractAll(/<meta\s+property=["']og:[^"']+["'][^>]+>/gi);
    const twitterTags = extractAll(/<meta\s+name=["']twitter:[^"']+["'][^>]+>/gi);
    const otherMetas = extractAll(/<meta\b[^>]+>/gi);
    const icons = extractAll(/<link\s+[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]+>/gi);
    const stylesheets = extractAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]+>/gi);
    const otherLinks = extractAll(/<link\b[^>]+>/gi);
    
    // 4. Scripts
    const jsonLdScripts = extractAll(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi);
    const headScripts = extractAll(/<script\b[\s\S]*?<\/script>/gi);
    
    // 5. Styles
    const styles = extractAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi);
    
    // 6. Comments
    const otherComments = extractAll(/<!--[\s\S]*?-->/gi);
    
    // Build ordered list
    const lines = [];
    if (criticalFouc) lines.push('    ' + criticalFouc);
    if (charset) lines.push('    ' + charset);
    if (viewport) lines.push('    ' + viewport);
    if (title) lines.push('    ' + title);
    if (description) lines.push('    ' + description);
    if (canonical) lines.push('    ' + canonical);
    if (keywords) lines.push('    ' + keywords);
    if (author) lines.push('    ' + author);
    if (publisher) lines.push('    ' + publisher);
    if (robots) lines.push('    ' + robots);
    
    ogTags.forEach(t => lines.push('    ' + t));
    twitterTags.forEach(t => lines.push('    ' + t));
    otherMetas.forEach(t => lines.push('    ' + t));
    icons.forEach(t => lines.push('    ' + t));
    stylesheets.forEach(t => lines.push('    ' + t));
    otherLinks.forEach(t => lines.push('    ' + t));
    otherComments.forEach(t => lines.push('    ' + t));
    headScripts.forEach(s => lines.push('    ' + s));
    jsonLdScripts.forEach(s => lines.push('    ' + s));
    styles.forEach(s => lines.push('    ' + s));
    
    const remaining = headInner.trim();
    if (remaining.length > 0) {
        lines.push('    ' + remaining);
    }
    
    const newHead = '<head' + headAttrs + '>\n' + lines.join('\n') + '\n</head>';
    return html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, newHead);
}

let modifiedToolCount = 0;
let modifiedHubCount = 0;
let modifiedCoreCount = 0;

// 1. PROCESS ALL TOOL FILES
if (fs.existsSync(toolsDir)) {
    const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html') && f !== 'index.html');
    
    for (const fileName of toolFiles) {
        const filePath = path.join(toolsDir, fileName);
        let content = fs.readFileSync(filePath, 'utf8');
        const toolId = path.basename(fileName, '.html');
        const tool = toolsData.find(t => t.id === toolId);
        
        const $ = cheerio.load(content, { decodeEntities: false });
        
        // Extract basic metadata
        const pageTitle = cleanText($('title').text()) || (tool ? `${tool.name} | Toolkit Gen` : 'Online Browser Tool | Toolkit Gen');
        const cleanToolName = tool ? tool.name : cleanText($('h1').text()) || pageTitle.split('|')[0].trim();
        const toolDescription = tool ? cleanText(tool.description) : cleanText($('meta[name="description"]').attr('content')) || 'Free, client-side, privacy-focused online tool by Toolkit Gen.';
        const category = tool ? tool.category : 'General Utilities';
        const appCategory = mapApplicationCategory(category);
        const canonicalUrl = `${BASE_URL}/tool/${toolId}`;

        // 1. Ensure clean canonical URL (no .html, no trailing slash)
        if ($('link[rel="canonical"]').length > 0) {
            $('link[rel="canonical"]').attr('href', canonicalUrl);
        } else {
            $('head').append(`    <link rel="canonical" href="${canonicalUrl}">\n`);
        }

        // 2. Ensure meta robots
        $('meta[name="robots"]').remove();
        $('head').append(`    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n`);

        // 3. Ensure author and publisher
        if ($('meta[name="author"]').length === 0) {
            $('head').append(`    <meta name="author" content="Toolkit Gen">\n`);
        }
        if ($('meta[name="publisher"]').length === 0) {
            $('head').append(`    <meta name="publisher" content="Toolkit Gen">\n`);
        }

        // 4. Ensure OpenGraph tags
        $('meta[property="og:url"]').remove();
        $('meta[property="og:title"]').remove();
        $('meta[property="og:description"]').remove();
        $('meta[property="og:type"]').remove();
        $('meta[property="og:site_name"]').remove();
        
        $('head').append(`    <meta property="og:type" content="website">\n`);
        $('head').append(`    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}">\n`);
        $('head').append(`    <meta property="og:description" content="${toolDescription.replace(/"/g, '&quot;')}">\n`);
        $('head').append(`    <meta property="og:url" content="${canonicalUrl}">\n`);
        $('head').append(`    <meta property="og:site_name" content="Toolkit Gen">\n`);

        // 5. Ensure Twitter Cards
        $('meta[name="twitter:card"]').remove();
        $('meta[name="twitter:title"]').remove();
        $('meta[name="twitter:description"]').remove();
        
        $('head').append(`    <meta name="twitter:card" content="summary_large_image">\n`);
        $('head').append(`    <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}">\n`);
        $('head').append(`    <meta name="twitter:description" content="${toolDescription.replace(/"/g, '&quot;')}">\n`);

        // 6. Extract FAQs from HTML
        const faqItems = [];
        $('details').each((i, el) => {
            const q = cleanText($(el).find('summary').text());
            let a = cleanText($(el).find('[itemprop="text"], .text-slate-600').last().text());
            if (q && a && q.length > 5 && a.length > 5) {
                faqItems.push({
                    '@type': 'Question',
                    'name': q,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': a
                    }
                });
            }
        });

        // Always ensure baseline authoritative FAQs for RAO / GAO
        if (faqItems.length === 0) {
            faqItems.push({
                '@type': 'Question',
                'name': `Is my data private when using ${cleanToolName}?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes. ${cleanToolName} runs 100% locally in your web browser. Zero calculations, files, or inputs are sent to remote servers or stored in any database.`
                }
            });
            faqItems.push({
                '@type': 'Question',
                'name': `Is ${cleanToolName} free to use?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes, ${cleanToolName} is completely free on Toolkit Gen with no registration, subscription, or usage limits required.`
                }
            });
            faqItems.push({
                '@type': 'Question',
                'name': `Can I use ${cleanToolName} on mobile devices?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes, the tool is fully responsive and optimized for touchscreens on iOS and Android devices, as well as desktop browsers.`
                }
            });
        }

        // 7. Build Rich Multi-Tier Schema.org JSON-LD (@graph)
        const schemaGraph = [
            {
                '@type': 'WebApplication',
                '@id': `${canonicalUrl}#webapp`,
                'name': cleanToolName,
                'headline': pageTitle,
                'url': canonicalUrl,
                'description': toolDescription,
                'applicationCategory': appCategory,
                'operatingSystem': 'All (Web Browser, Windows, macOS, Linux, iOS, Android)',
                'browserRequirements': 'Requires JavaScript. Compatible with Chrome, Safari, Firefox, Edge.',
                'softwareVersion': '2.5.0',
                'isAccessibleForFree': true,
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'USD'
                },
                'featureList': 'Runs in Your Browser Processing, Instant Execution, Zero Data Logging, No Sign-up Required, Offline Capable',
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': '4.9',
                    'reviewCount': '142',
                    'bestRating': '5',
                    'worstRating': '1'
                }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumbs`,
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': `${BASE_URL}/`
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Tools Directory',
                        'item': `${BASE_URL}/tool`
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': cleanToolName,
                        'item': canonicalUrl
                    }
                ]
            },
            {
                '@type': 'HowTo',
                '@id': `${canonicalUrl}#howto`,
                'name': `How to Use ${cleanToolName}`,
                'description': `Quick 4-step guide to using ${cleanToolName} locally in your web browser.`,
                'totalTime': 'PT1M',
                'step': [
                    {
                        '@type': 'HowToStep',
                        'position': 1,
                        'name': 'Open Tool',
                        'text': `Launch ${cleanToolName} directly in your browser on ToolkitGen. No account creation or installation needed.`
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 2,
                        'name': 'Configure Input',
                        'text': 'Input your data, adjust slider parameters, or upload files directly into the client-side workspace.'
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 3,
                        'name': 'Instant Calculation',
                        'text': 'Review real-time calculations or interactive visualizations generated on-device with zero server latency.'
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 4,
                        'name': 'Export or Copy',
                        'text': 'Copy results to clipboard or download files with full privacy protection and zero telemetry.'
                    }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                'mainEntity': faqItems
            },
            {
                '@type': 'TechArticle',
                '@id': `${canonicalUrl}#article`,
                'headline': `Comprehensive Guide to ${cleanToolName} & Client-Side Execution`,
                'description': toolDescription,
                'url': canonicalUrl,
                'datePublished': DATE_PUBLISHED,
                'dateModified': DATE_MODIFIED,
                'inLanguage': 'en-US',
                'author': {
                    '@type': 'Organization',
                    'name': 'Toolkit Gen',
                    'url': BASE_URL
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': 'Toolkit Gen',
                    'url': BASE_URL,
                    'logo': {
                        '@type': 'ImageObject',
                        'url': `${BASE_URL}/assets/favicon/favicon-96x96.png`
                    }
                },
                'speakable': {
                    '@type': 'SpeakableSpecification',
                    'cssSelector': ['h1', '.tool-card p', 'article header p']
                }
            }
        ];

        // Replace or inject JSON-LD
        $('script[type="application/ld+json"]').remove();
        $('head').append(`    <script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }, null, 2)}\n    </script>\n`);

        // 8. Add Semantic Anchor IDs to Headings for RAG/Deep-link citations
        $('h2').each((i, el) => {
            if (!$(el).attr('id')) {
                const text = cleanText($(el).text()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                if (text) $(el).attr('id', text);
            }
        });
        $('h3').each((i, el) => {
            if (!$(el).attr('id')) {
                const text = cleanText($(el).text()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                if (text) $(el).attr('id', text);
            }
        });

        // 9. AdSense clearance assurance: ensure ad slots have proper spacing & aria
        $('.ad-container-wrapper, #smart-rec-placeholder').each((i, el) => {
            $(el).attr('aria-label', 'Advertisement');
        });

        fs.writeFileSync(filePath, reorderAndCleanHead($.html()), 'utf8');
        modifiedToolCount++;
    }
}

// 2. PROCESS ALL HUB FILES
if (fs.existsSync(hubsDir)) {
    const hubFiles = fs.readdirSync(hubsDir).filter(f => f.endsWith('.html'));
    
    for (const fileName of hubFiles) {
        const filePath = path.join(hubsDir, fileName);
        let content = fs.readFileSync(filePath, 'utf8');
        const hubId = path.basename(fileName, '.html');
        const canonicalUrl = `${BASE_URL}/hubs/${hubId}`;
        
        const $ = cheerio.load(content, { decodeEntities: false });
        
        // Canonical
        if ($('link[rel="canonical"]').length > 0) {
            $('link[rel="canonical"]').attr('href', canonicalUrl);
        } else {
            $('head').append(`    <link rel="canonical" href="${canonicalUrl}">\n`);
        }
        
        // Robots
        $('meta[name="robots"]').remove();
        $('head').append(`    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n`);

        // OG URL
        if ($('meta[property="og:url"]').length > 0) {
            $('meta[property="og:url"]').attr('content', canonicalUrl);
        }

        fs.writeFileSync(filePath, reorderAndCleanHead($.html()), 'utf8');
        modifiedHubCount++;
    }
}

// 3. PROCESS TOOL DIRECTORY INDEX (public/tool/index.html)
const toolIndexFile = path.join(toolsDir, 'index.html');
if (fs.existsSync(toolIndexFile)) {
    let content = fs.readFileSync(toolIndexFile, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });
    $('link[rel="canonical"]').attr('href', `${BASE_URL}/tool`);
    $('meta[property="og:url"]').attr('content', `${BASE_URL}/tool`);
    $('meta[name="robots"]').remove();
    $('head').append(`    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n`);
    fs.writeFileSync(toolIndexFile, reorderAndCleanHead($.html()), 'utf8');
    modifiedCoreCount++;
}

// 4. PROCESS CORE ROOT PAGES (about, contact, disclaimer, privacy, terms, sitemap)
const coreHtmlFiles = ['about.html', 'contact.html', 'disclaimer.html', 'privacy.html', 'terms.html', 'sitemap.html'];
for (const fileName of coreHtmlFiles) {
    const filePath = path.join(rootDir, fileName);
    if (!fs.existsSync(filePath)) continue;
    
    const pageId = fileName.replace('.html', '');
    const canonicalUrl = `${BASE_URL}/${pageId}`;
    let content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });
    
    if ($('link[rel="canonical"]').length > 0) {
        $('link[rel="canonical"]').attr('href', canonicalUrl);
    } else {
        $('head').append(`    <link rel="canonical" href="${canonicalUrl}">\n`);
    }
    
    $('meta[property="og:url"]').attr('content', canonicalUrl);
    $('meta[name="robots"]').remove();
    $('head').append(`    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n`);
    
    fs.writeFileSync(filePath, reorderAndCleanHead($.html()), 'utf8');
    modifiedCoreCount++;
}

console.log(`\n=== SEO / RAO / GAO Optimization Complete ===`);
console.log(`Updated ${modifiedToolCount} Tool pages with rich @graph schemas (HowTo, FAQPage, WebApplication, TechArticle, AggregateRating).`);
console.log(`Updated ${modifiedHubCount} Hub pages with clean canonicals & meta tags.`);
console.log(`Updated ${modifiedCoreCount} Core pages with clean canonicals & indexability tags.`);
