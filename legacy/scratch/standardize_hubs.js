const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const EXPECTED_TAGS = [
    '<style>html{opacity:0;}html.page-ready{opacity:1;transition:opacity 0.18s ease;}</style>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>', // Placeholder, keep existing title
    '<meta name="description"', // Placeholder, keep existing description
    '<link rel="canonical"', // Placeholder, keep existing canonical or generate
    '<meta name="keywords"', // Placeholder, keep existing keywords
    '<meta name="author" content="Toolkit Gen">',
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title"', // Placeholder
    '<meta property="og:description"', // Placeholder
    '<meta property="og:url"', // Placeholder
    '<meta property="og:site_name" content="Toolkit Gen">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title"', // Placeholder
    '<meta name="twitter:description"', // Placeholder
    '<link rel="stylesheet" href="/style.css?v=3">',
    '<script src="/tailwind.js"></script>',
    "<script>document.addEventListener('DOMContentLoaded', function () { document.documentElement.classList.add('page-ready'); });</script>",
    '<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675079345370949" crossorigin="anonymous"></script> -->',
    '<script type="application/ld+json">' // Placeholder
];

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });

    // Extract existing crucial metadata
    const title = $('title').text() || 'Toolkit Gen Hub';
    const description = $('meta[name="description"]').attr('content') || title;
    const keywords = $('meta[name="keywords"]').attr('content') || 'tools, toolkit gen';
    let canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) {
        const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/');
        canonical = `https://toolkitgen.com/${relativePath}`;
    }
    const schema = $('script[type="application/ld+json"]').html() || `
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "${title}",
      "url": "${canonical}",
      "description": "${description}"
    }
  ]
}`;

    // Construct the new head
    const newHead = `
    ${EXPECTED_TAGS[0]}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="Toolkit Gen">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="Toolkit Gen">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <link rel="stylesheet" href="/style.css?v=3">
    <script src="/tailwind.js"></script>
    ${EXPECTED_TAGS[19]}
    ${EXPECTED_TAGS[20]}
    <script type="application/ld+json">${schema}</script>
`;

    // Replace the head
    const newContent = content.replace(/<head>[\s\S]*?<\/head>/i, `<head>\n${newHead}</head>`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Standardized head for ${filePath}`);
}

const hubsDir = path.join(process.cwd(), 'public/hubs');
if (fs.existsSync(hubsDir)) {
    const list = fs.readdirSync(hubsDir);
    for (const file of list) {
        if (file.endsWith('.html')) {
            processHtmlFile(path.join(hubsDir, file));
        }
    }
}
// Also standardise 404.html to make it uniform
processHtmlFile(path.join(process.cwd(), 'public/404.html'));
