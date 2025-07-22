"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./PromptAssistant.module.css";
import CustomPromptList from "./components/CustomPromptList";
import { assistantInstructions } from '@/lib/prompt-assistant/assistantInstructions';

// Queue system for handling AI requests
class RequestQueue {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing: boolean = false;
  private processingDelay: number = 1000; // 1 second delay between requests

  async add(request: () => Promise<void>) {
    return new Promise<void>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await request();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, this.processingDelay));
      }
    }
    this.isProcessing = false;
  }
}

const requestQueue = new RequestQueue();

interface PresetAssistant {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    name: string;
    description: string;
    example: string;
  }>;
  template: string;
}

interface CustomAssistant {
  id: string;
  title: string;
  description: string;
  fields: string[];
  field_descriptions: string[];
  field_examples: string[];
  template: string;
}

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
  },
  {
    id: "selling-thread-ig",
    title: "🧵 Penulis Thread Instagram Jualan Produk Sendiri",
    description: "Cipta thread Instagram gaya borak mamak untuk jual produk sendiri (digital/fizikal, ebook, kursus, dll.) secara direct.",
    fields: [
      {
        name: "Nama Produk",
        description: "Nama produk yang anda nak jual",
        example: "cth., Ebook Rahsia Bisnes, Kursus Canva, Baju Muslimah, Software Kewangan"
      },
      {
        name: "Jenis Produk",
        description: "Jenis produk (Digital/Fizikal)",
        example: "cth., Digital, Fizikal"
      },
      {
        name: "Kelebihan Produk",
        description: "3 sebab utama kenapa produk ini best",
        example: "cth., Mudah digunakan, Harga berbaloi, Support sepanjang tahun"
      },
      {
        name: "Harga",
        description: "Harga produk",
        example: "cth., RM49, RM199, RM99/bulan"
      },
      {
        name: "Audience Sasaran",
        description: "Siapa yang sesuai beli produk ni",
        example: "cth., Usahawan baru, Pelajar, Ibu bekerja, Freelancer"
      },
      {
        name: "Nada & Gaya",
        description: "Gaya penulisan yang anda nak (borak, santai, yakin, sarkastik)",
        example: "cth., Borak mamak, Santai, Yakin, Sarkastik"
      },
      {
        name: "Link Pembelian",
        description: "Link untuk pembelian produk anda",
        example: "cth., https://websiteanda.com/beli"
      }
    ],
    template: `Tulis thread Instagram gaya borak mamak untuk promosikan produk sendiri (bukan affiliate/Shopee). Fokus pada keunikan dan kelebihan produk, sesuai untuk jualan direct.\n\nNama Produk: [namaproduk]\nJenis Produk: [jenisproduk]\nKelebihan Produk: [kelebihanproduk]\nHarga: [harga]\nAudience Sasaran: [audiencesasaran]\nNada & Gaya: [nada&gaya]\nLink Pembelian: [linkpembelian]\n\nPanduan:\n- Mulakan dengan hook yang lucu, relatable atau menyindir manja\n- Ceritakan masalah yang biasa dihadapi audience dan kaitkan dengan produk\n- Highlight kelebihan utama produk dengan gaya [nada&gaya]\n- Nyatakan harga dan kenapa berbaloi\n- Akhiri dengan CTA santai dan letakkan link pembelian\n\nTulis 4–6 post pendek bergaya Threads (1–3 ayat per post), guna emoji dan gaya santai Malaysia.\n\nAkhir sekali, letakkan:\n👉 [linkpembelian]`
  },
  {
    id: "shopee-thread-ig",
    title: "🧵 Penulis Thread IG Shopee (2 Info Sahaja)",
    description: "Cipta thread Instagram Shopee hanya dengan info produk dan link komisen.",
    fields: [
      {
        name: "Info Produk",
        description: "Salin info produk dari Shopee (boleh copy paste terus)",
        example: "cth., Mesin Basuh Mini Portable, Cuci baju tanpa mesin besar, Jimat ruang, Harga RM59 – RM89"
      },
      {
        name: "Link Komisen",
        description: "Link komisen Shopee anda",
        example: "cth., https://shope.ee/xxxxxxx"
      }
    ],
    template: `Tulis thread Instagram gaya penceritaan santai untuk promosikan produk Shopee ini. Elakkan gaya terlalu kolokial, tapi kekalkan nada mesra dan mudah difahami.\n\nInfo Produk: [infoproduk]\nLink Komisen: [linkkomisen]\n\nPanduan:\n- Mulakan dengan ayat hook yang menarik dan relatable\n- Ceritakan kisah atau situasi yang menggambarkan keperluan atau kelebihan produk\n- Tekankan manfaat utama produk dengan cara yang jujur dan meyakinkan\n- Akhiri dengan ajakan sopan untuk mencuba dan letakkan link komisen\n\nTulis 3–5 post pendek bergaya Threads (1–2 ayat per post), guna emoji dan bahasa santai yang sopan.\n\nAkhir sekali, letakkan:\n👉 [linkkomisen]. Ingat gaya jualan mestilah soft sale dan secara jelas nyatakan masalah dan penyelesaian`
  }
];

