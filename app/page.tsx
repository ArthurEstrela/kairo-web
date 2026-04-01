import Link from 'next/link'
import { Sword, Zap, Trophy, MessageSquare, Target, ArrowRight, Star } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Roleplay com IA',
    description: 'Pratica com personas realistas — negocia com um CEO difícil, resolve conflitos com um colega.',
    color: 'oklch(0.55 0.22 264)',
  },
  {
    icon: Zap,
    title: 'XP & Ligas',
    description: 'Ganha XP, mantém sequências e sobe de Bronze a Diamond. Cada sessão conta.',
    color: 'oklch(0.75 0.18 85)',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Vê a tua posição entre os melhores comunicadores da tua liga.',
    color: 'oklch(0.65 0.18 45)',
  },
  {
    icon: Target,
    title: 'Avaliação Precisa',
    description: 'Feedback instantâneo e objetivo com pontuação por argumentação, confiança e persuasão.',
    color: 'oklch(0.60 0.20 160)',
  },
]

const TIERS = [
  { emoji: '🥉', name: 'Bronze' },
  { emoji: '🥈', name: 'Prata' },
  { emoji: '🥇', name: 'Ouro' },
  { emoji: '💎', name: 'Platina' },
  { emoji: '💠', name: 'Diamond' },
]

const STATS = [
  { value: '5k+', label: 'Utilizadores Ativos' },
  { value: '20k+', label: 'Horas Treinadas' },
  { value: '94%', label: 'Taxa de Evolução' },
]

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'oklch(0.08 0.018 264)' }}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'oklch(0.08 0.018 264 / 85%)', backdropFilter: 'blur(16px)', borderBottom: '1px solid oklch(1 0 0 / 5%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg btn-gradient flex items-center justify-center">
            <Sword className="size-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-base" style={{ fontFamily: 'var(--font-display)' }}>
            KAIRO
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/public/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Entrar
          </Link>
          <Link
            href="/public/register"
            className="btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            Criar Conta
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 800, height: 800, borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(0.50 0.22 264 / 12%) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '60%', left: '20%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(0.42 0.22 293 / 8%) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '40%', right: '10%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(0.55 0.18 200 / 6%) 0%, transparent 70%)',
          }} />
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(oklch(1 0 0 / 2%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 2%) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        </div>

        {/* Badge */}
        <div className="relative mb-6 flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Star className="size-3 text-yellow-400 fill-yellow-400" />
          Treina soft skills com IA · Gamificado · Grátis para começar
        </div>

        {/* Headline */}
        <h1
          className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Treina.<br />
          <span className="gradient-text">Evolui.</span><br />
          Domina.
        </h1>

        <p className="relative text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          A plataforma de soft skills com IA que transforma como os melhores líderes,
          vendedores e comunicadores se preparam.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row gap-3 justify-center mb-20">
          <Link
            href="/public/register"
            className="btn-gradient text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 justify-center group"
            style={{ boxShadow: '0 8px 32px oklch(0.50 0.22 264 / 35%)' }}
          >
            Começar Grátis
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/public/login"
            className="glass text-foreground font-semibold px-8 py-3.5 rounded-2xl text-sm hover:bg-white/8 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Stats */}
        <div className="relative flex flex-wrap justify-center gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-6 py-4 text-center min-w-[110px]">
              <div
                className="text-2xl font-extrabold gradient-text mb-0.5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/40">
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, oklch(1 0 0 / 0%), oklch(1 0 0 / 20%))' }} />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-3">
            Como funciona
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-12 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tudo o que precisas para{' '}
            <span className="gradient-text">evoluir rápido</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="glass rounded-2xl p-6 flex gap-4 hover:bg-white/5 transition-colors group"
              >
                <div
                  className="size-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: `${color}18`, border: `1px solid ${color}28` }}
                >
                  <Icon className="size-5" style={{ color }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-sm mb-1.5"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tiers ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Sobe nas ligas</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className="glass rounded-2xl px-5 py-3 flex items-center gap-2 hover:bg-white/6 transition-colors"
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="text-sm font-semibold">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'oklch(0.13 0.025 264)', border: '1px solid oklch(1 0 0 / 8%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.50 0.22 264 / 12%) 0%, transparent 70%)'
          }} />
          <div className="relative">
            <div className="size-12 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
              <Sword className="size-6 text-white" />
            </div>
            <h2
              className="text-3xl font-extrabold mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pronto para começar?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
              Junta-te a milhares de profissionais que já estão a treinar as suas soft skills com o Kairo.
            </p>
            <Link
              href="/public/register"
              className="btn-gradient text-white font-bold px-8 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2 group"
              style={{ boxShadow: '0 8px 32px oklch(0.50 0.22 264 / 30%)' }}
            >
              Criar Conta Grátis
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="text-center px-6 py-8" style={{ borderTop: '1px solid oklch(1 0 0 / 5%)' }}>
        <p className="text-xs text-muted-foreground/50">
          © 2026 Kairo · Todos os direitos reservados
        </p>
      </footer>
    </div>
  )
}
