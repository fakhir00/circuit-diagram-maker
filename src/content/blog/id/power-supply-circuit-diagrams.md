---
title: "Desain Sirkuit Catu Daya: Menggambar Skema SMPS, Regulator, dan Inverter"
description: "Cara menggambar diagram sirkuit catu daya yang menyampaikan keselamatan dan arus: penghalang isolasi, simbol transformator, penyearah jembatan, kapasitor filter, regulator 78xx, konverter buck, dan inverter gelombang sinus."
date: 2026-08-20T12:00:00Z
image: "/images/blog/blog_power_supply_circuits.svg"
author: "Circuit Diagram Maker Team"
lang: "id"
category: "Power Electronics"
tags: ["power-supply-circuit-design", "smps-circuit-design", "buck-converter", "voltage-regulator-circuit", "transformerless-power-supply", "inverter-circuit"]
---

**Skema catu daya adalah satu-satunya jenis diagram sirkuit yang harus menyampaikan fakta fisik, bukan hanya fakta listrik.** Di tempat lain, Anda bebas menempatkan simbol di mana pun diagram terbaca dengan baik. Dalam catu daya, posisi komponen memberitahu pembaca di sisi mana penghalang isolasi komponen tersebut berada, dan ketebalan garis memberitahu berapa banyak arus yang dibawanya. Jika salah, diagram tersebut bukan sekadar jelek — tetapi berbahaya, karena orang berikutnya akan membangun apa yang Anda gambar.

Panduan ini membahas konvensi penggambaran yang spesifik untuk elektronika daya: penghalang, transformator, penyearah, filter, regulator, dan kosakata ketebalan garis yang menghubungkannya. Ini dibangun berdasarkan aturan universal dalam [panduan lengkap diagram sirkuit](/blog/complete-guide-to-circuit-diagrams/).

## Aturan Tata Letak: Tegangan Tinggi di Kiri, Tegangan Rendah di Kanan

Setiap catu daya terisolasi memiliki dua dunia yang terpisah secara elektrik. Skema harus membuat pemisahan itu terlihat jelas sekilas, dan konvensinya adalah:

- **Sisi primer di kiri.** Masukan listrik, sekring, filter masukan, jembatan, kapasitor bulk, perangkat switching.
- **Penghalang isolasi sebagai garis vertikal di tengah**, digambar sebagai garis putus-putus atau garis padat yang membentang sepanjang tinggi lembar.
- **Sisi sekunder di kanan.** Penyearah keluaran, filter keluaran, regulasi, konektor beban.
- **Hanya komponen yang secara sah menjembatani celah** yang melewati garis tersebut: transformator, optocoupler, dan kapasitor keamanan kelas Y. Tidak ada yang lain. Pernah.

Aturan terakhir inilah yang membuat konvensi ini berharga. Seorang pemeriksa yang meninjau catu daya terisolasi melakukan satu hal pertama: mereka melihat penghalang dan menghitung apa yang melewatiinya. Jika mereka menemukan koneksi ground, resistor, atau kabel sinyal melewati penghalang, desainnya salah dan mereka berhenti membaca. Gambaran Anda harus membiarkan mereka melakukan pengecekan itu dalam lima detik.

Berikan label pada sisi-sisinya. `PRIMARY — 230 VAC, HAZARDOUS` di kiri, `SECONDARY — SELV` di kanan. Tambahkan jarak creepage yang diperlukan sebagai catatan teks pada penghalang itu sendiri. Anotasi tersebut bukan dekorasi; itu adalah instruksi untuk insinyur tata letak PCB, yang tidak dapat menyimpulkan milimeter jarak dari skema kecuali Anda menuliskannya.

```mermaid
flowchart LR
    A["AC mains<br/>fuse + filter"] --> B["Bridge rectifier"]
    B --> C["Bulk capacitor<br/>~325 V DC"]
    C --> D["Switching device"]
    D --> E["Transformer<br/>crosses barrier"]
    E --> F["Output rectifier"]
    F --> G["Output filter"]
    G --> H["Regulation<br/>feedback via optocoupler"]

    style E fill:#1e293b,stroke:#f59e0b,color:#fff
    style H fill:#1e293b,stroke:#22c55e,color:#fff
```

