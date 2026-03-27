'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { skillsApi } from '@/lib/api'
import { useChallengeStore } from '@/store/useChallengeStore'
import { cn } from '@/lib/utils'
import type { ChallengeResponse, SkillResponse } from '@/types'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Loader2,
  Play,
  Zap,
  Lock,
  CheckCircle2,
} from 'lucide-react'

const DIFFICULTY: Record<number, { label: string; cls: string; dot: string }> = {
  0: { label: 'Iniciante',     cls: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25', dot: 'bg-emerald-400' },
  1: { label: 'Intermediário', cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',          dot: 'bg-blue-400'    },
  2: { label: 'Avançado',      cls: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',    dot: 'bg-orange-400'  },
}

export default function SkillsPage() {
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsApi.getAll,
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <div className="size-8 rounded-xl btn-gradient flex items-center justify-center shrink-0" style={{ boxShadow: '0 4px 16px oklch(0.50 0.22 264 / 35%)' }}>
            <BookOpen className="size-4 text-white" />
          </div>
          Catálogo de Skills
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Escolhe uma skill para praticar e completa os desafios em ordem.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/4 animate-pulse" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma skill disponível por agora.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {skills.map((skill) => (
            <SkillAccordion key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  )
}

function SkillAccordion({ skill }: { skill: SkillResponse }) {
  const [open, setOpen] = useState(false)
  const diff = DIFFICULTY[skill.difficultyLevel] ?? DIFFICULTY[1]

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        open
          ? 'bg-white/4 border-white/10'
          : 'bg-white/2.5 border-white/6 hover:bg-white/4 hover:border-white/8'
      )}
      style={open ? { borderLeft: '2px solid oklch(0.55 0.22 264 / 60%)' } : undefined}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className={cn('size-2.5 rounded-full shrink-0', diff.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-semibold text-foreground"
              style={open ? { fontFamily: 'var(--font-display)' } : undefined}
            >
              {skill.name}
            </span>
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', diff.cls)}>
              {diff.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{skill.description}</p>
        </div>
        {open ? (
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && <ChallengeList skillId={skill.id} />}
    </div>
  )
}

function ChallengeList({ skillId }: { skillId: string }) {
  const router = useRouter()
  const { setCurrent } = useChallengeStore()

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges', skillId],
    queryFn: () => skillsApi.getChallenges(skillId),
  })

  function handleStart(challenge: ChallengeResponse) {
    setCurrent(challenge)
    router.push(`/dashboard/challenge/${challenge.id}?trackId=${skillId}`)
  }

  if (isLoading) {
    return (
      <div className="px-5 pb-5 pt-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
          <Loader2 className="size-3.5 animate-spin" />
          A carregar desafios…
        </div>
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <div className="px-5 pb-5 pt-1">
        <p className="text-xs text-muted-foreground py-3">Nenhum desafio disponível.</p>
      </div>
    )
  }

  return (
    <div className="px-5 pb-4 pt-1 space-y-1.5">
      <div className="h-px bg-white/6 mb-3" />
      {challenges
        .sort((a, b) => a.levelOrder - b.levelOrder)
        .map((ch, idx) => (
          <ChallengeRow
            key={ch.id}
            challenge={ch}
            index={idx}
            onStart={() => handleStart(ch)}
          />
        ))}
    </div>
  )
}

function ChallengeRow({
  challenge,
  index,
  onStart,
}: {
  challenge: ChallengeResponse
  index: number
  onStart: () => void
}) {
  const isLocked    = challenge.status === 'LOCKED'
  const isCompleted = challenge.status === 'COMPLETED'

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150',
        isLocked
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-white/5 cursor-pointer group'
      )}
      onClick={isLocked ? undefined : onStart}
    >
      {/* Status badge */}
      <div
        className={cn(
          'size-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
          isCompleted
            ? 'bg-emerald-500/20 text-emerald-400'
            : isLocked
            ? 'bg-white/5 text-muted-foreground'
            : 'bg-primary/20 text-primary'
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="size-4 text-emerald-400" />
        ) : isLocked ? (
          <Lock className="size-3.5" />
        ) : (
          index + 1
        )}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isLocked ? 'text-muted-foreground' : 'text-foreground')}>
          {challenge.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Zap className="size-2.5 text-yellow-400" />
            +{challenge.xpReward} XP
          </span>
          {challenge.maxTurns > 0 && (
            <span className="text-[10px] text-muted-foreground">· {challenge.maxTurns} turnos</span>
          )}
        </div>
      </div>

      {!isLocked && (
        <Play
          className={cn(
            'size-4 shrink-0 transition-colors',
            isCompleted
              ? 'text-emerald-400 group-hover:text-emerald-300'
              : 'text-primary group-hover:text-blue-300'
          )}
        />
      )}
    </div>
  )
}
