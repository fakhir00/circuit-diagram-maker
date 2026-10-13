import fs from 'fs';
import path from 'path';

const files = [
  'common.json',
  'home.json',
  'about.json',
  'contact.json',
  'legal.json',
  'tools.json',
  'faq.json',
  'blog.json',
  'keyword-tools.json'
];

const targetLocales = ['es', 'id', 'tr', 'bg'];

for (const f of files) {
  const filePath = path.join(process.cwd(), 'src/data/i18n', f);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const en = data.en || {};
  
  console.log(`\n=== File: ${f} ===`);
  for (const loc of targetLocales) {
    const locDict = data[loc] || {};
    let identicalCount = 0;
    let missingCount = 0;
    const sampleIdentical = [];

    for (const [key, val] of Object.entries(en)) {
      if (typeof val === 'string') {
        const locVal = locDict[key];
        if (!locVal) {
          missingCount++;
        } else if (locVal.trim() === val.trim() && val.length > 10) {
          identicalCount++;
          if (sampleIdentical.length < 3) sampleIdentical.push({ key, val });
        }
      }
    }
    console.log(`Locale [${loc}]: missing=${missingCount}, identical_to_en=${identicalCount}`);
    if (sampleIdentical.length > 0) {
      console.log(`  Samples identical to en:`, sampleIdentical);
    }
  }
}
