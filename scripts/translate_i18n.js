import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['hi', 'es', 'ru', 'fr', 'de', 'it', 'pt', 'bn', 'ja', 'ko', 'ms', 'pl', 'id', 'ar', 'bg', 'tr', 'sv'];
const i18nDir = path.resolve(__dirname, '../src/data/i18n');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        // data[0] contains the translations blocks
        return data[0].map(block => block[0]).join('');
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error.message);
        return text; // fallback to english on error
    }
}

async function processFile(filename) {
    console.log(`Processing ${filename}...`);
    const filepath = path.join(i18nDir, filename);
    const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const enData = content['en'];

    if (!enData) return;

    for (const lang of locales) {
        if (!content[lang]) {
            content[lang] = Array.isArray(enData) ? [] : {};
        }

        if (Array.isArray(enData)) {
            // For faq.json array
            for (let i = 0; i < enData.length; i++) {
                if (!content[lang][i]) content[lang][i] = { ...enData[i] };
                
                // Only translate if it matches english (naive check)
                if (content[lang][i].question === enData[i].question) {
                    content[lang][i].question = await translateText(enData[i].question, lang);
                    await delay(100);
                }
                if (content[lang][i].answer === enData[i].answer) {
                    content[lang][i].answer = await translateText(enData[i].answer, lang);
                    await delay(100);
                }
            }
        } else {
            // For common.json, home.json
            for (const [key, value] of Object.entries(enData)) {
                if (content[lang][key] === value || !content[lang][key]) {
                    content[lang][key] = await translateText(value, lang);
                    await delay(100);
                }
            }
        }
        
        console.log(`- Translated ${filename} to ${lang}`);
        // Save incrementally
        fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    }
}

async function run() {
    await processFile('common.json');
    await processFile('home.json');
    await processFile('faq.json');
    console.log('All translations completed successfully!');
}

run().catch(console.error);
