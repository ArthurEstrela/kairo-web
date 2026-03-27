'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useChallengeStore } from '@/store/useChallengeStore'
import { useChatWebSocket } from '@/hooks/useChatWebSocket'
import { tracksApi } from '@/lib/api'
import type { TrackWithChallengesResponse } from '@/types'

export default function ArenaPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const trackId = searchParams.get('trackId')
  const queryClient = useQueryClient()

  const store = useChallengeStore()
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isInputEnabled, setIsInputEnabled] = useState(false)
  const [resultModal, setResultModal] = useState<{ score: number; xp: number; lives: number } | null>(null)
  const [completeError, setCompleteError] = useState<'409' | 'network' | null>(null)
  const [disconnectError, setDisconnectError] = useState(false)
  const pendingCompleteRef = useRef<{ challengeId: string; interactionId: string } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackId) {
      router.push('/dashboard')
    }
    return () => { store.clear() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cached = queryClient.getQueryData<TrackWithChallengesResponse>(['track', trackId])
    if (cached) {
      const challenge = cached.challenges?.find((c) => c.id === params.id)
      if (challenge?.maxTurns) store.setMaxTurns(challenge.maxTurns)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { sendTurn } = useChatWebSocket({
    challengeId: params.id,
    trackId: trackId ?? '',
    onChunk: (delta, isNew) => {
      setMessages((prev) => {
        if (isNew || prev.length === 0 || prev[prev.length - 1].role !== 'ai') {
          return [...prev, { role: 'ai', content: delta }]
        }
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: updated[updated.length - 1].content + delta,
        }
        return updated
      })
    },
    onTurnAck: () => setIsInputEnabled(true),
    onDisconnect: () => {
      setDisconnectError(true)
    },
    onResult: (score, xp, lives, interactionId) => {
      setIsInputEnabled(false)
      setResultModal({ score, xp, lives })
      pendingCompleteRef.current = { challengeId: params.id, interactionId }
      queryClient.invalidateQueries({ queryKey: ['track', trackId] })
    },
    onCompleteError: (type) => setCompleteError(type),
  })

  useEffect(() => {
    if (store.maxTurns > 0 && !isInputEnabled && !resultModal) {
      const id = setTimeout(() => setIsInputEnabled(true), 0)
      return () => clearTimeout(id)
    }
  }, [store.maxTurns]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = inputValue.trim()
    if (!text || !isInputEnabled) return
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInputValue('')
    setIsInputEnabled(false)
    sendTurn(text)
  }

  const progress = store.maxTurns > 0
    ? (store.currentTurn / store.maxTurns) * 100
    : 0

  if (!trackId) return null

  if (disconnectError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 max-w-md mx-auto text-center p-4">
        <p className="text-lg font-semibold">Ligação perdida</p>
        <p className="text-sm text-muted-foreground">A sessão foi interrompida. Podes tentar de novo.</p>
        <button
          onClick={() => router.push(trackId ? `/dashboard/tracks/${trackId}` : '/dashboard')}
          className="btn-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl"
        >
          Voltar à Trilha
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push(`/dashboard/tracks/${trackId}`)}
          className="w-9 h-9 bg-white/6 border border-white/8 rounded-xl flex items-center justify-center text-muted-foreground text-sm hover:bg-white/10"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {store.current?.title ?? 'Desafio'}
          </p>
          <p className="text-xs text-muted-foreground">Roleplay · +{store.current?.xpReward ?? 0} XP</p>
        </div>
      </div>

      {/* Progress bar */}
      {store.maxTurns > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Progresso</span>
            <span className="text-xs font-bold text-foreground">
              Turno {store.currentTurn} / {store.maxTurns}
            </span>
          </div>
          <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2259E4, #6D2BD9)',
              }}
            />
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-white/2 border border-white/6 rounded-2xl p-4 space-y-3 mb-4 min-h-0">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'self-end ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs
              ${msg.role === 'ai'
                ? 'bg-gradient-to-br from-blue-800 to-purple-800'
                : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
              {msg.role === 'ai' ? '🤖' : '👤'}
            </div>
            <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed
              ${msg.role === 'ai'
                ? 'bg-white/5 border border-indigo-500/20 text-gray-300 rounded-bl-sm'
                : 'bg-blue-500/12 border border-blue-500/25 text-blue-200 rounded-br-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex items-center gap-2 p-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 items-end pb-16 md:pb-0">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
          }}
          placeholder={isInputEnabled ? 'A tua resposta… (Enter para enviar)' : 'Aguarda…'}
          disabled={!isInputEnabled}
          rows={2}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-foreground resize-none outline-none focus:border-blue-500/50 disabled:opacity-40"
        />
        <button
          onClick={handleSend}
          disabled={!isInputEnabled || !inputValue.trim()}
          className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-base disabled:opacity-40 shrink-0"
        >
          →
        </button>
      </div>

      {/* Result modal */}
      {resultModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[oklch(0.14_0.02_264)] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-5xl mb-3">{resultModal.score >= 70 ? '🏆' : resultModal.score >= 60 ? '✅' : '😓'}</div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              {resultModal.score >= 70 ? 'Excelente!' : resultModal.score >= 60 ? 'Concluído!' : 'Tenta de novo'}
            </h2>
            <p className="text-3xl font-bold text-indigo-400 mb-2">{resultModal.score}%</p>
            {resultModal.xp > 0 && (
              <p className="text-sm text-emerald-400 mb-1">+{resultModal.xp} XP ganhos!</p>
            )}
            <p className="text-xs text-muted-foreground mb-4">❤️ {resultModal.lives} vidas restantes</p>
            {completeError === '409' && (
              <p className="text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2 mb-3">
                Não foi possível registar. Inicia de novo.
              </p>
            )}
            {completeError === 'network' && (
              <button
                onClick={() => {
                  const pending = pendingCompleteRef.current
                  if (!pending) return
                  setCompleteError(null)
                  tracksApi.complete(pending.challengeId, pending.interactionId).catch((err: Error) => {
                    if (err.message.includes('409')) {
                      setCompleteError('409')
                    } else {
                      setCompleteError('network')
                    }
                  })
                }}
                className="w-full text-xs text-amber-400 border border-amber-400/20 rounded-xl py-2 mb-3"
              >
                Tentar registar de novo
              </button>
            )}
            <button
              onClick={() => router.push(`/dashboard/tracks/${trackId}`)}
              className="w-full btn-gradient text-white text-sm font-semibold py-2.5 rounded-xl"
            >
              Ver Mapa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
