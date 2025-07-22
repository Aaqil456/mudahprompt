'use client'

import { useState, useRef } from 'react'
import styles from './contact.module.css'

interface ChatMessage {
  role: 'user' | 'bot'
  content: string
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Hai! Saya Chatbot MudahPrompt. Ada apa-apa soalan tentang web app ini? Tulis di bawah.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.filter(m => m.role !== 'bot').map(m => m.content)
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', content: data.reply || 'Maaf, saya tidak dapat menjawab soalan itu.' }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Ralat berlaku. Sila cuba lagi.' }])
    }
    setLoading(false)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) sendMessage()
  }

  return (
    <div className={styles.container}>
      <div className={styles.promptBg} />
      <div className={styles.contactCard}>
        <h1 className={styles.contactTitle}>Hubungi Kami</h1>
        <p className={styles.contactSubtitle}>
          Ada soalan atau cadangan? Tanya chatbot kami di bawah!
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📧</div>
              <div>
                <h3>Email</h3>
                <p>aautomate123@gmail.com</p>
              </div>
            </div>
              </div>
        <div className={styles.contactChatWindow}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                styles.contactChatBubble + ' ' + (msg.role === 'user' ? styles.contactChatBubbleUser : styles.contactChatBubbleBot)
              }
            >
              {msg.content}
            </div>
          ))}
          <div ref={chatEndRef} />
          </div>
        <div className={styles.contactChatInputBar}>
              <input
                type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Tulis soalan anda..."
            className={styles.contactChatInput}
            disabled={loading}
            autoFocus
          />
            <button 
            onClick={sendMessage}
            className={styles.contactChatSendButton}
            disabled={loading || !input.trim()}
            >
            {loading ? '...' : 'Hantar'}
            </button>
        </div>
      </div>
    </div>
  )
} 