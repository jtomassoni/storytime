import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const assignments = await prisma.storyOfTheDay.findMany({
      include: {
        story: true,
      },
      orderBy: { date: "asc" },
    })
    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Story of the day fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const { date, storyId } = await request.json()

    if (!date || !storyId) {
      return NextResponse.json(
        { error: "Date and story ID are required" },
        { status: 400 }
      )
    }

    const dateObj = new Date(date)
    dateObj.setHours(0, 0, 0, 0)

    // Check if assignment already exists for this date
    const existing = await prisma.storyOfTheDay.findUnique({
      where: { date: dateObj },
    })

    if (existing) {
      // Update existing assignment
      const updated = await prisma.storyOfTheDay.update({
        where: { id: existing.id },
        data: { storyId },
        include: { story: true },
      })
      return NextResponse.json({ success: true, assignment: updated })
    } else {
      // Create new assignment
      const assignment = await prisma.storyOfTheDay.create({
        data: {
          date: dateObj,
          storyId,
        },
        include: { story: true },
      })
      return NextResponse.json({ success: true, assignment })
    }
  } catch (error) {
    console.error("Story of the day assignment error:", error)
    return NextResponse.json(
      { error: "Failed to assign story" },
      { status: 500 }
    )
  }
}

