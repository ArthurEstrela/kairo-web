'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/lib/api'
import { Sword, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      const data = await authApi.register({ name, email, password })
      setAuth({ token: data.token, userId: data.userId, name: data.name, email: data.email })
      router.push('/dashboard/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registo falhou. Tenta de novo.')
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
          Cria a tua<br />conta.
        </h1>
        <p className="text-sm text-muted-foreground mt-2.5">
          Começa a treinar as tuas soft skills hoje.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.10s' }}>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arthur Menezes"
            required
            className="auth-input w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/40 text-foreground"
          />
        </div>

        {/* Email */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.16s' }}>
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
        <div className="animate-fade-in-up" style={{ animationDelay: '0.22s' }}>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Palavra-passe
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mín. 8 caracteres"
              required
              minLength={8}
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
        <div className="animate-fade-in-up pt-1" style={{ animationDelay: '0.28s' }}>
          <button
            type="submit"
            disabled={loading}
            className="relative w-full btn-gradient py-3 rounded-xl text-white text-sm font-semibold overflow-hidden group disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 24px oklch(0.50 0.22 264 / 30%)' }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <span>{loading ? 'A criar conta…' : 'Criar Conta'}</span>
            {!loading && <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>
      </form>

      {/* Terms note */}
      <p className="text-center text-[11px] text-muted-foreground/60 mt-4 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.33s' }}>
        Ao criar conta aceitas os nossos{' '}
        <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Termos de Serviço</span>
        {' '}e{' '}
        <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Política de Privacidade</span>.
      </p>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground mt-5 animate-fade-in-up" style={{ animationDelay: '0.38s' }}>
        Já tens conta?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline">
          Entra aqui
        </Link>
      </p>
    </>
  )
}
