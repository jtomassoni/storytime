import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { cultureRegion, preferredValues, avoidTopics, languagePrefs } =
      await request.json()

    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        cultureRegion: cultureRegion || null,
        preferredValues: preferredValues || [],
        avoidTopics: avoidTopics || [],
        languagePrefs: languagePrefs || [],
      },
      create: {
        userId: user.id,
        cultureRegion: cultureRegion || null,
        preferredValues: preferredValues || [],
        avoidTopics: avoidTopics || [],
        languagePrefs: languagePrefs || [],
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

