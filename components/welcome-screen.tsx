"use client"

import { BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  suggestions: string[]
  onSuggestionClick: (question: string) => void
}

export function WelcomeScreen({ suggestions, onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <BookOpen className="w-10 h-10 text-primary" />
      </div>

      <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Bible3</h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        Your AI-powered companion for exploring Scripture. Ask questions about the Bible, seek understanding of
        passages, or explore theological concepts.
      </p>

      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Try asking</span>
        </div>
        <div className="grid gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/30 transition-colors bg-transparent"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
