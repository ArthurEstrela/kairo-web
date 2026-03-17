'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: string | null
  name: string | null
  email: string | null
  isAuthenticated: boolean
  setAuth: (auth: { token: string; userId: string; name: string; email: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      name: null,
      email: null,
      isAuthenticated: false,

      setAuth: ({ token, userId, name, email }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kairo_token', token)
        }
        set({ token, userId, name, email, isAuthenticated: true })
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kairo_token')
        }
        set({ token: null, userId: null, name: null, email: null, isAuthenticated: false })
      },
    }),
    {
      name: 'kairo_auth',
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        name: state.name,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
