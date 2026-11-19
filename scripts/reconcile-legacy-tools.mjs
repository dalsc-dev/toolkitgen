import fs from "fs";
import path from "path";

// 1. Programmatically extract toolsData from legacy/public/script.js
const scriptContent = fs.readFileSync("legacy/public/script.js", "utf-8");
const match = scriptContent.match(/let\s+toolsData\s*=\s*(\[[\s\S]*?\]);\s*window\.goToRandomTool/);
if (!match) {
  console.error("Failed to extract toolsData regex");
  process.exit(1);
}

// Evaluate toolsData
const toolsData = eval(match[1]);
console.log(`Successfully extracted ${toolsData.length} tools from legacy/public/script.js`);

// 2. Read legacy/public/tools.json
const legacyToolsJson = JSON.parse(fs.readFileSync("legacy/public/tools.json", "utf-8"));
const legacyToolsJsonMap = new Map(legacyToolsJson.map(t => [t.id, t]));

// 3. Read legacy/public/tool/*.html
const legacyHtmlFiles = fs.readdirSync("legacy/public/tool")
  .filter(f => f.endsWith(".html"))
  .map(f => f.replace(/\.html$/, ""));
const legacyHtmlSet = new Set(legacyHtmlFiles);

// 4. Read sitemaps
const sitemapToolsXml = fs.readFileSync("legacy/public/sitemap-tools.xml", "utf-8");
const sitemapUrls = Array.from(sitemapToolsXml.matchAll(/<loc>https?:\/\/[^\/]+\/tool\/([^<]+)<\/loc>/g)).map(m => m[1].replace(/\.html$/, ""));
const sitemapSet = new Set(sitemapUrls);

// 5. Read new content collections
const newContentFiles = fs.readdirSync("src/content/tools")
  .filter(f => f.endsWith(".json"))
  .map(f => f.replace(/\.json$/, ""));
const newContentSet = new Set(newContentFiles);

// 6. Read built pages
let builtDistTools = [];
if (fs.existsSync("dist/tool")) {
  builtDistTools = fs.readdirSync("dist/tool").filter(f => {
    return fs.statSync(path.join("dist/tool", f)).isDirectory() || f.endsWith(".html");
  }).map(f => f.replace(/\.html$/, ""));
}
const builtDistSet = new Set(builtDistTools);

// Analyze legacy index.html JSON-LD and nav for slugs not in toolsData
const legacyIndexHtml = fs.readFileSync("legacy/public/index.html", "utf-8");
const indexToolMatches = Array.from(legacyIndexHtml.matchAll(/\/tool\/([a-zA-Z0-9_\-]+)(?:\.html)?/g)).map(m => m[1]);
const indexToolSet = new Set(indexToolMatches);

// Check firebase.json redirects
const firebaseJson = JSON.parse(fs.readFileSync("legacy/firebase.json", "utf-8"));
const redirects = firebaseJson.hosting?.redirects || [];
const redirectMap = new Map();
redirects.forEach(r => {
  const sourceTool = r.source?.match(/\/tool\/([a-zA-Z0-9_\-]+)/)?.[1];
  if (sourceTool) {
    redirectMap.set(sourceTool, r.destination);
  }
});

// Check legacy hub pages for anchored sections
const hubFiles = fs.readdirSync("legacy/public/hubs").filter(f => f.endsWith(".html"));
const hubAnchors = new Map(); // hubName -> Set of anchor IDs
for (const hf of hubFiles) {
  const hubName = hf.replace(/\.html$/, "");
  const content = fs.readFileSync(path.join("legacy/public/hubs", hf), "utf-8");
  // Find ids
  const ids = Array.from(content.matchAll(/id=["']([a-zA-Z0-9_\-]+)["']/g)).map(m => m[1]);
  hubAnchors.set(hubName, new Set(ids));
}

// Reconciliation report
console.log("\n=== RECONCILIATION SUMMARY COUNTS ===");
console.log(`toolsData entries: ${toolsData.length}`);
console.log(`legacy/public/tools.json entries: ${legacyToolsJson.length}`);
console.log(`legacy/public/tool/*.html files: ${legacyHtmlFiles.length}`);
console.log(`legacy sitemap-tools.xml URLs: ${sitemapUrls.length}`);
console.log(`src/content/tools/*.json entries: ${newContentFiles.length}`);
console.log(`dist/tool/* built entries: ${builtDistTools.length}`);

// Let us find tools in toolsData vs legacy HTML
const inToolsData = new Set(toolsData.map(t => t.id));

// Hub analysis
console.log("\n=== HUB ANALYSIS IN toolsData ===");
const hubEntries = toolsData.filter(t => t.hub);
console.log(`Entries with 'hub' field in toolsData: ${hubEntries.length}`);
hubEntries.forEach(t => {
  const hasHtml = legacyHtmlSet.has(t.id);
  const hubName = t.hub;
  const inHubFile = hubAnchors.get(hubName)?.has(t.id);
  console.log(`- ID: ${t.id} | hub: ${t.hub} | hasHtml: ${hasHtml} | inHubHtml: ${Boolean(inHubFile)}`);
});

// Let us find items in legacy/public/tool/*.html not in toolsData
console.log("\n=== LEGACY HTML FILES NOT IN toolsData ===");
const htmlNotInToolsData = legacyHtmlFiles.filter(id => !inToolsData.has(id));
console.log(htmlNotInToolsData);

// Let us find items in toolsData not in legacy/public/tool/*.html
console.log("\n=== toolsData ENTRIES NOT IN legacy/public/tool/*.html ===");
const toolsDataNotInHtml = toolsData.filter(t => !legacyHtmlSet.has(t.id));
toolsDataNotInHtml.forEach(t => {
  console.log(`- ${t.id} (hub: ${t.hub || 'none'}, redirect: ${redirectMap.get(t.id) || 'none'})`);
});

// Slugs in legacy index.html but not in toolsData
console.log("\n=== SLUGS IN LEGACY index.html BUT NOT IN toolsData ===");
const indexNotInToolsData = Array.from(indexToolSet).filter(id => !inToolsData.has(id));
console.log(indexNotInToolsData);
