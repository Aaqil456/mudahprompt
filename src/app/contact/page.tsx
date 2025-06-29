'use client'

import { useState } from 'react'
import styles from './contact.module.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.landingBg}></div>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>Hubungi Kami</h1>
          <p className={styles.subtitle}>
            Ada soalan atau cadangan? Kami sedia membantu anda!
          </p>
          
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📧</div>
              <div>
                <h3>Email</h3>
                <p>aautomate123@gmail.com</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>⏰</div>
              <div>
                <h3>Masa Respons</h3>
                <p>24-48 jam pada hari bekerja</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nama Penuh *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama penuh anda"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Masukkan email anda"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subjek *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="">Pilih subjek</option>
                <option value="General Inquiry">Soalan Umum</option>
                <option value="Technical Support">Sokongan Teknikal</option>
                <option value="Feature Request">Cadangan Ciri</option>
                <option value="Bug Report">Laporan Bug</option>
                <option value="Partnership">Perkongsian</option>
                <option value="Other">Lain-lain</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Mesej *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tulis mesej anda di sini..."
                rows={6}
                className={styles.textarea}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Menghantar...' : 'Hantar Mesej'}
            </button>

            {submitStatus === 'success' && (
              <div className={styles.successMessage}>
                ✅ Mesej anda telah dihantar! Kami akan membalas dalam masa 24-48 jam.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className={styles.errorMessage}>
                ❌ Ralat menghantar mesej. Sila cuba lagi atau hantar email terus ke aautomate123@gmail.com
              </div>
            )}
          </form>

          <div className={styles.faqSection}>
            <h2>Soalan Lazim</h2>
            <div className={styles.faqItem}>
              <h3>Berapa lama masa untuk dapat respons?</h3>
              <p>Kami biasanya membalas dalam masa 24-48 jam pada hari bekerja.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Adakah MudahPrompt percuma?</h3>
              <p>Ya, MudahPrompt adalah percuma untuk digunakan. Kami disokong oleh iklan untuk mengekalkan perkhidmatan.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Boleh saya cadang ciri baru?</h3>
              <p>Ya! Kami sentiasa terbuka untuk cadangan. Pilih "Cadangan Ciri" dalam borang di atas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 