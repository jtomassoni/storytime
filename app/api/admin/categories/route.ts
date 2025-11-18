import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAdmin()
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const { name, description, minAge, maxAge, cultureTags } =
      await request.json()

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        minAge: minAge || null,
        maxAge: maxAge || null,
        cultureTags: cultureTags || [],
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}

