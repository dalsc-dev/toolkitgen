const fs = require('fs');
const path = require('path');

const analyticsData = fs.readFileSync('analytics.txt', 'utf8');
const lines = analyticsData.split('\n');
const keepTools = new Set();

for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length > 0) {
        const urlPath = parts[0];
        // match /tool/something or /tool/something#hash
        const match = urlPath.match(/\/tool\/([\w_]+)/);
        if (match) {
            keepTools.add(match[1]);
        }
    }
}

// Ensure pdf_local_signer is added since user asked about it earlier? Wait, is pdf_local_signer in the list?
// /tool/pdf_local_signer is NOT in the list! Wait!
// Did they forget it? The user explicitly said: "this is my analytics of site based on stable and stay and good for future which is good for my site other remove"

const toolsDir = path.join('/Users/dalsc2/Downloads/Project/toolkitgen', 'public', 'tool');
const existingFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const toDelete = [];
const toKeep = [];

existingFiles.forEach(file => {
    const toolName = file.replace('.html', '');
    if (keepTools.has(toolName)) {
        toKeep.push(file);
    } else {
        toDelete.push(file);
    }
});

console.log(`Tools to keep: ${toKeep.length}`);
console.log(`Tools to delete: ${toDelete.length}`);
console.log(`Examples of tools to delete: ${toDelete.slice(0, 10).join(', ')}...`);

fs.writeFileSync('to_delete.json', JSON.stringify(toDelete, null, 2));
