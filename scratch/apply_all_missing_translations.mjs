import fs from 'fs';
import path from 'path';

const i18nDir = path.join(process.cwd(), 'src/data/i18n');

// 1. UPDATE legal.json
const legalPath = path.join(i18nDir, 'legal.json');
const legalData = JSON.parse(fs.readFileSync(legalPath, 'utf8'));

legalData.tr = {
  ...legalData.tr,
  "legal.terms.s3.l4": "Hizmeti yasa dışı amaçlarla kullanmak veya yanıltıcı ve zararlı içerikler üretmek"
};

legalData.bg = {
  ...legalData.bg,
  "legal.terms.s3.l1": "Опит за декомпилиране или извличане на изходния код на софтуера без разрешение",
  "legal.terms.s3.l2": "Използване на автоматизирани ботове за претоварване на сървърите на сайта",
  "legal.terms.s3.l3": "Публично разпространение на подвеждаща информация относно Circuit Diagram Maker",
  "legal.terms.s3.l4": "Използване на услугата за незаконни цели или създаване на зловредно съдържание"
};

fs.writeFileSync(legalPath, JSON.stringify(legalData, null, 2) + '\n', 'utf8');
console.log('Updated legal.json');

// 2. UPDATE home.json
const homePath = path.join(i18nDir, 'home.json');
const homeData = JSON.parse(fs.readFileSync(homePath, 'utf8'));

homeData.es = {
  ...homeData.es,
  "home.how_to.title": "Cómo crear un diagrama de circuito",
  "home.how_to.steps": [
    {
      "number": "01",
      "title": "Seleccione los componentes",
      "desc": "Explore nuestra biblioteca con más de 40 símbolos electrónicos y arrástrelos sobre el lienzo infinito."
    },
    {
      "number": "02",
      "title": "Conecte el circuito",
      "desc": "Utilice el enrutamiento inteligente para unir los terminales. El motor mantiene cada cable perfectamente alineado en ángulo recto."
    },
    {
      "number": "03",
      "title": "Personalice y exporte",
      "desc": "Añada etiquetas, ajuste la posición de los componentes y descargue su esquema en formato SVG, PNG o JSON con un solo clic."
    }
  ]
};

homeData.id = {
  ...homeData.id,
  "home.how_to.title": "Cara Membuat Diagram Sirkuit",
  "home.how_to.steps": [
    {
      "number": "01",
      "title": "Pilih Komponen",
      "desc": "Jelajahi pustaka kami yang berisi 40+ simbol elektronika standar dan seret langsung ke kanvas kerja."
    },
    {
      "number": "02",
      "title": "Hubungkan Sirkuit",
      "desc": "Gunakan perutean kabel otomatis yang cerdas untuk menghubungkan pin. Kabel akan tertata rapi secara horizontal dan vertikal."
    },
    {
      "number": "03",
      "title": "Sesuaikan dan Ekspor",
      "desc": "Tambahkan label nilai komponen, atur tata letak, lalu unduh dalam format SVG, PNG, atau JSON dengan sekali klik."
    }
  ]
};

homeData.tr = {
  ...homeData.tr,
  "home.how_to.title": "Devre Şeması Nasıl Çizilir?",
  "home.how_to.steps": [
    {
      "number": "01",
      "title": "Bileşenleri Seçin",
      "desc": "40'tan fazla standart elektronik sembol içeren kütüphanemizden istediğiniz parçaları çalışma alanına sürükleyin."
    },
    {
      "number": "02",
      "title": "Devreyi Bağlayın",
      "desc": "Uçları birleştirmek için akıllı kablolama aracını kullanın. Sistem tüm hatları düzgün ve dik açılı olarak otomatik hizalar."
    },
    {
      "number": "03",
      "title": "Özelleştirin ve Dışa Aktarın",
      "desc": "Bileşen değerlerini ve etiketleri ekleyin, ardından tek tıklamayla SVG, PNG veya JSON olarak indirin."
    }
  ]
};

