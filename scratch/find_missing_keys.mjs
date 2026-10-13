import fs from 'fs';
import path from 'path';

const files = [
  'legal.json',
  'tools.json',
  'about.json',
  'contact.json',
  'common.json',
  'home.json',
  'keyword-tools.json'
];

const targetLocales = ['es', 'id', 'tr', 'bg'];

for (const f of files) {
  const filePath = path.join(process.cwd(), 'src/data/i18n', f);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const en = data.en || {};
  
  console.log(`\n================================`);
  console.log(`File: ${f}`);
  console.log(`================================`);
  
  for (const loc of targetLocales) {
    const locDict = data[loc] || {};
    const missingKeys = [];
    for (const key of Object.keys(en)) {
      if (locDict[key] === undefined) {
        missingKeys.push(key);
      }
    }
    console.log(`Locale [${loc}] has ${missingKeys.length} missing keys:`);
    console.log(missingKeys.slice(0, 10).join(', ') + (missingKeys.length > 10 ? '...' : ''));
  }
}
