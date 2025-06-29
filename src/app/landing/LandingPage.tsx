'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import styles from './landing-page.module.css'
import { createClient } from '@/lib/supabase/client'

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

const presetAssistants = [
  {
    id: "cold-email",
    title: "Penulis Email Dingin",
    description: "Tulis email professional dengan CTA yang jelas",
    fields: [
      {
        name: "Jawatan Penerima",
        description: "Jawatan atau kedudukan orang yang anda email",
        example: "cth., Pengarah Pemasaran, CEO, Pengurus HR"
      },
      {
        name: "Industri",
        description: "Sektor perniagaan atau bidang yang mereka kerja",
        example: "cth., Teknologi, Kesihatan, E-dagang"
      },
      {
        name: "Masalah Utama",
        description: "Masalah atau cabaran utama yang mereka hadapi",
        example: "cth., Pengurangan pelanggan, Kos operasi tinggi"
      },
      {
        name: "Penyelesaian Anda",
        description: "Bagaimana produk/perkhidmatan anda selesaikan masalah mereka",
        example: "cth., Platform analitik AI yang kurangkan pengurangan pelanggan sebanyak 30%"
      },
      {
        name: "Tindakan Seterusnya",
        description: "Apa yang anda mahu mereka lakukan seterusnya",
        example: "cth., Jadual demo 15 minit, Muat turun kajian kes kami"
      },
      {
        name: "Nada",
        description: "Gaya dan mood keseluruhan email",
        example: "cth., Professional, Santai, Bersemangat"
      },
      {
        name: "Panjang",
        description: "Anggaran bilangan perkataan untuk email",
        example: "cth., 150-200 perkataan, 200-250 perkataan"
      }
    ],
    template: `Tulis email dingin yang professional dengan butiran berikut:

Jawatan Penerima: [jawatanpenerima]
Industri: [industri]
Masalah Utama: [masalahutama]
Penyelesaian Anda: [penyelesaiananda]
Tindakan Seterusnya: [tindakanseterusnya]
Nada: [nada]
Panjang: [panjang]

Panduan:
- Mulakan dengan hook yang peribadi yang tunjukkan anda telah buat penyelidikan
- Alamatkan masalah utama yang mereka hadapi
- Persembahkan penyelesaian anda sebagai yang sesuai untuk keperluan mereka
- Sertakan bukti sosial atau statistik yang relevan
- Akhiri dengan tindakan seterusnya yang jelas dan spesifik
- Kekalkan nada [nada] dan professional
- Kekalkan panjang kira-kira [panjang] perkataan

Format email dengan jarak dan struktur yang betul.`
  },
  {
    id: "youtube-summary",
    title: "Peringkas YouTube",
    description: "Ringkaskan video YouTube kepada 3 perenggan yang jelas",
    fields: [
      {
        name: "Topik Video",
        description: "Subjek atau tema utama video",
        example: "cth., Cara Mulakan Perniagaan, Asas Pembelajaran Mesin"
      },
      {
        name: "Poin Utama",
        description: "Idea utama atau pengajaran dari video",
        example: "cth., 1. Penyelidikan pasaran 2. Pelan perniagaan 3. Pilihan pembiayaan"
      },
      {
        name: "Audience Sasaran",
        description: "Siapa yang video ini ditujukan",
        example: "cth., Pemula, Profesional, Pelajar"
      },
      {
        name: "Gaya Ringkasan",
        description: "Betapa formal atau santai ringkasan sepatutnya",
        example: "cth., Akademik, Santai, Teknikal"
      },
      {
        name: "Sertakan Timestamp",
        description: "Sama ada untuk sertakan timestamp video",
        example: "cth., ya/tidak"
      }
    ],
    template: `Cipta ringkasan komprehensif video YouTube dengan butiran ini:

Topik Video: [topikvideo]
Poin Utama: [poinutama]
Audience Sasaran: [audiencesasaran]
Gaya Ringkasan: [gayaringkasan]
Sertakan Timestamp: [sertakantimestamp]

Panduan:
- Mulakan dengan gambaran ringkas topik utama video
- Bahagikan poin utama kepada bahagian yang jelas dan mudah difahami
- Highlight sebarang insight atau pengajaran yang boleh diambil tindakan
- Gunakan bahasa [gayaringkasan] yang sesuai untuk [audiencesasaran]
- [sertakantimestamp === 'ya' ? 'Sertakan timestamp yang relevan untuk saat-saat penting' : 'Fokus pada kandungan tanpa timestamp']
- Kekalkan nada professional namun menarik
- Pastikan ringkasan komprehensif tetapi ringkas

Format ringkasan dengan tajuk yang jelas dan bullet point di mana sesuai.`
  },
  {
    id: "social-hook",
    title: "Penjana Hook Media Sosial",
    description: "Jana hook yang menarik untuk post media sosial",
    fields: [
      {
        name: "Platform",
        description: "Platform media sosial yang anda post",
        example: "cth., Instagram, LinkedIn, Twitter"
      },
      {
        name: "Jenis Kandungan",
        description: "Jenis kandungan yang anda cipta",
        example: "cth., Pelancaran Produk, Panduan Cara, Kisah Kejayaan"
      },
      {
        name: "Audience Sasaran",
        description: "Siapa yang anda mahu capai dengan post anda",
        example: "cth., Usahawan, Profesional Teknologi, Peminat Kecergasan"
      },
      {
        name: "Nada",
        description: "Mood atau gaya hook anda",
        example: "cth., Lucu, Inspirasi, Pendidikan"
      },
      {
        name: "Mesej Utama",
        description: "Poin utama yang anda mahu sampaikan",
        example: "cth., Alat AI baru kami jimat 5 jam seminggu"
      },
      {
        name: "Gaya Hook",
        description: "Pendekatan untuk menarik perhatian",
        example: "cth., Soalan, Kisah, Statistik Mengejutkan"
      }
    ],
    template: `Jana hook media sosial yang menarik dengan spesifikasi ini:

Platform: [platform]
Jenis Kandungan: [jeniskandungan]
Audience Sasaran: [audiencesasaran]
Nada: [nada]
Mesej Utama: [mesejutama]
Gaya Hook: [gayahook]

Panduan:
- Cipta hook yang menarik perhatian dalam beberapa perkataan pertama
- Gunakan teknik [gayahook] (cth., soalan, kenyataan, kisah)
- Padankan nada dengan amalan terbaik [platform]
- Gabungkan emoji dan format yang relevan
- Pastikan hook membawa secara semula jadi kepada [mesejutama]
- Kekalkan bahasa yang sesuai untuk [audiencesasaran]
- Optimumkan untuk had aksara [platform] dan corak engagement

Jana 3 hook berbeza, setiap satu dengan pendekatan unik.`
  },
  {
    id: "blog-outline",
    title: "Penjana Outline Blog",
    description: "Strukturkan idea blog dengan outline yang lengkap",
    fields: [
      {
        name: "Tajuk Blog",
        description: "Tajuk atau topik utama artikel blog",
        example: "cth., Cara Tingkatkan Jualan Online, Tips Kesihatan Mental"
      },
      {
        name: "Audience Sasaran",
        description: "Siapa yang akan baca artikel ini",
        example: "cth., Usahawan, Pelajar, Ibu Bapa"
      },
      {
        name: "Objektif Artikel",
        description: "Apa yang anda mahu capai dengan artikel ini",
        example: "cth., Didik, Hibur, Jual, Bangunkan Authority"
      },
      {
        name: "Poin Utama",
        description: "Idea utama yang akan dibincangkan",
        example: "cth., 1. Definisi 2. Kepentingan 3. Cara Implementasi"
      },
      {
        name: "Gaya Penulisan",
        description: "Nada dan pendekatan artikel",
        example: "cth., Formal, Santai, Teknikal, Bercerita"
      },
      {
        name: "Panjang Artikel",
        description: "Anggaran bilangan perkataan",
        example: "cth., 500-800 perkataan, 1000-1500 perkataan"
      }
    ],
    template: `Cipta outline blog yang lengkap dengan butiran ini:

Tajuk Blog: [tajukblog]
Audience Sasaran: [audiencesasaran]
Objektif Artikel: [objektifartikel]
Poin Utama: [poinutama]
Gaya Penulisan: [gayapenulisan]
Panjang Artikel: [panjangartikel]

Panduan:
- Mulakan dengan pengenalan yang menarik dan relevan
- Bahagikan [poinutama] kepada bahagian yang logik dan tersusun
- Sertakan contoh, statistik, atau kisah yang menyokong setiap poin
- Pastikan flow yang natural dari satu bahagian ke bahagian seterusnya
- Akhiri dengan kesimpulan yang kuat dan call-to-action
- Gunakan gaya [gayapenulisan] yang sesuai untuk [audiencesasaran]
- Kekalkan panjang kira-kira [panjangartikel] perkataan

Format outline dengan tajuk bahagian, sub-bahagian, dan bullet point untuk poin-poin utama.`
  },
  {
    id: "product-description",
    title: "Penulis Deskripsi Produk",
    description: "Tulis deskripsi produk yang menjual",
    fields: [
      {
        name: "Nama Produk",
        description: "Nama produk yang anda jual",
        example: "cth., iPhone 14 Pro, Nike Air Max"
      },
      {
        name: "Jenis Produk",
        description: "Kategori produk",
        example: "cth., Telefon Pintar, Kasut Larian, Perisian"
      },
      {
        name: "Audience Sasaran",
        description: "Siapa yang akan beli produk ini",
        example: "cth., Peminat Teknologi, Atlet, Profesional"
      },
      {
        name: "Ciri Utama",
        description: "Ciri-ciri utama yang perlu dihighlight",
        example: "cth., Jangka hayat bateri, Kualiti kamera, Keselesaan"
      },
      {
        name: "Masalah Yang Diselesaikan",
        description: "Masalah yang produk ini selesaikan",
        example: "cth., Masa yang terbuang, Ketidakcekapan, Kos tinggi"
      },
      {
        name: "Nada",
        description: "Gaya dan mood deskripsi",
        example: "cth., Professional, Santai, Bersemangat"
      },
      {
        name: "Panjang",
        description: "Anggaran bilangan perkataan",
        example: "cth., 100-150 perkataan, 200-300 perkataan"
      }
    ],
    template: `Tulis deskripsi produk yang menjual dengan butiran ini:

Nama Produk: [namaproduk]
Jenis Produk: [jenisproduk]
Audience Sasaran: [audiencesasaran]
Ciri Utama: [cirutama]
Masalah Yang Diselesaikan: [masalahyangdiselesaikan]
Nada: [nada]
Panjang: [panjang]

Panduan:
- Mulakan dengan hook yang menarik perhatian
- Highlight [cirutama] yang paling penting
- Jelaskan bagaimana produk selesaikan [masalahyangdiselesaikan]
- Gunakan bahasa yang meyakinkan dan menarik
- Sertakan benefit yang jelas untuk [audiencesasaran]
- Kekalkan nada [nada] dan professional
- Akhiri dengan call-to-action yang kuat
- Kekalkan panjang kira-kira [panjang] perkataan

Format deskripsi dengan tajuk yang menarik, bullet point untuk ciri-ciri, dan kesimpulan yang meyakinkan.`
  },
  {
    id: "meeting-agenda",
    title: "Perancang Agenda Mesyuarat",
    description: "Rancang agenda mesyuarat yang produktif",
    fields: [
      {
        name: "Jenis Mesyuarat",
        description: "Jenis atau tujuan mesyuarat",
        example: "cth., Mesyuarat Projek, Brainstorming, Review Bulanan"
      },
      {
        name: "Tempoh Mesyuarat",
        description: "Berapa lama mesyuarat akan berlangsung",
        example: "cth., 30 minit, 1 jam, 2 jam"
      },
      {
        name: "Objektif Utama",
        description: "Apa yang perlu dicapai dalam mesyuarat",
        example: "cth., Buat keputusan, Kongsi kemajuan, Selesaikan masalah"
      },
      {
        name: "Peserta",
        description: "Siapa yang akan hadir",
        example: "cth., Pasukan Pemasaran, Pengurus Projek, CEO"
      },
      {
        name: "Topik Utama",
        description: "Topik utama yang akan dibincangkan",
        example: "cth., 1. Kemajuan Projek 2. Cabaran 3. Langkah Seterusnya"
      },
      {
        name: "Hasil Yang Diharapkan",
        description: "Apa yang diharapkan selepas mesyuarat",
        example: "cth., Keputusan yang jelas, Tindakan yang ditetapkan, Pelan yang disetujui"
      }
    ],
    template: `Rancang agenda mesyuarat yang produktif dengan butiran ini:

Jenis Mesyuarat: [jenismesyuarat]
Tempoh Mesyuarat: [tempohmesyuarat]
Objektif Utama: [objektifutama]
Peserta: [peserta]
Topik Utama: [topikutama]
Hasil Yang Diharapkan: [hasilyangdiharapkan]

Panduan:
- Mulakan dengan pengenalan dan objektif mesyuarat
- Bahagikan masa dengan bijak untuk setiap topik
- Sertakan masa untuk soalan dan perbincangan
- Pastikan setiap peserta faham tanggungjawab mereka
- Tetapkan masa yang jelas untuk setiap bahagian
- Akhiri dengan ringkasan dan tindakan seterusnya
- Pastikan agenda membawa kepada [hasilyangdiharapkan]

Format agenda dengan masa yang jelas, tanggungjawab yang ditetapkan, dan hasil yang diharapkan.`
  }
];

