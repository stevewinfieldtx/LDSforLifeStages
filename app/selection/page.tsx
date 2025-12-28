"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"

export default function SelectionPage() {
  const router = useRouter()
  const { generateForVerse, isLoading, loadingStep } = useDevotional()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "bible" | "bom" | "dc" | "pgp">("all")

  const verseCategories = {
    bible: {
      label: "Bible",
      icon: "📕",
      verses: [
        "John 3:16",
        "Psalm 23:1-4",
        "Philippians 4:13",
        "Romans 8:28",
        "Jeremiah 29:11",
        "Proverbs 3:5-6",
        "Isaiah 40:31",
        "Matthew 6:33",
        "1 Corinthians 13:4-7",
        "James 1:5",
      ]
    },
    bom: {
      label: "Book of Mormon",
      icon: "📘",
      verses: [
        "1 Nephi 3:7",
        "2 Nephi 2:25",
        "2 Nephi 31:20",
        "Mosiah 2:17",
        "Mosiah 3:19",
        "Alma 32:21",
        "Alma 37:6-7",
        "Helaman 5:12",
        "Ether 12:6",
        "Ether 12:27",
        "Moroni 7:45",
        "Moroni 10:4-5",
        "3 Nephi 11:29",
        "3 Nephi 17:21",
      ]
    },
    dc: {
      label: "D&C",
      icon: "📗",
      verses: [
        "D&C 4:2-4",
        "D&C 6:36",
        "D&C 8:2-3",
        "D&C 18:10",
        "D&C 19:23",
        "D&C 58:27",
        "D&C 64:10",
        "D&C 82:10",
        "D&C 84:88",
        "D&C 88:63",
        "D&C 121:7-8",
        "D&C 122:7",
        "D&C 130:20-21",
      ]
    },
    pgp: {
      label: "Pearl of Great Price",
      icon: "📙",
      verses: [
        "Moses 1:39",
        "Moses 7:18",
        "Abraham 3:22-23",
        "JS-History 1:17",
        "Articles of Faith 1:13",
      ]
    }
  }

  const getDisplayVerses = () => {
    if (activeTab === "all") {
      return [
        ...verseCategories.bom.verses.slice(0, 4),
        ...verseCategories.bible.verses.slice(0, 4),
        ...verseCategories.dc.verses.slice(0, 4),
        ...verseCategories.pgp.verses.slice(0, 2),
      ]
    }
    return verseCategories[activeTab].verses
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    const ready = await generateForVerse(searchQuery)
    if (ready) {
      router.push("/verse")
    }
  }

  const handleVerseClick = async (verse: string) => {
    const ready = await generateForVerse(verse)
    if (ready) {
      router.push("/verse")
    }
  }

  const tabs = [
    { id: "all", label: "All", icon: "📚" },
    { id: "bom", label: "BoM", icon: "📘" },
    { id: "bible", label: "Bible", icon: "📕" },
    { id: "dc", label: "D&C", icon: "📗" },
    { id: "pgp", label: "PGP", icon: "📙" },
  ] as const

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
        <h2 className="text-base font-bold">Search Scriptures</h2>
        <div className="w-10" />
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-muted-foreground">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search any verse (e.g., Alma 32:21)"
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={handleSearch} className="text-primary font-medium text-sm">
              Go
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2 px-1">
          Search by reference: "1 Nephi 3:7", "D&C 4", "Moses 1:39", or any verse
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-2">
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Verses */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          {activeTab === "all" ? "Popular Verses" : `Popular ${verseCategories[activeTab as keyof typeof verseCategories]?.label || ""} Verses`}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {getDisplayVerses().map((verse) => (
            <button
              key={verse}
              onClick={() => handleVerseClick(verse)}
              disabled={isLoading}
              className="flex items-center justify-start p-3 bg-card rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-all disabled:opacity-50 text-left"
            >
              <span className="font-medium text-sm leading-tight">{verse}</span>
            </button>
          ))}
        </div>
        
        {activeTab !== "all" && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Or type any {verseCategories[activeTab as keyof typeof verseCategories]?.label} reference above
          </p>
        )}
      </div>
    </div>
  )
}
