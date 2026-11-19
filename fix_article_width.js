const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const toolsDir = path.join(publicDir, 'tool');
const blogDir = path.join(__dirname, 'blog');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Check if it has the <article class="...w-full max-w-full max-w-5xl mx-auto mt-16"> pattern
            // Actually let's just do a regex replace on the specific class string
            
            let newContent = content.replace(/w-full max-w-full max-w-5xl mx-auto/g, 'w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-full max-w-5xl mx-auto');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${file}`);
            }
        }
    }
}

processDir(toolsDir);
processDir(blogDir);
processDir(publicDir);

console.log('Done fixing article widths.');