Perhatikan tegangan kapasitor bulk dalam rantai tersebut. Masukan 230 V RMS dityearahkan menjadi sekitar 325 V DC, dan masukan 120 V menjadi sekitar 170 V. Berikan anotasi nilai tersebut pada gambar di sebelah kapasitor. Angka inilah yang memberitahu semua pihak di bawahnya mengapa komponen 400 V dipasang di sana dan mengapa tidak ada yang menyentuh simpul tersebut dengan probe oscilloscope.

## Garis Tebal dan Garis Tipis

Pada skema, ketebalan garis tidak membawa makna listrik — kawat tipis dan kawat tebal adalah konduktor ideal yang setara. Tepat itulah mengapa konvensi ini bekerja: ketebalan bebas membawa *informasi*.

| Ketebalan garis | Digunakan untuk |
| :--- | :--- |
| **Tebal** | Setiap jalur yang membawa arus signifikan: rail, simpul switching, pengembalian ground, umpan motor dan beban |
| **Normal** | Sinyal umum dan koneksi kontrol |
| **Tipis atau putus-putus** | Jalur sensing, titik umpan balik, koneksi pengujian yang tidak membawa arus nyata |

Tandakan arus pada jalur tebal sebagai anotasi teks — `5 A max` di sebelah rail tidak menghabiskan biaya apa pun dan memberitahu insinyur tata letak seberapa lebar tembaga harus dibuat. Dalam catu daya switching, tandakan juga **simpul switching**, titik yang bergerak antara rail masukan dan ground pada frekuensi switching. Itu adalah simpul paling bising dalam sirkuit, dan menandainya pada skema adalah cara Anda menyampaikan "jaga jalur net ini tetap pendek" sebelum tata letak dimulai.

## Simbol Transformator

Simbol transformator adalah dua kumparan yang menghadap satu sama lain dengan garis inti di antara mereka. Tiga detail memisahkan simbol transformator yang baik dari yang buram:

**Jenis inti ditunjukkan oleh garis antara kumparan.** Dua garis sejajar berarti inti feromagnetik. Tanpa gari berarti inti udara. Gambarkan mereka, karena pembaca harus dapat membedakan transformator listrik dari transformator kopling RF tanpa nomor bagian.

**Titik fase menentukan polaritas.** Sebuah titik di salah ujung setiap kumparan berarti kedua ujung tersebut bersama-sama menjadi positif. Dalam konverter flyback, sekunder dengan sengaja dililitkan dalam *fase anti*, dan satu-satunya hal pada gambar yang menyampaikan hal itu adalah peletakan titik. Jika melewatkan titik pada flyback, sirkuit yang dibangun tidak akan berfungsi, jadi ini bukan pilihan gaya.

**Trape dibuat secara eksplisit.** Sekunder center-tap menunjukkan trape sebagai kawat yang keluar dari titik tengah kumparan. Satu garis itulah seluruh perbedaan antara catu daya rail ganda dan catu daya rail tunggal.

Orientasikan transformator secara vertikal, primer di kiri inti dan sekunder di kanan, sehingga garis inti mendarat langsung pada penghalang isolasi Anda. Ketika penghalang melewati inti, gambaran tersebut menyatakan tujuan desain tanpa satu kata pun teks.

## Penyearah Jembatan

Gambarkan penyearah jembatan sebagai **berlian empat dioda**, bukan empat dioda yang tersebar di seluruh lembar. Berlian tersebut langsung dikenali dan membuat jalur arus dapat dilacak: dua simpul AC saling berhadapan, DC positif berhadapan dengan DC negatif, dan setiap dioda menunjuk ke arah yang sama di sekitar loop.

Dua orientasi yang dapat diterima ada. AC pada sudut kiri dan kanan dengan DC positif di atas dan negatif di bawah adalah yang paling umum. AC pada atas dan bawah dengan DC di kiri dan kanan juga terbaca dengan baik dan sering menghasilkan lebih sedikit persilangan kawat ketika transformator berada di sebelah kiri.

