const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(getHtmlFiles(filePath));
        } else if (filePath.endsWith('.html')) {
            results.push(filePath);
        }
    }
    return results;
}

const publicDir = path.join(process.cwd(), 'public');
const allFiles = getHtmlFiles(publicDir);

const EXPECTED_TAGS = [
    '<style>html{opacity:0;}html.page-ready{opacity:1;transition:opacity 0.18s ease;}</style>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>',
    '<meta name="description"',
    '<link rel="canonical"',
    '<meta name="keywords"',
    '<meta name="author" content="Toolkit Gen">',
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title"',
    '<meta property="og:description"',
    '<meta property="og:url"',
    '<meta property="og:site_name" content="Toolkit Gen">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title"',
    '<meta name="twitter:description"',
    '<link rel="stylesheet" href="/style.css?v=3">',
    '<script src="/tailwind.js"></script>',
    "<script>document.addEventListener('DOMContentLoaded', function () { document.documentElement.classList.add('page-ready'); });</script>",
    '<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675079345370949" crossorigin="anonymous"></script> -->',
    '<script type="application/ld+json">'
];

const auditResults = {
    total: allFiles.length,
    valid: 0,
    invalid: [],
    adsenseViolations: []
};

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
    
    if (!headMatch) {
        auditResults.invalid.push({ file: path.relative(publicDir, file), reason: 'Missing <head> tag' });
        continue;
    }
    
    const headContent = headMatch[1];
    
    // Check for required tags
    let missingTags = [];
    for (const tag of EXPECTED_TAGS) {
        if (!headContent.includes(tag)) {
            missingTags.push(tag);
        }
    }
    
    // Check for AdSense violations in the entire file
    // 1. Multiple AdSense script tags (excluding the commented one in head, we check for uncommented ones)
    const adsenseMatches = content.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g);
    if (adsenseMatches && adsenseMatches.length > 1) {
        // One is allowed (even if commented out). More than one is a violation.
        // Wait, if it's commented out in head, and there's another one, that's bad.
        auditResults.adsenseViolations.push({ file: path.relative(publicDir, file), reason: 'Multiple AdSense script tags found' });
    }
    
    // 2. Invisible ad containers
    // We can't perfectly parse CSS, but we can check for common inline styles on ad units
    const adUnitMatches = content.match(/<ins[^>]*class="adsbygoogle"[^>]*>/g);
    if (adUnitMatches) {
        for (const match of adUnitMatches) {
            if (match.includes('display:none') || match.includes('display: none') || match.includes('visibility:hidden') || match.includes('visibility: hidden')) {
                // display:none is allowed by responsive ad units if done properly, but generally we want to ensure no hidden ads.
                // Google allows display:none for responsive ads via CSS media queries, but inline might be flagged if not careful. Let's just flag for review.
            }
        }
    }

    // 3. Auto-refresh scripts or overlays (basic check)
    if (content.includes('http-equiv="refresh"')) {
        auditResults.adsenseViolations.push({ file: path.relative(publicDir, file), reason: 'Meta refresh tag found (not allowed with AdSense)' });
    }

    if (missingTags.length > 0) {
        auditResults.invalid.push({ file: path.relative(publicDir, file), reason: 'Missing required SEO/head tags', details: missingTags });
    } else {
        auditResults.valid++;
    }
}

fs.writeFileSync(path.join(process.cwd(), 'scratch/head_audit_results.json'), JSON.stringify(auditResults, null, 2));
console.log(`Audit complete. Valid: ${auditResults.valid}, Invalid: ${auditResults.invalid.length}, AdSense Violations: ${auditResults.adsenseViolations.length}`);