export default function PromptAssistant() {
  const [selectedAssistant, setSelectedAssistant] = useState<PresetAssistant | null>(null);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isAssistingWithGemini, setIsAssistingWithGemini] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fieldsContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const [customInstruction, setCustomInstruction] = useState('');
  const [isLoadingInstruction, setIsLoadingInstruction] = useState(false);
  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [instructionSaved, setInstructionSaved] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!selectedAssistant) return;
    setIsLoadingInstruction(true);
    setInstructionSaved(false);
    fetch(`/api/assistant-instructions?assistantId=${selectedAssistant.id}`)
      .then(res => res.json())
      .then(data => {
        setCustomInstruction(
          data.instruction ||
          (selectedAssistant && assistantInstructions[selectedAssistant.id]) ||
          'Answer the following prompt directly and completely. Use the same language as the prompt. Return your answer as a single, clear response.'
        );
      })
      .finally(() => setIsLoadingInstruction(false));
  }, [selectedAssistant]);

  const handleGeneratePrompt = () => {
    if (selectedAssistant && Object.keys(fieldValues).length > 0) {
      let prompt = selectedAssistant.template;
      
      const fieldMappings: Record<string, string> = {};
      selectedAssistant.fields.forEach((field: any) => {
        const fieldKey = field.name.toLowerCase().replace(/\s+/g, '');
        fieldMappings[fieldKey] = fieldValues[field.name] || '';
      });

      Object.entries(fieldMappings).forEach(([key, value]) => {
        const placeholder = new RegExp(`\\[${key}\\]`, 'g');
        prompt = prompt.replace(placeholder, value);
      });

      setGeneratedPrompt(prompt);
      setIsEditing(false);
      // Save prompt history
      fetch('/api/save-prompt-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistantId: selectedAssistant.id,
          prompt: prompt,
        }),
      });
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const handleEditPrompt = () => {
    setIsEditing(true);
    setEditedPrompt(generatedPrompt);
  };

  const handleSaveEdit = () => {
    setGeneratedPrompt(editedPrompt);
    setIsEditing(false);
  };

  const handleGeminiAssist = async () => {
    const promptToSend = isEditing ? editedPrompt : generatedPrompt;
    if (!promptToSend || !selectedAssistant) return;

    setIsAssistingWithGemini(true);
    try {
      await requestQueue.add(async () => {
        const response = await fetch('/api/gemini-assist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            promptText: promptToSend, 
            assistantId: selectedAssistant.id,
            systemInstruction: customInstruction || "Answer the following prompt directly and completely. Use the same language as the prompt. Return your answer as a single, clear response."
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.revisedPrompt) {
          setGeminiAnswer(data.revisedPrompt);
        }
      });
    } catch (error) {
      console.error('Error asking Gemini for assistance:', error);
      alert('Failed to get assistance from Gemini. Please try again.');
    } finally {
      setIsAssistingWithGemini(false);
    }
  };

  const handleAssistantSelect = (assistant: any) => {
    setSelectedAssistant(assistant);
    setFieldValues({});
    setGeneratedPrompt("");
    setGeminiAnswer("");
    // Auto-scroll to fields container on both mobile and desktop after a short delay
      setTimeout(() => {
        const element = fieldsContainerRef.current;
        if (element) {
          const navbarHeight = 80; // Approximate navbar height
          const elementPosition = element.offsetTop - navbarHeight - 20; // 20px extra padding
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 150); // Slightly longer delay to ensure DOM is updated
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInstruction = () => {
    setIsEditingInstruction(true);
    setInstructionSaved(false);
  };

  const handleSaveInstruction = async () => {
    if (!selectedAssistant) return;
    setIsLoadingInstruction(true);
    await fetch('/api/assistant-instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistantId: selectedAssistant.id, instruction: customInstruction }),
    });
    setIsEditingInstruction(false);
    setIsLoadingInstruction(false);
    setInstructionSaved(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.promptBg} />
      
      <div className={styles.card}>
        <h1 className={styles.title}>Prompt Assistant</h1>
        
        <div className={styles.promptsGrid}>
              {presetAssistants.map((assistant) => (
            <div 
                  key={assistant.id}
              className={`${styles.promptCard} ${
                    selectedAssistant?.id === assistant.id ? styles.selected : ''
                  }`}
                  onClick={() => handleAssistantSelect(assistant)}
                >
              <h3 className={styles.promptTitle}>{assistant.title}</h3>
              <p className={styles.promptDescription}>{assistant.description}</p>
              <div className={styles.fields}>
                {assistant.fields.map((field) => (
                  <span key={field.name} className={styles.field}>
                    {field.name}
                  </span>
                ))}
              </div>
                    </div>
                  ))}
        </div>

        {selectedAssistant && (
          <>
            <h2 className={styles.selectedAssistantTitle}>{selectedAssistant.title}</h2>
            <div ref={fieldsContainerRef} className={styles.inputFields}>
              {selectedAssistant.fields.map((field: any) => (
                <div key={field.name} className={styles.field}>
                  <label className={styles.label}>{field.name}</label>
                  {field.description && (
                    <p className={styles.fieldDescription}>{field.description}</p>
                  )}
                  {field.example && (
                    <p className={styles.fieldExample}>{field.example}</p>
                  )}
                  <textarea
                    className={styles.textarea}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={`isikan ${field.name}...`}
                  />
                </div>
              ))}
            </div>

            <button 
              className={styles.button}
              onClick={handleGeneratePrompt}
              disabled={!selectedAssistant || Object.keys(fieldValues).length === 0}
            >
              Generate Prompt
            </button>

            {generatedPrompt && (
              <div className={styles.output}>
                <div className={styles.outputHeader}>
                  <h3 className={styles.outputTitle}>Generated Prompt</h3>
                  <div className={styles.outputActions}>
                    <button
                      className={styles.actionButton}
                      onClick={handleEditPrompt}
                    >
                      Edit
                    </button>
                    {isEditing && (
                      <button
                        className={styles.actionButton}
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    )}
                    <button
                      className={styles.actionButton}
                      onClick={handleCopyPrompt}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <textarea
                  className={`${styles.outputTextarea} ${isEditing ? styles.editing : ''}`}
                  value={isEditing ? editedPrompt : generatedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  readOnly={!isEditing}
                />
                <div className={styles.customInstructionArea}>
                  <label className={styles.label}><strong>Arahan Pembantu</strong></label>
                  <p className={styles.fieldDescription}>
                    Anda boleh ubah arahan ini untuk mempengaruhi cara AI menjawab. Arahan yang disimpan akan digunakan secara automatik untuk pembantu ini.
                  </p>
                  {isLoadingInstruction ? (
                    <p>Memuatkan arahan...</p>
                  ) : (
                    <>
                      <textarea
                        className={styles.textarea}
                        value={customInstruction}
                        onChange={e => setCustomInstruction(e.target.value)}
                        readOnly={!isEditingInstruction}
                        placeholder="Masukkan arahan khas untuk pembantu ini..."
                        rows={3}
                      />
                      <div className={styles.outputActions}>
                        {!isEditingInstruction ? (
                          <button className={styles.actionButton} onClick={handleEditInstruction}>
                            Edit Arahan
                          </button>
                        ) : (
                          <button className={styles.actionButton} onClick={handleSaveInstruction} disabled={isLoadingInstruction}>
                            Simpan Arahan
                          </button>
                        )}
                        {instructionSaved && <span className={styles.savedMessage}>Disimpan!</span>}
                        <button
                          className={styles.actionButton}
                          onClick={handleGeminiAssist}
                          disabled={isAssistingWithGemini}
                        >
                          {isAssistingWithGemini ? 'Menanya...' : 'Dapatkan Jawapan'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {geminiAnswer && (
                  <div className={styles.geminiAnswerArea}>
                    <h3 className={styles.outputTitle}>Jawapan AI</h3>
                    <textarea
                      className={styles.outputTextarea}
                      value={geminiAnswer}
                      readOnly
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 