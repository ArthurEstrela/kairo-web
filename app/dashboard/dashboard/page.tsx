'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { skillsApi } from '@/lib/api'
import { ChallengeCard } from '@/components/features/challenge/ChallengeCard'
import { LeagueShield } from '@/components/features/gamification/LeagueShield'
import { XpBar } from '@/components/features/gamification/XpAnimation'
import { GlassCard } from '@/components/ui/glass-card'
import type { SkillResponse } from '@/types'
import { Heart, Flame, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { name } = useAuthStore()
  const { xp, lives, maxLives, streak, tier } = useGamificationStore()
  const [openSkill, setOpenSkill] = useState<string | null>(null)

  const { data: skills = [], isLoading: loadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsApi.getAll,
  })

  function toggleSkill(id: string) {
    setOpenSkill((prev) => (prev === id ? null : id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Hey, <span className="gradient-text">{name?.split(' ')[0] ?? '...'}</span> 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Keep training — your skills are leveling up.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassCard className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">League</p>
          <LeagueShield tier={tier} size="sm" />
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Lives</p>
          <div className="flex gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`size-4 ${i < lives ? 'text-red-400 fill-red-400' : 'text-muted-foreground/30'}`}
              />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Streak</p>
          <div className="flex items-center gap-1.5">
            <Flame className="size-5 text-orange-400" />
            <span className="text-xl font-bold text-orange-400">{streak}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Progress</p>
          <XpBar current={xp} tier={tier} className="w-full" />
        </GlassCard>
      </div>

      {/* Skills & Challenges */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Learning Tracks</h2>

        {loadingSkills ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <SkillAccordion
                key={skill.id}
                skill={skill}
                open={openSkill === skill.id}
                onToggle={() => toggleSkill(skill.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SkillAccordion({
  skill,
  open,
  onToggle,
}: {
  skill: SkillResponse
  open: boolean
  onToggle: () => void
}) {
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges', skill.id],
    queryFn: () => skillsApi.getChallenges(skill.id),
    enabled: open,
  })

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="text-left">
          <p className="font-semibold text-sm">{skill.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
        </div>
        {open
          ? <ChevronUp className="size-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        }
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-2 border-t border-white/5 pt-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : challenges.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No challenges yet.</p>
          ) : (
            challenges
              .sort((a, b) => a.levelOrder - b.levelOrder)
              .map((ch) => <ChallengeCard key={ch.id} challenge={ch} />)
          )}
        </div>
      )}
    </div>
  )
}
