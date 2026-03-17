import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SkillResponse,
  ChallengeResponse,
  SubmitInteractionRequest,
  InteractionResultResponse,
  GamificationProfile,
  LeaderboardEntry,
  UserStats,
  RecentActivityItem,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('kairo_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new Error(body || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillsApi = {
  getAll: () => request<SkillResponse[]>('/api/v1/skills'),

  getChallenges: (skillId: string) =>
    request<ChallengeResponse[]>(`/api/v1/skills/${skillId}/challenges`),
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export const challengeApi = {
  evaluate: (data: SubmitInteractionRequest) =>
    request<InteractionResultResponse>('/api/v1/challenges/evaluate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export const gamificationApi = {
  getProfile: (userId: string) =>
    request<GamificationProfile>(`/api/v1/gamification/profile/${userId}`),
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export const leaderboardApi = {
  getTopN: (tier: string, top = 10) =>
    request<LeaderboardEntry[]>(`/api/v1/leaderboard/${tier}?top=${top}`),

  getUserRank: (tier: string, userId: string) =>
    request<LeaderboardEntry>(`/api/v1/leaderboard/${tier}/users/${userId}`),
}

// ─── User Stats ───────────────────────────────────────────────────────────────

export const userApi = {
  getStats: (userId: string) =>
    request<UserStats>(`/api/v1/users/${userId}/stats`),

  getRecentActivity: (userId: string) =>
    request<RecentActivityItem[]>(`/api/v1/users/${userId}/recent-activity`),
}
