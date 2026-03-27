'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { tracksApi, gamificationApi } from '@/lib/api'
import { useGamificationStore } from '@/store/useGamificationStore'
import { Sparkles, ArrowRight, Zap, AlertTriangle } from 'lucide-react'

export default function GenerateTrackPage() {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { availableTrackGenerations, setProfile } = useGamificationStore()

  const isPremium  = availableTrackGenerations === null
  const isExhausted = !isPremium && availableTrackGenerations === 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!goal.trim() || isExhausted) return
    setLoading(true)
    setError(null)
    try {
      const { id } = await tracksApi.generate(goal.trim())
      gamificationApi.getProfile().then(setProfile).catch(() => {/* silent */})
      router.push(`/dashboard/tracks/${id}`)
    } catch (err: unknown) {
      const apiErr = err as { body?: { error?: string; detail?: string }; message?: string }
      const detail = apiErr.body?.detail ?? apiErr.body?.error ?? apiErr.message
      if ((err as { status?: number }).status === 429) {
        setError('Atingiste o limite mensal de trilhas. Faz upgrade para Premium para gerar mais.')
      } else {
        setError(detail ?? 'Não foi possível gerar a trilha. Tenta de novo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const quotaPct = isPremium ? 100 : ((availableTrackGenerations ?? 0) / 3) * 100

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-slide-up">
      <div className="w-full max-w-xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="size-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto animate-glow-pulse"
          >
            <Sparkles className="size-6 text-white" />
          </div>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nova Trilha de Aprendizado
          </h1>
          <p className="text-sm text-muted-foreground">
            Descreve o que queres aprender e a IA cria uma trilha personalizada para ti.
          </p>
        </div>

        {/* Quota indicator */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{
            background: 'oklch(0.14 0.018 264)',
            border: '1px solid oklch(1 0 0 / 7%)',
          }}
        >
          {isPremium ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap className="size-4" />
              <span className="text-sm font-semibold">Gerações ilimitadas — Premium</span>
            </div>
          ) : isExhausted ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span className="text-sm font-semibold">Limite mensal atingido</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Volta no próximo mês ou{' '}
                <Link href="/dashboard/upgrade" className="text-primary font-semibold hover:underline underline-offset-4">
                  faz upgrade para Premium
                </Link>{' '}
                para gerações ilimitadas.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {availableTrackGenerations} de 3 trilhas restantes este mês
                </span>
                <Link href="/dashboard/upgrade" className="text-primary font-semibold hover:underline underline-offset-4">
                  Upgrade →
                </Link>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${quotaPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Ex: Quero aprender a pedir um aumento de salário de forma assertiva e confiante"
              className="auth-input w-full bg-white/4 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none"
              disabled={loading || isExhausted}
            />
            <span className="absolute bottom-3 right-4 text-[10px] text-muted-foreground/50 font-medium pointer-events-none">
              {goal.length}/500
            </span>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !goal.trim() || isExhausted}
            className="relative w-full btn-gradient text-white text-sm font-semibold py-3 rounded-xl overflow-hidden group disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ boxShadow: '0 4px 24px oklch(0.50 0.22 264 / 30%)' }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            {loading ? (
              <>
                <Sparkles className="size-4 relative animate-pulse" />
                <span className="relative">A IA está a criar a tua trilha…</span>
              </>
            ) : (
              <>
                <span className="relative">Gerar Trilha</span>
                <ArrowRight className="size-4 relative group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
