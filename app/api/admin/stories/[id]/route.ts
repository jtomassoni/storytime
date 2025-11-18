import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { assignStoryToAutoCategories } from "@/lib/category-helpers"

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Delete existing category associations
    await prisma.storyCategory.deleteMany({
      where: { storyId: params.id },
    })

    const story = await prisma.story.update({
      where: { id: params.id },
      data: {
        title,
        shortDescription,
        longDescription: longDescription || null,
        fullText,
        boyStoryText: boyStoryText || null,
        girlStoryText: girlStoryText || null,
        minAge: minAge || null,
        maxAge: maxAge || null,
        estimatedReadTimeMinutes: estimatedReadTimeMinutes || null,
        isActive: isActive ?? true,
        valuesTags: valuesTags || [],
        topicTags: topicTags || [],
        cultureTags: cultureTags || [],
        languageTags: languageTags || [],
        contentWarnings: contentWarnings || [],
        representationTags: representationTags || [],
        categories: {
          create: (selectedCategoryIds || []).map((categoryId: string) => ({
            categoryId,
          })),
        },
      },
    })

    // Auto-assign story to categories based on tags (in addition to manually selected ones)
    try {
      await assignStoryToAutoCategories(story.id)
    } catch (error) {
      console.error("Error auto-assigning categories:", error)
      // Don't fail the request if auto-assignment fails
    }

    return NextResponse.json({ success: true, story })
  } catch (error) {
    console.error("Story update error:", error)
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    )
  }
}

