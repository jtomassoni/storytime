import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    // Category model doesn't exist in schema - return empty array
    return NextResponse.json([])
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
    // Category model doesn't exist in schema - return error
    return NextResponse.json(
      { error: "Categories are not supported" },
      { status: 501 }
    )
  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}

