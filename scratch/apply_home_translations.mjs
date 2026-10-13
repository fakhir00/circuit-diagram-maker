import fs from 'fs';
import path from 'path';

const p = path.join(process.cwd(), 'src/data/i18n/home.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

// Spanish (es)
if (data.es) {
  data.es['home.hero.title'] = 'El Mejor Creador de Diagramas de Circuitos Online Gratis';
  data.es['home.hero.meta_desc'] = 'El creador de diagramas de circuitos online más intuitivo y gratuito. Arrastra componentes, conecta cables fácilmente y exporta esquemas electrónicos profesionales al instante.';
}

// Indonesian (id)
if (data.id) {
  data.id['home.hero.title'] = 'Pembuat Diagram Sirkuit Online Gratis Terbaik';
  data.id['home.hero.meta_desc'] = 'Pembuat diagram sirkuit online gratis dan paling intuitif. Tarik komponen elektronik, sambungkan kabel secara cerdas, dan ekspor skema profesional secara instan tanpa unduhan.';
}

// Turkish (tr)
if (data.tr) {
  data.tr['home.hero.title'] = 'En İyi Ücretsiz Çevrimiçi Devre Şeması Oluşturucu';
  data.tr['home.hero.meta_desc'] = 'Çevrimiçi en sezgisel ve ücretsiz devre şeması oluşturucu. Bileşenleri sürükleyin, kabloları akıllıca bağlayın ve anında profesyonel şemalar dışa aktarın.';
}

// Bulgarian (bg)
if (data.bg) {
  data.bg['home.hero.title'] = 'Безплатна онлайн програма за електрически схеми';
  data.bg['home.hero.meta_desc'] = 'Най-лесният и безплатен онлайн инструмент за електрически схеми. Поставяйте компоненти, свързвайте проводници интелигентно и експортирайте професионални схеми веднага.';
  if (data.bg['home.features.cards'] && data.bg['home.features.cards'][1]) {
    data.bg['home.features.cards'][1].title = 'Интелигентно ортогонално окабеляване';
  }
}

fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Successfully updated home.json');
