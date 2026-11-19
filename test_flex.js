const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const toolsDir = path.join('/Users/dalsc2/Downloads/Project/toolkitgen', 'public', 'tool');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html')).map(f => path.join(toolsDir, f));

let problemFiles = [];

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { recognizeSelfClosing: true, decodeEntities: false });

    const article = $('article');
    if (article.length > 0) {
        // If the article is inside anything other than <main> or body directly, it might be constrained
        // Actually, if parent is not <main> or <body>, it's inside something else.
        const parentTag = article.parent().get(0).tagName.toLowerCase();
        if (parentTag !== 'main' && parentTag !== 'body') {
            problemFiles.push({ file, parentTag, parentClass: article.parent().attr('class') });
        }
    }
}
console.log("Problem files: " + problemFiles.length);
if (problemFiles.length > 0) {
    console.log(problemFiles.slice(0, 5));
}
