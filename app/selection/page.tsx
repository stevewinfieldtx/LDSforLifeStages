"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"

export default function SelectionPage() {
  const router = useRouter()
  const { generateForVerse, isLoading, loadingStep } = useDevotional()
  const [searchQuery, setSearchQuery] = useState("")

  const popularVerses = [
    "John 3:16",
    "Psalm 23",
    "Philippians 4:13",
    "Romans 8:28",
    "Jeremiah 29:11",
    "Proverbs 3:5-6",
    "Isaiah 40:31",
    "Matthew 6:33",
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    await generateForVerse(searchQuery)
    router.push("/verse")
  }

  const handleVerseClick = async (verse: string) => {
    await generateForVerse(verse)
    router.push("/verse")
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto shadow-2xl bg-background">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white p-6 text-center">
          <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Curating your experience</h2>
          <p className="text-sm opacity-80 animate-pulse">{loadingStep}</p>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 backdrop-blur-md p-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-base font-bold">Select a Verse</h2>
        <div className="w-10" />
      </div>

      {/* Search */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-muted-foreground">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for a verse (e.g., John 3:16)"
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={handleSearch} className="text-primary font-medium text-sm">
              Go
            </button>
          )}
        </div>
      </div>

      {/* Popular Verses */}
      <div className="flex-1 px-4 pb-24">
        <h3 className="text-lg font-bold mb-4">Popular Verses</h3>
        <div className="grid grid-cols-2 gap-3">
          {popularVerses.map((verse) => (
            <button
              key={verse}
              onClick={() => handleVerseClick(verse)}
              disabled={isLoading}
              className="flex items-center justify-center p-4 bg-card rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
            >
              <span className="font-medium text-sm">{verse}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
