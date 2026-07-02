import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://help.dentiqlab.vn';
const data = JSON.parse(readFileSync(join(ROOT, 'assets/search-data.json'), 'utf8'));
const bySection = new Map();
for (const e of data) {
  if (!bySection.has(e.section)) bySection.set(e.section, []);
  bySection.get(e.section).push(e);
}
let out = `# DentIQ Lab Help\n\n> Tài liệu hệ điều hành Labo ↔ Phòng khám cho labo nha khoa Việt Nam.\n\n`;
for (const [section, entries] of bySection) {
  out += `## ${section}\n\n`;
  for (const e of entries) out += `- [${e.title}](${ORIGIN}/${e.url}): ${e.description}\n`;
  out += '\n';
}
writeFileSync(join(ROOT, 'llms.txt'), out);
console.log(`Wrote llms.txt — ${data.length} entries.`);
