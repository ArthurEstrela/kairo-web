'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { tracksApi } from '@/lib/api'
import type { TrackChallengeResponse } from '@/types'
import {
  CheckCircle2,
  Lock,
  Target,
  Zap,
  Swords,
  AlertTriangle,
} from 'lucide-react'

const DIFFICULTY_LABELS = ['Fácil', 'Médio', 'Difícil', 'Boss', 'Lendário']

function getDifficultyLabel(levelOrder: number, total: number): string {
  if (total === 1) return 'Único'
  if (levelOrder === total) return 'Boss'
  const idx = Math.floor(((levelOrder - 1) / (total - 1)) * (DIFFICULTY_LABELS.length - 2))
  return DIFFICULTY_LABELS[idx] ?? 'Médio'
}

function ChallengeCard({
  challenge, trackId, total, index,
}: {
  challenge: TrackChallengeResponse
  trackId: string
  total: number
  index: number
}) {
  const isLocked    = challenge.status === 'LOCKED'
  const isCompleted = challenge.status === 'COMPLETED'
  const isActive    = challenge.status === 'ACTIVE'
  const isBoss      = challenge.levelOrder === total
  const diffLabel   = getDifficultyLabel(challenge.levelOrder, total)

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-150 ${
        isLocked ? 'opacity-45' : 'group'
      }`}
      style={{
        background: isCompleted
          ? 'oklch(0.17 0.025 160)'
          : isActive
          ? 'oklch(0.17 0.030 264)'
          : 'oklch(0.14 0.018 264)',
        borderColor: isCompleted
          ? 'oklch(0.50 0.18 160 / 35%)'
          : isActive
          ? 'oklch(0.50 0.22 264 / 35%)'
          : 'oklch(1 0 0 / 6%)',
      }}
    >
      {/* Status icon */}
      <div
        className="size-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold relative"
        style={{
          background: isCompleted
            ? 'oklch(0.45 0.18 160 / 20%)'
            : isActive
            ? 'oklch(0.50 0.22 264 / 20%)'
            : 'oklch(1 0 0 / 5%)',
        }}
      >
        {isCompleted ? (
          <CheckCircle2 className="size-5 text-emerald-400" />
        ) : isLocked ? (
          <Lock className="size-4 text-muted-foreground/50" />
        ) : isBoss ? (
          <Swords className="size-5 text-orange-400" />
        ) : (
          <Target className="size-5 text-blue-400" />
        )}
        {isBoss && !isLocked && (
          <span className="absolute -top-1 -right-1 text-xs leading-none">⚡</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground truncate">{challenge.title}</p>
          {isBoss && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/25 font-medium">
              Boss
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
            <Zap className="size-2.5" />+{challenge.xpReward} XP
          </span>
          <span className="text-[10px] text-muted-foreground">{diffLabel}</span>
          {challenge.maxTurns > 0 && (
            <span className="text-[10px] text-muted-foreground">{challenge.maxTurns} turnos</span>
          )}
          {isCompleted && challenge.bestScore != null && (
            <span className="text-[10px] text-emerald-400 font-medium">
              Melhor: {challenge.bestScore}%
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      {!isLocked && (
        <Link
          href={`/dashboard/challenge/${challenge.id}?trackId=${trackId}`}
          className={`text-xs font-semibold px-3.5 py-2 rounded-xl shrink-0 transition-all duration-150 ${
            isCompleted
              ? 'bg-white/8 text-muted-foreground hover:bg-white/12 hover:text-foreground'
              : 'btn-gradient text-white hover:opacity-90'
          }`}
          style={isActive ? { boxShadow: '0 4px 14px oklch(0.50 0.22 264 / 30%)' } : undefined}
        >
          {isCompleted ? 'Repetir' : 'Iniciar'}
        </Link>
      )}
    </div>
  )
}

export default function TrackMapPage() {
  const params       = useParams<{ trackId: string }>()
  const searchParams = useSearchParams()
  const noLives      = searchParams.get('noLives') === '1'

  const { data: track, isLoading, error } = useQuery({
    queryKey: ['track', params.trackId],
    queryFn: () => tracksApi.getById(params.trackId),
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4 animate-slide-up">
        <div className="h-7 w-56 bg-white/5 rounded-xl animate-pulse" />
        <div className="space-y-3 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !track) {
    return (
      <div className="max-w-xl mx-auto animate-slide-up">
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          Trilha não encontrada.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">

      {/* No lives warning */}
      {noLives && (
        <div className="flex items-center gap-3 p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl">
          <AlertTriangle className="size-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-400 font-medium">
            Ficaste sem vidas! Volta amanhã ou faz upgrade.
          </p>
        </div>
      )}

      {/* Track header */}
      <div>
        <h1
          className="text-xl font-extrabold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {track.title}
        </h1>
        {track.description && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{track.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {track.challenges.length} desafios no total
        </p>
      </div>

      {/* Challenge list with connector */}
      <div className="flex flex-col gap-0">
        {track.challenges.map((challenge, idx) => (
          <div key={challenge.id}>
            <ChallengeCard
              challenge={challenge}
              trackId={params.trackId}
              total={track.challenges.length}
              index={idx}
            />
            {idx < track.challenges.length - 1 && (
              <div className="flex justify-center py-0.5">
                <div
                  className="w-0.5 h-5 rounded-full"
                  style={{
                    background: challenge.status === 'COMPLETED'
                      ? 'linear-gradient(to bottom, oklch(0.50 0.18 160 / 60%), oklch(0.50 0.22 264 / 30%))'
                      : 'linear-gradient(to bottom, oklch(0.50 0.22 264 / 25%), oklch(0.42 0.22 293 / 15%))',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
