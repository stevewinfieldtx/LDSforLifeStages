"use client"

import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { useEffect, useRef } from "react"

export default function SongsPage() {
  const router = useRouter()
  const { devotional } = useDevotional()
  const song = devotional.songs || {}
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.scrollTo(0, 0)
  }, [])

  const copyAndOpenSuno = () => {
    if (song.prompt) {
      navigator.clipboard.writeText(song.prompt)
      window.open("https://suno.ai", "_blank")
    }
  }

  return (
    <div
      ref={mainRef}
      className="w-full max-w-md mx-auto flex flex-col min-h-screen relative overflow-x-hidden shadow-2xl bg-gradient-to-b from-rose-50 to-background"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between bg-background/90 backdrop-blur-md border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-10 rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <span className="text-sm font-bold tracking-wide uppercase text-rose-600">Worship Music</span>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-muted transition-colors">
          <span className="material-symbols-outlined text-[24px]">more_vert</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col p-5 gap-6">
        {/* Album Art */}
        <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl relative group ring-1 ring-rose-200 bg-gradient-to-br from-rose-100 to-pink-50">
          {song.img ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${song.img}')` }}
            ></div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-rose-300 text-6xl">music_note</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-white">graphic_eq</span>
          </div>
        </div>

        {/* Song Info */}
        <div className="flex flex-col items-center text-center gap-1">
          <h1 className="text-2xl font-bold leading-tight tracking-tight">{song.title || "Generating song..."}</h1>
          <p className="text-rose-600 font-medium text-sm tracking-wide">
            {devotional.verse?.reference} {song.sub && `• ${song.sub}`}
          </p>
        </div>

        {/* Generate Music Card */}
        {song.prompt && (
          <div className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-card p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <span className="material-symbols-outlined text-[20px]">music_note</span>
                <span className="text-xs font-bold uppercase tracking-wider">Create Your Version</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
                AI Prompt
              </span>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-100">
              <p className="text-muted-foreground text-sm font-serif italic leading-relaxed">
                &quot;{song.prompt}&quot;
              </p>
            </div>
            <button
              onClick={copyAndOpenSuno}
              className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold leading-normal transition-all active:scale-[0.98] shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span className="truncate">Copy Prompt & Open Suno</span>
              <span className="material-symbols-outlined text-[16px] opacity-70">open_in_new</span>
            </button>
          </div>
        )}

        {/* Lyrics */}
        {song.lyrics && (
          <div className="flex flex-col items-center gap-6 pt-2 pb-10">
            <div className="h-px w-16 bg-rose-200 rounded-full"></div>
            <div className="text-center space-y-8 max-w-xs mx-auto">
              <div className="space-y-3">
                <p className="font-serif text-lg leading-loose text-foreground whitespace-pre-line">{song.lyrics}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {!song.title && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="size-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 animate-pulse">
              <span className="material-symbols-outlined text-rose-600">music_note</span>
            </div>
            <p className="text-muted-foreground">Composing your song...</p>
          </div>
        )}
      </main>
    </div>
  )
}
