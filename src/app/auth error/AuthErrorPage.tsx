'use client'

import { useRouter } from 'next/navigation'

export default function AuthErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-gray-300 mb-8">There was a problem with the authentication process.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
} 