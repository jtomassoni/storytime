import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get("storyId")

    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 })
    }

    // favoriteStory model doesn't exist in schema - return false
    return NextResponse.json({ isFavorited: false })
  } catch (error) {
    console.error("Favorite check error:", error)
    return NextResponse.json(
      { error: "Failed to check favorite" },
      { status: 500 }
    )
  }
}

