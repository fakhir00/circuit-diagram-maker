import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'src', 'data', 'i18n', 'common.json');
const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const translations = {
  "en": {
    "404.meta.title": "404 - Page Not Found",
    "404.title": "Oops! Page not found.",
    "404.desc": "It looks like the schematic you're trying to find doesn't exist. Let's get you back to safety.",
    "404.button": "Return Home"
  },
  "hi": {
    "404.meta.title": "404 - पृष्ठ नहीं मिला",
    "404.title": "उफ़! पृष्ठ नहीं मिला।",
    "404.desc": "ऐसा लगता है कि आप जो योजना खोज रहे हैं वह मौजूद नहीं है। चलिए आपको वापस सुरक्षित स्थान पर ले चलते हैं।",
    "404.button": "होम पर लौटें"
  },
  "es": {
    "404.meta.title": "404 - Página no encontrada",
    "404.title": "¡Uy! Página no encontrada.",
    "404.desc": "Parece que el esquema que intentas encontrar no existe. Volvamos a la página principal.",
    "404.button": "Volver a Inicio"
  },
  "ru": {
    "404.meta.title": "404 - Страница не найдена",
    "404.title": "Упс! Страница не найдена.",
    "404.desc": "Похоже, схемы, которую вы пытаетесь найти, не существует. Давайте вернем вас обратно.",
    "404.button": "Вернуться на главную"
  },
  "fr": {
    "404.meta.title": "404 - Page non trouvée",
    "404.title": "Oups ! Page non trouvée.",
    "404.desc": "Il semble que le schéma que vous essayez de trouver n'existe pas. Retournons à l'accueil.",
    "404.button": "Retour à l'accueil"
  },
  "de": {
    "404.meta.title": "404 - Seite nicht gefunden",
    "404.title": "Hoppla! Seite nicht gefunden.",
    "404.desc": "Es sieht so aus, als gäbe es den Schaltplan, den Sie suchen, nicht. Lassen Sie uns zum Start zurückkehren.",
    "404.button": "Zurück zur Startseite"
  },
  "it": {
    "404.meta.title": "404 - Pagina non trovata",
    "404.title": "Ops! Pagina non trovata.",
    "404.desc": "Sembra che lo schema che stai cercando non esista. Torniamo alla home.",
    "404.button": "Ritorna alla Home"
  },
  "pt": {
    "404.meta.title": "404 - Página não encontrada",
    "404.title": "Oops! Página não encontrada.",
    "404.desc": "Parece que o esquema que você está tentando encontrar não existe. Vamos voltar para casa.",
    "404.button": "Voltar ao Início"
  },
  "bn": {
    "404.meta.title": "৪০৪ - পৃষ্ঠা পাওয়া যায়নি",
    "404.title": "উফস! পৃষ্ঠা পাওয়া যায়নি।",
    "404.desc": "মনে হচ্ছে আপনি যে ডায়াগ্রাম খোঁজার চেষ্টা করছেন তা নেই। চলুন আপনাকে নিরাপদে ফিরিয়ে নিয়ে যাই।",
    "404.button": "হোমে ফিরে যান"
  },
  "ja": {
    "404.meta.title": "404 - ページが見つかりません",
    "404.title": "おっと！ページが見つかりません。",
    "404.desc": "探している回路図は存在しないようです。ホームに戻りましょう。",
    "404.button": "ホームに戻る"
  },
  "ko": {
    "404.meta.title": "404 - 페이지를 찾을 수 없습니다",
    "404.title": "앗! 페이지를 찾을 수 없습니다.",
    "404.desc": "찾으려는 회로도가 존재하지 않는 것 같습니다. 홈으로 돌아가ましょう.",
    "404.button": "홈으로 돌아가기"
  },
  "ms": {
    "404.meta.title": "404 - Halaman Tidak Ditemui",
    "404.title": "Alamak! Halaman tidak ditemui.",
    "404.desc": "Nampaknya skematik yang anda cari tidak wujud. Mari kembali ke halaman utama.",
    "404.button": "Kembali ke Utama"
  },
  "pl": {
    "404.meta.title": "404 - Nie znaleziono strony",
    "404.title": "Ups! Nie znaleziono strony.",
    "404.desc": "Wygląda na to, że schemat, którego szukasz, nie istnieje. Wróćmy w bezpieczne miejsce.",
    "404.button": "Powrót do strony głównej"
  },
  "id": {
    "404.meta.title": "404 - Halaman Tidak Ditemukan",
    "404.title": "Ups! Halaman tidak ditemukan.",
    "404.desc": "Sepertinya skema yang Anda cari tidak ada. Mari kita kembali ke beranda.",
    "404.button": "Kembali ke Beranda"
  },
  "ar": {
    "404.meta.title": "404 - الصفحة غير موجودة",
    "404.title": "عفوًا! الصفحة غير موجودة.",
    "404.desc": "يبدو أن المخطط الذي تحاول العثور عليه غير موجود. دعنا نعود إلى الصفحة الرئيسية.",
    "404.button": "العودة للرئيسية"
  },
  "bg": {
    "404.meta.title": "404 - Страницата не е намерена",
    "404.title": "Опа! Страницата не е намерена.",
    "404.desc": "Изглежда, че схемата, която търсите, не съществува. Нека се върнем в началото.",
    "404.button": "Връщане в началото"
  },
  "tr": {
    "404.meta.title": "404 - Sayfa Bulunamadı",
    "404.title": "Oops! Sayfa bulunamadı.",
    "404.desc": "Bulmaya çalıştığınız şema mevcut değil gibi görünüyor. Hadi sizi ana sayfaya götürelim.",
    "404.button": "Ana Sayfaya Dön"
  },
  "sv": {
    "404.meta.title": "404 - Sidan hittades inte",
    "404.title": "Hoppsan! Sidan hittades inte.",
    "404.desc": "Det verkar som att schemat du letar efter inte existerar. Låt oss gå tillbaka till start.",
    "404.button": "Tillbaka till Start"
  }
};

for (const lang in translations) {
  if (content[lang]) {
    content[lang] = { ...content[lang], ...translations[lang] };
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), 'utf8');
console.log("Updated common.json with 404 translations successfully!");
