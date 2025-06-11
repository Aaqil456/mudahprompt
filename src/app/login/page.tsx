'use client'

import styles from './login-page.module.css'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (!error) {
      // The redirect will happen automatically
    } else {
      alert('Google sign in failed!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Centered login card */}
      <div className="flex-1 flex items-center justify-center">
        <div className={`${styles.loginCard} w-full max-w-md mx-auto flex flex-col items-center p-8 md:p-10`}>
          <div className={`${styles.loginTitle} mb-4`}>Sign In</div>
          <div className={`${styles.loginDesc} mb-8`}>Sign in to access your dashboard and manage your AI prompts securely.</div>
          <button className={`${styles.neonButton} w-full`} onClick={handleGoogleLogin}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

// Tailwind custom classes for animation (add to globals.css or tailwind config):
// .animate-glow { animation: glow 6s ease-in-out infinite alternate; }
// .animate-grid-fade { animation: gridFade 8s linear infinite alternate; }
// @keyframes glow { 0% { opacity: 0.7; } 100% { opacity: 1; filter: blur(8px); } }
// @keyframes gridFade { 0% { opacity: 0.7; } 100% { opacity: 1; } } 