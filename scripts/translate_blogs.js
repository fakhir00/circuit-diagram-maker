import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['hi', 'es', 'ru', 'fr', 'de', 'it', 'pt', 'bn', 'ja', 'ko', 'ms', 'pl', 'id', 'ar', 'bg', 'tr', 'sv'];

const translate = async (text, targetLang) => {
    if (!text || text.trim() === '') return text;
    // Don't translate code blocks or purely symbols
    if (text.startsWith('```') || text.startsWith('---')) return text;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        let translated = '';
        if (data[0] && Array.isArray(data[0])) {
            for (const chunk of data[0]) {
                if (chunk[0]) translated += chunk[0];
            }
        }
        return translated || text;
    } catch (e) {
        console.error(`Error translating to ${targetLang}:`, e.message);
        return text;
    }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function translateMarkdown(content, targetLang) {
    // 1. Split frontmatter from body
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return content;

    const fm = match[1];
    const body = match[2];

    // 2. Translate frontmatter fields
    let newFm = fm;
    const titleMatch = fm.match(/title:\s*"(.*?)"/);
    if (titleMatch) {
        const transTitle = await translate(titleMatch[1], targetLang);
        newFm = newFm.replace(`title: "${titleMatch[1]}"`, `title: "${transTitle.replace(/"/g, '\\"')}"`);
    }

    const descMatch = fm.match(/description:\s*"(.*?)"/);
    if (descMatch) {
        const transDesc = await translate(descMatch[1], targetLang);
        newFm = newFm.replace(`description: "${descMatch[1]}"`, `description: "${transDesc.replace(/"/g, '\\"')}"`);
    }

    // replace lang
    newFm = newFm.replace(/lang:\s*"en"/, `lang: "${targetLang}"`);

    // 3. Translate body line by line or paragraph by paragraph
    const chunks = body.split('\n\n');
    const translatedChunks = [];
    
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        if (chunk.trim() === '' || chunk.startsWith('```') || chunk.startsWith('<')) {
            translatedChunks.push(chunk);
            continue;
        }

        // if chunk contains relative link [Open the editor](/editor/), don't break it
        // basic google translate is okay with brackets if we are lucky
        let transChunk = await translate(chunk, targetLang);
        translatedChunks.push(transChunk);
        await delay(50);
    }

    return `---\n${newFm}\n---\n\n${translatedChunks.join('\n\n')}`;
}

async function main() {
    const enDir = path.join(__dirname, '../src/content/blog/en');
    const blogRoot = path.join(__dirname, '../src/content/blog');
    
    const files = fs.readdirSync(enDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    for (const locale of locales) {
        const localeDir = path.join(blogRoot, locale);
        if (!fs.existsSync(localeDir)) fs.mkdirSync(localeDir, { recursive: true });

        for (const file of files) {
            const srcPath = path.join(enDir, file);
            const destPath = path.join(localeDir, file);

            if (fs.existsSync(destPath)) {
                continue; // Skip if already translated
            }

            console.log(`Translating ${file} into ${locale}...`);
            const content = fs.readFileSync(srcPath, 'utf8');
            const newContent = await translateMarkdown(content, locale);
            fs.writeFileSync(destPath, newContent, 'utf8');
            console.log(`[OK] Saved ${locale}/${file}`);
        }
    }
    console.log("✅ All blogs translated successfully!");
}

main().catch(console.error);
