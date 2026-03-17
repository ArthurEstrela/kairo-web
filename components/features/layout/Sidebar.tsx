'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Play,
  BarChart2,
  Users,
  Brain,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard/dashboard',   label: 'Painel',                 icon: LayoutDashboard },
  { href: '/dashboard/skills',      label: 'Trilhas de Aprendizado', icon: BookOpen },
  { href: '/dashboard/simulations', label: 'Simulações',             icon: Play },
  { href: '/dashboard/profile',     label: 'Progresso',              icon: BarChart2 },
  { href: '/dashboard/league',      label: 'Comunidade',             icon: Users },
]

// Pages that don't exist yet → redirect to dashboard
const STUB_ROUTES = ['/dashboard/skills', '/dashboard/simulations']

export function Sidebar() {
  const pathname         = usePathname()
  const router           = useRouter()
  const { name, logout } = useAuthStore()
  const { tier }         = useGamificationStore()

  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside
      className="w-52 shrink-0 flex flex-col h-full border-r border-white/6"
      style={{ background: 'oklch(0.11 0.015 264)' }}
    >
      {/* Logo area */}
      <div className="px-5 pt-6 pb-5">
        <div className="size-9 rounded-xl btn-gradient flex items-center justify-center mb-3 shadow-lg">
          <Brain className="size-5 text-white" />
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          Aprenda através da prática
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (!STUB_ROUTES.includes(href) && pathname.startsWith(href + '/'))

          const resolvedHref = STUB_ROUTES.includes(href)
            ? '/dashboard/dashboard'
            : href

          return (
            <Link
              key={href}
              href={resolvedHref}
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
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
                  : undefined
              }
            >
              <Icon
                className={cn(
                  'size-4 shrink-0',
                  isActive ? 'text-blue-400' : 'text-muted-foreground'
                )}
              />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-white/6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
          title="Clique para sair"
        >
          <div className="size-8 rounded-full btn-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {name ?? 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground">
              {tier === 'DIAMOND' || tier === 'PLATINUM' ? 'Membro Pro' : 'Plano Gratuito'}
            </p>
          </div>
        </button>
      </div>
    </aside>
  )
}
