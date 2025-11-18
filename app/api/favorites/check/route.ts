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

    const favorite = await prisma.favoriteStory.findUnique({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId,
        },
      },
    })

    return NextResponse.json({ isFavorited: !!favorite })
  } catch (error) {
    console.error("Favorite check error:", error)
    return NextResponse.json(
      { error: "Failed to check favorite" },
      { status: 500 }
    )
  }
}

