const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8').replace(/^\uFEFF/, ''));
for (const entry of manifest.files) {
  const bytes = fs.readFileSync(path.join(__dirname, entry.file));
  if (bytes.length !== entry.bytes || crypto.createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
    throw new Error(`Evidence integrity mismatch: ${entry.file}`);
  }
}
const markdownFiles = ['README.md', 'observations.md', 'css-motion-inventory.md', 'khonnai-adaptation.md', 'landing-reference.md', '../khonnai-redesign-constraints.md'];
let localLinks = 0;
for (const file of markdownFiles) {
  const absolute = path.resolve(root, file);
  const content = fs.readFileSync(absolute, 'utf8');
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    if (/^(https?:|#)/.test(match[1])) continue;
    const target = match[1].replace(/:\d+$/, '').split('#')[0];
    const resolved = path.isAbsolute(target) ? target : path.resolve(path.dirname(absolute), target);
    if (!fs.existsSync(resolved)) throw new Error(`Broken link in ${file}: ${match[1]}`);
    localLinks++;
  }
}
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'css-inventory.json'), 'utf8'));
const counts = Object.fromEntries(Object.entries(inventory).map(([name, data]) => [name, data.keyframes.length]));
if (counts['selling.css'] !== 119 || counts['global.css'] !== 5 || counts['controls.css'] !== 4) {
  throw new Error(`Unexpected keyframe counts: ${JSON.stringify(counts)}`);
}
console.log(JSON.stringify({ verifiedEvidenceFiles: manifest.files.length, markdownFiles: markdownFiles.length, validLocalLinks: localLinks, keyframes: counts }, null, 2));
