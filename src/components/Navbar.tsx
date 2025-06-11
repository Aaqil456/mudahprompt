"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import styles from "../styles/Navbar.module.css"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

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
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link href="/" className={styles.navbarBrand}>MudahPrompt</Link>
        <div className={styles.navbarMenu}>
          <Link href="/" className={styles.navbarLink}>Home</Link>
          <span className={styles.navbarDivider}></span>
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