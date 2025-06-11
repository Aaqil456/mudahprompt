'use client'

import Link from 'next/link'
import styles from '../styles/Navbar.module.css'

export default function Footer() {
  return (
    <footer className={styles.navbar} style={{ 
      position: 'fixed', 
      bottom: 0, 
      borderTop: '2px solid var(--neon-green)',
      borderBottom: 'none',
      borderRadius: '1.2rem 1.2rem 0 0',
      padding: '1rem 0'
    }}>
      <div className={styles.navbarInner}>
        <div className={styles.navbarMenu}>
          <Link href="/privacy-policy" className={styles.navbarLink}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.navbarLink} style={{ marginLeft: '1rem' }}>
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
} 