homeData.bg = {
  ...homeData.bg,
  "home.how_to.title": "Как се създава електрическа схема",
  "home.how_to.steps": [
    {
      "number": "01",
      "title": "Изберете компоненти",
      "desc": "Разгледайте библиотеката с над 40 електронни символа и ги плъзнете върху работното платно."
    },
    {
      "number": "02",
      "title": "Свържете схемата",
      "desc": "Използвайте интелигентното автоматично окабеляване за свързване на изводите. Всички проводници остават под прав ъгъл."
    },
    {
      "number": "03",
      "title": "Персонализирайте и експортирайте",
      "desc": "Добавете обозначения и стойности, след което изтеглете схемата като SVG, PNG или JSON с един клик."
    }
  ]
};

fs.writeFileSync(homePath, JSON.stringify(homeData, null, 2) + '\n', 'utf8');
console.log('Updated home.json');

// 3. UPDATE about.json
const aboutPath = path.join(i18nDir, 'about.json');
const aboutData = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));

// Spanish about
aboutData.es = {
  ...aboutData.es,
  "about.story.p3": "Nuestro creador de diagramas de circuitos permite diseñar desde simples circuitos con LED hasta amplificadores multietapa, fuentes conmutadas (buck converter) e interfaces para microcontroladores. Es la herramienta que deseábamos tener cuando éramos estudiantes, y ahora es completamente gratuita para cualquier estudiante, profesor, aficionado o ingeniero en todo el mundo.",
  "about.timeline": [
    {
      "year": "2023",
      "title": "Nace la idea",
      "desc": "Frustrados por los pesados programas CAD de escritorio, nuestros ingenieros fundadores comenzaron a crear un prototipo de diseñador de circuitos basado en la web."
    },
    {
      "year": "2024",
      "title": "Primera versión beta pública",
      "desc": "Circuit Diagram Maker se lanzó con 20 símbolos, enrutamiento básico de cables y exportación en PNG. Miles de estudiantes lo adoptaron en cuestión de semanas."
    },
    {
      "year": "2026",
      "title": "Exportación SVG y más de 40 símbolos",
      "desc": "Añadimos enrutamiento ortogonal (Manhattan), exportación vectorial en SVG, atajos de teclado y ampliamos la biblioteca a más de 40 símbolos electrónicos."
    },
    {
      "year": "2026",
      "title": "Alcance global",
      "desc": "Circuit Diagram Maker atiende a usuarios en más de 180 países, con soporte en 18 idiomas y una comunidad en constante crecimiento."
    }
  ],
  "about.values": [
    {
      "icon": "🚀",
      "title": "Velocidad sobre complejidad",
      "desc": "Un diseñador de diagramas debe abrirse en segundos, no en minutos. Priorizamos la velocidad de carga y la agilidad del flujo de trabajo ante todo."
    },
    {
      "icon": "🎯",
      "title": "Precisión por defecto",
      "desc": "Cada cable se ajusta a una cuadrícula de 20 px. Todas las conexiones son ortogonales. Diseñe esquemas limpios y legibles desde el primer momento."
    },
    {
      "icon": "🌍",
      "title": "Accesible para todos",
      "desc": "Gratuito para siempre, sin registros ni barreras de pago. Creemos que las herramientas profesionales deben estar al alcance de cualquier estudiante y entusiasta de la electrónica."
    },
    {
      "icon": "🔓",
      "title": "Sus datos en su dispositivo",
      "desc": "Todos los esquemas se guardan localmente en su navegador. Nunca subimos, analizamos ni comercializamos sus diseños."
    }
  ],
  "about.stats.symbols.value": "40+",
  "about.stats.languages.value": "18",
  "about.stats.countries.value": "180+",
  "about.stats.cost.value": "0"
};

