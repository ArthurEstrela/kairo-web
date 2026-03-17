'use client'

import { useRouter } from 'next/navigation'
import { useChallengeStore } from '@/store/useChallengeStore'
import type { ChallengeResponse } from '@/types'
import { cn } from '@/lib/utils'
import { Zap, MessageSquare, HelpCircle, ChevronRight } from 'lucide-react'

interface ChallengeCardProps {
  challenge: ChallengeResponse
  locked?: boolean
}

export function ChallengeCard({ challenge, locked = false }: ChallengeCardProps) {
  const router = useRouter()
  const setCurrent = useChallengeStore((s) => s.setCurrent)

  function handleStart() {
    if (locked) return
    setCurrent(challenge)
    router.push(`/dashboard/challenge/${challenge.id}`)
  }

  return (
    <button
      onClick={handleStart}
      disabled={locked}
      className={cn(
        'w-full text-left glass rounded-xl p-4 transition-all duration-200',
        'border border-white/5 hover:border-primary/40 hover:glow-blue',
        'flex items-center gap-4 group',
        locked && 'opacity-40 cursor-not-allowed hover:border-white/5'
      )}
    >
      {/* Icon */}
      <div className={cn(
        'size-10 rounded-lg flex items-center justify-center shrink-0',
        challenge.type === 'ROLEPLAY'
          ? 'bg-primary/20 text-primary'
          : 'bg-accent/20 text-accent'
      )}>
        {challenge.type === 'ROLEPLAY'
          ? <MessageSquare className="size-5" />
          : <HelpCircle className="size-5" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{challenge.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded font-medium',
            challenge.type === 'ROLEPLAY' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'
          )}>
            {challenge.type}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="size-3" />{challenge.xpReward} XP
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className={cn(
        'size-4 text-muted-foreground transition-transform shrink-0',
        !locked && 'group-hover:translate-x-1 group-hover:text-primary'
      )} />
    </button>
  )
}
