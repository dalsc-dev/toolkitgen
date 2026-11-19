import fs from "fs";

const toolFiles = fs.readdirSync("src/content/tools").filter(f => f.endsWith(".json"));
const classes = new Set();
for (const f of toolFiles) {
  const content = fs.readFileSync(`src/content/tools/${f}`, "utf-8");
  const matches = content.match(/border-[ls]-[^\s"'\\]+/g) || [];
  matches.forEach(m => classes.add(m));
}
console.log(Array.from(classes));
