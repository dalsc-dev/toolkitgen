const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const toolsDir = path.join('/Users/dalsc2/Downloads/Project/toolkitgen', 'public', 'tool');

const walk = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
};

const files = walk(toolsDir);
let unextracted = [];

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { recognizeSelfClosing: true, decodeEntities: false });

    // Check if article is inside grid
    const article = $('article');
    if (article.length > 0) {
        const gridContainer = article.closest('.grid');
        if (gridContainer.length > 0) {
            unextracted.push(file);
        }
    }
}
console.log("Unextracted count: " + unextracted.length);
if (unextracted.length > 0) {
    console.log("Example 1: " + unextracted[0]);
    // check its structure
    const html = fs.readFileSync(unextracted[0], 'utf8');
    const $ = cheerio.load(html);
    const article = $('article');
    console.log("Parent classes: " + article.parent().attr('class'));
}
