// List of preset assistants for MudahPrompt
// Shared between prompt assistant and landing page

const presetAssistants = [
  {
    id: "whatsapp-reply",
    title: "💬 Pembalas WhatsApp Panjang",
    description: "Auto generate reply bila orang marah / bertanya / nak refund / puji kita.",
    fields: [
      {
        name: "Situasi",
        description: "Situasi yang berlaku dengan pelanggan",
        example: "cth., Pelanggan marah lambat reply, Nak refund barang, Puji produk kita"
      },
      {
        name: "Gaya",
        description: "Gaya dan nada jawapan yang dikehendaki",
        example: "cth., Profesional + tenang, Mesra pelanggan, Sopan dan yakin"
      },
      {
        name: "Jenis Perniagaan",
        description: "Jenis perniagaan atau perkhidmatan anda",
        example: "cth., Peniaga kecil, Customer service, Agent dropship"
      },
      {
        name: "Maklumat Tambahan",
        description: "Maklumat tambahan yang perlu disertakan",
        example: "cth., Polisi refund, Masa operasi, Nombor telefon"
      }
    ],
    template: `Tulis jawapan WhatsApp yang professional untuk situasi ini:

Situasi: [situasi]
Gaya: [gaya]
Jenis Perniagaan: [jenisperniagaan]
Maklumat Tambahan: [maklumattambahan]

Panduan:
- Mulakan dengan salam dan pengakuan situasi
- Gunakan nada [gaya] yang sesuai untuk [jenisperniagaan]
- Berikan penyelesaian yang jelas dan praktikal
- Sertakan [maklumattambahan] jika relevan
- Akhiri dengan terima kasih dan harapan untuk terus berurusan
- Kekalkan profesionalisme walaupun dalam situasi sukar
- Gunakan bahasa yang mudah difahami dan mesra

Format jawapan dengan salam, kandungan utama, dan penutup yang sopan.`
  },
  {
    id: "concept-explainer",
    title: "🧠 Penjelasan Konsep Sukar dengan Gaya Mudah",
    description: "Contoh: Topik: Blockchain — Gaya: Macam ajar budak sekolah rendah",
    fields: [
      {
        name: "Topik",
        description: "Konsep atau topik yang perlu dijelaskan",
        example: "cth., Blockchain, Cryptocurrency, AI, Machine Learning"
      },
      {
        name: "Gaya",
        description: "Gaya penjelasan yang dikehendaki",
        example: "cth., Macam ajar budak sekolah rendah, Santai seperti TikTok, Formal tapi mudah"
      },
      {
        name: "Audience Sasaran",
        description: "Siapa yang akan baca penjelasan ini",
        example: "cth., Student, Orang awam, TikTok content explainer"
      },
      {
        name: "Panjang",
        description: "Berapa panjang penjelasan yang dikehendaki",
        example: "cth., 2-3 perenggan, 1 halaman, Bullet points sahaja"
      }
    ],
    template: `Jelaskan konsep sukar dengan gaya yang mudah difahami:

Topik: [topik]
Gaya: [gaya]
Audience Sasaran: [audiencesasaran]
Panjang: [panjang]

Panduan:
- Mulakan dengan analogi atau contoh yang mudah difahami
- Gunakan bahasa [gaya] yang sesuai untuk [audiencesasaran]
- Elakkan jargon teknikal, guna perkataan biasa
- Sertakan contoh praktikal atau situasi harian
- Buat perbandingan dengan benda yang biasa
- Pastikan penjelasan [panjang] dan tidak terlalu panjang
- Akhiri dengan ringkasan yang mudah diingat

Format penjelasan dengan pengenalan, kandungan utama, dan kesimpulan yang jelas.`
  },
  {
    id: "instagram-caption",
    title: "📷 Penulis Caption Instagram",
    description: "Contoh: Gambar: Travel ke Langkawi — Gaya: Lucu dan chill",
    fields: [
      {
        name: "Jenis Gambar",
        description: "Jenis gambar atau kandungan yang dipost",
        example: "cth., Travel ke Langkawi, Makanan, Selfie, Produk"
      },
      {
        name: "Gaya",
        description: "Gaya dan mood caption yang dikehendaki",
        example: "cth., Lucu dan chill, Professional, Inspirasi, Santai"
      },
      {
        name: "Audience",
        description: "Siapa yang akan baca caption ini",
        example: "cth., Rakan-rakan, Pelanggan, Followers Instagram"
      },
      {
        name: "Mesej Utama",
        description: "Mesej utama yang mahu disampaikan",
        example: "cth., Promosi produk, Kongsi pengalaman, Hibur followers"
      }
    ],
    template: `Tulis caption Instagram yang menarik untuk gambar ini:

Jenis Gambar: [jenisgambar]
Gaya: [gaya]
Audience: [audience]
Mesej Utama: [mesejutama]

Panduan:
- Mulakan dengan hook yang menarik perhatian
- Gunakan gaya [gaya] yang sesuai untuk [audience]
- Sertakan emoji yang relevan dengan [jenisgambar]
- Buat caption yang relatable dan engaging
- Sampaikan [mesejutama] dengan cara yang natural
- Gunakan hashtag yang relevan (3-5 hashtag)
- Akhiri dengan call-to-action yang sesuai
- Pastikan panjang sesuai untuk Instagram (tidak terlalu panjang)

Format caption dengan hook, kandungan utama, hashtag, dan call-to-action.`
  },
  {
    id: "resume-interview",
    title: "📄 Penulis Resume & Jawapan Temuduga",
    description: "Contoh: Jawatan dipohon: Marketing Exec — Gaya: Yakin + sopan",
    fields: [
      {
        name: "Jawatan Dipohon",
        description: "Jawatan yang anda mohon",
        example: "cth., Marketing Executive, Software Engineer, Sales Manager"
      },
      {
        name: "Gaya",
        description: "Gaya dan nada yang dikehendaki",
        example: "cth., Yakin + sopan, Professional, Bersemangat"
      },
      {
        name: "Pengalaman",
        description: "Pengalaman kerja atau pendidikan yang relevan",
        example: "cth., 2 tahun dalam digital marketing, Fresh graduate, 5 tahun dalam sales"
      },
      {
        name: "Kemahiran Utama",
        description: "Kemahiran utama yang relevan dengan jawatan",
        example: "cth., Digital marketing, Leadership, Communication, Technical skills"
      }
    ],
    template: `Tulis resume atau jawapan temuduga yang professional:

Jawatan Dipohon: [jawatandipohon]
Gaya: [gaya]
Pengalaman: [pengalaman]
Kemahiran Utama: [kemahiranutama]

Panduan:
- Mulakan dengan ringkasan yang menarik dan relevan
- Gunakan gaya [gaya] yang menunjukkan keyakinan
- Highlight [kemahiranutama] yang sesuai untuk [jawatandipohon]
- Sertakan pencapaian konkrit dan measurable
- Gunakan action verbs yang kuat
- Pastikan format yang kemas dan mudah dibaca
- Akhiri dengan objektif kerjaya yang jelas
- Sesuai untuk student & jobseeker

Format resume dengan ringkasan, pengalaman, kemahiran, dan objektif yang jelas.`
  },
  {
    id: "shopee-seller",
    title: "🛒 Penjual Shopee – Jawapan Chat Pelanggan",
    description: "Contoh: Pelanggan tanya: Barang ni ready stock ke?",
    fields: [
      {
        name: "Soalan Pelanggan",
        description: "Soalan atau pertanyaan dari pelanggan",
        example: "cth., Barang ni ready stock ke?, Boleh nego harga tak?, Bila sampai?"
      },
      {
        name: "Jenis Produk",
        description: "Jenis produk yang dijual",
        example: "cth., Pakaian, Elektronik, Makanan, Kecantikan"
      },
      {
        name: "Gaya Jawapan",
        description: "Gaya jawapan yang dikehendaki",
        example: "cth., Mesra pelanggan + cepat + info lengkap, Professional, Santai"
      },
      {
        name: "Maklumat Penting",
        description: "Maklumat penting yang perlu disertakan",
        example: "cth., Stock status, Harga, Masa penghantaran, Warranty"
      }
    ],
    template: `Tulis jawapan chat Shopee yang mesra pelanggan:

Soalan Pelanggan: [soalanpelanggan]
Jenis Produk: [jenisproduk]
Gaya Jawapan: [gayajawapan]
Maklumat Penting: [maklumatpenting]

Panduan:
- Mulakan dengan salam dan terima kasih atas pertanyaan
- Berikan jawapan yang [gayajawapan] untuk [jenisproduk]
- Sertakan [maklumatpenting] yang relevan
- Gunakan bahasa yang mesra dan professional
- Berikan maklumat yang lengkap dan tepat
- Akhiri dengan terima kasih dan harapan untuk jualan
- Kekalkan nada positif dan membantu

Format jawapan dengan salam, maklumat lengkap, dan penutup yang mesra.`
  },
  {
    id: "study-notes",
    title: "🎓 Ringkasan Nota Sekolah / IPTA",
    description: "Contoh: Topik: Prinsip Akaun Bab 3",
    fields: [
      {
        name: "Topik",
        description: "Topik atau subjek yang perlu diringkaskan",
        example: "cth., Prinsip Akaun Bab 3, Matematik Tambahan, Sejarah"
      },
      {
        name: "Jenis Nota",
        description: "Jenis nota atau bahan yang perlu diringkaskan",
        example: "cth., Bab buku teks, Kuliah, Tutorial, Assignment"
      },
      {
        name: "Gaya Ringkasan",
        description: "Gaya ringkasan yang dikehendaki",
        example: "cth., Bullet point, Mind map, Flow chart, Perenggan"
      },
      {
        name: "Objektif",
        description: "Objektif ringkasan ini",
        example: "cth., Mudah faham, Boleh hafal, Untuk exam, Untuk presentation"
      }
    ],
    template: `Ringkaskan nota pembelajaran dengan format yang mudah difahami:

Topik: [topik]
Jenis Nota: [jenisnota]
Gaya Ringkasan: [gayaringkasan]
Objektif: [objektif]

Panduan:
- Mulakan dengan konsep utama dan definisi penting
- Gunakan format [gayaringkasan] yang sesuai untuk [objektif]
- Highlight poin-poin utama dan formula penting
- Sertakan contoh atau aplikasi praktikal
- Buat ringkasan yang mudah faham dan boleh hafal
- Kekalkan struktur yang logik dan tersusun
- Akhiri dengan ringkasan atau kesimpulan utama
- Boleh tarik student untuk belajar dengan lebih efektif

Format ringkasan dengan pengenalan, kandungan utama, dan kesimpulan yang jelas.`
  },
  {
    id: "content-ideas",
    title: "🎥 Penjana Idea Content Harian",
    description: "Contoh: Niche: Kesihatan wanita — Platform: TikTok — Gaya: Storytelling",
    fields: [
      {
        name: "Niche",
        description: "Niche atau bidang kandungan",
        example: "cth., Kesihatan wanita, Perniagaan, Teknologi, Pendidikan"
      },
      {
        name: "Platform",
        description: "Platform yang akan digunakan",
        example: "cth., TikTok, Instagram, YouTube, LinkedIn"
      },
      {
        name: "Gaya",
        description: "Gaya kandungan yang dikehendaki",
        example: "cth., Storytelling, Educational, Entertainment, Motivational"
      },
      {
        name: "Audience",
        description: "Audience sasaran",
        example: "cth., Wanita 18-35, Usahawan, Pelajar, Profesional"
      }
    ],
    template: `Jana idea content harian yang menarik untuk platform ini:

Niche: [niche]
Platform: [platform]
Gaya: [gaya]
Audience: [audience]

Panduan:
- Jana 5 idea content yang berbeza untuk seminggu
- Setiap idea mesti sesuai untuk [platform] dan [gaya]
- Fokus pada [niche] yang menarik untuk [audience]
- Sertakan format content yang sesuai (video, post, story)
- Buat idea yang trending dan boleh viral
- Pastikan idea praktikal dan boleh dihasilkan
- Sertakan hook atau angle yang menarik
- Boleh tarik creator kecil & influencer baru

Format idea dengan tajuk, konsep, format, dan angle yang jelas untuk setiap idea.`
  }
];

export default presetAssistants; 