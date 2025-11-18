import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { childAge, preferredValues, preferredGender } = await request.json()

    // Build query to find a matching story
    const where: any = {
      isActive: true,
    }

    // Filter by age if provided
    if (childAge !== null && childAge !== undefined) {
      where.OR = [
        {
          minAge: { lte: childAge },
          maxAge: { gte: childAge },
        },
        {
          minAge: null,
          maxAge: null,
        },
      ]
    }

    // Filter by values if provided
    if (preferredValues && Array.isArray(preferredValues) && preferredValues.length > 0) {
      where.valuesTags = {
        hasSome: preferredValues.map((v: string) => v.toLowerCase()),
      }
    }

    // Find stories that match
    const stories = await prisma.story.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10, // Get a few candidates
    })

    // If no stories match, get any active story
    let story: typeof stories[0] | null = stories[0] || null
    if (!story) {
      story = await prisma.story.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      })
    }

    if (!story) {
      return NextResponse.json(
        { error: "No stories available" },
        { status: 404 }
      )
    }

    // Return story with 10-minute version preference (or fallback to full text)
    // Note: These fields may not exist in schema yet, so we use type assertion
    const storyWithVersions = story as any
    
    return NextResponse.json({
      story: {
        id: story.id,
        title: story.title,
        shortDescription: story.shortDescription,
        minAge: story.minAge,
        maxAge: story.maxAge,
        valuesTags: story.valuesTags,
        // Include 10-minute versions (may be null if not generated yet)
        fullText10Min: storyWithVersions.fullText10Min || null,
        boyStoryText10Min: storyWithVersions.boyStoryText10Min || null,
        girlStoryText10Min: storyWithVersions.girlStoryText10Min || null,
        boyStoryText: story.boyStoryText,
        girlStoryText: story.girlStoryText,
        fullText: story.fullText,
        estimatedReadTimeMinutes10Min: storyWithVersions.estimatedReadTimeMinutes10Min || null,
        preferredGender: preferredGender || null,
      },
    })
  } catch (error) {
    console.error("Preview story error:", error)
    return NextResponse.json(
      { error: "Failed to get preview story" },
      { status: 500 }
    )
  }
}

