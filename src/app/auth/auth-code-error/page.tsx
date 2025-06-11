import styles from './auth-code-error.module.css'

export default function AuthErrorPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Glowing orbs */}
      <div className="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-destructive/20 blur-[128px]" />
      <div className="absolute -right-20 top-3/4 h-[500px] w-[500px] rounded-full bg-destructive/20 blur-[128px]" />

      <div className="relative flex min-h-screen items-center justify-center p-8">
        <div className="glass-effect w-full max-w-md space-y-8 rounded-2xl p-8 text-center">
          <h1 className="bg-gradient-to-r from-destructive to-destructive/50 bg-clip-text text-4xl font-bold text-transparent">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            There was a problem authenticating your account. Please try again.
          </p>
          <a
            href="/login"
            className="group relative inline-block overflow-hidden rounded-xl bg-black px-8 py-4 text-white transition-all hover:bg-black/90"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-destructive/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative text-lg font-medium">Return to Login</span>
          </a>
        </div>
      </div>
    </div>
  )
} 