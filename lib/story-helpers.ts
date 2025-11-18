import { prisma } from "./prisma"

/**
 * Generates a condensed version of a story targeting a specific read time.
 * Uses AI to intelligently condense the story while preserving:
 * - Story essence and main plot points
 * - Bedtime-appropriate tone
 * - Key themes and values
 * - Character development (if applicable)
 * 
 * @param originalText The full story text to condense
 * @param targetMinutes Target read time in minutes (5 or 10)
 * @param storyMetadata Optional metadata to help guide condensation
 * @returns Condensed story text
 */
export async function generateShortVersion(
  originalText: string,
  targetMinutes: 5 | 10,
  storyMetadata?: {
    title?: string
    valuesTags?: string[]
    topicTags?: string[]
  }
): Promise<string> {
  // Estimate words per minute for bedtime story reading (slower pace for parents reading to kids)
  // Average bedtime story reading: ~100-120 words per minute
  const wordsPerMinute = 110
  const targetWordCount = targetMinutes * wordsPerMinute

  // Use OpenAI API if available, otherwise throw helpful error
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable not set. Please configure it to generate story versions."
    )
  }

  // Build the prompt for AI condensation
  const valuesContext = storyMetadata?.valuesTags?.length
    ? `\n\nKey themes and values to preserve: ${storyMetadata.valuesTags.join(", ")}`
    : ""
  const topicsContext = storyMetadata?.topicTags?.length
    ? `\n\nStory topics: ${storyMetadata.topicTags.join(", ")}`
    : ""

  const prompt = `You are a children's bedtime story editor. Your task is to create a condensed version of this bedtime story that takes approximately ${targetMinutes} minutes to read aloud (target: ~${targetWordCount} words).

CRITICAL REQUIREMENTS:
1. Preserve the main plot, characters, and story arc - this should be a complete story, not a summary
2. Maintain the bedtime-appropriate, calming, gentle tone throughout
3. Keep all key themes and values intact${valuesContext}${topicsContext}
4. Preserve character development and emotional journey
5. Ensure the story feels complete and satisfying, just shorter
6. Keep the same narrative style and voice
7. Do NOT add new content - only condense what exists
8. Maintain any gender-specific elements if present

Original story:
${originalText}

Please provide ONLY the condensed story text, with no additional commentary or explanation.`

  try {
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using cost-effective model
        messages: [
          {
            role: "system",
            content:
              "You are an expert children's story editor specializing in creating condensed versions of bedtime stories while preserving their essence, tone, and themes.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7, // Some creativity but mostly faithful to original
        max_tokens: Math.ceil(targetWordCount * 1.5), // Allow some buffer
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()
    const condensedText =
      data.choices?.[0]?.message?.content?.trim() || originalText

    if (!condensedText || condensedText.length < 100) {
      throw new Error(
        "Generated story version is too short or empty. Please try again."
      )
    }

    return condensedText
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(
      `Failed to generate condensed story version: ${String(error)}`
    )
  }
}

/**
 * Estimates read time in minutes for a given text.
 * Uses average reading speed for bedtime stories (~110 words per minute).
 */
export function estimateReadTime(text: string): number {
  const wordsPerMinute = 110
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generates all missing length versions for a story.
 * Processes default, boy, and girl versions as needed.
 */
export async function generateStoryVersions(
  storyId: string,
  options: {
    targetLengths?: ("5min" | "10min")[]
    genderVersions?: ("default" | "boy" | "girl")[]
  } = {}
): Promise<{
  generated: string[]
  errors: Array<{ version: string; error: string }>
}> {
  const {
    targetLengths = ["5min", "10min"],
    genderVersions = ["default", "boy", "girl"],
  } = options

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: {
      fullText: true,
      boyStoryText: true,
      girlStoryText: true,
      title: true,
      valuesTags: true,
      topicTags: true,
    },
  })

  if (!story) {
    throw new Error(`Story ${storyId} not found`)
  }

  const generated: string[] = []
  const errors: Array<{ version: string; error: string }> = []
  const updates: Record<string, string> = {}
  const readTimeUpdates: Record<string, number> = {}

  // Generate versions for each requested length and gender combination
  for (const length of targetLengths) {
    const targetMinutes = length === "5min" ? 5 : 10

    // Default version (fullText)
    if (genderVersions.includes("default") && story.fullText) {
      const fieldName = length === "5min" ? "fullText5Min" : "fullText10Min"
      const readTimeFieldName =
        length === "5min"
          ? "estimatedReadTimeMinutes5Min"
          : "estimatedReadTimeMinutes10Min"

      try {
        const condensed = await generateShortVersion(
          story.fullText,
          targetMinutes,
          {
            title: story.title,
            valuesTags: story.valuesTags,
            topicTags: story.topicTags,
          }
        )
        updates[fieldName] = condensed
        readTimeUpdates[readTimeFieldName] = estimateReadTime(condensed)
        generated.push(`default-${length}`)
      } catch (error) {
        errors.push({
          version: `default-${length}`,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Boy version
    if (
      genderVersions.includes("boy") &&
      story.boyStoryText &&
      length === "5min"
    ) {
      try {
        const condensed = await generateShortVersion(
          story.boyStoryText,
          targetMinutes,
          {
            title: story.title,
            valuesTags: story.valuesTags,
            topicTags: story.topicTags,
          }
        )
        updates.boyStoryText5Min = condensed
        readTimeUpdates.estimatedReadTimeMinutes5Min = estimateReadTime(
          condensed
        )
        generated.push(`boy-${length}`)
      } catch (error) {
        errors.push({
          version: `boy-${length}`,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    if (
      genderVersions.includes("boy") &&
      story.boyStoryText &&
      length === "10min"
    ) {
      try {
        const condensed = await generateShortVersion(
          story.boyStoryText,
          targetMinutes,
          {
            title: story.title,
            valuesTags: story.valuesTags,
            topicTags: story.topicTags,
          }
        )
        updates.boyStoryText10Min = condensed
        readTimeUpdates.estimatedReadTimeMinutes10Min = estimateReadTime(
          condensed
        )
        generated.push(`boy-${length}`)
      } catch (error) {
        errors.push({
          version: `boy-${length}`,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Girl version
    if (
      genderVersions.includes("girl") &&
      story.girlStoryText &&
      length === "5min"
    ) {
      try {
        const condensed = await generateShortVersion(
          story.girlStoryText,
          targetMinutes,
          {
            title: story.title,
            valuesTags: story.valuesTags,
            topicTags: story.topicTags,
          }
        )
        updates.girlStoryText5Min = condensed
        readTimeUpdates.estimatedReadTimeMinutes5Min = estimateReadTime(
          condensed
        )
        generated.push(`girl-${length}`)
      } catch (error) {
        errors.push({
          version: `girl-${length}`,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    if (
      genderVersions.includes("girl") &&
      story.girlStoryText &&
      length === "10min"
    ) {
      try {
        const condensed = await generateShortVersion(
          story.girlStoryText,
          targetMinutes,
          {
            title: story.title,
            valuesTags: story.valuesTags,
            topicTags: story.topicTags,
          }
        )
        updates.girlStoryText10Min = condensed
        readTimeUpdates.estimatedReadTimeMinutes10Min = estimateReadTime(
          condensed
        )
        generated.push(`girl-${length}`)
      } catch (error) {
        errors.push({
          version: `girl-${length}`,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }
  }

  // Update the story with all generated versions
  if (Object.keys(updates).length > 0) {
    await prisma.story.update({
      where: { id: storyId },
      data: {
        ...updates,
        ...readTimeUpdates,
      },
    })
  }

  return { generated, errors }
}

