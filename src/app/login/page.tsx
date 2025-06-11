'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add your login logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Please sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </p>
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