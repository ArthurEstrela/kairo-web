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
    queryKey: ['profile'],
    queryFn: () => gamificationApi.getProfile(),
    enabled: !!userId,
  })

  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">

      {/* Header */}
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          O Meu Perfil
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          O teu progresso e estatísticas de aprendizado
        </p>
      </div>

      {/* Identity card */}
      <div
        className="rounded-2xl p-5 flex items-center gap-5"
        style={{
          background: 'linear-gradient(oklch(0.16 0.018 264), oklch(0.16 0.018 264)) padding-box, linear-gradient(145deg, oklch(0.55 0.20 232 / 45%), oklch(0.20 0.02 264 / 8%), oklch(0.45 0.22 293 / 35%)) border-box',
          border: '1px solid transparent',
        }}
      >
        {/* Avatar */}
        <div
          className="size-16 rounded-2xl btn-gradient flex items-center justify-center shrink-0 text-xl font-extrabold text-white"
          style={{
            fontFamily: 'var(--font-display)',
            boxShadow: '0 0 24px oklch(0.50 0.22 264 / 40%)',
          }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <p
            className="font-extrabold text-lg truncate leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
            <Mail className="size-3.5 shrink-0" />
            {email}
          </p>
          {profile && <LeagueShield tier={profile.tier} size="sm" />}
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : profile ? (
        <>
          {/* 3 stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="card-hold rounded-2xl p-4 text-center space-y-2"
              style={{ '--glow': 'oklch(0.50 0.22 264 / 20%)' } as React.CSSProperties}
            >
              <div className="size-8 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto">
                <Zap className="size-4 text-blue-400" />
              </div>
              <p
                className="text-2xl font-extrabold gradient-text leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {profile.currentXp.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total XP</p>
            </div>

            <div className="card-hold rounded-2xl p-4 text-center space-y-2">
              <div className="size-8 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto">
                <Flame className="size-4 text-orange-400" />
              </div>
              <p
                className="text-2xl font-extrabold text-orange-400 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {profile.currentStreak}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sequência</p>
            </div>

            <div className="card-hold rounded-2xl p-4 text-center space-y-2">
              <div className="size-8 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto">
                <Heart className="size-4 text-red-400 fill-red-400" />
              </div>
              <p
                className="text-2xl font-extrabold text-red-400 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {profile.currentLives}<span className="text-sm text-muted-foreground font-normal">/{profile.maxLives}</span>
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vidas</p>
            </div>
          </div>

          {/* XP progress */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <p
                className="text-sm font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Progresso de XP
              </p>
              <LeagueShield tier={profile.tier} size="sm" />
            </div>
            <XpBar current={profile.currentXp} tier={profile.tier} />
            <p className="text-xs text-muted-foreground">
              Continua a treinar para subir de liga.
            </p>
          </GlassCard>

          {/* Lives restore notice */}
          {profile.lastLifeLostAt && profile.currentLives < profile.maxLives && (
            <GlassCard className="flex items-center gap-3 p-4">
              <div className="size-8 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                <Heart className="size-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">As vidas restauram com o tempo</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tens {profile.currentLives}/{profile.maxLives} vidas. Restauram a cada 4 horas.
                </p>
              </div>
            </GlassCard>
          )}
        </>
      ) : null}
    </div>
  )
}
