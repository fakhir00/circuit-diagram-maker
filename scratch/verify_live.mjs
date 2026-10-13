import { execSync } from 'child_process';

const testUrls = [
  // Spanish
  'http://localhost:4322/es/',
  'http://localhost:4322/es/about-us/',
  'http://localhost:4322/es/privacy/',
  // Indonesian
  'http://localhost:4322/id/',
  'http://localhost:4322/id/arduino-circuit-maker/',
  'http://localhost:4322/id/terms/',
  // Turkish
  'http://localhost:4322/tr/',
  'http://localhost:4322/tr/logic-gate-diagram-tool/',
  'http://localhost:4322/tr/contact-us/',
  // Bulgarian
  'http://localhost:4322/bg/',
  'http://localhost:4322/bg/pcb-schematic-tool/',
  'http://localhost:4322/bg/about-us/'
];

console.log('Starting Live Curl Verification...\n');

for (const url of testUrls) {
  try {
    // Use curl.exe directly as requested in task 5
    const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'N/A';

    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const desc = descMatch ? descMatch[1] : 'N/A';

    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : 'N/A';

    const hreflangMatches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)];
    const hreflangs = hreflangMatches.map(m => `${m[1]} -> ${m[2]}`);
    const hasXDefault = hreflangs.some(h => h.startsWith('x-default'));

    // Check nav links sample
    const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
    const navText = navMatch ? navMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) : 'N/A';

    // Check language switcher links inside lang-menu-dropdown
    const dropdownMatch = html.match(/id="lang-menu-dropdown"[\s\S]*?<\/div>\s*<\/div>/i);
    const langLinks = dropdownMatch ? [...dropdownMatch[0].matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)] : [];
    console.log(`Language switcher links count: ${langLinks.length}`);
    if (langLinks.length > 0) {
      console.log(`Sample switcher links:`);
      for (const m of langLinks.slice(0, 5)) {
        const name = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
        console.log(`  ${name} -> ${m[1]}`);
      }
    }

    // Verification asserts
    const parsedUrl = new URL(url);
    const expectedCanonicalPath = parsedUrl.pathname.endsWith('/') ? parsedUrl.pathname : parsedUrl.pathname + '/';
    const isSelfCanonical = canonical === `https://www.circuitdiagrammaker.com${expectedCanonicalPath}`;
    console.log(`Self-canonical Valid? ${isSelfCanonical ? 'YES' : 'NO'}`);
    
    // Check for bad machine translation artifacts
    const hasBadArtifacts = desc.includes('Spanish version.') || 
                            desc.includes('Indonesian version.') || 
                            desc.includes('Turkish version.') || 
                            desc.includes('Bulgarian version.') ||
                            title.endsWith('| ES') ||
                            title.endsWith('| ID') ||
                            title.endsWith('| TR') ||
                            title.endsWith('| BG');
    console.log(`Robotic Suffixes Detected? ${hasBadArtifacts ? 'YES (FAIL)' : 'NO (CLEAN)'}`);
    console.log(`=======================================================\n`);
  } catch (err) {
    console.error(`Error curling ${url}:`, err.message);
  }
}
