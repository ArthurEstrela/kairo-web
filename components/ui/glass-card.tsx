import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'blue' | 'purple' | 'none'
}

export function GlassCard({ className, glow = 'none', children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl p-6',
        glow === 'blue' && 'glow-blue',
        glow === 'purple' && 'glow-purple',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
