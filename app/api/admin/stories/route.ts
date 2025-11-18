import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { assignStoryToAutoCategories } from "@/lib/category-helpers"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(stories)
  } catch (error) {
    console.error("Stories fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()

    const {
      title,
      shortDescription,
      longDescription,
      fullText,
      boyStoryText,
      girlStoryText,
      minAge,
      maxAge,
      estimatedReadTimeMinutes,
      isActive,
      selectedCategoryIds,
      valuesTags,
      topicTags,
      cultureTags,
      languageTags,
      contentWarnings,
      representationTags,
    } = body

    const story = await prisma.story.create({
      data: {
        title,
        shortDescription,
        fullText,
        boyStoryText: boyStoryText || null,
        girlStoryText: girlStoryText || null,
        minAge: minAge || null,
        maxAge: maxAge || null,
        estimatedReadTimeMinutes: estimatedReadTimeMinutes || null,
        isActive: isActive ?? true,
        valuesTags: valuesTags || [],
        topicTags: topicTags || [],
      },
    })

    // Auto-assign story to categories based on tags
    try {
      await assignStoryToAutoCategories(story.id)
    } catch (error) {
      console.error("Error auto-assigning categories:", error)
      // Don't fail the request if auto-assignment fails
    }

    return NextResponse.json({ success: true, story })
  } catch (error) {
    console.error("Story creation error:", error)
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    )
  }
}