// Indonesian about
aboutData.id = {
  ...aboutData.id,
  "about.story.title": "Mengapa Kami Membangun Alat Pembuat Diagram Sirkuit Ini",
  "about.story.p1": "Setiap teknisi dan pelajar elektronika pasti memahami kendala ini: Anda hanya butuh membuat skema sirkuit sederhana untuk laporan praktikum, ulasan desain, atau proposal proyek. Pilihan Anda? Menjalankan aplikasi desktop berukuran 2 GB yang butuh lima menit untuk terbuka, menggambar manual di atas kertas, atau berkutat dengan aplikasi gambar biasa yang tidak memahami simbol elektronika standar.",
  "about.story.p2": "lahir dari kendala tersebut. Kami bertekad membangun alat pembuat diagram sirkuit tercepat, paling praktis, dan paling mudah diakses di web — yang terbuka secara instan, menyediakan simbol komponen nyata, menghubungkan kabel secara cerdas, dan mengekspor skema berkualitas publikasi tanpa biaya apa pun.",
  "about.story.p3": "Editor sirkuit kami menangani segalanya, mulai dari sirkuit LED sederhana hingga desain penguat audio bertingkat, skema konverter buck, dan antarmuka mikrokontroler. Ini adalah alat yang kami impikan saat kami masih mahasiswa, dan kini tersedia gratis bagi setiap pelajar, pendidik, penghobi, dan teknisi di seluruh dunia.",
  "about.timeline": [
    {
      "year": "2023",
      "title": "Ide Dimulai",
      "desc": "Merasa terbatas oleh software CAD desktop yang lambat, tim kami mulai mengembangkan prototipe pembuat skema sirkuit berbasis peramban web."
    },
    {
      "year": "2024",
      "title": "Beta Publik Pertama",
      "desc": "Circuit Diagram Maker diluncurkan dengan 20 simbol elektronik, routing kabel dasar, dan ekspor PNG. Ribuan pelajar menggunakannya dalam hitungan minggu."
    },
    {
      "year": "2026",
      "title": "Ekspor Vektor SVG & 40+ Simbol",
      "desc": "Kami menambahkan routing ortogonal Manhattan, ekspor vektor SVG tajam, pintasan keyboard, serta memperluas pustaka komponen hingga lebih dari 40 simbol."
    },
    {
      "year": "2026",
      "title": "Jangkauan Global",
      "desc": "Circuit Diagram Maker kini melayani pengguna di lebih dari 180 negara dengan dukungan 18 bahasa dan komunitas yang terus berkembang."
    }
  ],
  "about.values": [
    {
      "icon": "🚀",
      "title": "Kecepatan di Atas Kerumitan",
      "desc": "Alat pembuat skema harus terbuka dalam hitungan detik. Kami memprioritaskan kecepatan akses dan kemudahan alur kerja di atas segalanya."
    },
    {
      "icon": "🎯",
      "title": "Presisi Secara Otomatis",
      "desc": "Setiap kabel terkunci rapi pada kisi grid 20px. Semua koneksi dibuat siku secara ortogonal agar skema selalu bersih dan mudah dibaca."
    },
    {
      "icon": "🌍",
      "title": "Dapat Diakses Semua Orang",
      "desc": "Gratis selamanya, tanpa perlu daftar akun atau langganan berbayar. Kami meyakini alat teknik profesional harus dapat diakses oleh setiap pelajar di seluruh dunia."
    },
    {
      "icon": "🔓",
      "title": "Data Anda Tetap di Perangkat Anda",
      "desc": "Semua skema sirkuit disimpan secara lokal di peramban web Anda. Kami tidak pernah mengunggah atau memonetisasi hasil karya Anda."
    }
  ],
  "about.stats.symbols.value": "40+",
  "about.stats.languages.value": "18",
  "about.stats.countries.value": "180+",
  "about.stats.cost.value": "0",
  "about.cta.title": "Siap Membuat Diagram Sirkuit Pertama Anda?",
  "about.cta.desc": "Buka editor skema sirkuit dan mulailah merancang sekarang — gratis sepenuhnya tanpa perlu registrasi."
};

