import fs from "fs";
import path from "path";

const files = fs.readdirSync("src/content/tools").filter(f => f.endsWith(".json"));

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join("src/content/tools", file);
  let text = fs.readFileSync(filePath, "utf-8");
  const original = text;

  // 1. Strip FAQ chevron down glyphs
  text = text.replace(/\s*▼/g, "");

  // 2. Replace play / stop glyphs
  text = text.replace(/▶/g, "Play");
  text = text.replace(/►/g, "Play");
  text = text.replace(/■/g, "Stop");

  // 3. Replace bullets and half-circles
  text = text.replace(/●/g, "");
  text = text.replace(/◐/g, "");
  text = text.replace(/▴/g, "");
  text = text.replace(/▾/g, "");

  // 4. Replace arrows
  text = text.replace(/→/g, "->");
  text = text.replace(/←/g, "<-");
  text = text.replace(/↑/g, "^");
  text = text.replace(/↓/g, "v");

  if (text !== original) {
    fs.writeFileSync(filePath, text, "utf-8");
    modifiedCount++;
  }
}

console.log(`Cleaned geometric glyphs in ${modifiedCount} content files.`);
