"use client"

import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { useEffect, useRef, useState } from "react"

export default function StoriesPage() {
  const router = useRouter()
  const { devotional } = useDevotional()
  const stories = devotional.stories || []
  const mainRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [activeTab])

  const activeStory = stories[activeTab]
  const tabLabels = ["Today's World", "Different Time"]

  return (
    <div
      ref={mainRef}
      className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-emerald-50 to-background max-w-md mx-auto shadow-2xl"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur-md p-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-base font-bold text-emerald-700">Stories</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      <main className="flex-1 pb-10">
        {/* Title Section */}
        <div className="px-6 py-6 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 mb-4">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span className="text-xs font-semibold uppercase tracking-wide">Real Life Moments</span>
          </div>
          <p className="text-primary font-bold text-sm tracking-widest uppercase mb-2">{devotional.verse?.reference}</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Stories That Hit Home</h1>
          <p className="mt-2 text-muted-foreground">See how this verse plays out in everyday life.</p>
        </div>

        <div className="px-4 mb-6">
          <div className="flex bg-emerald-100 rounded-xl p-1">
            {tabLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === i ? "bg-white text-emerald-700 shadow-md" : "text-emerald-600 hover:text-emerald-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-10">
          {!activeStory ? (
            <div className="flex flex-col items-center justify-center py-12 bg-card rounded-2xl border border-emerald-200">
              <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-pulse">
                <span className="material-symbols-outlined text-emerald-600">menu_book</span>
              </div>
              <p className="text-muted-foreground">Crafting story...</p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-emerald-200">
              {activeStory.img ? (
                <img
                  alt={activeStory.title}
                  className="w-full aspect-video object-cover"
                  src={activeStory.img || "/placeholder.svg"}
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-emerald-100 to-teal-50 animate-pulse flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-300 text-4xl">image</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">auto_stories</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold">{activeStory.title}</h3>
                </div>
                <div className="prose max-w-none text-muted-foreground leading-relaxed text-[16px]">
                  <p className="mb-4 whitespace-pre-wrap">{activeStory.text}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
