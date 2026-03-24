'use client'

import { useState, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { subscriptionApi } from '@/lib/api'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const FREE_FEATURES = [
  '3 trilhas geradas por mês',
  '5 vidas (recarga a cada 4h)',
  'Todos os desafios de soft skills',
  'Ranking na liga Bronze-Diamond',
]

const PREMIUM_FEATURES = [
  'Gerações de trilhas ilimitadas',
  'Vidas ilimitadas',
  'Todos os desafios de soft skills',
  'Ranking na liga Bronze-Diamond',
  'Suporte prioritário',
]

export default function UpgradePage() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await subscriptionApi.createCheckout()
      return res.clientSecret
    } catch {
      setCheckoutError('Não foi possível iniciar o checkout. Tenta de novo.')
      setShowCheckout(false)
      return ''
    }
  }, [])

  function handleUpgradeClick() {
    setCheckoutError(null)
    setShowCheckout(true)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Planos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Escolhe o plano certo para ti.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Freemium card */}
        <div className="p-5 bg-white/3 border border-white/8 rounded-2xl">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">
            Free
          </p>
          <p className="text-3xl font-bold text-foreground mb-4">€0</p>
          <ul className="space-y-2 mb-6">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-white/30 mt-0.5">–</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="text-xs text-muted-foreground font-medium py-2 text-center">
            Plano actual
          </div>
        </div>

        {/* Premium card */}
        <div className="p-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl relative">
          <span className="absolute -top-2.5 right-4 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-3 py-0.5 rounded-full">
            Recomendado
          </span>
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">
            Premium
          </p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-foreground">€9</span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
          <ul className="space-y-2 mb-6">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpgradeClick}
            className="w-full btn-gradient text-white text-sm font-semibold py-2.5 rounded-xl"
          >
            Fazer Upgrade
          </button>
        </div>
      </div>

      {checkoutError && (
        <p className="mt-4 text-sm text-red-400 text-center">{checkoutError}</p>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowCheckout(false)}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg bg-[oklch(0.13_0.015_264)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <p className="text-sm font-semibold text-foreground">Upgrade para Premium</p>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
