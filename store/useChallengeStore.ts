'use client'

import { create } from 'zustand'
import type { ChallengeResponse, ChatMessage } from '@/types'

interface ChallengeState {
  current: ChallengeResponse | null
  currentTurn: number
  maxTurns: number
  conversationHistory: ChatMessage[]

  setCurrent: (challenge: ChallengeResponse) => void
  setMaxTurns: (n: number) => void
  setCurrentTurn: (n: number) => void
  addMessage: (msg: ChatMessage) => void
  clear: () => void
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  current: null,
  currentTurn: 0,
  maxTurns: 0,
  conversationHistory: [],

  setCurrent: (challenge) => set({ current: challenge }),
  setMaxTurns: (n) => set({ maxTurns: n }),
  setCurrentTurn: (n) => set({ currentTurn: n }),
  addMessage: (msg) => set((s) => ({ conversationHistory: [...s.conversationHistory, msg] })),
  clear: () => set({ current: null, currentTurn: 0, maxTurns: 0, conversationHistory: [] }),
}))
