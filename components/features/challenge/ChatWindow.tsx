'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'
import { Bot, User } from 'lucide-react'

interface ChatWindowProps {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <Bot className="size-4 text-accent" />
          </div>
          <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAI = message.role === 'ai'

  return (
    <div className={cn('flex items-start gap-3 animate-slide-up', !isAI && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'size-8 rounded-full flex items-center justify-center shrink-0',
        isAI ? 'bg-accent/20' : 'bg-primary/20'
      )}>
        {isAI
          ? <Bot className="size-4 text-accent" />
          : <User className="size-4 text-primary" />
        }
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isAI
          ? 'glass rounded-tl-sm text-foreground'
          : 'bg-primary/20 border border-primary/30 rounded-tr-sm text-foreground'
      )}>
        {message.content}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}
