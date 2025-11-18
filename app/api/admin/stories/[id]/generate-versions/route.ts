import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { generateStoryVersions } from "@/lib/story-helpers"

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    const body = await request.json()

    const {
      targetLengths = ["5min", "10min"],
      genderVersions = ["default", "boy", "girl"],
    } = body

    // Validate inputs
    const validLengths = ["5min", "10min"]
    const validGenders = ["default", "boy", "girl"]

    const lengths = Array.isArray(targetLengths)
      ? targetLengths.filter((l) => validLengths.includes(l))
      : validLengths

    const genders = Array.isArray(genderVersions)
      ? genderVersions.filter((g) => validGenders.includes(g))
      : validGenders

    if (lengths.length === 0) {
      return NextResponse.json(
        { error: "At least one valid target length must be specified" },
        { status: 400 }
      )
    }

    if (genders.length === 0) {
      return NextResponse.json(
        { error: "At least one valid gender version must be specified" },
        { status: 400 }
      )
    }

    // Generate the versions
    const result = await generateStoryVersions(params.id, {
      targetLengths: lengths as ("5min" | "10min")[],
      genderVersions: genders as ("default" | "boy" | "girl")[],
    })

    return NextResponse.json({
      success: true,
      generated: result.generated,
      errors: result.errors.length > 0 ? result.errors : undefined,
      message:
        result.errors.length > 0
          ? `Generated ${result.generated.length} versions with ${result.errors.length} errors`
          : `Successfully generated ${result.generated.length} versions`,
    })
  } catch (error) {
    console.error("Story version generation error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate story versions",
      },
      { status: 500 }
    )
  }
}

