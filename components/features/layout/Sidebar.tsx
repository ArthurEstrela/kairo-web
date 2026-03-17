'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Trophy,
  User,
  LogOut,
  Sword,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/dashboard/league',    label: 'League',      icon: Trophy },
  { href: '/dashboard/profile',   label: 'Profile',     icon: User },
]

export function Sidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { logout } = useAuthStore()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-border/50 bg-sidebar">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border/50">
        <div className="size-7 rounded-lg btn-gradient flex items-center justify-center">
          <Sword className="size-4 text-white" />
        </div>
        <span className="text-lg font-bold gradient-text tracking-tight">Kairo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary/15 text-primary glow-blue'
                  : 'text-sidebar-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <Icon className={cn('size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
