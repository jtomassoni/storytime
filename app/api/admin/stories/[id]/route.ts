import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

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

    return NextResponse.json({ success: true, story })
  } catch (error) {
    console.error("Story update error:", error)
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    )
  }
}

