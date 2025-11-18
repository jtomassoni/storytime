import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

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
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan || "yearly"

        if (userId) {
          let subscriptionEndsAt: Date | null = null

          if (session.subscription) {
            // Recurring subscription (monthly or yearly)
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            )
            subscriptionEndsAt = new Date(
              (subscription as any).current_period_end * 1000
            )
          } else if (plan === "founders") {
            // Founders plan: one-time payment, set to 100 years from now (lifetime)
            subscriptionEndsAt = new Date()
            subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 100)
          }

          if (subscriptionEndsAt) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                isPaid: true,
                subscriptionEndsAt: subscriptionEndsAt,
              },
            })
          }
        }
        break
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          if (subscription.status === "active") {
            const subscriptionEndsAt = new Date(
              (subscription as any).current_period_end * 1000
            )
            await prisma.user.update({
              where: { id: user.id },
              data: {
                isPaid: true,
                subscriptionEndsAt: subscriptionEndsAt,
              },
            })
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                isPaid: false,
                subscriptionEndsAt: null,
              },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

