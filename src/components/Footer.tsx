'use client'

import Link from 'next/link'
import styles from '../styles/Navbar.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.navbarInner}>
        <div className={styles.navbarBrand}>
          <Link href="/" className={styles.navbarLink} style={{ borderBottom: 'none', padding: 0 }}>
            <span className="text-primary">Mudah</span>
            <span className="text-white">Prompt</span>
          </Link>
        </div>
        <div className={styles.navbarMenu}>
          <Link href="/privacy-policy" className={styles.navbarLink}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.navbarLink}>
            Terms & Conditions
          </Link>
          <Link href="/contact" className={styles.navbarLink}>
            Hubungi Kami
          </Link>
        </div>
      </div>
    </footer>
  )
} 