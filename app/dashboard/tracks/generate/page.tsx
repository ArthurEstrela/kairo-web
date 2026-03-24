'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { tracksApi } from '@/lib/api'
import { useGamificationStore } from '@/store/useGamificationStore'

export default function GenerateTrackPage() {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { availableTrackGenerations } = useGamificationStore()

  const isPremium = availableTrackGenerations === null
  const isExhausted = !isPremium && availableTrackGenerations === 0
  const canGenerate = isPremium || (availableTrackGenerations !== null && availableTrackGenerations > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!goal.trim() || !canGenerate) return
    setLoading(true)
    setError(null)
    try {
      const { id } = await tracksApi.generate(goal.trim())
      router.push(`/dashboard/tracks/${id}`)
    } catch (err: unknown) {
      const apiErr = err as { body?: { error?: string; detail?: string }, message?: string }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Nova Trilha de Aprendizado</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Descreve o que queres aprender e a IA cria uma trilha personalizada para ti.
        </p>

        {/* Quota indicator */}
        {isPremium ? (
          <div className="flex items-center gap-2 mb-5 text-xs text-emerald-400 font-medium">
            <span>✓</span>
            <span>Gerações ilimitadas (Premium)</span>
          </div>
        ) : isExhausted ? (
          <div className="mb-5 p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl">
            <p className="text-sm text-amber-400 font-medium mb-1">Limite mensal atingido</p>
            <p className="text-xs text-amber-300/80">
              Volta no próximo mês ou{' '}
              <Link href="/dashboard/upgrade" className="underline font-semibold hover:text-amber-200">
                faz upgrade para Premium
              </Link>{' '}
              para gerações ilimitadas.
            </p>
          </div>
        ) : (
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>{availableTrackGenerations} de 3 trilhas restantes este mês</span>
              <Link href="/dashboard/upgrade" className="text-blue-400 hover:text-blue-300 transition-colors">
                Upgrade →
              </Link>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${((availableTrackGenerations ?? 0) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ex: Quero aprender a pedir um aumento de salário"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground resize-none outline-none focus:border-blue-500/50"
            disabled={loading || isExhausted}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{goal.length}/500</span>
            <button
              type="submit"
              disabled={loading || !goal.trim() || isExhausted}
              className="btn-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50"
            >
              {loading ? 'A IA está a criar a tua trilha...' : 'Gerar Trilha'}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
