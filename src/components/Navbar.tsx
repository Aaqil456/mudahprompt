"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import styles from "../styles/Navbar.module.css"

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/prompt-assistant', label: 'Prompt Assistant' },
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' }
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              MudahPrompt
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'text-blue-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {!user && (
            <Link href="/login" className={styles.navbarLink}>Sign In</Link>
          )}
          {user && (
            <>
              <Link href="/prompt-assistant" className={styles.navbarLink}>Prompt Assistant</Link>
              <span className={styles.navbarDivider}></span>
              <button className={styles.navbarLink} style={{background: "none", border: "none", cursor: "pointer", padding: 0}} onClick={handleSignOut}>Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 