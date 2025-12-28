"use client"

import { useRouter } from "next/navigation"
import { useSubscription } from "@/context/subscription-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SubscriptionPage() {
  const router = useRouter()
  const { tier, isTrialActive, daysLeftInTrial, startTrial, upgradeToPaid } = useSubscription()

  const features = [
    "Biblical Context & Backstory",
    "Personalized Stories",
    "Inspiring Poetry & Hymns",
    "Visual Imagery & Symbols",
    "Worship Songs & Music",
    "Custom Verse Search",
    "AI Chat Assistant",
  ]

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-gradient-to-b from-amber-50 via-background to-background shadow-2xl pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-background/95 backdrop-blur-md p-4 justify-between border-b border-border">
        <button
          onClick={() => router.push("/")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-base font-bold">Premium Subscription</h2>
        <div className="w-10"></div>
      </div>

      <main className="flex-1 px-6 py-8">
        {/* Current Status */}
        {tier === "free" && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
              <span className="material-symbols-outlined text-gray-600">block</span>
              <span className="text-sm font-semibold text-gray-700">Free Account</span>
            </div>
            <p className="text-sm text-muted-foreground">You currently have access to the Friendly Breakdown only</p>
          </div>
        )}

        {isTrialActive && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full mb-4">
              <span className="material-symbols-outlined text-amber-700">verified</span>
              <span className="text-sm font-semibold text-amber-900">
                Trial Active: {daysLeftInTrial} {daysLeftInTrial === 1 ? "day" : "days"} left
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Enjoying premium? Upgrade to keep full access</p>
          </div>
        )}

        {tier === "paid" && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full mb-4">
              <span className="material-symbols-outlined text-green-700">workspace_premium</span>
              <span className="text-sm font-semibold text-green-900">Premium Member</span>
            </div>
            <p className="text-sm text-muted-foreground">You have full access to all features</p>
          </div>
        )}

        {/* Features List */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Premium Features</h3>
          <Card className="p-6 space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">check</span>
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Pricing Cards */}
        {tier !== "paid" && (
          <div className="space-y-4">
            {tier === "free" && (
              <Card className="p-6 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-200 rounded-full mb-2">
                    <span className="text-xs font-bold text-amber-900">BEST VALUE</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">7-Day Free Trial</h3>
                  <p className="text-sm text-muted-foreground">Then choose a plan</p>
                </div>
                <Button
                  onClick={startTrial}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  Start Free Trial
                </Button>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 text-center">
                <div className="mb-3">
                  <div className="text-3xl font-bold text-primary">$2</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
                <Button
                  onClick={() => upgradeToPaid("monthly")}
                  variant="outline"
                  className="w-full"
                  disabled={tier === "paid"}
                >
                  {tier === "paid" ? "Active" : "Choose"}
                </Button>
              </Card>

              <Card className="p-5 text-center border-2 border-primary">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full mb-2">
                  <span className="text-[10px] font-bold text-primary">SAVE 50%</span>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-primary">$12</div>
                  <div className="text-xs text-muted-foreground">per year</div>
                  <div className="text-[10px] text-green-600 font-semibold mt-1">($1/month)</div>
                </div>
                <Button
                  onClick={() => upgradeToPaid("yearly")}
                  className="w-full bg-gradient-to-r from-primary to-amber-500"
                  disabled={tier === "paid"}
                >
                  {tier === "paid" ? "Active" : "Choose"}
                </Button>
              </Card>
            </div>
          </div>
        )}

        {tier === "paid" && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Thank you for supporting Bible for Life Stages!</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
