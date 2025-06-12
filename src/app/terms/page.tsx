'use client'

import styles from './terms.module.css'

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.landingBg}></div>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.lastUpdated}>Last Updated: March 2024</p>
          
          <div className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using MudahPrompt, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
          </div>

          <div className={styles.section}>
            <h2>2. Use of Service</h2>
            <p>You agree to use MudahPrompt only for lawful purposes and in accordance with these Terms. You are responsible for:</p>
            <ul>
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your use complies with all applicable laws</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. User Accounts</h2>
            <p>When creating an account with MudahPrompt, you must provide accurate and complete information. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>4. Intellectual Property</h2>
            <p>All content and materials available on MudahPrompt are protected by intellectual property rights. This includes:</p>
            <ul>
              <li>Text, graphics, logos, and software</li>
              <li>User-generated content</li>
              <li>AI-generated responses and prompts</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>5. Limitation of Liability</h2>
            <p>MudahPrompt is provided "as is" without any warranties of any kind. We are not liable for:</p>
            <ul>
              <li>Any direct, indirect, or consequential damages</li>
              <li>Loss of data or business interruption</li>
              <li>Any issues arising from the use of our service</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any changes through:</p>
            <ul>
              <li>Email notifications</li>
              <li>Updates on our website</li>
              <li>In-app notifications</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>7. Contact Information</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
            <p className={styles.contact}>support@mudahprompt.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 