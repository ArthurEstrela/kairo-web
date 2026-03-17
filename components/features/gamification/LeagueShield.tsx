import { cn } from '@/lib/utils'
import type { LeagueTier } from '@/types'

const TIER_CONFIG: Record<LeagueTier, { label: string; emoji: string; className: string; bg: string }> = {
  BRONZE:   { label: 'Bronze',   emoji: '🥉', className: 'tier-bronze',   bg: 'bg-amber-900/30 border-amber-700/40' },
  SILVER:   { label: 'Silver',   emoji: '🥈', className: 'tier-silver',   bg: 'bg-slate-700/30 border-slate-500/40' },
  GOLD:     { label: 'Gold',     emoji: '🥇', className: 'tier-gold',     bg: 'bg-yellow-900/30 border-yellow-600/40' },
  PLATINUM: { label: 'Platinum', emoji: '💎', className: 'tier-platinum', bg: 'bg-cyan-900/30 border-cyan-600/40' },
  DIAMOND:  { label: 'Diamond',  emoji: '💠', className: 'tier-diamond',  bg: 'bg-violet-900/30 border-violet-600/40' },
}

interface LeagueShieldProps {
  tier: LeagueTier
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function LeagueShield({ tier, size = 'md', showLabel = true }: LeagueShieldProps) {
  const config = TIER_CONFIG[tier]

  const sizeClasses = {
    sm: 'text-lg px-2 py-1 gap-1 text-xs',
    md: 'text-2xl px-3 py-1.5 gap-1.5 text-sm',
    lg: 'text-4xl px-4 py-2 gap-2 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        sizeClasses[size],
        config.bg,
        config.className
      )}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}
