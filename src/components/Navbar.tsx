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
  { href: '/', label: 'Home' },
  { href: '/prompt-assistant', label: 'Prompt Assistant', requiresAuth: true },
  { href: '/login', label: 'Sign In' }
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    router.push('/')
  }

  // Redirect to login if trying to access protected route
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname === '/prompt-assistant') {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  // Filter nav items based on auth state
  const filteredNavItems = navItems
    .filter(item => !item.requiresAuth || isAuthenticated)
    .map(item => {
      if (item.href === '/login') {
        return {
          ...item,
          href: isAuthenticated ? '#' : '/login',
          label: isAuthenticated ? 'Sign Out' : 'Sign In',
          onClick: isAuthenticated ? handleSignOut : undefined
        }
      }
      return item
    })

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
        <div className={styles.navbarBrand}>
          <Link href="/" className={styles.navbarLink}>
            <span className="text-primary">Mudah</span>
            <span className="text-white">Prompt</span>
          </Link>
        </div>
        
        <div className={styles.navbarMenu}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.onClick}
              className={`${styles.navbarLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 