Satu persilangan pada dasarnya tidak dapat dihindari dalam jembatan — kawat AC kedua harus mencapai sudut yang jauh. Gambarkan sebagai persilangan bersih tanpa titik sambungan, jauhkan dari simbol lain, dan itu akan terbaca sebagai disengaja. Untuk jembatan **terbungkus** seperti seri KBP atau DB, menggambar sebuah persegi panjang dengan pin `~`, `~`, `+` dan `−` sepenuhnya sah dan sering lebih jelas, karena itulah bagian aktualnya: satu komponen, bukan empat.

Anotasi nomor bagian dioda dan kebutuhan tegangan balik puncak. Dalam jembatan listrik, dioda melihat tegangan masukan puncak penuh, dan menulis `1N4007, 1000 V` pada gambar mencegah seseorang menggantinya dengan 1N4148 saat kekurangan pasokan.

## Kapasitor Filter

Kapasitor reservoir setelah penyearah adalah tempat terjadinya dua kesalahan penggambaran secara konsisten.

**Polaritas.** Gunakan simbol kapasitor terpolarisasi — satu pelat lurus, satu pelat melengkung — dengan pelat lurus mengarah ke rail positif dan tanda `+` eksplisit di sebelahnya. Jangan pernah menggunakan simbol dua garis lurus tanpa polaritas untuk elektrolitik. Kapasitor elektrolitik terbalik pada rail 325 V adalah kegagalan yang benar-benar keras.

**Tegangan dinilai pada gambar.** `2200µF 35V` adalah anotasi lengkap; `2200µF` bukan. Nilai tersebut adalah keputusan desain yang diturunkan dari puncak yang dityearahkan, bukan detail pembelian, sehingga layak ada di skema.

Gambarkan kapasitor reservoir segera setelah jembatan dengan jalur pendek dan langsung ke rail positif dan pengembalian ground. Dalam catu daya switching, loop tersebut — kapasitor bulk, switch, dan pengembalian — adalah loop arus tinggi, dan menggambarnya rapat dan tertutup pada skema adalah cara Anda memberitahu insinyur tata letak untuk menjaganya tetap rapat dalam tembaga.

Tambahkan kapasitor frekuensi tinggi kecil secara paralel dengan elektrolitik bulk, digambar di sebelahnya. Elektrolitik memiliki terlalu banyak induktansi untuk menangani arus frekuensi switching; keramik di sebelahnya melakukannya. Menampilkan keduanya, berdampingan, mencatat niat tersebut.

## Sirkuit Regulator Tegangan

Keluarga 78xx masih merupakan cara tercepat untuk mendapatkan rail bersih, dan blok skemanya sederhana: sebuah persegi panjang dengan masukan di kiri, keluaran di kanan, dan ground di bawah.

| Detail | 78xx regulator positif | 79xx regulator negatif |
| :--- | :--- | :--- |
| **TO-220 pin 1** | Masukan | Ground |
| **TO-220 pin 2** | Ground | Masukan |
| **TO-220 pin 3** | Keluaran | Keluaran |
| **Kapasitor masukan tipikal** | 0.33 µF | 2.2 µF |
| **Kapasitor keluaran tipikal** | 0.1 µF | 1 µF |

Pemetaan pin **tidak** sama, yang merupakan kesalahan paling umum dalam desain rail ganda. Seseorang menggambar 7912 dengan urutan pin yang sama dengan 7812 di sebelahnya, papan dibangun, dan rail negatif mati. Tulis nomor pin pada kedua simbol dan periksa terhadap datasheet setiap kali.

Tiga anotasi lagi yang layak ada pada regulator linear:

- **Dropout.** 7805 membutuhkan sekitar 2 V headroom, jadi masukan harus tetap di atas sekitar 7 V *termasuk lekuk ripple*. Catat tegangan masukan minimum pada gambar.
- **Dissipasi.** Daya yang terbuang adalah `(Vin − Vout) × I`. 7805 yang menurunkan 12 V menjadi 5 V pada 500 mA mendissipasi 3.5 W dan membutuhkan heatsink. Itu adalah catatan tingkat skema, karena menentukan jenis paket.
- **Kapasitor masukan dan keluaran berdekatan dengan pin yang dilayaninya**, persis seperti decoupling IC. Regulator tanpa kapasitor masukan bergetar, dan menggambar kapasitor dua inci jauhnya di sudut adalah cara kapasitor tersebut tertinggal dari papan.

