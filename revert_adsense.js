const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'public', 'tool');

// We need to revert the invalid `<ins>` tags that used `data-ad-slot="auto"`.
function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Revert Sidebar Ad
            const sidebarAd = /<div class="w-full mb-8 ad-container bg-white rounded-3xl shadow-sm border border-slate-200 p-4">[\s\S]*?<\/div>[\s]*<\/div>/;
            if (sidebarAd.test(content)) {
                content = content.replace(sidebarAd, `<div id="smart-rec-placeholder" class="min-h-[140px] w-full hidden"><span class="block text-center text-[10px] text-slate-400 uppercase tracking-wider py-1">Advertisement</span></div>`);
            }

            // Revert Banner Ad
            const bannerAd = /<!-- Standard Ad Banner -->[\s\S]*?<div class="w-full max-w-5xl mx-auto my-12 ad-container bg-white rounded-\[2rem\] shadow-sm border border-slate-200 p-4">[\s\S]*?<\/script>[\s]*<\/div>[\s]*<\/div>\n\s*/;
            if (bannerAd.test(content)) {
                content = content.replace(bannerAd, '');
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Reverted ads in ${file}`);
            }
        }
    }
}

processDir(toolsDir);
console.log('Done reverting ads.');
