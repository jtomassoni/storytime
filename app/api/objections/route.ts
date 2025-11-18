import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-helpers"

export const dynamic = 'force-dynamic'

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

    // storyObjection model doesn't exist in schema - return error
    return NextResponse.json(
      { error: "Objections are not supported" },
      { status: 501 }
    )
  } catch (error) {
    console.error("Objection error:", error)
    return NextResponse.json(
      { error: "Failed to submit objection" },
      { status: 500 }
    )
  }
}

