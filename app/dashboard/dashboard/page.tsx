'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { useChallengeStore } from '@/store/useChallengeStore'
import { skillsApi, leaderboardApi, userApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { SkillResponse, DayActivity, RecentActivityItem } from '@/types'
import { Search, Bell, Trophy, Zap, Target, Flame, Award, Clock, TrendingUp, Users, Timer, ChevronRight, Star } from 'lucide-react'

export default function DashboardPage() {
  const { name, userId } = useAuthStore()
  const { xp, streak, tier } = useGamificationStore()
  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: skillsApi.getAll })
  const { data: myRank } = useQuery({ queryKey: ['my-rank', tier, userId], queryFn: () => leaderboardApi.getUserRank(tier, userId!), enabled: !!userId, retry: false })
  const { data: stats } = useQuery({ queryKey: ['user-stats', userId], queryFn: () => userApi.getStats(userId!), enabled: !!userId })
  const { data: recentActivity = [] } = useQuery({ queryKey: ['recent-activity', userId], queryFn: () => userApi.getRecentActivity(userId!), enabled: !!userId })
  const firstName = name?.split(' ')[0] ?? 'Usuário'
  const rankLabel = myRank ? '#' + myRank.rank : '—'
  const totalSkills = skills.length
  const completedChallenges = stats?.completedChallenges ?? 0
  const tierThresholds: Record<string, [number, number]> = { BRONZE: [0, 500], SILVER: [500, 1500], GOLD: [1500, 3500], PLATINUM: [3500, 7000], DIAMOND: [7000, 12000] }
  const [tierMin, tierMax] = tierThresholds[tier] ?? [0, 500]
  const metaPct = Math.min(Math.round(((xp - tierMin) / (tierMax - tierMin)) * 100), 100)

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Painel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Bem-vindo de volta! Continue sua jornada de aprendizado</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="Buscar..." className="h-9 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-48 transition-colors" />
          </div>
          <button className="relative size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="size-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-blue-400" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-14 right-28 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta, {firstName}! 👋</h2>
            <p className="text-sm text-white/60 mt-1">Você está no caminho certo para atingir sua meta semanal de aprendizado</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <HeroPill icon={<Trophy className="size-4 text-yellow-300" />} label="Ranking" value={rankLabel} />
            <HeroPill icon={<Zap className="size-4 text-blue-300" />} label="XP" value={xp.toLocaleString()} />
            <HeroPill icon={<Target className="size-4 text-cyan-300" />} label="Meta" value={metaPct + '%'} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Flame className="size-5 text-white" />} iconGradient="from-orange-500 to-pink-500" label="Sequência de Aprendizado" value={String(streak)} unit="dias" progress={Math.min((streak / 30) * 100, 100)} />
        <StatCard icon={<Award className="size-5 text-white" />} iconGradient="from-blue-500 to-violet-500" label="Desafios Completados" value={String(completedChallenges)} unit="desafios" progress={totalSkills > 0 ? Math.min((completedChallenges / Math.max(totalSkills * 2, 1)) * 100, 100) : 0} />
        <StatCard icon={<Clock className="size-5 text-white" />} iconGradient="from-cyan-500 to-blue-500" label="Trilhas Disponíveis" value={String(totalSkills)} unit="trilhas" progress={100} />
        <StatCard icon={<TrendingUp className="size-5 text-white" />} iconGradient="from-violet-500 to-purple-600" label="Progresso Geral" value={String(metaPct)} unit="%" progress={metaPct} />
      </div>

      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Trilhas de Aprendizado Recomendadas</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Personalizadas com base no seu progresso e interesses</p>
          </div>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 shrink-0 mt-1">Ver Todas <ChevronRight className="size-4" /></button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{skills.slice(0, 3).map((skill, idx) => <SkillTrackCard key={skill.id} skill={skill} index={idx} />)}</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyActivityCard weeklyActivity={stats?.weeklyActivity ?? []} />
        <RecentActivityCard items={recentActivity} />
      </div>

      <div className="card-hold rounded-2xl p-10 text-center space-y-3">
        <h3 className="text-xl font-bold">Pronto para seu próximo desafio?</h3>
        <p className="text-sm text-muted-foreground">Inicie uma nova simulação e coloque suas habilidades à prova</p>
        <button className="mt-2 px-8 py-3 rounded-xl btn-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Iniciar Simulação</button>
      </div>
    </div>
  )
}

function HeroPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
      {icon}
      <div>
        <p className="text-[10px] text-white/60 leading-none">{label}</p>
        <p className="text-sm font-bold text-white leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ icon, iconGradient, label, value, unit, progress }: { icon: React.ReactNode; iconGradient: string; label: string; value: string; unit: string; progress: number }) {
  return (
    <div className="card-hold rounded-2xl p-5 space-y-4">
      <div className={cn('size-10 rounded-xl flex items-center justify-center bg-gradient-to-br', iconGradient)}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground leading-snug">{label}</p>
        <p className="text-2xl font-bold mt-1.5">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700" style={{ width: progress + '%' }} />
      </div>
    </div>
  )
}

const DIFFICULTY: Record<number, { label: string; cls: string }> = {
  0: { label: 'Iniciante', cls: 'bg-violet-500/20 text-violet-300 border border-violet-500/30' },
  1: { label: 'Intermediário', cls: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  2: { label: 'Avançado', cls: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
}
const BTN_GRADIENTS = ['from-blue-500 to-cyan-400', 'from-violet-600 to-purple-500', 'from-blue-600 to-violet-600']

function SkillTrackCard({ skill, index }: { skill: SkillResponse; index: number }) {
  const router = useRouter()
  const { setCurrent: setChallenge } = useChallengeStore()
  const diff = DIFFICULTY[skill.difficultyLevel] ?? DIFFICULTY[1]
  const { data: challenges = [] } = useQuery({ queryKey: ['challenges', skill.id], queryFn: () => skillsApi.getChallenges(skill.id) })
  function handleStart() { const first = challenges[0]; if (first) { setChallenge(first); router.push('/dashboard/challenge/' + first.id) } }
  return (
    <div className="card-hold rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', diff.cls)}>{diff.label}</span>
        <Star className="size-4 text-yellow-400 fill-yellow-400 shrink-0" />
      </div>
      <div>
        <h3 className="font-semibold">{skill.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{skill.description}</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Users className="size-3.5" /> {challenges.length} desafios</span>
        <span className="flex items-center gap-1.5"><Timer className="size-3.5" /> {challenges.length * 2} semanas</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progresso</span><span className="font-medium">0%</span></div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 w-0" /></div>
      </div>
      <button onClick={handleStart} className={cn('w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r hover:opacity-90 transition-opacity flex items-center justify-center gap-2', BTN_GRADIENTS[index] ?? BTN_GRADIENTS[0])}>
        Continuar Aprendendo <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

function WeeklyActivityCard({ weeklyActivity }: { weeklyActivity: DayActivity[] }) {
  const days = weeklyActivity.length > 0 ? weeklyActivity : ['S','T','Q','Q','S','S','D'].map((d) => ({ day: d, count: 0 }))
  const maxCount = Math.max(...days.map((d) => d.count), 1)
  const totalCount = days.reduce((s, d) => s + d.count, 0)
  return (
    <div className="card-hold rounded-2xl p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2 text-sm"><TrendingUp className="size-4 text-muted-foreground" /> Atividade Semanal</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Desafios completados esta semana</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">{totalCount} desafios</span>
      </div>
      <div className="flex items-end gap-2" style={{ height: 96 }}>
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full rounded-t-md bg-white/5 overflow-hidden flex flex-col justify-end" style={{ height: 80 }}>
              <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-violet-500 transition-all duration-700" style={{ height: (d.count / maxCount) * 80 + 'px' }} />
            </div>
            <span className="text-[10px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DOT_COLOR = (score: number) => score >= 70 ? 'bg-blue-400' : score >= 50 ? 'bg-violet-400' : 'bg-red-400'

function RecentActivityCard({ items }: { items: RecentActivityItem[] }) {
  return (
    <div className="card-hold rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold flex items-center gap-2 text-sm"><Zap className="size-4 text-muted-foreground" /> Atividade Recente</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma atividade ainda. Complete seu primeiro desafio!</p>
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
      <div className="h-5 w-24 rounded-full bg-white/10" />
      <div className="space-y-2"><div className="h-4 w-3/4 rounded bg-white/10" /><div className="h-3 w-full rounded bg-white/10" /><div className="h-3 w-2/3 rounded bg-white/10" /></div>
      <div className="h-1.5 rounded-full bg-white/10" />
      <div className="h-10 rounded-xl bg-white/10" />
    </div>
  )
}