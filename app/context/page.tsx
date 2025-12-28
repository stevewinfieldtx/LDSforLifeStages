"use client"

import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { useEffect, useRef } from "react"

export default function ContextPage() {
  const router = useRouter()
  const { devotional } = useDevotional()
  const context = devotional.context || {}
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.scrollTo(0, 0)
  }, [])

  const contextItems = [
    {
      title: "Who's Talking?",
      content: context.whoIsSpeaking,
      icon: "record_voice_over",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
    },
    {
      title: "Who Heard This First?",
      content: context.originalListeners,
      icon: "groups",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
    {
      title: "What Sparked This?",
      content: context.whyTheConversation,
      icon: "help_outline",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
    },
    {
      title: "Picture the Scene",
      content: context.setting,
      icon: "calendar_month",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
    },
    {
      title: "What Was Going On?",
      content: context.historicalBackdrop,
      icon: "public",
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-50",
    },
    {
      title: "Immediate Reactions",
      content: context.immediateImpact,
      icon: "fast_forward",
      color: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-50",
    },
    {
      title: "The Lasting Impact",
      content: context.longTermImpact,
      icon: "hourglass_bottom",
      color: "from-teal-500 to-green-500",
      bg: "bg-teal-50",
    },
  ]

  return (
    <div
      ref={mainRef}
      className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-amber-50 to-background max-w-md mx-auto shadow-2xl"
    >
      {/* Header with Hero */}
      <header className="absolute top-0 z-50 flex h-16 w-full items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <button className="flex size-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="flex-1 pb-10">
        {/* Hero Image */}
        <div className="relative w-full aspect-square bg-muted">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${devotional.contextHeroImage || "/ancient-jerusalem-historical-scene.jpg"}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-white mb-3">
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span className="text-xs font-semibold uppercase tracking-wide">The Backstory</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">{devotional.verse?.reference}</h1>
          </div>
        </div>

        {/* Context Items */}
        <div className="px-5 py-6 space-y-5">
          {contextItems.map(
            (item, i) =>
              item.content && (
                <div key={i} className={`${item.bg} rounded-2xl p-5 border border-border/50`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`size-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">{item.content}</p>
                </div>
              ),
          )}

          {/* Loading state */}
          {!context.whoIsSpeaking && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 animate-pulse">
                <span className="material-symbols-outlined text-amber-600">history_edu</span>
              </div>
              <p className="text-muted-foreground">Digging into the backstory...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
