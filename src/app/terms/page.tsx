'use client'

import styles from './terms.module.css'

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Terms and Conditions</h1>
        
        <div className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using MudahPrompt, you agree to be bound by these Terms and Conditions.</p>
        </div>

        <div className={styles.section}>
          <h2>2. Use of Service</h2>
          <p>You agree to use MudahPrompt only for lawful purposes and in accordance with these Terms.</p>
        </div>

        <div className={styles.section}>
          <h2>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account information.</p>
        </div>

        <div className={styles.section}>
          <h2>4. Intellectual Property</h2>
          <p>All content and materials available on MudahPrompt are protected by intellectual property rights.</p>
        </div>

        <div className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>MudahPrompt is provided &quot;as is&quot; without any warranties of any kind.</p>
        </div>

        <div className={styles.section}>
          <h2>6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any changes.</p>
        </div>
      </div>
    </div>
  )
} 