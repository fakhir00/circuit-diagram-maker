const res = await fetch('https://www.circuitdiagrammaker.com/de/truth-table-to-logic-circuit/');
const html = await res.text();

const regex = /<a[^>]*href="\/de\/"[^>]*>[^<]*<\/a>/g;
const matches = [...html.matchAll(regex)];
console.log('Matches with user regex on /de/ truth table:', matches.map(m => m[0]));

// Let's also check where Schaltplan-Ersteller link is:
const idx = html.indexOf('Schaltplan-Ersteller');
console.log('\nExact <a> tag for Schaltplan-Ersteller:');
console.log(html.substring(idx - 100, idx + 100));

const esRes = await fetch('https://www.circuitdiagrammaker.com/es/boolean-expression-simplifier/');
const esHtml = await esRes.text();
const esRegex = /<a[^>]*href="\/es\/"[^>]*>[^<]*<\/a>/g;
console.log('\nMatches on /es/ boolean:', [...esHtml.matchAll(esRegex)].map(m => m[0]));

const frRes = await fetch('https://www.circuitdiagrammaker.com/fr/truth-table-to-logic-circuit/');
const frHtml = await frRes.text();
const frRegex = /<a[^>]*href="\/fr\/"[^>]*>[^<]*<\/a>/g;
console.log('\nMatches on /fr/ truth table:', [...frHtml.matchAll(frRegex)].map(m => m[0]));
