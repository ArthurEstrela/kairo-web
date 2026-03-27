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
  Sword,
  LogOut,
  Flame,
  Heart,
  Zap,
  ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard/dashboard', label: 'Painel',            icon: LayoutDashboard },
  { href: '/dashboard/skills',    label: 'Catálogo',          icon: BookOpen },
  { href: '/dashboard/tracks',    label: 'As Minhas Trilhas', icon: Map },
  { href: '/dashboard/profile',   label: 'Progresso',         icon: BarChart2 },
  { href: '/dashboard/league',    label: 'Liga',              icon: Trophy },
]

const TIER_CONFIG: Record<LeagueTier, { label: string; emoji: string; barColor: string; xpRange: [number, number] }> = {
  BRONZE:   { label: 'Bronze',   emoji: '🥉', barColor: 'from-amber-600  to-orange-500', xpRange: [0,    500]   },
  SILVER:   { label: 'Prata',    emoji: '🥈', barColor: 'from-slate-400  to-slate-300',  xpRange: [500,  1500]  },
  GOLD:     { label: 'Ouro',     emoji: '🥇', barColor: 'from-yellow-500 to-amber-400',  xpRange: [1500, 3500]  },
  PLATINUM: { label: 'Platina',  emoji: '💎', barColor: 'from-cyan-500   to-teal-400',   xpRange: [3500, 7500]  },
  DIAMOND:  { label: 'Diamante', emoji: '💠', barColor: 'from-violet-500 to-purple-400', xpRange: [7500, 15000] },
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
      style={{ background: 'oklch(0.10 0.018 264)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="size-9 rounded-xl btn-gradient flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 0 18px oklch(0.50 0.22 264 / 40%)' }}
          >
            <Sword className="size-4 text-white" />
          </div>
          <div>
            <p
              className="text-sm font-extrabold leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              KAIRO
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">Aprende praticando</p>
          </div>
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
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
              style={isActive ? {
                background: 'linear-gradient(135deg, oklch(0.50 0.22 264 / 18%), oklch(0.42 0.22 293 / 12%))',
                border: '1px solid oklch(0.50 0.22 264 / 18%)',
                borderLeft: '2px solid oklch(0.65 0.22 264 / 85%)',
              } : undefined}
            >
              <Icon className={cn(
                'size-4 shrink-0 transition-colors',
                isActive ? 'text-blue-400' : 'text-muted-foreground/60 group-hover:text-muted-foreground'
              )} />
              <span className="truncate flex-1">{label}</span>
              {isActive && <ChevronRight className="size-3 text-blue-400/50 shrink-0" />}
            </Link>
          )
        })}
      </nav>

      {/* Gamification card */}
      <div
        className="mx-3 mb-2 rounded-xl overflow-hidden"
        style={{
          background: 'oklch(0.13 0.018 264)',
          border: '1px solid oklch(1 0 0 / 7%)',
        }}
      >
        {/* Tier header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
          <span className="text-[11px] font-semibold text-foreground/80 tracking-wide">
            {tierCfg.emoji} {tierCfg.label}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">{xpPct}%</span>
        </div>

        <div className="px-4 py-3 space-y-3">
          {/* Lives + Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    'size-3.5',
                    i < lives
                      ? 'text-red-400 fill-red-400'
                      : 'text-muted-foreground/20 fill-muted-foreground/10'
                  )}
                />
              ))}
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-orange-400">
                <Flame className="size-3" />
                {streak} dias
              </div>
            )}
          </div>

          {/* XP bar */}
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className={cn('h-full rounded-full bg-linear-to-r transition-all duration-700', tierCfg.barColor)}
                style={{ width: xpPct + '%' }}
              />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Zap className="size-2.5 text-blue-400" />
              <span className="font-semibold text-foreground/70">{xp.toLocaleString()}</span>
              <span>XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* User + logout */}
      <div className="p-3 border-t border-white/6">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/4 transition-colors">
          <div
            className="size-8 rounded-full btn-gradient flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ boxShadow: '0 0 10px oklch(0.50 0.22 264 / 30%)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-none">{name ?? 'Usuário'}</p>
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
