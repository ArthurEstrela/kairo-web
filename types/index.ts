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
  difficultyLevel: number  // 0=Iniciante 1=Intermediário 2=Avançado
}

export interface ChallengeResponse {
  id: string
  skillId: string
  title: string
  xpReward: number
  levelOrder: number
  type: 'ROLEPLAY' | 'QUIZ'
  maxTurns: number
  status: ChallengeStatus | null
}

// ─── Tracks ──────────────────────────────────────────────────────────────────
export type ChallengeStatus = 'COMPLETED' | 'ACTIVE' | 'LOCKED'

export interface TrackChallengeResponse {
  id: string
  title: string
  xpReward: number
  levelOrder: number
  maxTurns: number
  status: ChallengeStatus
  bestScore: number
}

export interface TrackWithChallengesResponse {
  id: string
  title: string
  description: string
  challenges: TrackChallengeResponse[]
}

export interface MyTracksResponse {
  totalCount: number
  tracks: TrackWithChallengesResponse[]
}

export interface GenerateTrackResponse {
  id: string
}

// ─── Arena ───────────────────────────────────────────────────────────────────
export interface WsResultPayload {
  interactionId: string
  score: number
  xpAwarded: number
  livesRemaining: number
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

// ─── User Stats ───────────────────────────────────────────────────────────────

export interface DayActivity {
  day: string
  count: number
}

export interface UserStats {
  completedChallenges: number
  weeklyActivity: DayActivity[]
}

export interface RecentActivityItem {
  description: string
  timeAgo: string
  score: number
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}
