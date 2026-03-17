'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { LeagueShield } from '@/components/features/gamification/LeagueShield'
import { Heart, Flame, Zap } from 'lucide-react'

export function TopBar() {
  const { name } = useAuthStore()
  const { xp, lives, streak, tier } = useGamificationStore()

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-6 shrink-0">
      {/* Left: Greeting */}
      <p className="text-sm text-muted-foreground">
        Welcome back, <span className="text-foreground font-semibold">{name ?? '...'}</span>
      </p>

      {/* Right: Stats */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 text-sm">
          <Flame className="size-4 text-orange-400" />
          <span className="font-semibold text-orange-400">{streak}</span>
          <span className="text-muted-foreground">streak</span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1.5 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={`size-4 ${i < lives ? 'text-red-400 fill-red-400' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>

        {/* XP */}
        <div className="hidden md:flex items-center gap-1.5 text-sm">
          <Zap className="size-4 text-primary" />
          <span className="font-semibold gradient-text">{xp.toLocaleString()}</span>
          <span className="text-muted-foreground">XP</span>
        </div>

        {/* League */}
        <LeagueShield tier={tier} size="sm" />
      </div>
    </header>
  )
}
