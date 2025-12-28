"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"

interface HeaderDropdownProps {
  verseReference?: string
}

export function HeaderDropdown({ verseReference }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { clearCache } = useDevotional()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleShare = async () => {
    if (navigator.share && verseReference) {
      try {
        await navigator.share({
          title: `Bible for Life Stages - ${verseReference}`,
          text: `Check out this devotional on ${verseReference}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share cancelled or failed")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
    setIsOpen(false)
  }

  const handleProfile = () => {
    router.push("/profile")
    setIsOpen(false)
  }

  const handleReportIssue = () => {
    window.open("mailto:support@bibleforlifestages.com?subject=Bible for Life Stages Feedback", "_blank")
    setIsOpen(false)
  }

  const handleClearCache = () => {
    console.log("[v0] handleClearCache button clicked")

    // Direct localStorage clearing as backup
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("bible3_cache_"))
    console.log("[v0] Found cache keys:", keys)
    keys.forEach((k) => {
      console.log("[v0] Removing:", k)
      localStorage.removeItem(k)
    })

    // Also call context clearCache
    clearCache()

    alert(`Cache cleared! Removed ${keys.length} entries. Click a verse source to generate fresh content.`)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="py-2">
            <button
              onClick={handleProfile}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
            >
              <span className="material-symbols-outlined text-indigo-500">person</span>
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={handleShare}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
            >
              <span className="material-symbols-outlined text-primary">share</span>
              <span className="font-medium">Share</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
            >
              <span className="material-symbols-outlined text-amber-500">bookmark_add</span>
              <span className="font-medium">Save to Favorites</span>
            </button>

            <div className="h-px bg-border my-1 mx-4"></div>

            <button
              onClick={handleReportIssue}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
            >
              <span className="material-symbols-outlined text-muted-foreground">flag</span>
              <span className="font-medium">Report Issue</span>
            </button>

            <button
              onClick={handleClearCache}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
            >
              <span className="material-symbols-outlined text-red-500">delete</span>
              <span className="font-medium">Clear Cache (Dev)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
