import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { childAge, preferredValues, preferredGender } =
      await request.json()

    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        childAge: childAge || null,
        preferredValues: preferredValues || [],
        preferredGender: preferredGender || null,
      },
      create: {
        userId: user.id,
        childAge: childAge || null,
        preferredValues: preferredValues || [],
        preferredGender: preferredGender || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Preferences error:", error)
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    )
  }
}

