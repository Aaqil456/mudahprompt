"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from '../styles/Navbar.module.css'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  href: string
  label: string
  requiresAuth?: boolean
  onClick?: () => void
}

const navItems: NavItem[] = [
  { href: '/', label: 'Laman Utama' },
  { href: '/prompt-assistant', label: 'Pembantu Prompt', requiresAuth: true },
  { href: '/login', label: 'Log Masuk' }
]

// SVG icon for user profile
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      if (session?.user) {
        // Try to get username from user_metadata, fallback to email
        const name = session.user.user_metadata?.username || session.user.user_metadata?.full_name || session.user.email;
        setUserName(name);
      } else {
        setUserName(null);
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setIsMobileMenuOpen(false)
    router.push('/')
  }

  // Redirect to login if trying to access protected route
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname === '/prompt-assistant') {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  // Filter nav items based on auth state
  const filteredNavItems = navItems.map(item => {
    if (item.href === '/login') {
      return {
        ...item,
        href: isAuthenticated ? '#' : '/login',
        label: isAuthenticated ? 'Log Keluar' : 'Log Masuk',
        onClick: isAuthenticated ? handleSignOut : undefined
      }
    }
    if (item.requiresAuth && !isAuthenticated) {
      return null;
    }
    return item;
  }).filter(Boolean);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavLinkClick = async (onClick?: () => void, href?: string) => {
    if (onClick) {
      await onClick();
    }
    // Only close menu after navigation for normal links
    if (!onClick && href) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={styles.navbar} style={{ 
      position: 'fixed',
      top: 0,
      borderBottom: '2px solid var(--neon-green)',
      borderTop: 'none',
      borderRadius: '0 0 1.2rem 1.2rem',
      padding: '1rem 0'
    }}>
      <div className={styles.navbarInner}>
        {(userName) ? (
          <div className={styles.profileGreeting} style={{ color: '#00ffae', fontFamily: 'var(--font-digital)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
            <UserIcon />
            <b>{userName}</b>
        </div>
        ) : null}
        
        {isMobile ? (
          <>
            <button 
              className={styles.hamburgerButton}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
              <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
              <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`}></span>
            </button>
            
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
              <button
                className={styles.closeButton}
                onClick={toggleMobileMenu}
                aria-label="Tutup menu"
                style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', zIndex: 1001 }}
              >
                &times;
              </button>
              {filteredNavItems.map((item) => {
                if (!item) return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavLinkClick(item.onClick, item.href)}
                    className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className={styles.navbarMenu} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {filteredNavItems.map((item) => {
              if (!item) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  className={`${styles.navbarLink} ${pathname === item.href ? styles.active : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  )
} 