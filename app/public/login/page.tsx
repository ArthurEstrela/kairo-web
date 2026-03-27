'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/lib/api'
import { Sword, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await authApi.login({ email, password })
      setAuth({ token: data.token, userId: data.userId, name: data.name, email: data.email })
      router.push('/dashboard/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas. Tenta de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Mobile-only logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden animate-fade-in-up">
        <div className="size-9 rounded-xl btn-gradient flex items-center justify-center glow-blue">
          <Sword className="size-4 text-white" />
        </div>
        <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>KAIRO</span>
      </div>

      {/* Heading */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <h1
          className="text-4xl font-extrabold leading-[1.08] tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Bem-vindo<br />de volta.
        </h1>
        <p className="text-sm text-muted-foreground mt-2.5">
          Entra na tua conta para continuar a treinar.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@exemplo.com"
            required
            className="auth-input w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/40 text-foreground"
          />
        </div>

        {/* Password */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.19s' }}>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Palavra-passe
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground/40 text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 animate-fade-in-up">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="animate-fade-in-up pt-1" style={{ animationDelay: '0.26s' }}>
          <button
            type="submit"
            disabled={loading}
            className="relative w-full btn-gradient py-3 rounded-xl text-white text-sm font-semibold overflow-hidden group disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 24px oklch(0.50 0.22 264 / 30%)' }}
          >
            {/* Shimmer on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <span>{loading ? 'A entrar…' : 'Entrar'}</span>
            {!loading && <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground mt-7 animate-fade-in-up" style={{ animationDelay: '0.32s' }}>
        Não tens conta?{' '}
        <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline">
          Cria uma grátis
        </Link>
      </p>
    </>
  )
}
