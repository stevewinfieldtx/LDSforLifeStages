"use client"

import React, { createContext, useContext, useState, type ReactNode, useCallback, useRef } from "react"
import { useLanguage } from "./language-context"

const CACHE_VERSION = "v13"

export interface VerseData {
  reference: string
  version: string
  text: string
  source?: string
}

export interface ContextData {
  whoIsSpeaking?: string
  originalListeners?: string
  whyTheConversation?: string
  historicalBackdrop?: string
  immediateImpact?: string
  longTermImpact?: string
  setting?: string
}

export interface StoryData {
  title: string
  text: string
  imagePrompt?: string
  img?: string
}

export interface PoetryData {
  title: string
  type: string
  text: string
  imagePrompt?: string
  img?: string
}

export interface ImageryData {
  title: string
  sub: string
  icon: string
  imagePrompt?: string
  img?: string
}

export interface SongData {
  title: string
  sub: string
  lyrics: string
  prompt: string
  imagePrompt?: string
  img?: string
}

export interface DevotionalData {
  verse?: VerseData
  interpretation?: string
  heroImage?: string
  heroImagePrompt?: string
  context?: ContextData
  contextImagePrompt?: string
  contextHeroImage?: string
  stories?: StoryData[]
  poetry?: PoetryData[]
  imagery?: ImageryData[]
  songs?: SongData
}

interface LoadingStates {
  verse: boolean
  interpretation: boolean
  context: boolean
  stories: boolean
  poetry: boolean
  imagery: boolean
  songs: boolean
}

interface DevotionalContextType {
  devotional: DevotionalData
  setDevotional: React.Dispatch<React.SetStateAction<DevotionalData>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  loadingStep: string
  setLoadingStep: React.Dispatch<React.SetStateAction<string>>
  loadingStates: LoadingStates
  generateDevotional: (source?: string) => Promise<boolean>
  generateForVerse: (verseQuery: string) => Promise<boolean>
  userName: string
  setUserName: React.Dispatch<React.SetStateAction<string>>
  clearCache: () => void
}

const DevotionalContext = createContext<DevotionalContextType | null>(null)

export function useDevotional() {
  const context = useContext(DevotionalContext)
  if (!context) {
    throw new Error("useDevotional must be used within a DevotionalProvider")
  }
  return context
}

const initialLoadingStates: LoadingStates = {
  verse: false,
  interpretation: false,
  context: false,
  stories: false,
  poetry: false,
  imagery: false,
  songs: false,
}

interface UserProfile {
  ageRange: string
  gender: string
  stageSituation: string
  language?: string
  contentMode?: "casual" | "academic"
}

