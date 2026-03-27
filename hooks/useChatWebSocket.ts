'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useChallengeStore } from '@/store/useChallengeStore'
import { tracksApi } from '@/lib/api'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080'

type HookOptions = {
  challengeId: string
  trackId: string
  onChunk: (delta: string, isNew: boolean) => void
  onTurnAck: () => void
  onResult: (score: number, xpAwarded: number, livesRemaining: number, interactionId: string) => void
  onCompleteError: (type: '409' | 'network') => void
  onDisconnect?: () => void
}

export function useChatWebSocket({
  challengeId,
  trackId,
  onChunk,
  onTurnAck,
  onResult,
  onCompleteError,
  onDisconnect,
}: HookOptions) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const store = useChallengeStore()
  const wsRef = useRef<WebSocket | null>(null)
  const isNewBubbleRef = useRef(true)
  const errorHandledRef = useRef(false)

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/api/v1/chat/stream`)
    wsRef.current = ws

    // Timeout: if we haven't received INIT_ACK within 30s, treat as disconnect
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) return
      // Still haven't received INIT_ACK — server is not responding
      errorHandledRef.current = true
      ws.close()
      store.clear()
      onDisconnect?.()
    }, 30_000)

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'AUTH', token }))
    }

    ws.onmessage = async (event) => {
      let msg: Record<string, unknown>
      try { msg = JSON.parse(event.data as string) } catch { return }

      switch (msg.type) {
        case 'AUTH_ACK':
          ws.send(JSON.stringify({ type: 'INIT', challengeId }))
          break

        case 'CHUNK':
          onChunk(msg.delta as string, isNewBubbleRef.current)
          isNewBubbleRef.current = false
          break

        case 'INIT_ACK':
          clearTimeout(connectionTimeout)
          store.setMaxTurns(msg.maxTurns as number)
          isNewBubbleRef.current = true
          break

        case 'TURN_ACK':
          store.setCurrentTurn(msg.turn as number)
          isNewBubbleRef.current = true
          onTurnAck()
          break

        case 'RESULT': {
          const { interactionId, score, xpAwarded, livesRemaining } = msg as {
            interactionId: string
            score: number
            xpAwarded: number
            livesRemaining: number
          }
          onResult(score, xpAwarded, livesRemaining, interactionId)
          tracksApi.complete(challengeId, interactionId).catch((err: Error) => {
            if (err.message.includes('409') || err.message.includes('Sessão não encontrada')) {
              onCompleteError('409')
            } else {
              onCompleteError('network')
            }
          })
          break
        }

        case 'ERROR': {
          const code = msg.code as string
          errorHandledRef.current = true
          store.clear()
          if (code === 'NO_LIVES') {
            router.push(`/dashboard/tracks/${trackId}?noLives=1`)
          } else if (['CHALLENGE_NOT_FOUND', 'CHALLENGE_FORBIDDEN', 'CHALLENGE_LOCKED'].includes(code)) {
            router.push(`/dashboard/tracks/${trackId}`)
          } else if (code === 'UNAUTHORIZED') {
            logout()
            router.push('/login')
          } else {
            router.push(`/dashboard/tracks/${trackId}`)
          }
          break
        }
      }
    }

    ws.onclose = (event) => {
      if (event.code !== 1000 && !errorHandledRef.current) {
        store.clear()
        onDisconnect?.()
      }
      errorHandledRef.current = false
    }

    return () => {
      clearTimeout(connectionTimeout)
      errorHandledRef.current = true  // prevent onclose from calling onDisconnect on intentional cleanup
      ws.close()
    }
  }, [challengeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendTurn = useCallback((userInput: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      isNewBubbleRef.current = true
      wsRef.current.send(JSON.stringify({ type: 'TURN', userInput }))
    }
  }, [])

  return { sendTurn }
}