// Turkish about
aboutData.tr = {
  ...aboutData.tr,
  "about.story.title": "Bu Devre Şeması Çizim Aracını Neden Geliştirdik?",
  "about.story.p1": "Her elektronik mühendisi ve öğrencisi bu zorluğu iyi bilir: Bir laboratuvar raporu, teknik sunum veya proje incelemesi için hızlıca bir devre şeması çizmeniz gerekir. Seçenekleriniz nelerdir? Açılması dakikalar süren 2 GB'lık hantal masaüstü yazılımlarını başlatmak, kağıt üzerine okunaksız çizimler karalamak veya direnç ile sıradan bir dikdörtgen arasındaki farkı bilmeyen genel çizim araçlarıyla uğraşmak.",
  "about.story.p2": "işte bu ihtiyaçtan doğdu. Amacımız web üzerindeki en hızlı, en sade ve en erişilebilir devre şeması çizim aracını oluşturmaktı: anında açılan, gerçek elektronik semboller içeren, bağlantıları akıllıca yönlendiren ve hiçbir ücret talep etmeden yayın kalitesinde şemalar sunan bir platform.",
  "about.story.p3": "Çevrimiçi devre editörümüz basit LED devrelerinden çok katlı amplifikatör tasarımlarına, buck dönüştürücü şemalarına ve mikrodenetleyici bağlantılarına kadar her türlü projeyi kolayca çizer. Öğrencilik yıllarımızda var olmasını dilediğimiz bu aracı, artık dünyadaki tüm öğrencilere, öğretmenlere, hobicilere ve mühendislere tamamen ücretsiz sunuyoruz.",
  "about.timeline": [
    {
      "year": "2023",
      "title": "Fikrin Doğuşu",
      "desc": "Hantal masaüstü CAD programlarından bunalan kurucu mühendislerimiz, tarayıcı tabanlı modern bir devre şeması aracı geliştirmeye başladı."
    },
    {
      "year": "2024",
      "title": "İlk Halka Açık Beta",
      "desc": "Circuit Diagram Maker 20 elektronik sembol, temel kablo yönlendirme ve PNG dışa aktarma özellikleriyle yayına girdi. Binlerce öğrenci ilk haftalarda kullanmaya başladı."
    },
    {
      "year": "2026",
      "title": "SVG Vektör Dışa Aktarma ve 40+ Sembol",
      "desc": "Ortogonal (Manhattan) kablolama, yüksek çözünürlüklü SVG vektör çıktısı, klavye kısayolları ekledik ve sembol kütüphanesini 40'ın üzerine çıkardık."
    },
    {
      "year": "2026",
      "title": "Küresel Erişim",
      "desc": "Circuit Diagram Maker günümüzde 180'den fazla ülkede, 18 dilde kullanıcılara hizmet veren geniş bir topluluğa ulaştı."
    }
  ],
  "about.values": [
    {
      "icon": "🚀",
      "title": "Karmaşıklık Yerine Hız",
      "desc": "Bir devre çizim aracı dakikalarca değil, saniyeler içinde açılmalıdır. Başlangıç hızını ve akıcı iş akışını her şeyin üzerinde tutuyoruz."
    },
    {
      "icon": "🎯",
      "title": "Kusursuz Hassasiyet",
      "desc": "Her kablo 20px ızgaraya oturur. Tüm bağlantılar dik açılı ve düzenlidir. Düzenleyicimiz her zaman temiz ve anlaşılır şemalar oluşturmanızı sağlar."
    },
    {
      "icon": "🌍",
      "title": "Herkes İçin Erişilebilir",
      "desc": "Sonsuza kadar ücretsiz; kayıt olma şartı veya gizli ücretler yok. Profesyonel devre tasarım araçlarının dünyadaki tüm öğrencilerin erişiminde olması gerektiğine inanıyoruz."
    },
    {
      "icon": "🔓",
      "title": "Verileriniz Kendi Cihazınızda",
      "desc": "Tüm devre şemaları doğrudan tarayıcınızın yerel hafızasında saklanır. Tasarımlarınızı asla sunuculara yüklemiyor veya toplamıyoruz."
    }
  ],
  "about.stats.symbols.value": "40+",
  "about.stats.languages.value": "18",
  "about.stats.countries.value": "180+",
  "about.stats.cost.value": "0",
  "about.cta.title": "İlk Devre Şemanızı Çizmeye Hazır mısınız?",
  "about.cta.desc": "Devre şeması düzenleyicisini hemen açın ve tasarlamaya başlayın — tamamen ücretsiz, hesap açmak gerekmez."
};

