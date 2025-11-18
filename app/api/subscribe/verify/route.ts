import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import Stripe from "stripe"

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-10-29.clover",
  })
}

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.customer_email !== user.email) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 })
    }

    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify subscription" },
      { status: 500 }
    )
  }
}

