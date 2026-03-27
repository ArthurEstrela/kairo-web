'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { useChallengeStore } from '@/store/useChallengeStore'
import { skillsApi, leaderboardApi, userApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { SkillResponse, DayActivity, RecentActivityItem } from '@/types'
import {
  Trophy, Zap, Target, Flame, Award, Clock,
  TrendingUp, Users, Timer, ChevronRight, Star, ArrowRight,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { name, userId } = useAuthStore()
  const { xp, streak, tier } = useGamificationStore()

  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: skillsApi.getAll })
  const { data: myRank } = useQuery({
    queryKey: ['my-rank', tier],
    queryFn: () => leaderboardApi.getMyRank(tier).catch((err) => err?.status === 404 ? null : Promise.reject(err)),
    enabled: !!userId,
    retry: false,
  })
  const { data: stats } = useQuery({ queryKey: ['user-stats'], queryFn: () => userApi.getStats(), enabled: !!userId })
  const { data: recentActivity = [] } = useQuery({ queryKey: ['recent-activity'], queryFn: () => userApi.getRecentActivity(), enabled: !!userId })

  const firstName = name?.split(' ')[0] ?? 'Utilizador'
  const rankLabel = myRank ? '#' + myRank.rank : '—'
  const totalSkills = skills.length
  const completedChallenges = stats?.completedChallenges ?? 0
  const tierThresholds: Record<string, [number, number]> = {
    BRONZE: [0, 500], SILVER: [500, 1500], GOLD: [1500, 3500], PLATINUM: [3500, 7500], DIAMOND: [7500, 15000]
  }
  const [tierMin, tierMax] = tierThresholds[tier] ?? [0, 500]
  const metaPct = Math.min(Math.round(((xp - tierMin) / (tierMax - tierMin)) * 100), 100)

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-slide-up">

      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Painel
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
          Bem-vindo de volta — continua a tua jornada de aprendizado
        </p>
      </div>

      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 md:p-7"
        style={{
          background: 'linear-gradient(135deg, oklch(0.18 0.060 264) 0%, oklch(0.16 0.055 280) 50%, oklch(0.14 0.060 293) 100%)',
          border: '1px solid oklch(0.50 0.22 264 / 20%)',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }} />
        {/* Glow blobs */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-primary/15 blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-8 right-24 w-36 h-36 rounded-full bg-accent/12 blur-[50px] pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2
              className="text-xl md:text-2xl font-extrabold text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Olá, {firstName}!
            </h2>
            <p className="text-xs text-white/55 mt-1 hidden sm:block">
              Estás no caminho certo para atingir a tua meta semanal
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <HeroPill icon={<Trophy className="size-4 text-yellow-300" />} label="Ranking" value={rankLabel} />
            <HeroPill icon={<Zap className="size-4 text-blue-300" />} label="XP" value={xp.toLocaleString()} />
            <HeroPill icon={<Target className="size-4 text-cyan-300" />} label="Meta" value={metaPct + '%'} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={<Flame className="size-5 text-white" />}
          iconGradient="from-orange-500 to-rose-500"
          label="Sequência"
          value={String(streak)}
          unit="dias"
          progress={Math.min((streak / 30) * 100, 100)}
          glowColor="oklch(0.65 0.22 25 / 30%)"
        />
        <StatCard
          icon={<Award className="size-5 text-white" />}
          iconGradient="from-blue-500 to-violet-500"
          label="Desafios"
          value={String(completedChallenges)}
          unit="completados"
          progress={totalSkills > 0 ? Math.min((completedChallenges / Math.max(totalSkills * 2, 1)) * 100, 100) : 0}
          glowColor="oklch(0.50 0.22 264 / 25%)"
        />
        <StatCard
          icon={<Clock className="size-5 text-white" />}
          iconGradient="from-cyan-500 to-blue-500"
          label="Skills"
          value={String(totalSkills)}
          unit="disponíveis"
          progress={100}
          glowColor="oklch(0.65 0.18 195 / 25%)"
        />
        <StatCard
          icon={<TrendingUp className="size-5 text-white" />}
          iconGradient="from-violet-500 to-purple-600"
          label="Progresso"
          value={String(metaPct)}
          unit="%"
          progress={metaPct}
          glowColor="oklch(0.42 0.22 293 / 25%)"
        />
      </div>

      {/* Recommended tracks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Trilhas Recomendadas
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
              Personalizadas com base no teu progresso
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/skills')}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-semibold"
          >
            Ver Todas <ChevronRight className="size-3.5" />
          </button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {skills.slice(0, 3).map((skill, idx) => (
              <SkillTrackCard key={skill.id} skill={skill} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <WeeklyActivityCard weeklyActivity={stats?.weeklyActivity ?? []} />
        <RecentActivityCard items={recentActivity} />
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-7 md:p-10 text-center space-y-3"
        style={{
          background: 'linear-gradient(oklch(0.16 0.018 264), oklch(0.16 0.018 264)) padding-box, linear-gradient(145deg, oklch(0.55 0.20 232 / 45%), oklch(0.20 0.02 264 / 8%), oklch(0.45 0.22 293 / 35%)) border-box',
          border: '1px solid transparent',
        }}
      >
        <h3
          className="text-xl font-extrabold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Pronto para o próximo desafio?
        </h3>
        <p className="text-sm text-muted-foreground">
          Inicia uma nova simulação e coloca as tuas habilidades à prova
        </p>
        <button
          onClick={() => router.push('/dashboard/tracks')}
          className="relative mt-1 inline-flex items-center gap-2 px-8 py-3 rounded-xl btn-gradient text-white text-sm font-semibold overflow-hidden group"
          style={{ boxShadow: '0 4px 24px oklch(0.50 0.22 264 / 35%)' }}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <span className="relative">Iniciar Simulação</span>
          <ArrowRight className="size-4 relative group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

function HeroPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
      {icon}
      <div>
        <p className="text-[10px] text-white/55 leading-none">{label}</p>
        <p className="text-sm font-bold text-white leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function StatCard({
  icon, iconGradient, label, value, unit, progress, glowColor,
}: {
  icon: React.ReactNode; iconGradient: string; label: string
  value: string; unit: string; progress: number; glowColor: string
}) {
  return (
    <div className="card-hold rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4 group hover:scale-[1.02] transition-transform duration-200">
      <div
        className={cn('size-9 md:size-10 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0', iconGradient)}
        style={{ boxShadow: `0 4px 16px ${glowColor}` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p
          className="text-2xl md:text-3xl font-extrabold mt-1 leading-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
          <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1.5" style={{ fontFamily: 'var(--font-sans)' }}>
            {unit}
          </span>
        </p>
      </div>
      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
          style={{ width: progress + '%' }}
        />
      </div>
    </div>
  )
}

const DIFFICULTY: Record<number, { label: string; cls: string }> = {
  0: { label: 'Iniciante',     cls: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' },
  1: { label: 'Intermediário', cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/30' },
  2: { label: 'Avançado',      cls: 'bg-orange-500/15 text-orange-300 border border-orange-500/30' },
}

function SkillTrackCard({ skill, index }: { skill: SkillResponse; index: number }) {
  const router = useRouter()
  const { setCurrent: setChallenge } = useChallengeStore()
  const diff = DIFFICULTY[skill.difficultyLevel] ?? DIFFICULTY[1]
  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges', skill.id],
    queryFn: () => skillsApi.getChallenges(skill.id),
  })

  function handleStart() {
    const first = challenges[0]
    if (first) {
      setChallenge(first)
      router.push('/dashboard/challenge/' + first.id + '?trackId=' + skill.id)
    }
  }

  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-violet-600 to-purple-500',
    'from-blue-600 to-violet-600',
  ]

  return (
    <div className="card-hold rounded-2xl p-5 flex flex-col gap-4 hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', diff.cls)}>{diff.label}</span>
        <Star className="size-4 text-yellow-400 fill-yellow-400 shrink-0" />
      </div>
      <div>
        <h3
          className="font-bold text-sm leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {skill.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Users className="size-3.5" /> {challenges.length} desafios</span>
        <span className="flex items-center gap-1.5"><Timer className="size-3.5" /> {challenges.length * 2} semanas</span>
      </div>
      <button
        onClick={handleStart}
        className={cn(
          'relative w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r overflow-hidden group',
          gradients[index] ?? gradients[0]
        )}
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        <span className="relative flex items-center justify-center gap-1.5">
          Começar <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </button>
    </div>
  )
}

function WeeklyActivityCard({ weeklyActivity }: { weeklyActivity: DayActivity[] }) {
  const days = weeklyActivity.length > 0
    ? weeklyActivity
    : ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d) => ({ day: d, count: 0 }))
  const maxCount = Math.max(...days.map((d) => d.count), 1)
  const totalCount = days.reduce((s, d) => s + d.count, 0)

  return (
    <div className="card-hold rounded-2xl p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3
            className="font-bold text-sm flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <TrendingUp className="size-4 text-muted-foreground" /> Atividade Semanal
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Desafios completados esta semana</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/25">
          {totalCount} desafios
        </span>
      </div>
      <div className="flex items-end gap-2" style={{ height: 96 }}>
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full rounded-t-lg bg-white/5 overflow-hidden flex flex-col justify-end" style={{ height: 80 }}>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-violet-500 transition-all duration-700"
                style={{ height: (d.count / maxCount) * 80 + 'px' }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground font-medium">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DOT_COLOR = (score: number) =>
  score >= 70 ? 'bg-blue-400' : score >= 50 ? 'bg-violet-400' : 'bg-red-400'

function RecentActivityCard({ items }: { items: RecentActivityItem[] }) {
  return (
    <div className="card-hold rounded-2xl p-5 space-y-4">
      <h3
        className="font-bold text-sm flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Zap className="size-4 text-muted-foreground" /> Atividade Recente
      </h3>
      {items.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Completa o teu primeiro desafio!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={cn('mt-1.5 size-2 rounded-full shrink-0', DOT_COLOR(a.score))} />
              <div>
                <p className="text-sm leading-snug">{a.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card-hold rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="h-5 w-24 rounded-full bg-white/8" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/8" />
        <div className="h-3 w-full rounded bg-white/8" />
        <div className="h-3 w-2/3 rounded bg-white/8" />
      </div>
      <div className="h-1.5 rounded-full bg-white/8" />
      <div className="h-10 rounded-xl bg-white/8" />
    </div>
  )
}