// Bulgarian about
aboutData.bg = {
  ...aboutData.bg,
  "about.story.title": "Защо създадохме този инструмент за електрически схеми",
  "about.story.p1": "Всеки електроинженер и студент познава това разочарование: трябва бързо да начертаете електрическа схема за лабораторен доклад, преглед на проект или дипломна работа. Какви са вариантите ви? Да стартирате тежък 2GB десктоп софтуер, който зарежда пет минути, да рисувате на ръка върху лист хартия или да се борите с обикновена програма за рисуване, която дори не разпознава резистор от правоъгълник.",
  "about.story.p2": "се роди именно от тази необходимост. Решихме да изградим най-бързия, най-лесния и най-достъпния онлайн редактор на електрически схеми — инструмент, който се зарежда мигновено, предлага реални електронни символи, свързва проводниците интелигентно и експортира кристално ясни схеми напълно безплатно.",
  "about.story.p3": "Нашият редактор се справя с всичко: от прости схеми със светодиоди до сложни многостъпални усилватели, импулсни захранвания и схеми с микроконтролери. Това е инструментът, който искахме да имаме като студенти, а днес той е напълно свободен за всеки учащ, преподавател, любител и инженер по света.",
  "about.timeline": [
    {
      "year": "2023",
      "title": "Раждане на идеята",
      "desc": "Недоволни от тромавия CAD софтуер, инженерите ни започнаха разработката на бърз уеб инструмент за чертане на схеми."
    },
    {
      "year": "2024",
      "title": "Първа публична бета версия",
      "desc": "Circuit Diagram Maker стартира с 20 електронни символа, базово окабеляване и PNG експорт. Хиляди студенти го припознаха за седмици."
    },
    {
      "year": "2026",
      "title": "SVG експорт и над 40 символа",
      "desc": "Добавихме ортогонално автоматично окабеляване (Манхатън рутиране), векторен SVG експорт, клавишни комбинации и обогатихме библиотеката с компоненти."
    },
    {
      "year": "2026",
      "title": "Глобален обхват",
      "desc": "Circuit Diagram Maker обслужва потребители в над 180 държави с локализация на 18 езика и активно нарастваща общност."
    }
  ],
  "about.values": [
    {
      "icon": "🚀",
      "title": "Бързина вместо излишна сложност",
      "desc": "Софтуерът за електрически схеми трябва да зарежда за секунди. Поставяме бързината на работа и удобството на първо място."
    },
    {
      "icon": "🎯",
      "title": "Прецизност по подразбиране",
      "desc": "Всеки проводник прилепва към мрежа от 20px. Всички връзки са под прав ъгъл. Програмата осигурява чисти и прегледни схеми по дизайн."
    },
    {
      "icon": "🌍",
      "title": "Достъпен за всеки",
      "desc": "Безплатен завинаги, без регистрация и без скрити абонаменти. Вярваме, че професионалните инженерни инструменти трябва да са достъпни за всички."
    },
    {
      "icon": "🔓",
      "title": "Вашите данни остават при вас",
      "desc": "Всички схеми се пазят локално във вашия браузър. Ние никога не качваме и не споделяме вашите проекти на външни сървърни ресурси."
    }
  ],
  "about.stats.symbols.value": "40+",
  "about.stats.languages.value": "18",
  "about.stats.countries.value": "180+",
  "about.stats.cost.value": "0",
  "about.cta.title": "Готови ли сте да създадете първата си схема?",
  "about.cta.desc": "Отворете редактора на схеми и започнете да чертаете — напълно безплатно, без регистрация."
};

fs.writeFileSync(aboutPath, JSON.stringify(aboutData, null, 2) + '\n', 'utf8');
console.log('Updated about.json');

// 4. UPDATE contact.json
const contactPath = path.join(i18nDir, 'contact.json');
const contactData = JSON.parse(fs.readFileSync(contactPath, 'utf8'));

// Spanish contact
contactData.es = {
  ...contactData.es,
  "contact.sidebar.email.desc": "Para problemas técnicos y sugerencias de funciones:",
  "contact.sidebar.time.desc": "Normalmente respondemos en un plazo de",
  "contact.sidebar.time.context": "en días laborables (lunes a viernes). Para problemas urgentes con el editor de circuitos, incluya 'URGENTE' en el asunto de su mensaje.",
  "contact.sidebar.features.desc": "¡Nos encanta recibir comentarios de los usuarios! Si tiene una idea para un nuevo componente, formato de exportación o función del editor, escríbanos: las mejores novedades de la herramienta nacieron gracias a la comunidad.",
  "contact.support_faqs": [
    {
      "q": "¿Mi esquema no se guardó: cómo puedo recuperarlo?",
      "a": "Circuit Diagram Maker utiliza el almacenamiento local de su navegador. Si borró los datos de navegación, el diagrama podría haberse eliminado. Le recomendamos exportar sus proyectos importantes como archivos JSON como copia de seguridad periódica."
    },
    {
      "q": "¿Puedo importar esquemas desde otras herramientas a Circuit Diagram Maker?",
      "a": "Actualmente, la herramienta permite importar sus propios archivos JSON, lo que facilita compartir proyectos entre equipos y dispositivos. Estamos evaluando la compatibilidad con formatos de archivo adicionales en nuestras próximas actualizaciones."
    },
    {
      "q": "El editor funciona lento en mi dispositivo, ¿qué puedo hacer?",
      "a": "Para un rendimiento óptimo, recomendamos usar un navegador moderno (Chrome, Firefox o Edge) con aceleración por hardware activada y cerrar pestañas en segundo plano. La herramienta funciona mejor en dispositivos con 4 GB o más de memoria RAM."
    }
  ]
};

