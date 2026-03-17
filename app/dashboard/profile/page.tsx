'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { gamificationApi } from '@/lib/api'
import { LeagueShield } from '@/components/features/gamification/LeagueShield'
import { XpBar } from '@/components/features/gamification/XpAnimation'
import { GlassCard } from '@/components/ui/glass-card'
import { Mail, Heart, Flame, Zap, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { name, email, userId } = useAuthStore()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => gamificationApi.getProfile(userId!),
    enabled: !!userId,
  })

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Identity card */}
      <GlassCard glow="blue" className="flex items-center gap-5">
        <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-primary">
            {name?.charAt(0).toUpperCase() ?? '?'}
          </span>
        </div>
        <div className="space-y-1 min-w-0">
          <p className="font-bold text-lg truncate">{name}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Mail className="size-3.5" />{email}
          </p>
          {profile && <LeagueShield tier={profile.tier} size="sm" />}
        </div>
      </GlassCard>

      {/* Stats */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : profile ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            <GlassCard className="p-4 text-center space-y-1">
              <Zap className="size-5 text-primary mx-auto" />
              <p className="text-xl font-bold gradient-text">{profile.currentXp.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </GlassCard>

            <GlassCard className="p-4 text-center space-y-1">
              <Flame className="size-5 text-orange-400 mx-auto" />
              <p className="text-xl font-bold text-orange-400">{profile.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </GlassCard>

            <GlassCard className="p-4 text-center space-y-1">
              <Heart className="size-5 text-red-400 mx-auto fill-red-400" />
              <p className="text-xl font-bold text-red-400">{profile.currentLives}/{profile.maxLives}</p>
              <p className="text-xs text-muted-foreground">Lives</p>
            </GlassCard>
          </div>

          {/* XP progress */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">XP Progress</p>
              <LeagueShield tier={profile.tier} size="sm" />
            </div>
            <XpBar current={profile.currentXp} tier={profile.tier} />
            <p className="text-xs text-muted-foreground">
              Keep training to advance to the next league tier.
            </p>
          </GlassCard>

          {/* Lives status */}
          {profile.lastLifeLostAt && profile.currentLives < profile.maxLives && (
            <GlassCard className="flex items-center gap-3 p-4">
              <Heart className="size-5 text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-medium">Lives restore over time</p>
                <p className="text-xs text-muted-foreground">
                  You have {profile.currentLives}/{profile.maxLives} lives. Lives restore every 4 hours.
                </p>
              </div>
            </GlassCard>
          )}
        </>
      ) : null}
    </div>
  )
}
