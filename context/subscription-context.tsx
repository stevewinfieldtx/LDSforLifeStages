"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SubscriptionTier = "free" | "trial" | "paid"

interface SubscriptionContextType {
  tier: SubscriptionTier
  trialEndsAt: number | null
  isTrialActive: boolean
  daysLeftInTrial: number
  canAccessPremium: boolean
  canSearchCustomVerse: boolean
  startTrial: () => void
  upgradeToPaid: (plan: "monthly" | "yearly") => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("free")
  const [trialEndsAt, setTrialEndsAt] = useState<number | null>(null)

  useEffect(() => {
    const savedTier = localStorage.getItem("subscriptionTier")
    const savedTrialEnd = localStorage.getItem("trialEndsAt")

    if (savedTier) {
      setTier(savedTier as SubscriptionTier)
    }

    if (savedTrialEnd) {
      const endTime = Number.parseInt(savedTrialEnd)
      setTrialEndsAt(endTime)

      // Check if trial has expired
      if (endTime < Date.now()) {
        setTier("free")
        localStorage.setItem("subscriptionTier", "free")
        localStorage.removeItem("trialEndsAt")
      }
    }
  }, [])

  const isTrialActive = tier === "trial" && trialEndsAt !== null && trialEndsAt > Date.now()

  const daysLeftInTrial = trialEndsAt ? Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0

  const canAccessPremium = tier === "paid" || isTrialActive

  const canSearchCustomVerse = tier === "paid" || isTrialActive

  const startTrial = () => {
    const endTime = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days from now
    setTier("trial")
    setTrialEndsAt(endTime)
    localStorage.setItem("subscriptionTier", "trial")
    localStorage.setItem("trialEndsAt", endTime.toString())
  }

  const upgradeToPaid = (plan: "monthly" | "yearly") => {
    // In a real app, this would integrate with Stripe
    // For now, just update the tier
    setTier("paid")
    localStorage.setItem("subscriptionTier", "paid")
    localStorage.removeItem("trialEndsAt")
    setTrialEndsAt(null)
  }

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        trialEndsAt,
        isTrialActive,
        daysLeftInTrial,
        canAccessPremium,
        canSearchCustomVerse,
        startTrial,
        upgradeToPaid,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