// Indonesian contact
contactData.id = {
  ...contactData.id,
  "contact.hero.subtitle": "Punya pertanyaan seputar Circuit Diagram Maker? Menemukan kendala pada editor? Ingin mengajukan simbol komponen baru? Tim kami siap membantu dan biasanya merespons dalam 24 jam di hari kerja. Sebelum menghubungi kami, Anda juga dapat membaca pertanyaan umum di bawah ini.",
  "contact.form.title": "Kirimkan Pesan kepada Kami",
  "contact.sidebar.email.title": "📧 Dukungan Email",
  "contact.sidebar.email.desc": "Untuk kendala teknis dan saran fitur baru:",
  "contact.sidebar.time.title": "⏱️ Waktu Respons",
  "contact.sidebar.time.desc": "Kami biasanya membalas dalam",
  "contact.sidebar.time.strong": "24 jam",
  "contact.sidebar.time.context": "pada hari kerja (Senin–Jumat). Untuk kendala mendesak pada editor sirkuit, sertakan kata 'URGENT' pada subjek pesan Anda.",
  "contact.sidebar.features.title": "💡 Usulan Fitur Baru",
  "contact.sidebar.features.desc": "Kami sangat menghargai masukan Anda! Jika Anda memiliki ide untuk simbol komponen baru, opsi ekspor, atau peningkatan editor, beri tahu kami — fitur terbaik kami hadir dari komunitas pengguna.",
  "contact.faq.title": "Pertanyaan Dukungan yang Sering Diajukan",
  "contact.support_faqs": [
    {
      "q": "Diagram sirkuit saya tidak tersimpan — bagaimana cara memulihkannya?",
      "a": "Circuit Diagram Maker menggunakan penyimpanan lokal peramban (Local Storage). Jika Anda membersihkan data cache atau riwayat peramban, data sirkuit mungkin terhapus. Kami sangat menyarankan mengekspor proyek penting sebagai file JSON untuk salinan cadangan."
    },
    {
      "q": "Bisakah saya mengimpor diagram dari aplikasi lain ke Circuit Diagram Maker?",
      "a": "Saat ini Circuit Diagram Maker mendukung impor format file JSON resminya sendiri. Anda dapat membagikan file JSON antar perangkat dan rekan tim. Dukungan format lain sedang dalam rencana pengembangan kami."
    },
    {
      "q": "Editor terasa lambat di perangkat saya — apa solusinya?",
      "a": "Untuk performa terbaik, gunakan peramban modern (Chrome, Firefox, Edge) dengan akselerasi perangkat keras yang aktif. Tutup tab lain yang tidak terpakai untuk menghemat memori RAM."
    }
  ]
};

