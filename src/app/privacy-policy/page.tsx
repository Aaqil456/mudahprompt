'use client'

import styles from './privacy-policy.module.css'

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.landingBg}></div>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: March 2024</p>

          <div className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information (email, name)</li>
              <li>Usage data and preferences</li>
              <li>Communication data</li>
              <li>AI interaction history</li>
              <li>Device and browser information</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about our services</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Ensure the security of our platform</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information, including:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze site usage</li>
              <li>Improve our services</li>
              <li>Provide personalized content</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Third-Party Services</h2>
            <p>We may use third-party services that collect information. These services have their own privacy policies and may include:</p>
            <ul>
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Cloud service providers</li>
              <li>AI service providers</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>7. Contact Information</h2>
            <p>If you have any questions about our Privacy Policy, please contact us at:</p>
            <p className={styles.contact}>privacy@mudahprompt.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 