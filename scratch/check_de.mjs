import fs from 'fs';

const html = fs.readFileSync('dist/de/truth-table-to-logic-circuit/index.html', 'utf8');
const matches = [...html.matchAll(/<a[^>]*href="\/de\/"[^>]*>([\s\S]*?)<\/a>/g)];
console.log('Total matches:', matches.length);
matches.forEach((m, i) => console.log(i, JSON.stringify(m[1].trim().slice(0, 100))));
