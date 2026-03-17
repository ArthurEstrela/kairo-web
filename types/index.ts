// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: string
  name: string
  email: string
}

// ─── Skills & Challenges ────────────────────────────────────────────────────

export interface SkillResponse {
  id: string
  name: string
  description: string
}

export interface ChallengeResponse {
  id: string
  skillId: string
  title: string
  xpReward: number
  levelOrder: number
  type: 'ROLEPLAY' | 'QUIZ'
}

export interface SubmitInteractionRequest {
  challengeId: string
  userInput: string
}

export interface InteractionResultResponse {
  scoreObtained: number
  totalXp: number
  livesRemaining: number
  feedbackMessage: string
}

// ─── Gamification ────────────────────────────────────────────────────────────

export type LeagueTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'

export interface GamificationProfile {
  id: string
  userId: string
  currentXp: number
  currentLives: number
  maxLives: number
  currentStreak: number
  tier: LeagueTier
  lastLifeLostAt: string | null
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string
  username: string
  xp: number
  rank: number
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}
