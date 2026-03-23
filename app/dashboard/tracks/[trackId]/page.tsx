'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { tracksApi } from '@/lib/api'
import type { TrackChallengeResponse } from '@/types'

const DIFFICULTY_LABELS = ['Fácil', 'Médio', 'Difícil', 'Boss', 'Lendário']

function getDifficultyLabel(levelOrder: number, total: number): string {
  if (total === 1) return 'Único'
  if (levelOrder === total) return 'Boss'
  const idx = Math.floor(((levelOrder - 1) / (total - 1)) * (DIFFICULTY_LABELS.length - 2))
  return DIFFICULTY_LABELS[idx] ?? 'Médio'
}

function ChallengeCard({ challenge, trackId, total }: {
  challenge: TrackChallengeResponse
  trackId: string
  total: number
}) {
  const diffLabel = getDifficultyLabel(challenge.levelOrder, total)
  const isHard = challenge.maxTurns >= 4

  const statusIcon = challenge.status === 'COMPLETED' ? '✓'
    : challenge.status === 'ACTIVE' ? '🎯'
    : '🔒'

  const borderColor = challenge.status === 'COMPLETED'
    ? 'border-emerald-500/40'
    : challenge.status === 'ACTIVE'
    ? 'border-blue-500/40'
    : 'border-white/6'

  const opacity = challenge.status === 'LOCKED' ? 'opacity-50' : ''

  return (
    <div className={`flex items-center gap-3 p-4 bg-white/3 border ${borderColor} rounded-2xl ${opacity}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 relative
        ${challenge.status === 'COMPLETED' ? 'bg-emerald-500/20' :
          challenge.status === 'ACTIVE' ? 'bg-blue-500/20' : 'bg-white/5'}`}>
        {statusIcon}
        {isHard && challenge.status !== 'LOCKED' && (
          <span className="absolute -top-1 -right-1 text-xs">💀</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{challenge.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-indigo-400 font-medium">+{challenge.xpReward} XP</span>
          <span className="text-xs text-muted-foreground">{diffLabel}</span>
          {challenge.maxTurns > 0 && (
            <span className="text-xs text-muted-foreground">{challenge.maxTurns} turnos</span>
          )}
        </div>
        {challenge.status === 'COMPLETED' && (
          <p className="text-xs text-emerald-400 mt-0.5">Melhor: {challenge.bestScore}%</p>
        )}
      </div>
      {challenge.status !== 'LOCKED' && (
        <Link
          href={`/dashboard/challenge/${challenge.id}?trackId=${trackId}`}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0
            ${challenge.status === 'COMPLETED'
              ? 'bg-white/8 text-muted-foreground hover:bg-white/12'
              : 'btn-gradient text-white'}`}
        >
          {challenge.status === 'COMPLETED' ? 'Tentar de novo' : 'Iniciar'}
        </Link>
      )}
    </div>
  )
}

export default function TrackMapPage() {
  const params = useParams<{ trackId: string }>()
  const searchParams = useSearchParams()
  const noLives = searchParams.get('noLives') === '1'

  const { data: track, isLoading, error } = useQuery({
    queryKey: ['track', params.trackId],
    queryFn: () => tracksApi.getById(params.trackId),
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="h-7 w-56 bg-white/5 rounded-xl animate-pulse mb-2" />
        <div className="space-y-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !track) {
    return <div className="max-w-xl mx-auto"><p className="text-red-400 text-sm">Trilha não encontrada.</p></div>
  }

  return (
    <div className="max-w-xl mx-auto">
      {noLives && (
        <div className="mb-4 p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl">
          <p className="text-sm text-amber-400">
            Ficaste sem vidas! Volta amanhã ou faz upgrade.
          </p>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">{track.title}</h1>
        {track.description && (
          <p className="text-sm text-muted-foreground mt-1">{track.description}</p>
        )}
      </div>
      <div className="flex flex-col gap-0">
        {track.challenges.map((challenge, idx) => (
          <div key={challenge.id}>
            <ChallengeCard
              challenge={challenge}
              trackId={params.trackId}
              total={track.challenges.length}
            />
            {idx < track.challenges.length - 1 && (
              <div className="flex justify-center">
                <div className="w-0.5 h-5 bg-gradient-to-b from-blue-500/30 to-purple-500/30" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
