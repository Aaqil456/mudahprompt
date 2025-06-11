'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import styles from './auth-error-page.module.css'

export default function AuthErrorPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Glowing orbs */}
      <div className="absolute -left-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-500/20 blur-[128px] animate-pulse-slow" />
      <div className="absolute -right-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-orange-500/20 blur-[128px] animate-pulse-slow" />

      {/* Navigation */}
      <nav className="glass-effect fixed left-0 top-0 z-50 w-full border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold text-gradient-animate">
            MudahPrompt
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 pt-24">
        <div className="glass-effect mx-auto max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl animate-float">
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-red-500/10 p-3">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="gradient-text text-3xl font-bold">Authentication Error</h1>
            <p className="mt-2 text-gray-400">
              There was a problem authenticating your account. Please try again.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <Link href="/login">
              <Button className="group relative w-full overflow-hidden rounded-xl bg-white px-6 py-3 text-black transition-all hover:bg-gray-100 button-hover-effect">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Try Again</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="group relative w-full overflow-hidden rounded-xl border-white/20 bg-black/50 px-6 py-3 text-white transition-all hover:bg-black/70 button-hover-effect">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Go Back Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 