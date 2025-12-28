"use client"

import type React from "react"

import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { FormEvent, KeyboardEvent } from "react"

interface MessageInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function MessageInput({ input, handleInputChange, handleSubmit, isLoading }: MessageInputProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
      }
    }
  }

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Ask about the Bible..."
            className="min-h-[52px] max-h-[200px] resize-none pr-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
            disabled={isLoading}
            rows={1}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-[52px] w-[52px] rounded-xl shrink-0"
          disabled={!input.trim() || isLoading}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      <p className="text-xs text-center text-muted-foreground mt-3">
        Bible3 provides AI-generated insights. Always verify with Scripture.
      </p>
    </div>
  )
}
