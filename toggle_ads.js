#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const adsenseScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675079345370949" crossorigin="anonymous"></script>';
const commentedAdsense = `<!-- ${adsenseScript} -->`;

const action = process.argv[2];

if (!action || (!action.includes('enable') && !action.includes('disable') && !action.includes('uncomment') && !action.includes('comment'))) {
  console.log('Usage:');
  console.log('  node toggle_ads.js --enable    (Uncomments AdSense across all HTML files)');
  console.log('  node toggle_ads.js --disable   (Comments out AdSense across all HTML files)');
  process.exit(1);
}

const isEnable = action.includes('enable') || action.includes('uncomment');

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const publicDir = path.join(__dirname, 'public');
const htmlFiles = getFiles(publicDir);

let modifiedCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  if (isEnable) {
    // Uncomment
    if (content.includes(commentedAdsense)) {
      content = content.replace(commentedAdsense, adsenseScript);
    } else if (!content.includes(adsenseScript)) {
      // Inject before </head> if not present
      content = content.replace('</head>', `    ${adsenseScript}\n</head>`);
    }
  } else {
    // Comment
    if (content.includes(adsenseScript) && !content.includes(commentedAdsense)) {
      content = content.replace(adsenseScript, commentedAdsense);
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`Success! ${isEnable ? 'Uncommented (Enabled)' : 'Commented out (Disabled)'} AdSense in ${modifiedCount} HTML files.`);
