'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { gamificationApi } from '@/lib/api'
import { Sidebar } from '@/components/features/layout/Sidebar'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Map,
  BarChart2,
  Trophy,
  Sword,
  Flame,
  Zap,
  Heart,
} from 'lucide-react'

const MOBILE_NAV_ITEMS = [
  { href: '/dashboard/dashboard', label: 'Painel',   icon: LayoutDashboard },
  { href: '/dashboard/tracks',    label: 'Trilhas',  icon: Map },
  { href: '/dashboard/league',    label: 'Liga',     icon: Trophy },
  { href: '/dashboard/skills',    label: 'Catálogo', icon: BookOpen },
  { href: '/dashboard/profile',   label: 'Perfil',   icon: BarChart2 },
]

function MobileTopBar() {
  const { xp, streak, lives, maxLives } = useGamificationStore()

  return (
    <header
      className="md:hidden h-14 border-b border-white/6 flex items-center justify-between px-4 shrink-0"
      style={{ background: 'oklch(0.10 0.018 264)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="size-7 rounded-lg btn-gradient flex items-center justify-center shrink-0"
          style={{ boxShadow: '0 0 10px oklch(0.50 0.22 264 / 40%)' }}
        >
          <Sword className="size-3.5 text-white" />
        </div>
        <span
          className="text-sm font-extrabold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          KAIRO
        </span>
      </div>

      {/* Quick gamification stats */}
      <div className="flex items-center gap-3">
        {streak > 0 && (
          <div className="flex items-center gap-1 text-orange-400 font-bold text-xs">
            <Flame className="size-3.5" />
            <span>{streak}</span>
          </div>
        )}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'size-3',
                i < lives ? 'text-red-400 fill-red-400' : 'text-muted-foreground/20 fill-muted-foreground/10'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-blue-400 font-bold text-xs">
          <Zap className="size-3.5" />
          <span>{xp.toLocaleString()}</span>
        </div>
      </div>
    </header>
  )
}

function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8"
      style={{ background: 'oklch(0.10 0.018 264)' }}
    >
      <div className="flex items-stretch">
        {MOBILE_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard/dashboard' && pathname.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-semibold transition-colors relative',
                isActive ? 'text-blue-400' : 'text-muted-foreground/60'
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-400" />
              )}
              <Icon className={cn('size-5', isActive ? 'text-blue-400' : 'text-muted-foreground/50')} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router                                    = useRouter()
  const { isAuthenticated, userId, _hasHydrated } = useAuthStore()
  const { setProfile, loaded }                    = useGamificationStore()

  useEffect(() => {
    if (!_hasHydrated) return
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router, _hasHydrated])

  useEffect(() => {
    if (!userId || loaded) return
    gamificationApi.getProfile().then(setProfile).catch(() => {/* silent */})
  }, [userId, loaded, setProfile])

  if (!_hasHydrated) return null
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[5%] w-96 h-96 rounded-full bg-primary/4 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 rounded-full bg-accent/4 blur-[120px]" />
      </div>

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <MobileTopBar />
        <main className="flex-1 min-w-0 overflow-y-auto scrollbar-thin p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
