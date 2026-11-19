const fs = require('fs');
const path = require('path');

let scriptContent = fs.readFileSync('/Users/dalsc2/Downloads/Project/toolkitgen/public/script.js', 'utf8');
const toDelete = JSON.parse(fs.readFileSync('to_delete.json', 'utf8')).map(f => f.replace('.html', ''));

const startIdx = scriptContent.indexOf('let toolsData = [');

let openBrackets = 0;
let endIdx = -1;

for (let i = startIdx + 'let toolsData ='.length; i < scriptContent.length; i++) {
    if (scriptContent[i] === '[') openBrackets++;
    if (scriptContent[i] === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            endIdx = i;
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const arrayStr = scriptContent.substring(startIdx + 'let toolsData = '.length, endIdx + 1);
    
    // It's a valid JS array but not JSON because of unquoted keys and !0.
    // We can eval it if we are careful.
    let parsedArray;
    try {
        parsedArray = eval('(' + arrayStr + ')');
        
        const filteredArray = parsedArray.filter(tool => !toDelete.includes(tool.id));
        console.log(`Original array length: ${parsedArray.length}`);
        console.log(`Filtered array length: ${filteredArray.length}`);
        
        // Convert back to string
        const newArrayStr = JSON.stringify(filteredArray, null, 4)
            .replace(/"([^"]+)":/g, '$1:') // remove quotes from keys
            .replace(/"!0"/g, '!0')
            .replace(/"!1"/g, '!1');
            
        scriptContent = scriptContent.substring(0, startIdx + 'let toolsData = '.length) + 
                        newArrayStr + 
                        scriptContent.substring(endIdx + 1);
                        
        fs.writeFileSync('/Users/dalsc2/Downloads/Project/toolkitgen/public/script.js', scriptContent);
        console.log("Successfully filtered toolsData in script.js");
    } catch(e) {
        console.error("Error evaluating or stringifying array: " + e);
    }
} else {
    console.error("Could not find toolsData array boundaries");
}
