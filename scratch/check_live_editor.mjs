async function checkEditor() {
  const res = await fetch('https://www.circuitdiagrammaker.com/editor/');
  console.log('Editor HTML status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Look for canvas or svg or editor containers
  const canvasMatches = html.match(/<canvas[^>]*>/gi);
  const svgMatches = html.match(/<svg[^>]*id=["'][^"']*canvas[^"']*["'][^>]*>/gi);
  console.log('Canvas tags:', canvasMatches);
  console.log('SVG canvas tags:', svgMatches);
  
  // Check for editor container
  console.log('Includes editor-container:', html.includes('editor') || html.includes('canvas'));

  // Find all script tags
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
  let match;
  const scripts = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  console.log('Scripts found:', scripts);

  for (const s of scripts) {
    const sUrl = s.startsWith('http') ? s : 'https://www.circuitdiagrammaker.com' + s;
    const sRes = await fetch(sUrl);
    console.log(`Script [${s}] -> HTTP ${sRes.status} (${sRes.headers.get('content-type')})`);
  }

  // Find all css link tags
  const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g;
  const stylesheets = [];
  while ((match = cssRegex.exec(html)) !== null) {
    stylesheets.push(match[1]);
  }
  console.log('Stylesheets found:', stylesheets);
  for (const css of stylesheets) {
    const cUrl = css.startsWith('http') ? css : 'https://www.circuitdiagrammaker.com' + css;
    const cRes = await fetch(cUrl);
    console.log(`CSS [${css}] -> HTTP ${cRes.status}`);
  }
}

checkEditor();
