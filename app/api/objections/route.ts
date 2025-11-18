import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { StoryObjectionReason } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { storyId, sentenceIndex, textSpan, reason, comment } =
      await request.json()

    if (!storyId || !reason) {
      return NextResponse.json(
        { error: "Story ID and reason are required" },
        { status: 400 }
      )
    }

    await prisma.storyObjection.create({
      data: {
        userId: user.id,
        storyId,
        sentenceIndex: sentenceIndex !== undefined ? sentenceIndex : null,
        textSpan: textSpan || null,
        reason: reason as StoryObjectionReason,
        comment: comment || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Objection error:", error)
    return NextResponse.json(
      { error: "Failed to submit objection" },
      { status: 500 }
    )
  }
}

