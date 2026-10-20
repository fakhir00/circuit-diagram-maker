import fs from 'node:fs';

const privacyHtml = fs.readFileSync('dist/privacy/index.html', 'utf8');
const indexHtml = fs.readFileSync('dist/index.html', 'utf8');
const esPrivacyHtml = fs.readFileSync('dist/es/privacy/index.html', 'utf8');

console.log('=== Privacy Anchor Verification ===');
console.log('dist/privacy/index.html has id="cookies":', privacyHtml.includes('id="cookies"'));
console.log('dist/privacy/index.html has id="advertising":', privacyHtml.includes('id="advertising"'));
console.log('dist/es/privacy/index.html has id="cookies":', esPrivacyHtml.includes('id="cookies"'));
console.log('dist/es/privacy/index.html has id="advertising":', esPrivacyHtml.includes('id="advertising"'));

console.log('\n=== Footer Links Verification ===');
console.log('index.html links to /privacy/#cookies:', indexHtml.includes('/privacy/#cookies'));
console.log('index.html links to /privacy/#advertising:', indexHtml.includes('/privacy/#advertising'));
console.log('index.html has smooth back to top button:', indexHtml.includes('footer-back-to-top'));
console.log('index.html has trust badge 1:', indexHtml.includes('100% In-Browser Privacy'));
console.log('index.html has disclaimer:', indexHtml.includes('Methodological & Regulatory Disclaimer'));

console.log('\n=== JSON-LD Cleanliness Verification ===');
const schemas = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
let hasDummyHash = false;
for (const s of schemas) {
  if (s.includes('"#"') || s.includes('"/#/"')) {
    hasDummyHash = true;
    console.error('Found dummy hash:', s);
  }
}
console.log('JSON-LD schemas free of dummy "#":', !hasDummyHash);