export default function LandingPage() {
  const router = useRouter()
  const [selectedAssistant, setSelectedAssistant] = useState<PresetAssistant | null>(null);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isAssistingWithGemini, setIsAssistingWithGemini] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fieldsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    if (!editedPrompt || !selectedAssistant) return;

    setIsAssistingWithGemini(true);
    try {
      await requestQueue.add(async () => {
        const response = await fetch('/api/gemini-assist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ promptText: editedPrompt, assistantId: selectedAssistant.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.revisedPrompt) {
          setEditedPrompt(data.revisedPrompt);
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
    
    // Auto-scroll to fields container on mobile after a short delay
    if (isMobile && fieldsContainerRef.current) {
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
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScrollToCTA = () => {
    const ctaSection = document.getElementById('sedia-nak-cuba');
    if (ctaSection) {
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition = ctaSection.offsetTop - navbarHeight - 20; // 20px extra padding
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCardButtonClick = async () => {
    if (isAuthenticated) {
      // User is logged in, redirect to prompt assistant page
      router.push('/prompt-assistant')
    } else {
      // User is not logged in, redirect to login page
      router.push('/login')
    }
  }

  return (
    <div className={styles.container}>
      {/* Grid background */}
      <div className={styles.landingBg} />

      <main className={styles.mainContent}>
        {/* Top Section */}
        <section className={styles.topSection}>
          <div className={styles.explanationBox}>
            <h2 className={styles.heroTitle}>GUNA CHATGPT TAPI HASIL TAK JADI?</h2>
            <div className={styles.neonText}>MUDAHPROMPT</div>
            <div className={styles.heroDesc}>
              <p>
                MudahPrompt bantu anda cipta prompt AI yang berkesan dengan templat yang tersusun dan cadangan masa nyata. Tak perlu lagi bergelut dengan AI yang tak faham apa yang anda mahu!
              </p>
              <button className={styles.ctaButton} onClick={handleScrollToCTA}>
                Cuba Sekarang - Percuma!
              </button>
            </div>
          </div>

          {/* Right: Robot Card */}
          <section className={styles.robotCard}>
            {/* AI Badge */}
            <div className={styles.aiBadge}>AI</div>
            
            {/* YouTube Video */}
            <iframe
              className={styles.robotImg}
              src="https://www.youtube.com/embed/aAVeOwPbqYw"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            
            {/* Card corners */}
            <div className={styles.cardCorners}>
              <div className={`${styles.corner} ${styles.tl}`}></div>
              <div className={`${styles.corner} ${styles.tr}`}></div>
              <div className={`${styles.corner} ${styles.bl}`}></div>
              <div className={`${styles.corner} ${styles.br}`}></div>
            </div>
          </section>
        </section>

        {/* Problem Section */}
        <section className={styles.problemSection}>
          <div className={styles.problemContainer}>
            <h2 className={styles.sectionTitle}>Masalah Biasa Guna AI</h2>
            <p className={styles.sectionSubtitle}>
              Anda pernah rasa macam ni tak? 🤔
            </p>
            <div className={styles.problemGrid}>
              <div className={styles.problemCard}>
                <div className={styles.problemIcon}>🤖</div>
                <h3>Hasil Terlalu Robotik</h3>
                <p>AI keluarkan jawapan yang kaku dan tak natural, tak macam manusia tulis</p>
              </div>
              <div className={styles.problemCard}>
                <div className={styles.problemIcon}>❓</div>
                <h3>Tak Tahu Macam Mana Nak Mula</h3>
                <p>Duduk depan ChatGPT tapi tak tahu apa nak tulis dalam prompt</p>
              </div>
              <div className={styles.problemCard}>
                <div className={styles.problemIcon}>⏰</div>
                <h3>Buang Masa Edit</h3>
                <p>Terpaksa edit berulang kali sampai dapat hasil yang betul</p>
              </div>
              <div className={styles.problemCard}>
                <div className={styles.problemIcon}>💸</div>
                <h3>Tak Dapat ROI</h3>
                <p>Belanja masa dan wang tapi hasil tak memuaskan hati</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.sectionTitle}>Apa MudahPrompt Tawarkan</h2>
            <p className={styles.sectionSubtitle}>
              Semua yang anda perlukan untuk cipta prompt AI yang berkesan
            </p>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📝</div>
                <h3>Pembina Prompt Tersusun</h3>
                <p>Ikut langkah demi langkah untuk cipta prompt yang lengkap dan berkesan</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💡</div>
                <h3>Cadangan Masa Nyata</h3>
                <p>bantuan dari AI untuk membuat prompt yang berkesan</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Hasil Natural & Manusiawi</h3>
                <p>AI yang faham konteks Malaysia dan keluarkan hasil yang natural</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className={styles.comparisonSection}>
          <div className={styles.comparisonContainer}>
            <h2 className={styles.sectionTitle}>ChatGPT Sahaja vs ChatGPT + MudahPrompt</h2>
            <p className={styles.sectionSubtitle}>
              Lihat perbezaannya bila guna ChatGPT dengan dan tanpa MudahPrompt
            </p>
            <div className={styles.comparisonTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Aspect</div>
                <div className={styles.tableCell}>ChatGPT Sahaja</div>
                <div className={styles.tableCell}>ChatGPT + MudahPrompt</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Masa Setup Prompt</div>
                <div className={styles.tableCell}>30-60 minit</div>
                <div className={styles.tableCell}>5-10 minit</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Kualiti Hasil ChatGPT</div>
                <div className={styles.tableCell}>Sederhana</div>
                <div className={styles.tableCell}>Tinggi & Konsisten</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Konteks Malaysia</div>
                <div className={styles.tableCell}>Terhad</div>
                <div className={styles.tableCell}>Dioptimumkan</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>Kemudahan Guna</div>
                <div className={styles.tableCell}>Perlu Pengalaman</div>
                <div className={styles.tableCell}>Mesra Pemula</div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className={styles.audienceSection}>
          <div className={styles.audienceContainer}>
            <h2 className={styles.sectionTitle}>Siapa Patut Guna MudahPrompt?</h2>
            <p className={styles.sectionSubtitle}>
              Platform ini sesuai untuk anda yang...
            </p>
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIcon}>🆕</div>
                <h3>Pemula AI</h3>
                <p>Baru nak cuba AI tapi tak tahu macam mana nak mula</p>
              </div>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIcon}>👑</div>
                <h3>Pemilik Brand</h3>
                <p>Nak content yang konsisten dan professional untuk brand</p>
              </div>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIcon}>📈</div>
                <h3>Marketer Sibuk</h3>
                <p>Tak ada masa nak duduk edit prompt berjam-jam</p>
              </div>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIcon}>🎨</div>
                <h3>Kreator Kandungan</h3>
                <p>Nak idea dan copy yang fresh untuk social media</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="sedia-nak-cuba" className={styles.finalCTASection}>
          <div className={styles.finalCTAContainer}>
            <h2 className={styles.finalCTATitle}>Sedia Nak Cuba?</h2>
            <p className={styles.finalCTASubtitle}>
              Cuba sekarang – tanpa pengalaman pun boleh! MudahPrompt bantu anda cipta prompt AI yang berkesan dalam masa singkat.
            </p>
            
            <div className={styles.assistantsPreview}>
              <h3 className={styles.assistantsTitle}>Pembantu Prompt Yang Tersedia:</h3>
              <div className={styles.promptsGrid}>
                {presetAssistants.slice(0, 3).map((assistant) => (
                  <div 
                    key={assistant.id}
                    className={styles.promptCard}
                  >
                    <h3 className={styles.promptTitle}>{assistant.title}</h3>
                    <p className={styles.promptDescription}>{assistant.description}</p>
                    <div className={styles.promptDetails}>
                      <p>
                        {assistant.id === "cold-email" && "Bantu anda tulis email yang professional dan menarik untuk prospek baru. Dapatkan template yang lengkap dengan hook yang menarik, penyelesaian masalah yang jelas, dan call-to-action yang berkesan."}
                        {assistant.id === "youtube-summary" && "Ringkaskan video YouTube yang panjang kepada 3 perenggan yang mudah difahami. Dapatkan poin-poin utama, insight yang berguna, dan timestamps untuk rujukan pantas."}
                        {assistant.id === "social-hook" && "Cipta hook yang menarik untuk post social media anda. Dapatkan pembuka yang mencengkam perhatian, sesuai dengan platform yang anda guna, dan sasarkan audience yang betul."}
                      </p>
                    </div>
                    <button className={styles.cardCTAButton} onClick={handleCardButtonClick}>
                      Cuba Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <p className={styles.finalCTANote}>
              Tiada kad kredit diperlukan • Daftar dalam 30 saat • Mulakan dengan templat percuma
            </p>
        </div>
        </section>
      </main>
    </div>
  )
} 