// Turkish contact
contactData.tr = {
  ...contactData.tr,
  "contact.hero.subtitle": "Circuit Diagram Maker hakkında bir sorunuz mu var? Editörde bir hata mı fark ettiniz? Yeni bir bileşen sembolü mü talep etmek istiyorsunuz? Ekibimiz iş günlerinde genellikle 24 saat içinde dönüş yapmaktadır. Bize yazmadan önce aşağıdaki sık sorulan destek sorularına göz atabilirsiniz.",
  "contact.form.title": "Bize Mesaj Gönderin",
  "contact.sidebar.email.title": "📧 E-posta Desteği",
  "contact.sidebar.email.desc": "Teknik sorular ve yeni özellik önerileri için:",
  "contact.sidebar.time.title": "⏱️ Yanıt Süresi",
  "contact.sidebar.time.desc": "Genellikle şu süre içinde yanıt veriyoruz:",
  "contact.sidebar.time.strong": "24 saat",
  "contact.sidebar.time.context": "iş günlerinde (Pazartesi–Cuma). Devre şeması düzenleyicisiyle ilgili acil durumlar için e-posta konunuza 'URGENT' yazabilirsiniz.",
  "contact.sidebar.features.title": "💡 Özellik ve Bileşen Talepleri",
  "contact.sidebar.features.desc": "Kullanıcılarımızın fikirlerini dinlemeyi çok seviyoruz! Yeni bir sembol, dışa aktarma formatı veya arayüz özelliği fikriniz varsa bizimle paylaşın — en popüler özelliklerimizi topluluğumuz önerdi.",
  "contact.faq.title": "Sıkça Sorulan Destek Soruları",
  "contact.support_faqs": [
    {
      "q": "Devre şemam kaydedilmedi — nasıl geri getirebilirim?",
      "a": "Circuit Diagram Maker tarayıcınızın yerel depolama alanını kullanır. Tarayıcı önbelleğinizi veya geçmişinizi temizlediyseniz şema silinmiş olabilir. Önemli devre projelerinizi yedeklemek için JSON formatında dışa aktarmanızı önemle tavsiye ederiz."
    },
    {
      "q": "Başka programlardan Circuit Diagram Maker'a şema aktarabilir miyim?",
      "a": "Şu anda Circuit Diagram Maker kendi JSON dosya formatını içe aktarmayı desteklemektedir. Bu dosyaları farklı cihazlar arasında veya iş arkadaşlarınızla kolayca paylaşabilirsiniz. Diğer dosya formatları için destek yol haritamızda yer almaktadır."
    },
    {
      "q": "Düzenleyici cihazımda yavaş çalışıyor — ne yapabilirim?",
      "a": "En iyi performans için donanım ivmesi açık modern bir tarayıcı (Chrome, Firefox veya Edge) kullanın ve arka planda açık olan gereksiz sekmeleri kapatın."
    }
  ]
};

// Bulgarian contact
contactData.bg = {
  ...contactData.bg,
  "contact.hero.subtitle": "Имате въпрос относно Circuit Diagram Maker? Открихте грешка в редактора? Искате да предложите нов компонент или символ? Екипът ни обикновено отговаря в рамките на 24 часа в работни дни. Преди да се свържете с нас, прегледайте и честите въпроси по-долу.",
  "contact.form.title": "Изпратете ни съобщение",
  "contact.sidebar.email.title": "📧 Имейл поддръжка",
  "contact.sidebar.email.desc": "За технически въпроси и предложения за нови функции:",
  "contact.sidebar.time.title": "⏱️ Време за отговор",
  "contact.sidebar.time.desc": "Обикновено отговаряме в рамките на",
  "contact.sidebar.time.strong": "24 часа",
  "contact.sidebar.time.context": "в работни дни (понеделник–петък). За спешни въпроси относно редактора включете 'URGENT' в темата на съобщението.",
  "contact.sidebar.features.title": "💡 Предложения за нови функции",
  "contact.sidebar.features.desc": "Винаги се радваме на обратна връзка! Ако имате идея за нов компонент, формат за експорт или подобрение в редактора, споделете я с нас — най-добрите ни функции бяха предложени именно от нашата общност.",
  "contact.faq.title": "Често задавани въпроси за поддръжка",
  "contact.support_faqs": [
    {
      "q": "Схемата ми не се запази — как мога да я възстановя?",
      "a": "Circuit Diagram Maker използва локалното хранилище на браузъра (Local Storage). Ако сте изчистили данните на браузъра си, схемата може да е изтрита. Силно препоръчваме да експортирате важните си проекти като JSON файл за сигурен архив."
    },
    {
      "q": "Мога ли да импортирам схеми от други програми в Circuit Diagram Maker?",
      "a": "В момента Circuit Diagram Maker поддържа импортиране на собствения си структуриран JSON формат. Можете лесно да прехвърляте JSON файлове между компютри и колеги. Поддръжката на допълнителни формати е част от нашия план за развитие."
    },
    {
      "q": "Редакторът работи бавно на моето устройство — какво да направя?",
      "a": "За максимална производителност използвайте съвременен браузър (Chrome, Firefox, Edge) с активирано хардуерно ускорение и затворете неизползваните раздели в браузъра."
    }
  ]
};

fs.writeFileSync(contactPath, JSON.stringify(contactData, null, 2) + '\n', 'utf8');
console.log('Updated contact.json');
