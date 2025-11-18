import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { storyId } = await request.json()

    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 })
    }

    const existing = await prisma.favoriteStory.findUnique({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId,
        },
      },
    })

    if (existing) {
      await prisma.favoriteStory.delete({
        where: {
          userId_storyId: {
            userId: user.id,
            storyId,
          },
        },
      })
      return NextResponse.json({ isFavorited: false })
    } else {
      await prisma.favoriteStory.create({
        data: {
          userId: user.id,
          storyId,
        },
      })
      return NextResponse.json({ isFavorited: true })
    }
  } catch (error) {
    console.error("Favorite toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    )
  }
}

