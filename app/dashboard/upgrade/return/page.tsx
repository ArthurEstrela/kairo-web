'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { subscriptionApi } from '@/lib/api'
import type { SessionStatus } from '@/types'

export default function CheckoutReturnPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<SessionStatus | 'loading' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }
    subscriptionApi.getSession(sessionId)
      .then((res) => setStatus(res.status))
      .catch(() => setStatus('error'))
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">A verificar pagamento...</p>
      </div>
    )
  }

  if (status === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Bem-vindo ao Premium!</h1>
        <p className="text-sm text-muted-foreground mb-6">
          O teu plano foi activado. Podes agora gerar trilhas ilimitadas.
        </p>
        <Link
          href="/dashboard/tracks/generate"
          className="btn-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl"
        >
          Gerar uma Trilha
        </Link>
      </div>
    )
  }

  // open or error
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-xl font-bold text-foreground mb-2">
        {status === 'open' ? 'Pagamento Pendente' : 'Algo correu mal'}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {status === 'open'
          ? 'O teu pagamento ainda não foi confirmado. Aguarda alguns momentos.'
          : 'Não foi possível verificar o teu pagamento. Contacta o suporte se o problema persistir.'}
      </p>
      <Link href="/dashboard/upgrade" className="text-blue-400 hover:text-blue-300 text-sm underline">
        Voltar aos planos
      </Link>
    </div>
  )
}
