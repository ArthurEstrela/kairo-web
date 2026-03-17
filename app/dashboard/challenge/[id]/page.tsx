'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useChallengeStore } from '@/store/useChallengeStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { challengeApi } from '@/lib/api'
import { ChatWindow } from '@/components/features/challenge/ChatWindow'
import { XpAnimation } from '@/components/features/gamification/XpAnimation'
import type { ChatMessage, InteractionResultResponse } from '@/types'
import { ArrowLeft, Send, Heart, Zap, MessageSquare, HelpCircle } from 'lucide-react'

function makeId() {
  return Math.random().toString(36).slice(2)
}

const OPENING_MESSAGE = (title: string, type: string): ChatMessage => ({
  id: makeId(),
  role: 'ai',
  content: type === 'ROLEPLAY'
    ? `Welcome to the simulation: "${title}". I'm your AI counterpart. State your case clearly and persuasively — I'll respond in character. Begin whenever you're ready.`
    : `Quiz challenge: "${title}". Read the scenario carefully and type your best answer. Your response will be evaluated on argumentation, confidence, and persuasion. Go ahead!`,
  timestamp: new Date(),
})

export default function ChallengePage() {
  const router    = useRouter()
  const challenge = useChallengeStore((s) => s.current)
  const { lives, xp, updateAfterChallenge } = useGamificationStore()

  const [messages, setMessages]   = useState<ChatMessage[]>(() =>
    challenge ? [OPENING_MESSAGE(challenge.title, challenge.type)] : []
  )
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<InteractionResultResponse | null>(null)
  const [xpVisible, setXpVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const inputRef                  = useRef<HTMLTextAreaElement>(null)

  // If user navigated directly without a challenge in store
  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">No challenge selected.</p>
        <button onClick={() => router.back()} className="text-primary text-sm hover:underline">
          ← Go back
        </button>
      </div>
    )
  }

  // Captured after guard — TypeScript now knows this is non-null in all inner functions
  const activeChallenge = challenge

  async function handleSubmit() {
    if (!input.trim() || loading) return

    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await challengeApi.evaluate({
        challengeId: activeChallenge.id,
        userInput: userMsg.content,
      })

      const aiMsg: ChatMessage = {
        id: makeId(),
        role: 'ai',
        content: res.feedbackMessage,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMsg])
      setResult(res)
      updateAfterChallenge(res.totalXp, res.livesRemaining)
      setXpVisible(true)

      // Fire confetti for great scores
      if (res.scoreObtained >= 70) {
        const confetti = (await import('canvas-confetti')).default
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2259E4', '#6D2BD9', '#0790DF', '#ffffff'],
        })
      }

      setTimeout(() => setShowModal(true), 800)
    } catch {
      const errMsg: ChatMessage = {
        id: makeId(),
        role: 'ai',
        content: 'Something went wrong evaluating your response. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleTryAgain() {
    setMessages([OPENING_MESSAGE(activeChallenge.title, activeChallenge.type)])
    setResult(null)
    setShowModal(false)
    setXpVisible(false)
    inputRef.current?.focus()
  }

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      {/* XP toast */}
      <XpAnimation
        xpGained={result ? result.totalXp - xp : 0}
        visible={xpVisible}
        onComplete={() => setXpVisible(false)}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="size-9 glass rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{challenge.title}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              challenge.type === 'ROLEPLAY' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'
            }`}>
              {challenge.type === 'ROLEPLAY'
                ? <><MessageSquare className="size-3 inline mr-1" />Roleplay</>
                : <><HelpCircle className="size-3 inline mr-1" />Quiz</>
              }
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="size-3" />{challenge.xpReward} XP
            </span>
          </div>
        </div>

        {/* Lives */}
        <div className="flex gap-1 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart key={i} className={`size-4 ${i < lives ? 'text-red-400 fill-red-400' : 'text-muted-foreground/30'}`} />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden min-h-0">
        <ChatWindow messages={messages} isLoading={loading} />

        {/* Input */}
        <div className="border-t border-white/5 p-3 flex gap-2 items-end shrink-0">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response… (Enter to send, Shift+Enter for new line)"
            disabled={loading || !!result}
            rows={2}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none transition-colors disabled:opacity-40 scrollbar-thin"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading || !!result}
            className="size-10 btn-gradient rounded-lg flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-opacity shrink-0"
          >
            <Send className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Result modal */}
      {showModal && result && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="glass rounded-2xl p-8 max-w-sm w-full glow-blue animate-slide-up text-center space-y-5">
            <div className="text-5xl">{result.scoreObtained >= 80 ? '🏆' : result.scoreObtained >= 60 ? '👍' : '💪'}</div>

            <div>
              <p className="text-muted-foreground text-sm mb-1">Your Score</p>
              <p className={`text-5xl font-bold ${scoreColor(result.scoreObtained)}`}>
                {result.scoreObtained}
              </p>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            </div>

            <div className="flex justify-center gap-4 text-sm">
              <div className="text-center">
                <p className="gradient-text font-bold">+{challenge.xpReward}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="text-center">
                <p className="text-red-400 font-bold">{result.livesRemaining}</p>
                <p className="text-xs text-muted-foreground">Lives left</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTryAgain}
                className="flex-1 glass rounded-xl py-2.5 text-sm font-medium hover:bg-white/8 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/dashboard/dashboard')}
                className="flex-1 btn-gradient rounded-xl py-2.5 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
