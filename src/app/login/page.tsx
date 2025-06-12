'use client'

import { createClient } from '@/lib/supabase/client'
import styles from './login-page.module.css'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBg} />
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Welcome to MudahPrompt</h1>
        <p className={styles.loginDesc}>Sign in to access your account</p>
        
        <button
          onClick={handleGoogleLogin}
          className={styles.neonButton}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

// Tailwind custom classes for animation (add to globals.css or tailwind config):
// .animate-glow { animation: glow 6s ease-in-out infinite alternate; }
// .animate-grid-fade { animation: gridFade 8s linear infinite alternate; }
// @keyframes glow { 0% { opacity: 0.7; } 100% { opacity: 1; filter: blur(8px); } }
// @keyframes gridFade { 0% { opacity: 0.7; } 100% { opacity: 1; } } 