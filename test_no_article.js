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
let noArticle = [];

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { recognizeSelfClosing: true, decodeEntities: false });

    const article = $('article');
    if (article.length === 0) {
        noArticle.push(file);
    }
}
console.log("Files without article: " + noArticle.length);
if (noArticle.length > 0) {
    console.log(noArticle[0]);
}
