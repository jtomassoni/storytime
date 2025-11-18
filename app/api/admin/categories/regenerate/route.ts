import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { assignStoryToAutoCategories } from "@/lib/category-helpers"

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    await requireAdmin()
    
    // Get all active stories
    const stories = await prisma.story.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    let processed = 0
    let errors = 0

    // Process each story to assign auto-generated categories
    for (const story of stories) {
      try {
        await assignStoryToAutoCategories(story.id)
        processed++
      } catch (error) {
        console.error(`Error processing story ${story.id}:`, error)
        errors++
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      errors,
      total: stories.length,
    })
  } catch (error) {
    console.error("Category regeneration error:", error)
    return NextResponse.json(
      { error: "Failed to regenerate categories" },
      { status: 500 }
    )
  }
}

