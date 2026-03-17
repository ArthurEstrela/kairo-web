'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { gamificationApi } from '@/lib/api'
import { Sidebar } from '@/components/features/layout/Sidebar'
import { TopBar } from '@/components/features/layout/TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router          = useRouter()
  const { isAuthenticated, userId } = useAuthStore()
  const { setProfile, loaded }      = useGamificationStore()

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  // Load gamification profile once
  useEffect(() => {
    if (!userId || loaded) return
    gamificationApi.getProfile(userId).then(setProfile).catch(() => {/* silent */})
  }, [userId, loaded, setProfile])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[5%] w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
