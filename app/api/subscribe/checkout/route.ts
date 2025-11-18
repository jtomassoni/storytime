import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { PRICING, STRIPE_PLANS, priceToCents } from "@/lib/pricing"

export const dynamic = 'force-dynamic'

// Check if we should use mock mode (no Stripe key or explicit mock mode)
const USE_MOCK_MODE = !process.env.STRIPE_SECRET_KEY || process.env.USE_MOCK_STRIPE === 'true'

type PlanType = "monthly" | "yearly" | "founders"

export async function POST(request: Request) {
  const sessionUser = await requireAuth()

  // Parse request body to get plan type
  let plan: PlanType = "yearly" // default to yearly
  try {
    const body = await request.json()
    plan = body.plan || "yearly"
  } catch {
    // If no body or invalid JSON, use default
  }

  // Validate plan type
  if (!["monthly", "yearly", "founders"].includes(plan)) {
    plan = "yearly"
  }

  // Check if founders plan is enabled
  if (plan === "founders" && !PRICING.foundersPlanEnabled) {
    return NextResponse.json(
      { error: "Founders plan is not currently available" },
      { status: 400 }
    )
  }

  // Fetch full user from database
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  // Type assertion for fields that exist in DB but may not be in generated types yet
  const userWithSub = user as typeof user & { subscriptionEndsAt: Date | null; stripeCustomerId: string | null }

  // Check if user already has an active subscription
  if (userWithSub.isPaid && userWithSub.subscriptionEndsAt && new Date(userWithSub.subscriptionEndsAt) > new Date()) {
    return NextResponse.json(
      { error: "You already have an active subscription" },
      { status: 400 }
    )
  }

  // If mock mode, activate subscription directly
  if (USE_MOCK_MODE) {
    const subscriptionEndsAt = new Date()
    
    // Set subscription end date based on plan type
    if (plan === "founders") {
      // Founders plan: set to 100 years from now (effectively lifetime)
      subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 100)
    } else if (plan === "monthly") {
      subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1)
    } else {
      // yearly
      subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPaid: true,
        subscriptionEndsAt: subscriptionEndsAt,
        stripeCustomerId: `mock_customer_${user.id}`,
      } as any,
    })

    // Return success URL that mimics Stripe checkout success
    return NextResponse.json({ 
      sessionId: `mock_session_${Date.now()}`,
      url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscribe/success?session_id=mock_session_${Date.now()}&mock=true&plan=${plan}`,
      mock: true,
    })
  }

  // Real Stripe mode
  try {
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-10-29.clover",
    })

    // Create or retrieve Stripe customer
    let customerId = userWithSub.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to user
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId } as any,
      })
    }

    // Determine price ID based on plan type
    let priceId: string | undefined

    if (plan === "monthly") {
      priceId = STRIPE_PLANS.monthly || process.env.STRIPE_MONTHLY_PLAN_ID
    } else if (plan === "yearly") {
      priceId = STRIPE_PLANS.yearly || process.env.STRIPE_YEARLY_PLAN_ID
    } else if (plan === "founders") {
      priceId = STRIPE_PLANS.founders || process.env.STRIPE_FOUNDERS_PLAN_ID
    }

    // If no price ID provided, create price dynamically
    if (!priceId) {
      // Create or get product
      let productId = process.env.STRIPE_PRODUCT_ID
      
      if (!productId) {
        const product = await stripe.products.create({
          name: "Bedtime Stories Subscription",
          description: "Daily bedtime stories for your family",
        })
        productId = product.id
      }

      // Create price based on plan type
      let priceConfig: {
        product: string
        unit_amount: number
        currency: string
        recurring?: { interval: "month" | "year" }
      }

      if (plan === "monthly") {
        priceConfig = {
          product: productId,
          unit_amount: priceToCents(PRICING.monthly),
          currency: "usd",
          recurring: { interval: "month" },
        }
      } else if (plan === "yearly") {
        priceConfig = {
          product: productId,
          unit_amount: priceToCents(PRICING.yearly),
          currency: "usd",
          recurring: { interval: "year" },
        }
      } else {
        // Founders plan is a one-time payment
        priceConfig = {
          product: productId,
          unit_amount: priceToCents(PRICING.foundersPrice),
          currency: "usd",
          // No recurring for founders plan
        }
      }

      const price = await stripe.prices.create(priceConfig as any)
      priceId = price.id
    }

    // Create checkout session
    const sessionConfig: {
      customer: string
      payment_method_types: string[]
      line_items: Array<{ price: string; quantity: number }>
      mode: "subscription" | "payment"
      success_url: string
      cancel_url: string
      metadata: { userId: string; plan: string }
    } = {
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: plan === "founders" ? "payment" : "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/account`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    }

    const session = await stripe.checkout.sessions.create(sessionConfig as any)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

