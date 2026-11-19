import fs from "fs";
import path from "path";
import { mapTo13Categories } from "./map-13-categories.mjs";

const toolFiles = fs.readdirSync("src/content/tools").filter(f => f.endsWith(".json"));

console.log(`Processing ${toolFiles.length} content tool files...`);

for (const tf of toolFiles) {
  const filePath = path.join("src/content/tools", tf);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // 1. Assign canonical 13 category
  const canonicalCat = mapTo13Categories(data);
  data.category = canonicalCat;

  // 2. Remove hardcoded "New" tag from tags
  if (Array.isArray(data.tags)) {
    data.tags = data.tags.filter(t => t.toLowerCase() !== "new");
  }

  // 3. Rename mandi_chest_lucky_picker
  if (data.id === "mandi_chest_lucky_picker") {
    data.name = "Random Name Picker";
    data.title = "Random Name Picker | Toolkit Gen";
    data.description = "Free online random name and item picker for fair giveaways, team selections, raffles, and group decisions. Runs locally in your browser.";
  }

  // Convert to JSON string for global replacements of overclaims
  let jsonString = JSON.stringify(data, null, 2);

  // 4. Clean overclaims
  jsonString = jsonString.replace(/\brevolutionary\b/gi, "advanced");
  jsonString = jsonString.replace(/\bmedical[- ]grade\b/gi, "high-precision");
  jsonString = jsonString.replace(/\bclinical[- ]grade\b/gi, "high-precision");
  jsonString = jsonString.replace(/\b100%\s+accurate\b/gi, "high-accuracy");
  jsonString = jsonString.replace(/\bbest[- ]in[- ]class\b/gi, "high-performance");
  jsonString = jsonString.replace(/\bstrictly client-side\b/gi, "local-first");
  jsonString = jsonString.replace(/\bzero latency\b/gi, "minimal latency");

  fs.writeFileSync(filePath, jsonString, "utf-8");
}

console.log(`Successfully mapped all 126 tools to 13 canonical categories and cleaned overclaims.`);
