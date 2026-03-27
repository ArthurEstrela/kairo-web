'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { leaderboardApi } from '@/lib/api'
import { LeagueShield } from '@/components/features/gamification/LeagueShield'
import type { LeagueTier } from '@/types'
import { Trophy, Loader2, Crown, Medal, Zap } from 'lucide-react'

const TIERS: LeagueTier[] = ['DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE']

export default function LeaguePage() {
  const { userId } = useAuthStore()
  const { tier }   = useGamificationStore()

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['leaderboard', tier],
    queryFn: () => leaderboardApi.getTopN(tier, 20),
    retry: false,
  })

  const { data: myRank } = useQuery({
    queryKey: ['my-rank', tier],
    queryFn: () =>
      leaderboardApi.getMyRank(tier).catch((err) =>
        err?.status === 404 ? null : Promise.reject(err)
      ),
    enabled: !!userId,
    retry: false,
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">

      {/* Header */}
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <div
            className="size-8 rounded-xl bg-linear-to-br from-yellow-500 to-amber-400 flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 4px 16px oklch(0.78 0.18 80 / 40%)' }}
          >
            <Trophy className="size-4 text-white" />
          </div>
          Liga
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Top jogadores da tua liga nesta temporada.
        </p>
      </div>

      {/* My rank banner */}
      {myRank && (
        <div
          className="rounded-2xl p-4 flex items-center justify-between gap-3"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.22 264 / 12%), oklch(0.42 0.22 293 / 8%))',
            border: '1px solid oklch(0.50 0.22 264 / 22%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-full btn-gradient flex items-center justify-center font-extrabold text-white text-sm shrink-0"
              style={{ fontFamily: 'var(--font-display)', boxShadow: '0 0 16px oklch(0.50 0.22 264 / 35%)' }}
            >
              #{myRank.rank}
            </div>
            <div>
              <p className="text-sm font-bold">A tua posição</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Zap className="size-3 text-blue-400" />
                {myRank.xp?.toLocaleString()} XP
              </p>
            </div>
          </div>
          <LeagueShield tier={tier} size="sm" />
        </div>
      )}

      {/* Tier selector */}
      <div className="flex gap-1.5 flex-wrap">
        {TIERS.map((t) => (
          <LeagueShield key={t} tier={t} size="sm" showLabel={t === tier} />
        ))}
      </div>

      {/* Leaderboard */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid oklch(1 0 0 / 7%)', background: 'oklch(0.14 0.018 264)' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="size-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum jogador nesta liga ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Sê o primeiro!</p>
          </div>
        ) : (
          <div>
            {/* Top 3 podium */}
            {entries.slice(0, 3).length > 0 && (
              <div className="px-4 py-4 border-b border-white/5 space-y-2">
                {entries.slice(0, 3).map((entry, idx) => {
                  const isMe = entry.userId === userId
                  const rankNum = idx + 1
                  const podiumStyles: Record<number, { bg: string; crown: string; badge: string }> = {
                    1: { bg: 'bg-yellow-500/10 border-yellow-500/20', crown: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
                    2: { bg: 'bg-slate-400/8 border-slate-400/15', crown: 'text-slate-400', badge: 'bg-slate-400/15 text-slate-300' },
                    3: { bg: 'bg-amber-600/8 border-amber-600/15', crown: 'text-amber-600', badge: 'bg-amber-600/15 text-amber-400' },
                  }
                  const style = podiumStyles[rankNum]
                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${style.bg} ${isMe ? 'ring-1 ring-primary/30' : ''}`}
                    >
                      <Crown className={`size-4 shrink-0 ${style.crown}`} />
                      <p className="flex-1 text-sm font-semibold truncate">
                        {entry.username ?? 'Anónimo'}
                        {isMe && <span className="ml-2 text-xs text-primary font-normal">(tu)</span>}
                      </p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                        {entry.xp?.toLocaleString()} XP
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Rest of the table */}
            {entries.slice(3).length > 0 && (
              <div className="divide-y divide-white/4">
                {entries.slice(3).map((entry, idx) => {
                  const rank = idx + 4
                  const isMe = entry.userId === userId
                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center gap-3 px-5 py-3 transition-colors ${isMe ? 'bg-primary/8' : 'hover:bg-white/2'}`}
                    >
                      <span className="text-xs text-muted-foreground font-medium w-6 shrink-0 flex items-center gap-1">
                        <Medal className="size-3 text-muted-foreground/40" />
                        {rank}
                      </span>
                      <p className="flex-1 text-sm font-medium truncate">
                        {entry.username ?? 'Anónimo'}
                        {isMe && <span className="ml-2 text-xs text-primary">(tu)</span>}
                      </p>
                      <span className="text-xs font-semibold gradient-text whitespace-nowrap">
                        {entry.xp?.toLocaleString()} XP
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
