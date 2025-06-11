'use client'

import Link from 'next/link'
import styles from './terms.module.css'

export default function Terms() {
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
          <p>Welcome to MudahPrompt. By using our service, you agree to these terms and conditions. Please read them carefully.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using MudahPrompt, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Service</h2>
          <p>MudahPrompt provides AI-powered prompt generation and management tools. You agree to:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• Use the service only for lawful purposes</li>
            <li>• Not misuse or attempt to manipulate the AI systems</li>
            <li>• Not use the service to generate harmful or malicious content</li>
            <li>• Respect intellectual property rights</li>
          </ul>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• Maintaining the security of your account</li>
            <li>• All activities that occur under your account</li>
            <li>• Notifying us immediately of any unauthorized use</li>
          </ul>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>4. Content Ownership</h2>
          <p>You retain ownership of any content you create using our service. However, you grant us a license to:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• Store and process your content</li>
            <li>• Use your content to improve our services</li>
            <li>• Display your content as part of the service</li>
          </ul>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>5. Service Limitations</h2>
          <p>We reserve the right to:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• Modify or discontinue the service at any time</li>
            <li>• Limit access to certain features</li>
            <li>• Refuse service to anyone for any reason</li>
          </ul>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>6. Disclaimer</h2>
          <p>Our service is provided "as is" without any warranties. We are not responsible for:</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li>• The accuracy of AI-generated content</li>
            <li>• Any loss of data or content</li>
            <li>• Service interruptions or technical issues</li>
          </ul>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>7. Changes to Terms</h2>
          <p>We may update these terms at any time. We will notify users of any material changes through the app or by email.</p>
          
          <h2 style={{ color: 'var(--neon-green)', marginTop: '2rem', marginBottom: '1rem' }}>8. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>📧 terms@mudahprompt.com</p>
        </div>
      </div>
    </div>
  )
} 