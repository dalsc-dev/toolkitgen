#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const toolsJsonPath = path.join(__dirname, 'public', 'tools.json');
const blogDir = path.join(__dirname, 'blog');

const tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

// Get existing blog files
const existingFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

// Create a simple mapping from tool id to blog filename
// We'll generate blog posts named exactly as: {tool_id}_blog.html

const missingTools = tools.filter(tool => {
    const expectedFile = `${tool.id}_blog.html`;
    return !existingFiles.includes(expectedFile);
});

console.log(`Total tools: ${tools.length}`);
console.log(`Existing blog files: ${existingFiles.length}`);
console.log(`Missing blog posts: ${missingTools.length}`);
console.log('\nMissing tools:');
missingTools.forEach((t, i) => {
    console.log(`${i+1}. ${t.id} - ${t.name}`);
});

module.exports = { missingTools };
