import fs from "fs";
import path from "path";

// 1. Clean src/styles/global.css
let globalCss = fs.readFileSync("src/styles/global.css", "utf-8");
globalCss = globalCss.replace(
  /article blockquote,\s*\.prose blockquote\s*\{[\s\S]*?\}/,
  `article blockquote, .prose blockquote {
  border-inline-start: none !important;
  border-left: none !important;
  border: 1px solid #e2e8f0;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  color: #475569;
  font-style: italic;
  background: #f8fafc;
  border-radius: 0.75rem;
}`
);

globalCss = globalCss.replace(
  /\.content-highlight\s*\{[\s\S]*?\}/,
  `.content-highlight {
  background: #fff8f6;
  border: 1px solid #fed7aa;
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
}`
);

fs.writeFileSync("src/styles/global.css", globalCss, "utf-8");
console.log("Cleaned src/styles/global.css");

// 2. Clean Astro pages (about, privacy, disclaimer)
const astroPages = ["about.astro", "privacy.astro", "disclaimer.astro"];
for (const p of astroPages) {
  const filePath = path.join("src/pages", p);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");
    content = content.replace(/border-l-4\s+border-emerald-500\s+rounded-r-2xl/g, "border border-emerald-200 bg-emerald-50/60 rounded-2xl");
    content = content.replace(/border-l-4\s+border-amber-500\s+rounded-r-2xl/g, "border border-amber-200 bg-amber-50/60 rounded-2xl");
    content = content.replace(/strictly client-side/g, "accessible and local-first");
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Cleaned ${filePath}`);
  }
}

// 3. Clean tool content in src/content/tools/*.json
const toolFiles = fs.readdirSync("src/content/tools").filter(f => f.endsWith(".json"));
let toolsCleaned = 0;

for (const tf of toolFiles) {
  const filePath = path.join("src/content/tools", tf);
  let text = fs.readFileSync(filePath, "utf-8");
  const orig = text;

  // Replace specific colored border-l-4 callouts
  text = text.replace(/pl-4\s+border-l-4\s+border-emerald-500/g, "p-4 border border-emerald-200 bg-emerald-50/60 rounded-xl");
  text = text.replace(/pl-4\s+border-l-4\s+border-blue-500/g, "p-4 border border-blue-200 bg-blue-50/60 rounded-xl");
  text = text.replace(/pl-4\s+border-l-4\s+border-yellow-500/g, "p-4 border border-amber-200 bg-amber-50/60 rounded-xl");
  text = text.replace(/pl-4\s+border-l-4\s+border-amber-500/g, "p-4 border border-amber-200 bg-amber-50/60 rounded-xl");
  text = text.replace(/pl-4\s+border-l-4\s+border-teal-500/g, "p-4 border border-teal-200 bg-teal-50/60 rounded-xl");
  text = text.replace(/pl-4\s+border-l-4\s+border-orange-500/g, "p-4 border border-orange-200 bg-orange-50/60 rounded-xl");
  text = text.replace(/pl-4\s+border-l-4\s+border-\[#EE6C4D\]/g, "p-4 border border-orange-200 bg-orange-50/60 rounded-xl");

  // Replace generic border-l-* and border-s-*
  text = text.replace(/\b(pl-4\s+)?border-[ls]-[0-9](\s+border-[a-z0-9\-\[\]#]+)?/g, "p-4 border border-slate-200 bg-slate-50/80 rounded-xl");
  text = text.replace(/\bborder-[ls]-[0-9]\b/g, "border border-slate-200 rounded-xl");
  text = text.replace(/\bborder-[ls]\b/g, "border");

  if (text !== orig) {
    fs.writeFileSync(filePath, text, "utf-8");
    toolsCleaned++;
  }
}
console.log(`Cleaned ${toolsCleaned} tool content files.`);

// 4. Clean hub content in src/content/hubs/*.json
const hubFiles = fs.readdirSync("src/content/hubs").filter(f => f.endsWith(".json"));
for (const hf of hubFiles) {
  const filePath = path.join("src/content/hubs", hf);
  let text = fs.readFileSync(filePath, "utf-8");
  const orig = text;
  text = text.replace(/\b(pl-4\s+)?border-[ls]-[0-9](\s+border-[a-z0-9\-\[\]#]+)?/g, "p-4 border border-slate-200 bg-slate-50/80 rounded-xl");
  text = text.replace(/\bborder-[ls]-[0-9]\b/g, "border border-slate-200 rounded-xl");
  text = text.replace(/\bborder-[ls]\b/g, "border");
  if (text !== orig) {
    fs.writeFileSync(filePath, text, "utf-8");
    console.log(`Cleaned hub: ${hf}`);
  }
}
