import fs from "fs";

const scriptContent = fs.readFileSync("legacy/public/script.js", "utf-8");
const match = scriptContent.match(/let\s+toolsData\s*=\s*(\[[\s\S]*?\]);\s*window\.goToRandomTool/);
const toolsData = eval(match[1]);

console.log("Searching toolsData for sqlite_wasm_explorer:");
console.log(toolsData.find(t => t.id === "sqlite_wasm_explorer"));

console.log("\nSearching toolsData for reaction_time_benchmark:");
console.log(toolsData.find(t => t.id === "reaction_time_benchmark"));

console.log("\nChecking legacy files for reaction_time_benchmark:");
const legacyFiles = fs.readdirSync("legacy/public/tool");
console.log("In legacy/public/tool:", legacyFiles.includes("reaction_time_benchmark.html"));

const indexHtml = fs.readFileSync("legacy/public/index.html", "utf-8");
const navMatches = Array.from(indexHtml.matchAll(/href=["']\/tool\/([^"']+)["'][^>]*>([^<]+)<\/a>/g)).map(m => ({ slug: m[1], label: m[2].trim() }));
console.log("\nNav tool links in legacy index.html:");
navMatches.filter(n => n.slug.includes("sqlite") || n.slug.includes("reaction") || n.slug.includes("raid") || n.slug.includes("health") || n.slug.includes("finance")).forEach(n => console.log(n));

// Search for reaction_time_benchmark in all legacy files
console.log("\nOccurrences of reaction_time_benchmark across legacy/public:");
const allLegacyFiles = fs.readdirSync("legacy/public", { recursive: true }).filter(f => typeof f === "string" && (f.endsWith(".html") || f.endsWith(".js") || f.endsWith(".json") || f.endsWith(".xml")));
for (const f of allLegacyFiles) {
  try {
    const c = fs.readFileSync(`legacy/public/${f}`, "utf-8");
    if (c.includes("reaction_time_benchmark")) {
      console.log(`- legacy/public/${f}`);
    }
  } catch (e) {}
}

// Search for ZFS RAID in all legacy files
console.log("\nOccurrences of 'ZFS' or 'RAID' across legacy/public:");
for (const f of allLegacyFiles) {
  try {
    const c = fs.readFileSync(`legacy/public/${f}`, "utf-8");
    if (c.toLowerCase().includes("zfs") || c.toLowerCase().includes("raid")) {
      console.log(`- legacy/public/${f}`);
    }
  } catch (e) {}
}
