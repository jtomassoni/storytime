import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { storyId } = await request.json()

    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 })
    }

    // favoriteStory model doesn't exist in schema - return error
    return NextResponse.json(
      { error: "Favorites are not supported" },
      { status: 501 }
    )
  } catch (error) {
    console.error("Favorite toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    )
  }
}

