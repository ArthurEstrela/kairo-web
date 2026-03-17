'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface XpAnimationProps {
  xpGained: number
  visible: boolean
  onComplete?: () => void
}

export function XpAnimation({ xpGained, visible, onComplete }: XpAnimationProps) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2500)
    return () => clearTimeout(timer)
  }, [visible, onComplete])

  if (!visible) return null

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none animate-slide-up">
      <div className="glass rounded-2xl px-5 py-3 glow-blue flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-xs text-muted-foreground font-medium">XP Gained</p>
          <p className="text-xl font-bold gradient-text">+{xpGained} XP</p>
        </div>
      </div>
    </div>
  )
}

const TIER_MAX: Record<string, number> = {
  BRONZE: 500,
  SILVER: 1500,
  GOLD: 3500,
  PLATINUM: 7500,
  DIAMOND: 7500,
}

interface XpBarProps {
  current: number
  tier: string
  className?: string
}

export function XpBar({ current, tier, className }: XpBarProps) {
  const max = TIER_MAX[tier] ?? 500
  const pct = Math.min((current / max) * 100, 100)

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{current.toLocaleString()} XP</span>
        <span>{max.toLocaleString()} XP</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full btn-gradient transition-all duration-700 animate-xp-pulse"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
