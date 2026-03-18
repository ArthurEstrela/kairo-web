'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tracksApi } from '@/lib/api'

export default function GenerateTrackPage() {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!goal.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { id } = await tracksApi.generate(goal.trim())
      router.push(`/dashboard/tracks/${id}`)
    } catch (err: unknown) {
      const apiErr = err as { body?: { error?: string }, message?: string }
      setError(apiErr.body?.error ?? apiErr.message ?? 'Não foi possível gerar a trilha. Tenta de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Nova Trilha de Aprendizado</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Descreve o que queres aprender e a IA cria uma trilha personalizada para ti.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ex: Quero aprender a pedir um aumento de salário"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground resize-none outline-none focus:border-blue-500/50"
            disabled={loading}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{goal.length}/500</span>
            <button
              type="submit"
              disabled={loading || !goal.trim()}
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
