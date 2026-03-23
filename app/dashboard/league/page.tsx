'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { leaderboardApi } from '@/lib/api'
import { LeagueShield } from '@/components/features/gamification/LeagueShield'
import { GlassCard } from '@/components/ui/glass-card'
import type { LeagueTier } from '@/types'
import { Trophy, Loader2, Crown } from 'lucide-react'

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
    queryKey: ['my-rank', tier, userId],
    queryFn: () =>
      leaderboardApi.getUserRank(tier, userId!).catch((err) =>
        err?.status === 404 ? null : Promise.reject(err)
      ),
    enabled: !!userId,
    retry: false,
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5 md:space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Trophy className="size-5 md:size-6 text-primary" />
          Liga
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm mt-1">Top negociadores da sua liga nesta temporada.</p>
      </div>

      {/* My rank banner */}
      {myRank && (
        <GlassCard glow="blue" className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
              #{myRank.rank}
            </div>
            <div>
              <p className="text-sm font-semibold">A tua posição</p>
              <p className="text-xs text-muted-foreground">{myRank.xp?.toLocaleString()} XP</p>
            </div>
          </div>
          <LeagueShield tier={tier} size="sm" />
        </GlassCard>
      )}

      {/* Tier selector */}
      <div className="flex gap-1.5 md:gap-2 flex-wrap">
        {TIERS.map((t) => (
          <LeagueShield key={t} tier={t} size="sm" showLabel={t === tier} />
        ))}
      </div>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Nenhum jogador nesta liga ainda. Sê o primeiro!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-3 md:px-5 py-3 text-left w-10 md:w-12">Pos.</th>
                  <th className="px-3 md:px-5 py-3 text-left">Jogador</th>
                  <th className="px-3 md:px-5 py-3 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry, idx) => {
                  const isMe = entry.userId === userId
                  const rank = idx + 1
                  return (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${isMe ? 'bg-primary/8' : 'hover:bg-white/2'}`}
                    >
                      <td className="px-3 md:px-5 py-2.5 md:py-3">
                        {rank <= 3 ? (
                          <Crown className={`size-4 ${
                            rank === 1 ? 'text-yellow-400' :
                            rank === 2 ? 'text-slate-400' :
                            'text-amber-600'
                          }`} />
                        ) : (
                          <span className="text-muted-foreground text-xs md:text-sm">#{rank}</span>
                        )}
                      </td>
                      <td className="px-3 md:px-5 py-2.5 md:py-3 font-medium text-xs md:text-sm max-w-[140px] md:max-w-none truncate">
                        {entry.username ?? 'Anónimo'}
                        {isMe && <span className="ml-1.5 text-xs text-primary">(tu)</span>}
                      </td>
                      <td className="px-3 md:px-5 py-2.5 md:py-3 text-right font-semibold gradient-text text-xs md:text-sm whitespace-nowrap">
                        {entry.xp?.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