export function DevotionalProvider({ children }: { children: ReactNode }) {
  const [devotional, setDevotional] = useState<DevotionalData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialLoadingStates)
  const [userName, setUserName] = useState("Friend")
  const { language: selectedLanguage } = useLanguage()
  
  const currentVerseRef = useRef<string | null>(null)
  const currentProfileRef = useRef<UserProfile | null>(null)

  React.useEffect(() => {
    const storedVersion = localStorage.getItem("lds_cache_version")
    if (storedVersion !== CACHE_VERSION) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("lds_cache_") && k !== "lds_cache_version")
      keys.forEach(k => localStorage.removeItem(k))
      localStorage.setItem("lds_cache_version", CACHE_VERSION)
    }
  }, [])

  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        if (parsed.fullName) setUserName(parsed.fullName.split(" ")[0])
      }
    } catch (e) { /* ignore */ }
  }, [])

  const getProfile = useCallback((): UserProfile => {
    try {
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        return {
          ageRange: parsed.ageRange || "",
          gender: parsed.gender || "",
          stageSituation: parsed.stageSituation || "Nothing special",
          language: selectedLanguage,
          contentMode: parsed.contentMode || "casual",
        }
      }
    } catch (e) { /* ignore */ }
    return { ageRange: "", gender: "", stageSituation: "Nothing special", language: selectedLanguage, contentMode: "casual" }
  }, [selectedLanguage])

  const getCacheKey = (reference: string, profile: UserProfile): string => {
    const demo = `${profile.ageRange}_${profile.stageSituation}_${profile.contentMode || "casual"}`.toLowerCase().replace(/\s+/g, "_")
    return `lds_cache_${reference.toLowerCase().replace(/\s+/g, "_")}_${demo}`
  }

  const loadFromCache = (reference: string, profile: UserProfile): DevotionalData | null => {
    try {
      const key = getCacheKey(reference, profile)
      const cached = localStorage.getItem(key)
      if (!cached) return null
      const data = JSON.parse(cached)
      if (data.interpretation && data.stories?.length > 0) {
        return data
      }
      localStorage.removeItem(key)
    } catch (e) { /* ignore */ }
    return null
  }

  const saveToCache = (reference: string, profile: UserProfile, data: DevotionalData) => {
    try {
      const key = getCacheKey(reference, profile)
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) { /* ignore */ }
  }

  const generateImage = async (prompt: string, width = 1024, height = 1024, ageRange?: string): Promise<string | null> => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width, height, ageRange }),
      })
      if (response.ok) {
        const data = await response.json()
        return data.imageUrl || null
      }
    } catch (e) { /* ignore */ }
    return null
  }

  const generateAllContent = useCallback(async (verse: VerseData, profile: UserProfile): Promise<void> => {
    const { reference, text, source } = verse
    const payload = {
      verseReference: reference,
      verseText: text,
      source,
      ageRange: profile.ageRange,
      gender: profile.gender,
      stageSituation: profile.stageSituation,
      language: profile.language || "en",
      contentMode: profile.contentMode || "casual",
    }

    let completedCount = 0
    const checkComplete = () => {
      completedCount++
      if (completedCount === 6) {
        setDevotional(current => {
          saveToCache(reference, profile, current)
          return current
        })
      }
    }

    // 1. Interpretation - AWAIT this one
    setLoadingStates(prev => ({ ...prev, interpretation: true }))
    try {
      const res = await fetch("/api/generate-interpretation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setDevotional(prev => ({ ...prev, interpretation: data.interpretation, heroImagePrompt: data.heroImagePrompt }))
      setLoadingStates(prev => ({ ...prev, interpretation: false }))
      if (data.heroImagePrompt) {
        generateImage(data.heroImagePrompt, 1024, 768, profile.ageRange).then(heroImage => {
          if (heroImage) setDevotional(prev => ({ ...prev, heroImage }))
        })
      }
      checkComplete()
    } catch {
      setLoadingStates(prev => ({ ...prev, interpretation: false }))
      checkComplete()
    }

    // 2-6: Fire and forget
    setLoadingStates(prev => ({ ...prev, context: true }))
    fetch("/api/generate-context", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(async data => {
        setDevotional(prev => ({ ...prev, context: data.context, contextImagePrompt: data.contextImagePrompt }))
        setLoadingStates(prev => ({ ...prev, context: false }))
        if (data.contextImagePrompt) {
          const img = await generateImage(data.contextImagePrompt, 1024, 768, profile.ageRange)
          if (img) setDevotional(prev => ({ ...prev, contextHeroImage: img }))
        }
        checkComplete()
      })
      .catch(() => { setLoadingStates(prev => ({ ...prev, context: false })); checkComplete() })

    setLoadingStates(prev => ({ ...prev, stories: true }))
    Promise.all([
      fetch("/api/generate-story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, storyType: "contemporary" }) }).then(r => r.json()),
      fetch("/api/generate-story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, storyType: "historical" }) }).then(r => r.json()),
    ]).then(async ([s1, s2]) => {
      const stories = [s1, s2].map(s => s.title ? s : { title: "Story", text: "", imagePrompt: "" })
      setDevotional(prev => ({ ...prev, stories }))
      setLoadingStates(prev => ({ ...prev, stories: false }))
      for (let i = 0; i < stories.length; i++) {
        if (stories[i].imagePrompt) {
          const img = await generateImage(stories[i].imagePrompt, 512, 512, profile.ageRange)
          if (img) setDevotional(prev => {
            const updated = [...(prev.stories || [])]
            if (updated[i]) updated[i] = { ...updated[i], img }
            return { ...prev, stories: updated }
          })
        }
      }
      checkComplete()
    }).catch(() => { setLoadingStates(prev => ({ ...prev, stories: false })); checkComplete() })

    setLoadingStates(prev => ({ ...prev, poetry: true }))
    Promise.all([
      fetch("/api/generate-poem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, poemType: "classic" }) }).then(r => r.json()),
      fetch("/api/generate-poem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, poemType: "freeverse" }) }).then(r => r.json()),
    ]).then(async ([p1, p2]) => {
      const poetry = [p1.poem, p2.poem].map(p => p || { title: "Poem", type: "Verse", text: "", imagePrompt: "" })
      setDevotional(prev => ({ ...prev, poetry }))
      setLoadingStates(prev => ({ ...prev, poetry: false }))
      for (let i = 0; i < poetry.length; i++) {
        if (poetry[i].imagePrompt) {
          const img = await generateImage(poetry[i].imagePrompt, 512, 512, profile.ageRange)
          if (img) setDevotional(prev => {
            const updated = [...(prev.poetry || [])]
            if (updated[i]) updated[i] = { ...updated[i], img }
            return { ...prev, poetry: updated }
          })
        }
      }
      checkComplete()
    }).catch(() => { setLoadingStates(prev => ({ ...prev, poetry: false })); checkComplete() })

    setLoadingStates(prev => ({ ...prev, imagery: true }))
    fetch("/api/generate-imagery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(async data => {
        const imagery = data.imagery || []
        setDevotional(prev => ({ ...prev, imagery }))
        setLoadingStates(prev => ({ ...prev, imagery: false }))
        for (let i = 0; i < imagery.length; i++) {
          if (imagery[i].imagePrompt) {
            const img = await generateImage(imagery[i].imagePrompt, 512, 512, profile.ageRange)
            if (img) setDevotional(prev => {
              const updated = [...(prev.imagery || [])]
              if (updated[i]) updated[i] = { ...updated[i], img }
              return { ...prev, imagery: updated }
            })
          }
        }
        checkComplete()
      })
      .catch(() => { setLoadingStates(prev => ({ ...prev, imagery: false })); checkComplete() })

    setLoadingStates(prev => ({ ...prev, songs: true }))
    fetch("/api/generate-songs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(async data => {
        const songs = data.songs
        setDevotional(prev => ({ ...prev, songs }))
        setLoadingStates(prev => ({ ...prev, songs: false }))
        if (songs?.imagePrompt) {
          const img = await generateImage(songs.imagePrompt, 512, 512, profile.ageRange)
          if (img) setDevotional(prev => ({ ...prev, songs: prev.songs ? { ...prev.songs, img } : undefined }))
        }
        checkComplete()
      })
      .catch(() => { setLoadingStates(prev => ({ ...prev, songs: false })); checkComplete() })
  }, [])

  const generateDevotional = useCallback(async (source = "ComeFollowMe"): Promise<boolean> => {
    setIsLoading(true)
    setLoadingStep("Getting scripture...")
    setDevotional({})
    setLoadingStates({ ...initialLoadingStates, verse: true })

    const profile = getProfile()

    try {
      const verseResponse = await fetch("/api/generate-verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      })

      if (!verseResponse.ok) throw new Error("Failed to get verse")
      const verse = await verseResponse.json()

      const cached = loadFromCache(verse.reference, profile)
      if (cached) {
        setDevotional(cached)
        setLoadingStates(initialLoadingStates)
        setIsLoading(false)
        setLoadingStep("")
        return true
      }

      setDevotional({ verse })
      setLoadingStates(prev => ({ ...prev, verse: false }))
      setLoadingStep("Generating interpretation...")

      currentVerseRef.current = verse.reference
      currentProfileRef.current = profile
      
      await generateAllContent(verse, profile)
      
      setIsLoading(false)
      setLoadingStep("")
      return true
    } catch (error) {
      console.error("Generation failed:", error)
      setLoadingStep("Connection error. Please try again.")
      setTimeout(() => {
        setIsLoading(false)
        setLoadingStates(initialLoadingStates)
      }, 2000)
      return false
    }
  }, [generateAllContent, getProfile])

  const generateForVerse = useCallback(async (verseQuery: string): Promise<boolean> => {
    setIsLoading(true)
    setLoadingStep(`Searching for ${verseQuery}...`)
    setDevotional({})
    setLoadingStates({ ...initialLoadingStates, verse: true })

    const profile = getProfile()

    try {
      const verseResponse = await fetch("/api/generate-verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseQuery }),
      })

      if (!verseResponse.ok) throw new Error("Failed to get verse")
      const verse = await verseResponse.json()

      const cached = loadFromCache(verse.reference, profile)
      if (cached) {
        setDevotional(cached)
        setLoadingStates(initialLoadingStates)
        setIsLoading(false)
        setLoadingStep("")
        return true
      }

      setDevotional({ verse })
      setLoadingStates(prev => ({ ...prev, verse: false }))
      setLoadingStep("Generating interpretation...")

      currentVerseRef.current = verse.reference
      currentProfileRef.current = profile
      
      await generateAllContent(verse, profile)
      
      setIsLoading(false)
      setLoadingStep("")
      return true
    } catch (error) {
      console.error("Generation failed:", error)
      setLoadingStep("Connection error. Please try again.")
      setTimeout(() => {
        setIsLoading(false)
        setLoadingStates(initialLoadingStates)
      }, 2000)
      return false
    }
  }, [generateAllContent, getProfile])

  const clearCache = useCallback(() => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("lds_cache_"))
    keys.forEach(k => localStorage.removeItem(k))
    setDevotional({})
  }, [])

  return (
    <DevotionalContext.Provider
      value={{
        devotional,
        setDevotional,
        isLoading,
        setIsLoading,
        loadingStep,
        setLoadingStep,
        loadingStates,
        generateDevotional,
        generateForVerse,
        userName,
        setUserName,
        clearCache,
      }}
    >
      {children}
    </DevotionalContext.Provider>
  )
}