Untuk **catu daya ganda 12V**, tata letak mengikuti konvensi tegangan vertikal secara ketat: rail `+12V` di atas lembar, ground di tengah, dan `−12V` di bawah. Transformator center-tap memberi makan jembatan, center tap menjadi ground, dan kedua rail keluar dari sudut positif dan negatif jembatan ke 7812 dan 7912 masing-masing. Digambar dengan cara ini, simetri terlihat jelas dan koneksi yang hilang akan terlihat jelas.

## Sirkuit SMPS dan Konverter Buck

Catu daya switching menggantikan panas regulator linear dengan switch, induktor, dan loop kontrol. Skema harus membuat tahapan daya dan loop kontrol terpisah secara visual, karena keduanya berperilaku sangat berbeda.

**Gambarkan tahapan daya sebagai loop tertutup.** Untuk **konverter buck DC-DC**: kapasitor masukan, switch high-side, induktor, kapasitor keluaran, dan jalur low-side — baik dioda tangkap atau MOSFET sinkron. Jaga agar kelima komponen ini berdekatan secara fisik di lembar, membentuk persegi panjang yang ringkas. Tegangan keluaran ditetapkan oleh duty cycle, `Vout ≈ D × Vin`, sehingga berikan anotasi rentang duty yang diinginkan dan frekuensi switching pada gambar.

**Gambarkan loop kontrol sebagai garis tipis.** Pembagi umpan balik dari keluaran kembali ke pin `FB` controller membawa arus mikroampere. Menggambarnya tipis, dan merutekannya dengan jelas menjauh dari simpul switching, menyampaikan batasan tata letak paling penting dalam seluruh sirkuit.

**Tandai loop panas.** Tambahkan catatan teks atau garis putus-putus di sekitar kapasitor masukan dan kedua switch. Loop tersebut membawa puncak arus switching, dan itu adalah penyebab utama kegagalan EMI. Loop ini juga tidak terlihat kecuali Anda menandainya.

**SMPS 12V dari listrik** adalah flyback: jembatan dan kapasitor bulk di primer, MOSFET yang melakukan switching pada primer transformator, penyearah cepat dan kapasitor keluaran di sekunder, dan umpan balik dari keluaran kembali ke controller primer melalui optocoupler dan referensi TL431. Pada gambar, optocoupler adalah komponen kedua yang diizinkan melewati penghalang, dan menggambarnya melintasi garis — sisi LED di sekunder, sisi transistor di primer — membuat jalur umpan balik terisolasi menjadi tidak ambigu.

Jaringan snubber dan clamp catu daya switching juga layak dianotasi. Clamp RCD di seluruh primer terlihat seperti tiga komponen sewenang-wenang kecuali Anda memberi label blok `PRIMARY CLAMP` dan mencatat energi kebocoran yang diserapnya.

## Catu Daya Tanpa Transformator

Catu daya capacitive-dropper menggantikan transformator dengan kapasitor berperingkat X seri dengan listrik. Catu daya ini kecil, murah, dan **tidak terisolasi** — setiap simpul dalam sirkuit, termasuk apa yang Anda beri label "ground", berada pada potensial listrik.

Skema harus menyatakan ini. Konvensi yang penting:

- **Jangan menggambar simbol ground bumi di mana pun dalam sirkuit.** Gunakan simbol common mengambang dan beri nama net `COM` atau `MAINS_RTN`, jangan pernah `GND` atau `EARTH`.
- **Tambahkan catatan bahaya dalam kotak** pada lembar: tidak ada isolasi galvanik, tidak ada peralatan pengujian dengan ground bumi, tidak ada koneksi yang dapat diakses pengguna.
- **Tunjukkan kapasitor seri X-nya** (`X1` atau `X2`) dan nilai tegangan. Kapasitor film serbaguna di posisi itu adalah kebakaran.
- **Tunjukkan resistor bleeder** di seluruh kapasitor X dan resistor seri pembatas arus masuk. Keduanya adalah komponen keamanan, bukan aksesori opsional.
- **Tunjukkan zener atau regulator shunt** yang menetapkan keluaran, plus kapasitor reservoir.

