"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { useSubscription } from "@/context/subscription-context"
import { HeaderDropdown } from "@/components/header-dropdown"
import { UpgradePrompt } from "@/components/upgrade-prompt"

export default function VerseInterpretationPage() {
  const router = useRouter()
  const { devotional, loadingStates, isLoading } = useDevotional()
  const { canAccessPremium } = useSubscription()
  const [showHeaderTitle, setShowHeaderTitle] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasWaited, setHasWaited] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowHeaderTitle(window.scrollY > 150)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Wait 5 seconds before allowing redirect - gives time for verse to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasWaited(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Only redirect if we've waited AND there's no verse AND we're not loading
  useEffect(() => {
    if (hasWaited && !devotional.verse?.reference && !isLoading) {
      console.log("[v0] Verse page - No verse after timeout and not loading, redirecting to home")
      router.push("/")
    }
  }, [hasWaited, devotional.verse?.reference, isLoading, router])

  useEffect(() => {
    console.log("[v0] Verse page - devotional.verse:", devotional.verse?.reference)
    console.log("[v0] Verse page - devotional.interpretation:", devotional.interpretation?.substring(0, 50))
    console.log("[v0] Verse page - isLoading:", isLoading)
  }, [devotional.verse, devotional.interpretation, isLoading])

  // Show loading state while waiting for verse
  if (!devotional.verse) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center max-w-md mx-auto bg-gradient-to-b from-orange-50 via-background to-background shadow-2xl">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading scripture...</p>
      </div>
    )
  }

  const verseText = devotional.verse.text?.startsWith('"') ? devotional.verse.text : `"${devotional.verse.text}"`

  const interpretationParagraphs = devotional.interpretation
    ? devotional.interpretation.split(/\n\n+/).filter((p) => p.trim().length > 0)
    : []

  const deepenItems = [
    {
      label: "Context",
      sub: "The backstory",
      icon: "history_edu",
      path: "/context",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-100",
      text: "text-amber-700",
      premium: true,
    },
    {
      label: "Stories",
      sub: "Real-life moments",
      icon: "menu_book",
      path: "/stories",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      premium: true,
    },
    {
      label: "Poetry",
      sub: "Beautiful verses",
      icon: "edit_note",
      path: "/poetry",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-100",
      text: "text-purple-700",
      premium: true,
    },
    {
      label: "Imagery",
      sub: "Visual symbols",
      icon: "image",
      path: "/imagery",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-100",
      text: "text-blue-700",
      premium: true,
    },
    {
      label: "Songs",
      sub: "Worship music",
      icon: "music_note",
      path: "/songs",
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-100",
      text: "text-rose-700",
      premium: true,
    },
    {
      label: "Let's Talk",
      sub: "Chat about it",
      icon: "forum",
      path: "/talk",
      color: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      premium: true,
    },
  ]

  const heroImageUrl = devotional.heroImage || "/spiritual-peaceful-landscape-golden-hour.jpg"
  const isInterpretationLoading = loadingStates?.interpretation

  return (
    <div
      ref={mainRef}
      className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-gradient-to-b from-orange-50 via-background to-background shadow-2xl"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center bg-background/95 backdrop-blur-md p-4 justify-between border-b border-border">
        <button
          onClick={() => router.push("/")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2
          className={`text-base font-bold transition-opacity duration-300 ${
            showHeaderTitle ? "opacity-100" : "opacity-0"
          }`}
        >
          {devotional.verse.reference}
        </h2>
        <div className="flex items-center gap-1">
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <span className="material-symbols-outlined">bookmark_border</span>
          </button>
          <HeaderDropdown verseReference={devotional.verse.reference} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pb-10">
        {/* Hero Image */}
        <div className="w-full px-4 pt-2 pb-6">
          <div
            className="w-full aspect-square bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-2xl shadow-lg relative bg-muted"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Verse Section */}
        <div className="px-6 mb-8 text-center">
          <p className="text-primary font-bold text-sm tracking-widest uppercase mb-3">Verse of the Day</p>
          <h1 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-4">{verseText}</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-border"></div>
            <p className="text-muted-foreground text-sm font-semibold tracking-wide">
              {devotional.verse.reference} ({devotional.verse.version})
            </p>
            <div className="h-px w-8 bg-border"></div>
          </div>
        </div>

        {/* Friendly Breakdown Section */}
        <div className="px-5 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <h2 className="text-lg font-bold">Friendly Breakdown</h2>
            </div>

            {isInterpretationLoading || interpretationParagraphs.length === 0 ? (
              <div className="flex flex-col gap-3 py-4">
                {!isInterpretationLoading && interpretationParagraphs.length === 0 && (
                  <p className="text-destructive text-sm">Unable to generate interpretation. Please try again.</p>
                )}
                {isInterpretationLoading && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/20 animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="prose max-w-none text-muted-foreground leading-relaxed text-[17px]">
                  <p className="mb-4">{interpretationParagraphs[0]}</p>

                  {isExpanded &&
                    interpretationParagraphs.slice(1).map((paragraph, i) => (
                      <p key={i} className="mb-4 last:mb-0 animate-in fade-in duration-300">
                        {paragraph}
                      </p>
                    ))}
                </div>
                {interpretationParagraphs.length > 1 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80 transition-colors"
                    >
                      {isExpanded ? "Show Less" : "Continue Reading"}
                      <span
                        className={`material-symbols-outlined text-base transition-transform duration-300 ${
                          isExpanded ? "rotate-[-90deg]" : ""
                        }`}
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Deepen Your Faith Section */}
        <div className="px-5 pb-8">
          <h3 className="text-lg font-bold mb-4 px-1">Dive Deeper</h3>

          {!canAccessPremium && (
            <div className="mb-4">
              <UpgradePrompt feature="Stories, Poetry, Imagery, Songs, and Context" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {deepenItems.map((item, idx) => {
              const isLocked = item.premium && !canAccessPremium
              return (
                <button
                  key={idx}
                  onClick={() => !isLocked && router.push(item.path)}
                  disabled={isLocked}
                  className={`group flex flex-col items-start p-4 bg-card rounded-xl border border-border shadow-sm transition-all ${
                    isLocked ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98] hover:shadow-md"
                  }`}
                >
                  <div
                    className={`size-10 rounded-full bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-3 relative`}
                  >
                    <span className="material-symbols-outlined">{isLocked ? "lock" : item.icon}</span>
                  </div>
                  <span className="font-bold">{item.label}</span>
                  <span className={`text-xs ${item.text} mt-1 text-left font-medium`}>{item.sub}</span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="flex items-center justify-center size-14 rounded-full bg-gradient-to-br from-primary to-orange-400 text-white shadow-lg active:scale-95 transition-transform hover:shadow-xl">
          <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
            headphones
          </span>
        </button>
      </div>
    </div>
  )
}
