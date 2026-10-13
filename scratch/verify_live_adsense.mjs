const BASE = 'https://www.circuitdiagrammaker.com';

async function testUrl(path) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const text = await res.text();
    return { status: res.status, ok: res.ok, text };
  } catch (err) {
    return { status: 'ERR', ok: false, error: err.message };
  }
}

async function run() {
  console.log('=== Checking Live Production Deploy at ' + new Date().toISOString() + ' ===');

  // 1. ads.txt
  console.log('\n--- 1. ads.txt ---');
  const ads = await testUrl('/ads.txt');
  console.log(`Status: ${ads.status}`);
  console.log(`Content:\n${ads.text ? ads.text.trim() : ads.error}`);
  const adsExpected = 'google.com, pub-9659978421339417, DIRECT, f08c47fec0942fa0';
  const adsPass = ads.status === 200 && ads.text.includes(adsExpected);
  console.log(`ads.txt Check: ${adsPass ? 'PASS' : 'WAIT/FAIL'}`);

  // 2. robots.txt
  console.log('\n--- 2. robots.txt ---');
  const robots = await testUrl('/robots.txt');
  console.log(`Status: ${robots.status}`);
  console.log(`Content:\n${robots.text ? robots.text.trim() : robots.error}`);
  const robotsPass = robots.status === 200 && !robots.text.includes('Disallow: /editor/');
  console.log(`robots.txt Check: ${robotsPass ? 'PASS' : 'WAIT/FAIL'}`);

  // 3. Privacy Policy across locales
  console.log('\n--- 3. Privacy Policy Disclosures ---');
  const privacyLocales = [
    { loc: 'en', path: '/privacy/', keyword: 'Google AdSense' },
    { loc: 'es', path: '/es/privacy/', keyword: 'Google AdSense' },
    { loc: 'id', path: '/id/privacy/', keyword: 'Google AdSense' },
    { loc: 'bg', path: '/bg/privacy/', keyword: 'Google AdSense' },
    { loc: 'tr', path: '/tr/privacy/', keyword: 'Google AdSense' }
  ];

  let allPrivacyPass = true;
  for (const item of privacyLocales) {
    const res = await testUrl(item.path);
    const hasKeyword = res.text ? res.text.includes(item.keyword) : false;
    const hasCookies = res.text ? (res.text.toLowerCase().includes('cookie') || res.text.toLowerCase().includes('çerez') || res.text.toLowerCase().includes('бисквитки') || res.text.toLowerCase().includes('galleta')) : false;
    console.log(`Locale [${item.loc}] (${item.path}): HTTP ${res.status} | Has AdSense partner disclosure: ${hasKeyword} | Has cookies section: ${hasCookies}`);
    if (res.status !== 200 || !hasKeyword || !hasCookies) {
      allPrivacyPass = false;
    }
  }
  console.log(`Privacy Policy Check: ${allPrivacyPass ? 'PASS' : 'WAIT/FAIL'}`);

  // 4. Sample Link check
  console.log('\n--- 4. Verified Link Checks ---');
  const sampleLinks = [
    '/',
    '/editor/',
    '/arduino-circuit-maker/',
    '/logic-gate-diagram-tool/',
    '/pcb-schematic-tool/',
    '/boolean-expression-simplifier/',
    '/truth-table-to-logic-circuit/',
    '/contact-us/',
    '/terms/',
    '/privacy/',
    '/es/privacy/',
    '/id/privacy/',
    '/bg/privacy/',
    '/tr/privacy/',
    '/ar/blog/logic-gate-circuit-diagrams/',
    '/bn/blog/circuit-diagram-for-beginners/',
    '/hi/blog/circuit-diagram-for-beginners/',
    '/ru/blog/circuit-diagram-for-beginners/',
    '/id/blog/circuit-diagram-for-beginners/'
  ];

  let linksPass = true;
  for (const link of sampleLinks) {
    const res = await testUrl(link);
    if (res.status !== 200) {
      console.log(`FAIL link ${link}: HTTP ${res.status}`);
      linksPass = false;
    }
  }
  if (linksPass) {
    console.log(`All ${sampleLinks.length} sample pages returned HTTP 200 OK!`);
  }
}

run();