Karena seluruh sirkuit mengambang pada potensial listrik, catu daya tanpa transformator adalah satu-satunya skema di mana Anda harus memberikan anotasi tentang apa yang *tidak boleh* dihubungkan. Ini tidak biasa untuk diagram sirkuit, dan tepat di sini.

## Inverter: Menuju Arah Berlawanan

**Sirkuit inverter gelombang sinus** menjalankan rantai secara terbalik — DC tegangan rendah ke AC tegangan tinggi — dan konvensi penggambarannya ikut terbalik. Sisi baterai tegangan rendah di kiri, transformator di tengah, dan output AC tegangan tinggi di kanan, dengan penghalang kembali melalui inti transformator.

Tahapan switching adalah pasangan push-pull yang menggerakkan primer center-tap atau jembatan H penuh yang menggerakkan primer biasa. Gambar jembatan H sebagai huruf H yang sebenarnya — dua switch atas, dua switch bawah, beban di tengah — karena bentuknya adalah penjelasannya. Tambahkan catatan dead-time di sebelah blok gate drive: jika kedua switch dalam satu kaki mengkonduksi secara bersamaan, mereka menghubung singkat catu daya, dan batasan itu hidup di skema sebagai catatan teks karena tidak ada simbol yang menyatakannya.

Untuk desain SPWM, gambarkan modulator sebagai blok berlabel dengan input dan output yang dinamai daripada memperluas setiap komparator. Satu lembar, satu fungsi: modulator mendapat lembar sendiri jika membutuhkannya. Contoh kerja kami dari seluruh rantai ada di [panduan diagram sirkuit 12V ke 220V AC](/blog/how-to-make-12v-to-220v-ac-circuit-diagram/).

## Daftar Periksa Skema Catu Daya

1. Penghalang isolasi digambar sebagai garis setinggi penuh, dengan hanya transformator, optocoupler, dan kapasitor Y yang melewatinya.
2. Kedua sisi diberi label dengan tegangan dan kelas bahayanya.
3. Persyaratan creepage dan clearance dicatat sebagai teks pada penghalang.
4. Garis inti transformator dan titik fase ada.
5. Jembatan digambar sebagai berlian atau persegi panjang terbungkus, dengan PIV dioda dianotasi.
6. Setiap elektrolitik digambar dengan simbol terpolarisasi, `+` ditandai, dan nilai tegangan.
7. Nomor pin regulator ditulis pada simbol dan diverifikasi terhadap datasheet.
8. Dropout, dissipasi, dan tegangan masukan minimum dicatat.
9. Kapasitor masukan dan keluaran digambar berdekatan dengan pin yang dilayaninya.
10. Jalur arus tinggi digambar tebal, dengan arus dianotasi.
11. Jalur umpan balik dan sensing digambar tipis dan dirutekan menjauh dari simpul switching.
12. Simpul switching dan loop panas secara eksplisit ditandai.
13. Sekring dan nilainya pada masukan, selalu.

> Skema catu daya dibaca oleh orang-orang yang akan memasukkan tangan mereka ke dalam perangkat yang selesai. Setiap anotasi di atas ada sehingga pembaca dapat mengetahui, tanpa mengukur apa pun, bagian sirkuit mana yang akan menyakiti mereka.

**[Mulai menggambar skema Anda sendiri sekarang.](/editor/)** Transformator, penyearah jembatan, kapasitor terpolarisasi, blok 78xx, dan switch MOSFET semuanya ada di perpustakaan, dan Anda dapat mengatur ketebalan garis untuk menandai jalur arus tinggi seperti yang dijelaskan panduan ini. Setelah catu daya digambar, beban yang menggantung darinya — [tahapan switching dan proteksi MOSFET](/blog/sensor-and-protection-circuit-diagrams/) dan [pohon daya mikrokontroler](/blog/microcontroller-circuit-diagrams/) — dibahas dalam panduan pendamping.