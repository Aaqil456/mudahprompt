'use client'

import Link from 'next/link'
import styles from './privacy-policy.module.css'

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      {/* Grid background */}
      <div className={styles.landingBg} />

      <div className={styles.robotCard} style={{ 
        margin: '2rem auto', 
        maxWidth: '800px',
        width: '90%',
        padding: '2rem'
      }}>
        <div style={{ 
          color: '#d1d5db', 
          fontFamily: 'var(--font-digital)', 
          lineHeight: '1.6',
          fontSize: '1rem'
        }}>
          <p>At MudahPrompt, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our web application.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
          <p>We collect only the minimum data required to operate the app effectively:</p>
          
          <h3 style={{ color: 'var(--neon-green)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>a. Authentication Data</h3>
          <p>When you sign in with Google, we receive your email address and basic profile info (e.g. name and avatar).</p>
          <p>This data is provided by Google via Supabase Auth.</p>
          
          <h3 style={{ color: 'var(--neon-green)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>b. User-Generated Content</h3>
          <p>If you create and save prompt templates, we store them in your account for your convenience.</p>
          <p>These prompts are only accessible by you and are not shared publicly unless explicitly stated.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
          <p>We use your information only to:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• Authenticate and manage your account</li>
            <li>• Save and retrieve your custom prompt builders (if you create them)</li>
            <li>• Improve your user experience</li>
          </ul>
          <p>We do not sell, share, or rent your data to third parties.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Storage & Security</h2>
          <p>All data is stored securely using Supabase, which complies with modern cloud security standards.</p>
          <p>We follow best practices to ensure your data remains safe.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>4. Your Control</h2>
          <p>You can:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• Sign out at any time</li>
            <li>• Request deletion of your data (email us at privacy@mudahprompt.com)</li>
            <li>• Edit or remove any custom prompts you have saved</li>
          </ul>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>5. Cookies</h2>
          <p>We do not use any tracking or advertising cookies. We only use essential cookies (if any) required for login sessions.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>6. Changes to This Policy</h2>
          <p>We may update this Privacy Policy as our app evolves. If changes are made, we will notify users through the app or by email (if applicable).</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>7. Contact Us</h2>
          <p>If you have any questions or concerns, please contact us at:</p>
          <p>📧 privacy@mudahprompt.com</p>
        </div>
      </div>
    </div>
  )
} 