import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['hi', 'es', 'ru', 'fr', 'de', 'it', 'pt', 'bn', 'ja', 'ko', 'ms', 'pl', 'id', 'ar', 'bg', 'tr', 'sv'];

// Simple fetch wrapper to bypass CORS/fetch issues in Node native if needed
const translate = async (text, targetLang) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0]; // Extract translated text
    } catch (e) {
        console.error(`Error translating "${text}" to ${targetLang}:`, e);
        return text;
    }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    const editorPath = path.join(__dirname, '../src/data/i18n/editor.json');
    let db = {};
    if (fs.existsSync(editorPath)) {
        db = JSON.parse(fs.readFileSync(editorPath, 'utf-8'));
    }

    const enStrings = db['en'];
    if (!enStrings) {
        throw new Error("No english strings found in editor.json");
    }

    for (const locale of locales) {
        if (!db[locale]) db[locale] = {};
        
        for (const [key, text] of Object.entries(enStrings)) {
            if (!db[locale][key]) {
                process.stdout.write(`Translating editor [${locale}]: ${key}... `);
                db[locale][key] = await translate(text, locale);
                console.log(`[OK] ${db[locale][key]}`);
                await delay(150); // slight delay to prevent rate limits
            }
        }
        
        // Save incrementally per locale
        fs.writeFileSync(editorPath, JSON.stringify(db, null, 2));
    }
    console.log("✅ Editor translation complete!");
}

main().catch(console.error);
