"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formatMonthlyPrice, formatYearlyPrice } from "@/lib/formatPrice"

type PlanType = "monthly" | "yearly" | "founders"

interface SubscribeButtonProps {
  plan?: PlanType
  className?: string
}

export function SubscribeButton({ plan, className }: SubscribeButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Determine plan from prop, URL param, or default to yearly
  const selectedPlan: PlanType = plan || (searchParams.get("plan") as PlanType) || "yearly"

  const getButtonText = () => {
    if (loading) return "Loading..."
    switch (selectedPlan) {
      case "monthly":
        return `Get Started - ${formatMonthlyPrice()}/month`
      case "yearly":
        return `Get Started - ${formatYearlyPrice()}/year`
      case "founders":
        return "Get Founders Access"
      default:
        return "Get Started - Choose Plan"
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/subscribe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: selectedPlan }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout")
      }

      // If mock mode, use Next.js router for navigation (no full page reload)
      if (data.mock) {
        if (typeof window !== 'undefined') {
          const url = new URL(data.url)
          // Use push for navigation - success page will handle refresh
          router.push(url.pathname + url.search)
        }
        return
      }

      // For real Stripe, we need to redirect to external URL
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto ${className || ""}`}
    >
      {getButtonText()}
    </button>
  )
}

