'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { cn } from '@/lib/utils'
import type { LeagueTier } from '@/types'
import {
  LayoutDashboard,
  BookOpen,
  Map,
  BarChart2,
  Trophy,
  Brain,
  LogOut,
  Flame,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard/dashboard', label: 'Painel',           icon: LayoutDashboard },
  { href: '/dashboard/skills',    label: 'Catálogo',         icon: BookOpen },
  { href: '/dashboard/tracks',    label: 'As Minhas Trilhas', icon: Map },
  { href: '/dashboard/profile',   label: 'Progresso',        icon: BarChart2 },
  { href: '/dashboard/league',    label: 'Liga',             icon: Trophy },
]

const TIER_CONFIG: Record<LeagueTier, { label: string; emoji: string; barColor: string; xpRange: [number, number] }> = {
  BRONZE:   { label: 'Bronze',   emoji: '🥉', barColor: 'from-amber-600  to-orange-500', xpRange: [0,    500]   },
  SILVER:   { label: 'Prata',    emoji: '🥈', barColor: 'from-slate-400  to-slate-300',  xpRange: [500,  1500]  },
  GOLD:     { label: 'Ouro',     emoji: '🥇', barColor: 'from-yellow-500 to-amber-400',  xpRange: [1500, 3500]  },
  PLATINUM: { label: 'Platina',  emoji: '💎', barColor: 'from-cyan-500   to-teal-400',   xpRange: [3500, 7000]  },
  DIAMOND:  { label: 'Diamante', emoji: '💠', barColor: 'from-violet-500 to-purple-400', xpRange: [7000, 12000] },
}

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { name, logout } = useAuthStore()
  const { xp, lives, maxLives, streak, tier } = useGamificationStore()

  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const tierCfg = TIER_CONFIG[tier]
  const [xpMin, xpMax] = tierCfg.xpRange
  const xpPct = Math.min(Math.round(((xp - xpMin) / Math.max(xpMax - xpMin, 1)) * 100), 100)

  return (
    <aside
      className="hidden md:flex w-56 shrink-0 flex-col h-full border-r border-white/6"
      style={{ background: 'oklch(0.11 0.015 264)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <div className="size-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg shrink-0">
          <Brain className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-none">Kairo</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Aprende praticando</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard/dashboard' && pathname.startsWith(href + '/'))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(59,91,219,0.35), rgba(109,43,217,0.25))',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }
                  : undefined
              }
            >
              <Icon
                className={cn(
                  'size-4 shrink-0',
                  isActive ? 'text-blue-400' : 'text-muted-foreground/70'
                )}
              />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Gamification stats */}
      <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-white/3 border border-white/6 space-y-2.5">
        {/* Lives + Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span key={i} className={cn('text-sm', i < lives ? '' : 'opacity-25')}>
                ❤️
              </span>
            ))}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-orange-400">
              <Flame className="size-3.5" />
              {streak}
            </div>
          )}
        </div>

        {/* XP bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">{tierCfg.emoji} {tierCfg.label}</span>
            <span className="text-muted-foreground font-medium">{xpPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className={cn('h-full rounded-full bg-linear-to-r transition-all duration-700', tierCfg.barColor)}
              style={{ width: xpPct + '%' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">{xp.toLocaleString()} XP</p>
        </div>
      </div>

      {/* User + logout */}
      <div className="p-3 border-t border-white/6">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
          <div className="size-8 rounded-full btn-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-none">{name ?? 'Usuário'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Terminar sessão"
            className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors shrink-0"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
