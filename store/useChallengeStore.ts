'use client'

import { create } from 'zustand'
import type { ChallengeResponse } from '@/types'

interface ChallengeState {
  current: ChallengeResponse | null
  setCurrent: (challenge: ChallengeResponse) => void
  clear: () => void
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  current: null,
  setCurrent: (challenge) => set({ current: challenge }),
  clear: () => set({ current: null }),
}))
