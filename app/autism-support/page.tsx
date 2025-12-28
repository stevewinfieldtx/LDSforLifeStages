"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"

export default function AutismSupportPage() {
  const router = useRouter()
  const { devotional } = useDevotional()
  const [reflection, setReflection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!devotional.verse?.reference) {
      router.push("/")
      return
    }

    const generateReflection = async () => {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch("/api/generate-autism-support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verseReference: devotional.verse?.reference,
            verseText: devotional.verse?.text,
            source: devotional.verse?.source,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate reflection")
        }

        const data = await response.json()
        setReflection(data.reflection)
      } catch (e) {
        console.error("Error generating autism support reflection:", e)
        setError("Unable to generate reflection. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    generateReflection()
  }, [devotional.verse, router])

  if (!devotional.verse) {
    return null
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-gradient-to-b from-purple-50 via-background to-background shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-background/95 backdrop-blur-md p-4 justify-between border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-base font-bold">Autism Family Support</h2>
        <div className="w-10" />
      </div>

      {/* Content */}
      <main className="flex-1 px-5 py-6">
        {/* Verse Reference */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground font-medium">{devotional.verse.reference}</p>
        </div>

        {/* Reflection Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">family_restroom</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">For Autism Families</h2>
              <p className="text-xs text-muted-foreground">A reflection for your journey</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3 py-8">
              <div className="flex items-center justify-center gap-3">
                <div className="size-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-sm text-muted-foreground animate-pulse">
                Creating a reflection for your family...
              </p>
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <p className="text-destructive text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary text-sm font-semibold hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="prose max-w-none text-muted-foreground leading-relaxed text-[17px]">
              {reflection.split(/\n\n+/).map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Encouragement Footer */}
        {!isLoading && !error && (
          <div className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-100">
            <p className="text-sm text-purple-800 text-center leading-relaxed">
              <span className="font-semibold">You are seen. You are loved.</span>
              <br />
              Your family&apos;s journey is sacred, and God walks with you every step.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
