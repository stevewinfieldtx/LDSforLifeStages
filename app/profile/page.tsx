"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { useSubscription } from "@/context/subscription-context"

interface ProfileData {
  fullName: string
  email: string
  ageRange: string
  gender: string
  stageSituation: string
  contentMode: "casual" | "academic"
}

export default function ProfilePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { canAccessPremium } = useSubscription()
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    ageRange: "",
    gender: "",
    stageSituation: "Nothing special",
    contentMode: "casual",
  })
  const [originalProfile, setOriginalProfile] = useState<string>("")

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("userProfile")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setFormData({
        fullName: parsed.fullName || "",
        email: parsed.email || "",
        ageRange: parsed.ageRange || "",
        gender: parsed.gender || "",
        stageSituation: parsed.stageSituation || parsed.season || "Nothing special",
        contentMode: parsed.contentMode || "casual",
      })
      const profileKey = `${parsed.ageRange || ""}_${parsed.gender || ""}_${parsed.stageSituation || parsed.season || "Nothing special"}`
      setOriginalProfile(profileKey)
    }
  }, [])

  // Save to localStorage whenever data changes
  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    if (field === "stageSituation" && !canAccessPremium) {
      updated.stageSituation = "Nothing special"
    }
    setFormData(updated)
    localStorage.setItem("userProfile", JSON.stringify(updated))
  }

  const handleSave = () => {
    router.push("/")
  }

  const ageRanges = [
    { value: "teens", label: "Youth (12-17)" },
    { value: "youth", label: "Young Single Adult (18-30)" },
    { value: "adult", label: "Adult (31-64)" },
    { value: "senior", label: "Senior (65+)" },
  ]

  // LDS-specific life stages grouped by category
  const stageSituationGroups = [
    {
      label: "Missionary Service",
      options: [
        "Preparing for a mission",
        "Currently serving a mission",
        "Recently returned missionary",
      ]
    },
    {
      label: "Temple & Marriage",
      options: [
        "Preparing for temple marriage",
        "Newly sealed in the temple",
        "Temple sealing anniversary",
      ]
    },
    {
      label: "Family Life",
      options: [
        "Having a baby",
        "Raising young children",
        "Raising teenagers",
        "Empty nester",
      ]
    },
    {
      label: "Church Callings",
      options: [
        "New calling",
        "Demanding calling",
        "Released from calling",
      ]
    },
    {
      label: "Faith & Challenges",
      options: [
        "New convert",
        "Faith crisis",
        "Inactive family member",
        "Grieving a loss",
        "Getting a divorce",
        "Going through health challenges",
        "Struggling financially",
        "Feeling lonely or isolated",
      ]
    }
  ]

  const allStageSituations = [
    "Nothing special",
    ...stageSituationGroups.flatMap(group => group.options)
  ]

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 mx-auto max-w-md shadow-2xl bg-background">
      {/* Header */}
      <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <button
          onClick={() => router.push("/")}
          className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
            arrow_back_ios_new
          </span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{t("profile")}</h2>
        <div className="w-10"></div>
      </div>

      {/* Page Indicators */}
      <div className="flex w-full flex-row items-center justify-center gap-2 py-4">
        <div className="h-2 w-2 rounded-full bg-primary"></div>
        <div className="h-2 w-2 rounded-full bg-border"></div>
        <div className="h-2 w-2 rounded-full bg-border"></div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col px-6 pt-2">
        <h1 className="text-[32px] font-bold leading-tight text-left pb-2">{t("letsGetToKnow")}</h1>
        <p className="text-base font-normal leading-normal text-muted-foreground">{t("personalizeDesc")}</p>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-5 px-6 py-6">
        <label className="flex flex-col gap-1.5 w-full">
          <p className="text-sm font-medium leading-normal">{t("language")}</p>
          <LanguageSelector variant="full" />
        </label>

        {/* Name Input */}
        <label className="flex flex-col gap-1.5 w-full">
          <p className="text-sm font-medium leading-normal">{t("fullName")}</p>
          <input
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="flex w-full resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-card h-14 placeholder:text-muted-foreground px-4 text-base font-normal leading-normal shadow-sm transition-all"
            placeholder="Enter your full name"
          />
        </label>

        {/* Email Input */}
        <label className="flex flex-col gap-1.5 w-full">
          <p className="text-sm font-medium leading-normal">{t("email")}</p>
          <input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="flex w-full resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-card h-14 placeholder:text-muted-foreground px-4 text-base font-normal leading-normal shadow-sm transition-all"
            placeholder="name@example.com"
            type="email"
          />
        </label>

        <div className="flex flex-row gap-4">
          <label className="flex flex-col gap-1.5 w-1/2">
            <p className="text-sm font-medium leading-normal">{t("ageRange")}</p>
            <div className="relative">
              <select
                value={formData.ageRange}
                onChange={(e) => handleChange("ageRange", e.target.value)}
                className="flex w-full resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-card h-14 px-4 text-base font-normal leading-normal shadow-sm appearance-none transition-all"
              >
                <option disabled value="">
                  Select
                </option>
                {ageRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </label>
          <label className="flex flex-col gap-1.5 w-1/2">
            <p className="text-sm font-medium leading-normal">{t("gender")}</p>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="flex w-full resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-card h-14 px-4 text-base font-normal leading-normal shadow-sm appearance-none transition-all"
              >
                <option disabled value="">
                  Select
                </option>
                <option value="female">Sister</option>
                <option value="male">Brother</option>
                <option value="other">Prefer not to say</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </label>
        </div>

        {/* Content Style Toggle */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">school</span>
            <h3 className="text-lg font-bold leading-tight">Content Style</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Choose how you&apos;d like your scripture content presented.</p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange("contentMode", "casual")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                formData.contentMode === "casual"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ color: formData.contentMode === "casual" ? "var(--primary)" : "var(--muted-foreground)" }}>
                favorite
              </span>
              <span className={`text-sm font-semibold ${formData.contentMode === "casual" ? "text-primary" : "text-foreground"}`}>
                Devotional
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                Warm, conversational, testimony-building
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => handleChange("contentMode", "academic")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                formData.contentMode === "academic"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ color: formData.contentMode === "academic" ? "var(--primary)" : "var(--muted-foreground)" }}>
                library_books
              </span>
              <span className={`text-sm font-semibold ${formData.contentMode === "academic" ? "text-primary" : "text-foreground"}`}>
                Academic
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                Scholarly, research-based, in-depth analysis
              </span>
            </button>
          </div>
          
          {formData.contentMode === "academic" && (
            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Academic mode includes:</span> Hebrew/Greek word studies, chiastic structures, historical-critical analysis, JST comparisons, and citations from LDS scholars like Nibley, Welch, and Tvedtnes.
              </p>
            </div>
          )}
        </div>

        {canAccessPremium && (
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">spa</span>
              <h3 className="text-lg font-bold leading-tight">{t("stageSituation")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t("stageDesc")}</p>
            
            {/* Nothing Special option first */}
            <label className="cursor-pointer group relative mb-4 block">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.stageSituation === "Nothing special"}
                onChange={() => handleChange("stageSituation", "Nothing special")}
              />
              <div className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:border-primary/50 inline-block">
                General / No specific stage
              </div>
            </label>

            {/* Grouped options */}
            {stageSituationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option, idx) => (
                    <label key={idx} className="cursor-pointer group relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={formData.stageSituation === option}
                        onChange={() => handleChange("stageSituation", option)}
                      />
                      <div className="rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:border-primary/50">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!canAccessPremium && (
          <div className="pt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "24px" }}>
                workspace_premium
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground mb-1">Personalize Your Experience</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Upgrade to access life situation-specific content tailored to your journey in the gospel.
                </p>
                <button
                  onClick={() => router.push("/subscription")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Learn more →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-muted-foreground mt-0.5" style={{ fontSize: "20px" }}>
            lock
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">{t("privacyNote")}</p>
        </div>
      </div>

      {/* Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-20 mx-auto max-w-md">
        <button
          onClick={handleSave}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-primary-foreground text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-lg"
        >
          <span className="truncate">{t("save")}</span>
        </button>
      </div>
    </div>
  )
}
