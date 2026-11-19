const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'public', 'tool');

const adHtmlSidebar = `<div class="w-full mb-8 ad-container bg-white rounded-3xl shadow-sm border border-slate-200 p-4">
                    <span class="block text-center text-[10px] text-slate-400 uppercase tracking-wider mb-2">Advertisement</span>
                    <div class="min-h-[250px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                        <ins class="adsbygoogle"
                             style="display:block; width: 100%; height: 100%;"
                             data-ad-client="ca-pub-4675079345370949"
                             data-ad-slot="auto"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                        <script>
                             (adsbygoogle = window.adsbygoogle || []).push({});
                        </script>
                    </div>
                </div>`;

const adHtmlBanner = `
        <!-- Standard Ad Banner -->
        <div class="w-full max-w-5xl mx-auto my-12 ad-container bg-white rounded-[2rem] shadow-sm border border-slate-200 p-4">
            <span class="block text-center text-[10px] text-slate-400 uppercase tracking-wider mb-2">Advertisement</span>
            <div class="min-h-[90px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                <ins class="adsbygoogle"
                     style="display:block; width: 100%; height: 90px;"
                     data-ad-client="ca-pub-4675079345370949"
                     data-ad-slot="auto"
                     data-ad-format="horizontal"
                     data-full-width-responsive="true"></ins>
                <script>
                     (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
`;

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
            
            // Replace the hidden smart-rec-placeholder with a standard ad unit
            const oldPlaceholder = /<div id="smart-rec-placeholder"[^>]*>[\s\S]*?<\/div>/;
            
            if (oldPlaceholder.test(content)) {
                content = content.replace(oldPlaceholder, adHtmlSidebar);
            }

            // Also add a horizontal banner ad right before the <article> tag
            if (content.includes('<article') && !content.includes('Standard Ad Banner')) {
                // Find <article and insert adHtmlBanner before it
                content = content.replace(/(<article)/, adHtmlBanner + '\n        $1');
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ads in ${file}`);
            }
        }
    }
}

processDir(toolsDir);
console.log('Done replacing ad placeholders.');
