"use client"

import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { BottomNav } from "@/components/bottom-nav"
import { useLanguage } from "@/context/language-context"

const famousVerses = [
  {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    theme: "God's Love",
    gradient: "from-rose-500 to-pink-600",
    icon: "favorite",
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    theme: "Guidance",
    gradient: "from-emerald-500 to-teal-600",
    icon: "landscape",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    theme: "Purpose",
    gradient: "from-violet-500 to-purple-600",
    icon: "light_mode",
  },
]

export default function ExamplesPage() {
  const router = useRouter()
  const { generateDevotional, isLoading, loadingStep } = useDevotional()
  const { t } = useLanguage()

  const handleVerseClick = async (reference: string) => {
    await generateDevotional(reference)
    setTimeout(() => {
      router.push("/verse")
    }, 100)
  }

  return (
    <div className="flex h-full w-full flex-col max-w-md mx-auto bg-gradient-to-b from-[#0c1929] via-[#1a2942] to-[#0c1929]">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0c1929]/95 backdrop-blur-sm text-white p-6 text-center">
          <div className="size-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold mb-2 text-amber-100">{t("generating")}</h2>
          <p className="text-sm text-blue-200 animate-pulse">{loadingStep}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Example Verses</h1>
        </div>

        <p className="text-sm text-blue-200/80 mb-6">
          Explore these beloved verses and see how Scripture speaks to your life stage
        </p>

        <div className="flex flex-col gap-4">
          {famousVerses.map((verse) => (
            <button
              key={verse.reference}
              onClick={() => handleVerseClick(verse.reference)}
              disabled={isLoading}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-left transition-all hover:scale-[1.02] hover:border-white/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${verse.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{verse.reference}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
                      <span className="material-symbols-outlined text-sm">{verse.icon}</span>
                      {verse.theme}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-2xl text-amber-400 group-hover:scale-110 transition-transform">
                    auto_stories
                  </span>
                </div>

                <p className="text-sm text-blue-100/90 leading-relaxed line-clamp-3">{verse.text}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-amber-400/30">
          <p className="text-xs text-center text-blue-200/70">
            Each verse is personalized based on your age, gender, and life situation
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
