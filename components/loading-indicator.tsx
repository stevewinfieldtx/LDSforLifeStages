"use client"

import { BookOpen } from "lucide-react"

export function LoadingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
        <BookOpen className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-card border border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
          </div>
          <span className="text-sm text-muted-foreground">Searching the scriptures...</span>
        </div>
      </div>
    </div>
  )
}
