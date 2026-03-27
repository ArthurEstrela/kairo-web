'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { tracksApi } from '@/lib/api'
import { Map, Plus, ChevronRight, Layers } from 'lucide-react'

export default function MyTracksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-tracks'],
    queryFn: () => tracksApi.getMy(),
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <div
              className="size-8 rounded-xl btn-gradient flex items-center justify-center shrink-0"
              style={{ boxShadow: '0 4px 16px oklch(0.50 0.22 264 / 35%)' }}
            >
              <Map className="size-4 text-white" />
            </div>
            As Minhas Trilhas
          </h1>
          {data && data.totalCount > 50 && (
            <p className="text-xs text-amber-400 mt-1.5">
              A mostrar as 50 trilhas mais recentes.
            </p>
          )}
        </div>
        <Link
          href="/dashboard/tracks/generate"
          className="relative shrink-0 flex items-center gap-1.5 btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl overflow-hidden group"
          style={{ boxShadow: '0 4px 16px oklch(0.50 0.22 264 / 30%)' }}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <Plus className="size-4 relative" />
          <span className="relative">Nova Trilha</span>
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          Erro ao carregar trilhas. Tenta de novo.
        </p>
      ) : !data?.tracks?.length ? (
        /* Empty state */
        <div
          className="rounded-2xl p-12 text-center space-y-4"
          style={{
            background: 'linear-gradient(oklch(0.16 0.018 264), oklch(0.16 0.018 264)) padding-box, linear-gradient(145deg, oklch(0.55 0.20 232 / 30%), oklch(0.20 0.02 264 / 8%), oklch(0.45 0.22 293 / 25%)) border-box',
            border: '1px solid transparent',
          }}
        >
          <div className="size-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto">
            <Layers className="size-6 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Ainda não tens trilhas</p>
            <p className="text-xs text-muted-foreground mt-1">
              Cria a tua primeira trilha personalizada com IA
            </p>
          </div>
          <Link
            href="/dashboard/tracks/generate"
            className="relative inline-flex items-center gap-2 btn-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl overflow-hidden group"
            style={{ boxShadow: '0 4px 20px oklch(0.50 0.22 264 / 35%)' }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <Plus className="size-4 relative" />
            <span className="relative">Criar a primeira trilha</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.tracks.map((track) => (
            <Link
              key={track.id}
              href={`/dashboard/tracks/${track.id}`}
              className="flex items-center gap-4 p-4 bg-white/2.5 border border-white/6 rounded-2xl hover:bg-white/4 hover:border-white/10 transition-all duration-150 group"
            >
              <div className="size-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <Map className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {track.challenges.length} desafios
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
