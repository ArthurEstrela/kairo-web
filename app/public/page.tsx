import Link from 'next/link'
import { Sword, Zap, Shield, Trophy, MessageSquare } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Roleplay Simulations',
    description: 'Practice with realistic AI personas — negotiate with a tough CEO, resolve conflicts with a difficult colleague.',
  },
  {
    icon: Zap,
    title: 'Gamified XP & Leagues',
    description: 'Earn XP, maintain streaks, and climb from Bronze to Diamond league. Every session counts.',
  },
  {
    icon: Trophy,
    title: 'Real-Time Leaderboard',
    description: 'See where you rank against other negotiators in your league. Rise to the top.',
  },
  {
    icon: Shield,
    title: 'AI-Powered Evaluation',
    description: 'Get instant, objective feedback scored on argumentation, confidence, and persuasion.',
  },
]

export default function LandingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center animate-slide-up">
      {/* Hero */}
      <div className="mb-6 flex justify-center">
        <div className="size-16 rounded-2xl btn-gradient flex items-center justify-center glow-blue animate-float">
          <Sword className="size-8 text-white" />
        </div>
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
        Train Your{' '}
        <span className="gradient-text">Soft Skills</span>
        <br />
        Like a Pro
      </h1>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
        Kairo is an AI-powered platform for sales professionals, leaders, and communicators.
        Practice negotiation, leadership, and conflict resolution through realistic simulations.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
        <Link
          href="/register"
          className="btn-gradient px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          Start Training Free
        </Link>
        <Link
          href="/login"
          className="glass px-8 py-3 rounded-xl text-foreground font-semibold text-sm hover:bg-white/8 transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-4 text-left">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass rounded-xl p-5 flex gap-4">
            <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Icon className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tiers */}
      <div className="mt-16">
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">Climb the ranks</p>
        <div className="flex flex-wrap justify-center gap-3">
          {(['🥉 Bronze', '🥈 Silver', '🥇 Gold', '💎 Platinum', '💠 Diamond'] as const).map((tier) => (
            <span key={tier} className="glass text-sm px-4 py-1.5 rounded-full">{tier}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
