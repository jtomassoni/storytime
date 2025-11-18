"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Layout } from "@/components/Layout"
import Link from "next/link"
import { FaCheckCircle, FaMoon, FaArrowRight } from "react-icons/fa"
import { formatYearlyPrice } from "@/lib/formatPrice"

function SubscribeSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    const isMock = searchParams.get("mock") === "true"
    
    if (isMock) {
      // Mock mode - just refresh to show updated subscription status
      setLoading(false)
      router.refresh()
      return
    }
    
    if (sessionId) {
      // Verify subscription status
      fetch("/api/subscribe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(() => {
          setLoading(false)
          router.refresh()
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [searchParams, router])

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="max-w-md w-full text-center">
          {loading ? (
            <div className="text-lg">Verifying subscription...</div>
          ) : (
            <>
              <div className="mb-6">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to Bedtime Stories!
                </h1>
                <p className="text-gray-600 text-lg">
                  Your subscription is active. Enjoy ad-free daily stories.
                </p>
              </div>

              <div className="bg-card-bg rounded-xl p-6 mb-6 border border-border-color">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FaMoon className="text-accent-purple text-2xl" />
                  <span className="text-xl font-semibold">{formatYearlyPrice()}/year</span>
                </div>
                <p className="text-sm text-gray-600">
                  You&apos;ll receive a new bedtime story every day, personalized to your preferences.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Get Your First Story
                <FaArrowRight />
              </Link>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default function SubscribeSuccessPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-[60vh] flex items-center justify-center py-12"><div className="text-lg">Loading...</div></div></Layout>}>
      <SubscribeSuccessContent />
    </Suspense>
  )
}

