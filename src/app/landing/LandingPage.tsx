'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import styles from './landing-page.module.css'
import { createClient } from '@/lib/supabase/client'
import presetAssistants from '@/lib/prompt-assistant/presetAssistants'

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

export default function LandingPage() {
  const router = useRouter()
  const [selectedAssistant, setSelectedAssistant] = useState<PresetAssistant | null>(null);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isAssistingWithGemini, setIsAssistingWithGemini] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const fieldsContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };
    checkAuth();
  }, [supabase]);

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

  const handleCardButtonClick = (assistantId: string) => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      // Optionally, you can pass the assistantId as a query param to auto-select it
      router.push('/prompt-assistant');
    }
  };

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
                  <div key={assistant.id} className={styles.promptCard}>
                    <h3 className={styles.promptTitle}>{assistant.title}</h3>
                    <p className={styles.promptDescription}>{assistant.description}</p>
                    <div className={styles.fields}>
                      {assistant.fields.map((field) => (
                        <span key={field.name} className={styles.field}>{field.name}</span>
                      ))}
                    </div>
                    <button
                      className={styles.ctaButton}
                      onClick={() => handleCardButtonClick(assistant.id)}
                    >
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