import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

// Mock subscription activation for testing
export async function POST(request: Request) {
  try {
    const sessionUser = await requireAuth()

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

    // Mock subscription: set subscription to expire 1 year from now
    const subscriptionEndsAt = new Date()
    subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 1)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPaid: true,
        subscriptionEndsAt: subscriptionEndsAt,
        stripeCustomerId: `mock_customer_${user.id}`,
      } as any,
    })

    return NextResponse.json({ 
      success: true,
      message: "Mock subscription activated!",
      subscriptionEndsAt: subscriptionEndsAt.toISOString(),
    })
  } catch (error) {
    console.error("Mock subscription error:", error)
    return NextResponse.json(
      { error: "Failed to activate mock subscription" },
      { status: 500 }
    )
  }
}

