'use client'

import styles from './privacy-policy.module.css'

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <div className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Account information (email, name)</li>
            <li>Usage data and preferences</li>
            <li>Communication data</li>
          </ul>
        </div>
        <div className={styles.section}>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about our services</li>
          </ul>
        </div>
        <div className={styles.section}>
          <h2>3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </div>
        <div className={styles.section}>
          <h2>4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 