import fs from 'fs';
import path from 'path';

const p = path.join(process.cwd(), 'src/data/i18n/keyword-tools.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

// Spanish (es)
data.es = {
  ...data.es,
  "keyword.hero.boolean.eyebrow": "Espacio de Álgebra Booleana",
  "keyword.hero.boolean.title": "Simplificador de Expresiones Booleanas: Reduce Cualquier Expresión al Instante",
  "keyword.hero.boolean.description": "Simplifique expresiones de álgebra booleana en segundos. Introduzca notación SOP o estándar, aplique las leyes de De Morgan, encuentre implicantes primos con Quine-McCluskey y genere automáticamente la tabla de verdad y el diagrama de puertas lógicas.",
  "keyword.hero.boolean.cta.primary": "Simplificar una Expresión",
  "keyword.hero.boolean.cta.secondary": "Ver Cómo Funciona",
  "keyword.hero.truth.eyebrow": "Conversor de Lógica Digital",
  "keyword.hero.truth.title": "Tabla de Verdad a Circuito Lógico: De Bits de Salida a Diseño de Puertas",
  "keyword.hero.truth.description": "Convierta patrones de salida de tablas de verdad en expresiones booleanas simplificadas y un diseño de circuito a nivel de puertas para una validación rápida y precisa.",
  "keyword.hero.truth.cta.primary": "Generar un Circuito",
  "keyword.hero.truth.cta.secondary": "Ver Cómo Funciona"
};

// Indonesian (id)
data.id = {
  ...data.id,
  "keyword.hero.boolean.eyebrow": "Ruang Kerja Aljabar Boolean",
  "keyword.hero.boolean.title": "Penyederhana Ekspresi Boolean: Sederhanakan Ekspresi Logika Secara Instan",
  "keyword.hero.boolean.description": "Sederhanakan ekspresi aljabar Boolean dalam hitungan detik. Masukkan notasi SOP atau standar, terapkan hukum De Morgan, temukan implikan prima dengan metode Quine-McCluskey, dan hasilkan tabel kebenaran serta jaringan gerbang logika secara otomatis.",
  "keyword.hero.boolean.cta.primary": "Sederhanakan Ekspresi",
  "keyword.hero.boolean.cta.secondary": "Pelajari Cara Kerjanya",
  "keyword.hero.truth.eyebrow": "Konverter Logika Digital",
  "keyword.hero.truth.title": "Tabel Kebenaran ke Rangkaian Logika: Dari Bit Output ke Desain Gerbang",
  "keyword.hero.truth.description": "Konversikan pola bit keluaran dari tabel kebenaran menjadi ekspresi Boolean minimal dan rancangan rangkaian gerbang praktis untuk validasi perangkat keras yang cepat.",
  "keyword.hero.truth.cta.primary": "Buat Rangkaian",
  "keyword.hero.truth.cta.secondary": "Pelajari Cara Kerjanya"
};

// Turkish (tr)
data.tr = {
  ...data.tr,
  "keyword.hero.boolean.eyebrow": "Boole Cebri Çalışma Alanı",
  "keyword.hero.boolean.title": "Boole İfadesi Sadeleştirici: Herhangi Bir Mantık İfadesini Anında Sadeleştirin",
  "keyword.hero.boolean.description": "Boole cebri ifadelerini saniyeler içinde basitleştirin. SOP veya standart gösterim girin, De Morgan kurallarını uygulayın, Quine-McCluskey indirgemesiyle asal bileşenleri bulun ve doğruluk tablosu ile kapı ağını otomatik olarak oluşturun.",
  "keyword.hero.boolean.cta.primary": "İfadeyi Sadeleştir",
  "keyword.hero.boolean.cta.secondary": "Nasıl Çalıştığını Gör",
  "keyword.hero.truth.eyebrow": "Dijital Mantık Dönüştürücü",
  "keyword.hero.truth.title": "Doğruluk Tablosundan Mantık Devresine: Çıkış Bitlerinden Kapı Tasarımına",
  "keyword.hero.truth.description": "Doğruluk tablosu çıkış modellerini sadeleştirilmiş Boole ifadelerine ve pratik kapı düzeyinde devre planlarına dönüştürerek hızlı doğrulama yapın.",
  "keyword.hero.truth.cta.primary": "Devre Oluştur",
  "keyword.hero.truth.cta.secondary": "Nasıl Çalıştığını Gör"
};

// Bulgarian (bg)
data.bg = {
  ...data.bg,
  "keyword.hero.boolean.eyebrow": "Работна среда за булева алгебра",
  "keyword.hero.boolean.title": "Опростяване на булеви изрази: Минимизирайте логически изрази мигновено",
  "keyword.hero.boolean.description": "Опростете изрази на булевата алгебра за секунди. Въведете SOP или стандартен запис, приложете законите на Де Морган, намерете прости импликанти с Quine-McCluskey и генерирайте автоматично таблица на истинност и схема на свързване.",
  "keyword.hero.boolean.cta.primary": "Опрости израз",
  "keyword.hero.boolean.cta.secondary": "Вижте как работи",
  "keyword.hero.truth.eyebrow": "Конвертор за цифрова логика",
  "keyword.hero.truth.title": "Таблица на истинност към логическа схема: От изходни битове към проектиране на елементи",
  "keyword.hero.truth.description": "Преобразувайте изходни стойности от таблици на истинност в опростени булеви изрази и практични принципни схеми на ниво логически елементи.",
  "keyword.hero.truth.cta.primary": "Генерирай схема",
  "keyword.hero.truth.cta.secondary": "Вижте как работи"
};

fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Successfully updated keyword-tools.json');
