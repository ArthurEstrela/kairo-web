import { Sword } from 'lucide-react'

const stats = [
  { value: '5k+',  label: 'Usuários Ativos' },
  { value: '20k+', label: 'Horas Treinadas' },
  { value: '94%',  label: 'Taxa de Evolução' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <div
        className="relative hidden lg:flex flex-col overflow-hidden"
        style={{ width: '55%', background: 'oklch(0.09 0.022 268)' }}
      >
        {/* Mesh gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 70% 55% at 25% 25%, oklch(0.50 0.22 264 / 13%) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 80% 75%, oklch(0.42 0.22 293 / 11%) 0%, transparent 65%)
          `
        }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 2.5%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 2.5%) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px'
        }} />

        {/* Big watermark text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(9rem, 18vw, 16rem)',
            fontWeight: 800,
            color: 'oklch(1 0 0 / 2.5%)',
            letterSpacing: '-0.03em',
            userSelect: 'none',
            lineHeight: 1,
          }}>KAIRO</span>
        </div>

        {/* Top logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl btn-gradient flex items-center justify-center glow-blue">
              <Sword className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              KAIRO
            </span>
          </div>
        </div>

        {/* Orbital animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Ring 1 — outer */}
          <div style={{ position: 'absolute', width: 360, height: 360, top: '50%', left: '50%', marginTop: -180, marginLeft: -180 }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              border: '1px solid oklch(0.50 0.22 264 / 16%)',
              animation: 'orbit-cw 28s linear infinite',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
                width: 12, height: 12, borderRadius: '50%',
                background: 'oklch(0.65 0.22 264)',
                boxShadow: '0 0 18px oklch(0.50 0.22 264 / 90%), 0 0 6px oklch(0.50 0.22 264)',
              }} />
            </div>
          </div>

          {/* Ring 2 — mid */}
          <div style={{ position: 'absolute', width: 240, height: 240, top: '50%', left: '50%', marginTop: -120, marginLeft: -120 }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              border: '1px solid oklch(0.42 0.22 293 / 20%)',
              animation: 'orbit-ccw 18s linear infinite',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
                width: 10, height: 10, borderRadius: '50%',
                background: 'oklch(0.58 0.24 293)',
                boxShadow: '0 0 14px oklch(0.42 0.22 293 / 90%), 0 0 5px oklch(0.42 0.22 293)',
              }} />
            </div>
          </div>

          {/* Ring 3 — inner */}
          <div style={{ position: 'absolute', width: 140, height: 140, top: '50%', left: '50%', marginTop: -70, marginLeft: -70 }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              border: '1px solid oklch(0.70 0.10 232 / 28%)',
              animation: 'orbit-cw 11s linear infinite',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
                width: 8, height: 8, borderRadius: '50%',
                background: 'oklch(0.88 0.04 264)',
                boxShadow: '0 0 10px oklch(0.88 0.04 264 / 80%)',
              }} />
            </div>
          </div>

          {/* Core */}
          <div className="relative z-10 size-16 rounded-2xl btn-gradient flex items-center justify-center animate-glow-pulse">
            <Sword className="size-7 text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 mt-auto p-10">
          <h2
            className="text-5xl font-bold leading-[1.05] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Treina.<br />Evolui.<br />Domina.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
            A plataforma de soft skills com IA que transforma como os melhores líderes se preparam.
          </p>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl px-4 py-3">
                <div
                  className="text-xl font-bold gradient-text"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right edge separator */}
        <div className="absolute inset-y-0 right-0 w-px" style={{
          background: 'linear-gradient(180deg, transparent 0%, oklch(1 0 0 / 7%) 35%, oklch(1 0 0 / 7%) 65%, transparent 100%)'
        }} />
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden">
        {/* Subtle radial glow behind the form */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 75% 55% at 50% 42%, oklch(0.50 0.22 264 / 7%) 0%, transparent 70%)'
        }} />

        <div className="relative z-10 w-full max-w-sm px-6 py-14">
          {children}
        </div>
      </div>
    </div>
  )
}
