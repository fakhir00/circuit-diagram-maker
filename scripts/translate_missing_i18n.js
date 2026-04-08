import fs from 'fs';
import path from 'path';

const locales = ['hi', 'es', 'ru', 'fr', 'de', 'it', 'pt', 'bn', 'ja', 'ko', 'ms', 'pl', 'id', 'ar', 'bg', 'tr', 'sv'];

async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0].map((block) => block[0]).join('');
}

function shouldTranslateString(englishValue, localeValue) {
  if (typeof localeValue === 'string' && localeValue.trim() !== '' && localeValue !== englishValue) {
    return false;
  }

  return /[A-Za-z]/.test(englishValue);
}

function prepareOutput(englishNode, localeNode, path = [], pending = []) {
  if (typeof englishNode === 'string') {
    if (shouldTranslateString(englishNode, localeNode)) {
      pending.push({ path, text: englishNode });
    }

    return typeof localeNode === 'string' && localeNode.trim() !== '' ? localeNode : englishNode;
  }

  if (Array.isArray(englishNode)) {
    const localeArray = Array.isArray(localeNode) ? localeNode : [];
    return englishNode.map((item, index) =>
      prepareOutput(item, localeArray[index], [...path, index], pending)
    );
  }

  if (englishNode && typeof englishNode === 'object') {
    const localeObject =
      localeNode && typeof localeNode === 'object' && !Array.isArray(localeNode) ? localeNode : {};
    const output = {};

    for (const key of Object.keys(englishNode)) {
      output[key] = prepareOutput(englishNode[key], localeObject[key], [...path, key], pending);
    }

    return output;
  }

  return localeNode ?? englishNode;
}

function setPathValue(target, pathParts, value) {
  let current = target;

  for (let index = 0; index < pathParts.length - 1; index += 1) {
    current = current[pathParts[index]];
  }

  current[pathParts[pathParts.length - 1]] = value;
}

function buildBatches(items, maxChars = 1400) {
  const batches = [];
  let currentBatch = [];
  let currentLength = 0;

  for (const item of items) {
    const projectedLength = currentLength + item.text.length + 40;
    if (currentBatch.length > 0 && projectedLength > maxChars) {
      batches.push(currentBatch);
      currentBatch = [];
      currentLength = 0;
    }

    currentBatch.push(item);
    currentLength += item.text.length + 40;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

function parseBatchTranslation(translatedText, batchLength) {
  const results = [];

  for (let index = 0; index < batchLength; index += 1) {
    const marker = `__CDM_SEG_${index}__`;
    const nextMarker = `__CDM_SEG_${index + 1}__`;
    const start = translatedText.indexOf(marker);
    const end = index + 1 < batchLength ? translatedText.indexOf(nextMarker) : translatedText.length;

    if (start === -1) {
      throw new Error(`Missing marker ${marker} in batch translation`);
    }

    const segment = translatedText
      .slice(start + marker.length, end === -1 ? translatedText.length : end)
      .trim();
    results.push(segment);
  }

  return results;
}

async function translateBatch(batch, lang) {
  const payload = batch
    .map((item, index) => `__CDM_SEG_${index}__\n${item.text}`)
    .join('\n');
  const translatedPayload = await translateText(payload, lang);
  const translatedItems = parseBatchTranslation(translatedPayload, batch.length);

  return batch.map((item, index) => ({
    path: item.path,
    text: translatedItems[index] || item.text
  }));
}

async function processFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const content = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  const english = content.en;

  if (!english) {
    throw new Error(`Missing "en" locale in ${filePath}`);
  }

  for (const locale of locales) {
    console.log(`Translating ${path.basename(filePath)} -> ${locale}`);
    const pending = [];
    const output = prepareOutput(english, content[locale], [], pending);
    const batches = buildBatches(pending);

    for (const batch of batches) {
      const translatedBatch = await translateBatch(batch, locale);
      for (const item of translatedBatch) {
        setPathValue(output, item.path, item.text);
      }
    }

    content[locale] = output;
    fs.writeFileSync(absolutePath, JSON.stringify(content, null, 2));
  }
}

async function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    throw new Error('Pass one or more JSON files to translate.');
  }

  for (const file of files) {
    await processFile(file);
  }

  console.log('Translation complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
