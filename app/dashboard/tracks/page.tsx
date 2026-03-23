'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { tracksApi } from '@/lib/api'

export default function MyTracksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-tracks'],
    queryFn: () => tracksApi.getMy(),
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-red-400 text-sm">Erro ao carregar trilhas.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">As Minhas Trilhas</h1>
          {data && data.totalCount > 50 && (
            <p className="text-xs text-amber-400 mt-1">
              Mostrando as 50 trilhas mais recentes.
            </p>
          )}
        </div>
        <Link
          href="/dashboard/tracks/generate"
          className="btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl"
        >
          + Nova Trilha
        </Link>
      </div>

      {!data?.tracks?.length ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm mb-4">Ainda não tens trilhas.</p>
          <Link
            href="/dashboard/tracks/generate"
            className="btn-gradient text-white text-sm font-semibold px-6 py-2.5 rounded-xl"
          >
            Criar a primeira trilha
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.tracks.map((track) => (
            <Link
              key={track.id}
              href={`/dashboard/tracks/${track.id}`}
              className="flex items-center justify-between p-4 bg-white/3 border border-white/6 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{track.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {track.challenges.length} desafios
                </p>
              </div>
              <span className="text-muted-foreground text-xs">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
