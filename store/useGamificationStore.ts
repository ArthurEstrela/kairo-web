'use client'

import { create } from 'zustand'
import type { GamificationProfile, LeagueTier } from '@/types'

interface GamificationState {
  xp: number
  lives: number
  maxLives: number
  streak: number
  tier: LeagueTier
  loaded: boolean
  setProfile: (profile: GamificationProfile) => void
  updateAfterChallenge: (xp: number, lives: number) => void
}

export const useGamificationStore = create<GamificationState>((set) => ({
  xp: 0,
  lives: 5,
  maxLives: 5,
  streak: 0,
  tier: 'BRONZE',
  loaded: false,

  setProfile: (profile) =>
    set({
      xp: profile.currentXp,
      lives: profile.currentLives,
      maxLives: profile.maxLives,
      streak: profile.currentStreak,
      tier: profile.tier,
      loaded: true,
    }),

  updateAfterChallenge: (xp, lives) => set({ xp, lives }),
}))
