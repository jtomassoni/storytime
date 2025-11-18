"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Story, Category } from "@prisma/client"
import { useAlertModal } from "@/components/AlertModal"

type StoryWithCategories = Story & {
  categories: Array<{
    category: Category
  }>
}

type StoryFormProps = {
  story?: StoryWithCategories
}

const COMMON_VALUES = [
  "kindness", "courage", "curiosity", "family", "friendship",
  "environmental care", "perseverance", "honesty", "empathy", "creativity",
  "gratitude", "respect", "cooperation", "patience", "forgiveness"
]

const COMMON_TOPICS = [
  "bedtime", "animals", "forest", "magic", "siblings", "friendship",
  "adventure", "nature", "dreams", "family", "ocean", "stars", "garden",
  "seasons", "music", "art", "cooking", "travel", "home", "school"
]

const CULTURE_REGIONS = [
  "Global", "European", "Asian", "African", "Latin American",
  "Middle Eastern", "North American", "Indigenous", "South Asian",
  "East Asian", "Pan-African"
]

const CONTENT_WARNINGS = [
  "mild_scary", "separation_anxiety", "mild_conflict", "supernatural",
  "strong_conflict", "death_loss"
]

const LANGUAGE_TAGS = ["en", "es", "fr", "de", "zh", "ja", "ar", "hi"]

export function StoryForm({ story }: StoryFormProps) {
  const router = useRouter()
  const { AlertModal, showAlert } = useAlertModal()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [generatingVersions, setGeneratingVersions] = useState(false)
  const [versionStatus, setVersionStatus] = useState<{
    fullText5Min: boolean
    fullText10Min: boolean
    boyStoryText5Min: boolean
    boyStoryText10Min: boolean
    girlStoryText5Min: boolean
    girlStoryText10Min: boolean
  }>({
    fullText5Min: !!(story as any)?.fullText5Min,
    fullText10Min: !!(story as any)?.fullText10Min,
    boyStoryText5Min: !!(story as any)?.boyStoryText5Min,
    boyStoryText10Min: !!(story as any)?.boyStoryText10Min,
    girlStoryText5Min: !!(story as any)?.girlStoryText5Min,
    girlStoryText10Min: !!(story as any)?.girlStoryText10Min,
  })

  const [formData, setFormData] = useState({
    title: story?.title || "",
    shortDescription: story?.shortDescription || "",
    longDescription: story?.longDescription || "",
    fullText: story?.fullText || "",
    boyStoryText: (story as any)?.boyStoryText || "",
    girlStoryText: (story as any)?.girlStoryText || "",
    minAge: story?.minAge?.toString() || "",
    maxAge: story?.maxAge?.toString() || "",
    estimatedReadTimeMinutes: story?.estimatedReadTimeMinutes?.toString() || "",
    isActive: story?.isActive ?? true,
    selectedCategoryIds: story?.categories.map((sc) => sc.category.id) || [],
    selectedValues: story?.valuesTags || [],
    selectedTopics: story?.topicTags || [],
    selectedCultures: story?.cultureTags || [],
    selectedLanguages: story?.languageTags || [],
    selectedWarnings: story?.contentWarnings || [],
    representationTags: story?.representationTags.join(", ") || "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const parseJSON = async () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setFormData({
        ...formData,
        title: parsed.title || formData.title,
        shortDescription: parsed.shortDescription || formData.shortDescription,
        longDescription: parsed.longDescription || formData.longDescription,
        fullText: parsed.storyText || formData.fullText,
        minAge: parsed.ageRange?.min?.toString() || formData.minAge,
        maxAge: parsed.ageRange?.max?.toString() || formData.maxAge,
        selectedValues: parsed.values || formData.selectedValues,
        selectedTopics: parsed.topics || formData.selectedTopics,
        selectedCultures: parsed.cultureRegions || formData.selectedCultures,
        selectedLanguages: parsed.languageTags || formData.selectedLanguages,
        selectedWarnings: parsed.contentWarnings || formData.selectedWarnings,
        representationTags: [
          ...(parsed.representation?.primaryChildGenders || []),
          ...(parsed.representation?.otherCharacterTypes || []),
          ...(parsed.representation?.diversityTags || []),
        ].join(", ") || formData.representationTags,
      })
      await showAlert("Story imported successfully!")
      setJsonInput("")
    } catch (error) {
      await showAlert("Invalid JSON format. Please check your story data.")
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item]
  }

  const generateChatGPTPrompt = () => {
    const prompt = `I need help writing a bedtime story for children. Please ask me questions about what kind of story I'd like to write, then help me create it.

When I'm ready, please generate the story in this exact JSON format:

\`\`\`json
{
  "title": "Story Title",
  "shortDescription": "A brief one-sentence description (50-100 characters)",
  "longDescription": "One or two paragraphs describing the story, its tone, themes, and what makes it special (optional but recommended)",
  "storyText": "The complete story text. Should be multiple paragraphs, suitable for read-aloud. Aim for 500-1500 words depending on age range. Use clear paragraph breaks.",
  "ageRange": {
    "min": 3,
    "max": 8
  },
  "values": ["kindness", "courage", "friendship"],
  "topics": ["bedtime", "animals", "adventure"],
  "cultureRegions": ["Global", "European"],
  "languageTags": ["en"],
  "contentWarnings": [],
  "representation": {
    "primaryChildGenders": ["girl", "boy"],
    "otherCharacterTypes": ["parent", "animal"],
    "diversityTags": ["diverse characters"]
  },
  "estimatedReadTimeMinutes": 5
}
\`\`\`

## Story Requirements:

1. **Age Appropriateness**:
   - Ages 3-5: Simple language, short sentences, repetitive elements, 300-600 words
   - Ages 5-7: More complex sentences, simple plots, 600-1000 words
   - Ages 7-10: More sophisticated vocabulary, longer narratives, 1000-1500 words
   - Ages 10-12: Complex themes, richer language, 1200-2000 words

2. **Bedtime Appropriate**:
   - Calming, soothing tone
   - Resolve conflicts peacefully
   - End with comfort, safety, or peaceful resolution
   - Avoid intense action, violence, or scary elements
   - Promote relaxation and sleep

3. **Values & Themes**: Each story should teach 2-4 positive values naturally woven into the narrative.

4. **Story Structure**: Clear beginning, middle, end with engaging opening, age-appropriate conflict, satisfying resolution, and comforting conclusion.

## Available Options:

**Values**: kindness, courage, curiosity, family, friendship, environmental care, perseverance, honesty, empathy, creativity, gratitude, respect, cooperation, patience, forgiveness

**Topics**: bedtime, animals, forest, magic, siblings, friendship, adventure, nature, dreams, family, ocean, stars, garden, seasons, music, art, cooking, travel, home, school

**Culture Regions**: Global, European, Asian, African, Latin American, Middle Eastern, North American, Indigenous, South Asian, East Asian, Pan-African

**Content Warnings**: mild_scary, separation_anxiety, mild_conflict, supernatural, strong_conflict, death_loss

Please start by asking me:
1. What age range is this story for?
2. What values or themes should it teach?
3. What topics or settings interest me?
4. Any specific cultural background or representation?
5. Any other preferences or ideas I have?

Then help me craft a beautiful bedtime story that fits these preferences!`

    return prompt
  }

  const copyPromptToClipboard = async () => {
    try {
      const prompt = generateChatGPTPrompt()
      await navigator.clipboard.writeText(prompt)
      await showAlert("ChatGPT prompt copied to clipboard! Paste it into ChatGPT to get started.")
    } catch (err) {
      console.error("Failed to copy:", err)
      await showAlert("Failed to copy to clipboard. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        ...formData,
        minAge: formData.minAge ? parseInt(formData.minAge) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
        estimatedReadTimeMinutes: formData.estimatedReadTimeMinutes
          ? parseInt(formData.estimatedReadTimeMinutes)
          : null,
        boyStoryText: formData.boyStoryText || null,
        girlStoryText: formData.girlStoryText || null,
        valuesTags: formData.selectedValues,
        topicTags: formData.selectedTopics,
        cultureTags: formData.selectedCultures,
        languageTags: formData.selectedLanguages,
        contentWarnings: formData.selectedWarnings,
        representationTags: formData.representationTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }

      const url = story ? `/api/admin/stories/${story.id}` : "/api/admin/stories"
      const method = story ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save story")
        setLoading(false)
        return
      }

      router.push("/admin/stories")
      router.refresh()
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg rounded-lg shadow-lg p-8 space-y-8">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Advanced Options - Collapsed by default */}
      <div className="border-b border-border-color pb-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-foreground/70">
            Advanced Options
          </span>
          <span className="text-foreground/50">{showAdvanced ? "−" : "+"}</span>
        </button>
        {showAdvanced && (
          <div className="mt-4 space-y-6">
            {/* Story Generation Helper */}
            <div className="bg-background/50 border border-border-color rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Need help writing a story?
                  </h3>
                  <p className="text-xs text-foreground/60">
                    Copy a prompt to ChatGPT that will guide you through creating a new bedtime story
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyPromptToClipboard}
                  className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-accent-purple-dark transition-colors text-sm font-medium whitespace-nowrap ml-4"
                >
                  Copy ChatGPT Prompt
                </button>
              </div>
            </div>

            {/* JSON Import Section */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Import from JSON
              </h3>
              <p className="text-xs text-foreground/60 mb-2">
                Paste a complete story JSON to quickly fill in the form below.
              </p>
              <div className="flex gap-2">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={5}
                  className="flex-1 px-3 py-2 bg-background border border-border-color rounded-md font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
                  placeholder='{"title": "...", "storyText": "...", ...}'
                />
                <button
                  type="button"
                  onClick={parseJSON}
                  className="px-4 py-2 bg-background text-foreground border border-border-color rounded-md hover:bg-card-bg transition-colors text-sm"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Basic Story Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border-color pb-2">
          Story Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Story Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
              placeholder="The Compass Rose"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
              />
              <span className="text-sm text-foreground">Published</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Short Description *
          </label>
          <p className="text-xs text-foreground/60 mb-2">
            A brief one-sentence summary that appears in story listings
          </p>
          <textarea
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            required
            rows={2}
            className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
            placeholder="A child learns about directions and discovers that having a sense of direction helps navigate life's journey."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Extended Description
          </label>
          <p className="text-xs text-foreground/60 mb-2">
            Optional: A longer description that provides more context about the story
          </p>
          <textarea
            value={formData.longDescription}
            onChange={(e) =>
              setFormData({ ...formData, longDescription: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
            placeholder="When Avery learns to use a compass and understand directions, Avery discovers that having a sense of direction - knowing where you're going and what matters to you - helps navigate not just physical journeys, but life's journey too."
          />
        </div>
      </div>

      {/* Story Content */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border-color pb-2">
          Story Content
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Story Text *
          </label>
          <p className="text-xs text-foreground/60 mb-3">
            The main story content. If you add gender-specific versions below, they'll be used when readers select those options.
          </p>
          <textarea
            value={formData.fullText}
            onChange={(e) => setFormData({ ...formData, fullText: e.target.value })}
            required
            rows={18}
            className="w-full px-4 py-3 bg-background border border-border-color rounded-md text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
            placeholder="Once upon a time..."
          />
        </div>

        <div className="border-t border-border-color pt-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Alternative Versions</h3>
          <p className="text-sm text-foreground/70 mb-4">
            If your story has different versions for different character genders, add them here. Otherwise, the main story text above will be used.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Version with Boy Character
              </label>
              <textarea
                value={formData.boyStoryText}
                onChange={(e) => setFormData({ ...formData, boyStoryText: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 bg-background border border-border-color rounded-md text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
                placeholder="Optional: Leave empty to use the main story text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Version with Girl Character
              </label>
              <textarea
                value={formData.girlStoryText}
                onChange={(e) => setFormData({ ...formData, girlStoryText: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 bg-background border border-border-color rounded-md text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
                placeholder="Optional: Leave empty to use the main story text"
              />
            </div>
          </div>
        </div>

        {/* Length-Specific Versions */}
        {story && (
          <div className="border-t border-border-color pt-6">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Length-Specific Versions
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              Generate condensed 5-minute and 10-minute versions of your story. These versions preserve the story&apos;s essence while making them shorter for different attention spans.
            </p>

            {/* Version Status */}
            <div className="mb-4 p-4 bg-card-bg rounded-lg border border-border-color">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Available Versions:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      versionStatus.fullText5Min
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-foreground/70">Default 5-min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      versionStatus.fullText10Min
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-foreground/70">Default 10-min</span>
                </div>
                {formData.boyStoryText && (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          versionStatus.boyStoryText5Min
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="text-foreground/70">Boy 5-min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          versionStatus.boyStoryText10Min
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="text-foreground/70">Boy 10-min</span>
                    </div>
                  </>
                )}
                {formData.girlStoryText && (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          versionStatus.girlStoryText5Min
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="text-foreground/70">Girl 5-min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          versionStatus.girlStoryText10Min
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="text-foreground/70">Girl 10-min</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Generation Controls */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  if (!story?.id) return
                  setGeneratingVersions(true)
                  try {
                    const res = await fetch(
                      `/api/admin/stories/${story.id}/generate-versions`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          targetLengths: ["5min"],
                          genderVersions: ["default"],
                        }),
                      }
                    )
                    const data = await res.json()
                    if (res.ok) {
                      setVersionStatus((prev) => ({
                        ...prev,
                        fullText5Min: true,
                      }))
                      await showAlert(
                        `Successfully generated 5-minute default version!`
                      )
                      // Refresh the page to see updated data
                      router.refresh()
                    } else {
                      await showAlert(
                        `Error: ${data.error || "Failed to generate version"}`
                      )
                    }
                  } catch (err) {
                    await showAlert(
                      `Error generating version: ${err instanceof Error ? err.message : "Unknown error"}`
                    )
                  } finally {
                    setGeneratingVersions(false)
                  }
                }}
                disabled={generatingVersions || !formData.fullText}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Generate 5-min (Default)
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!story?.id) return
                  setGeneratingVersions(true)
                  try {
                    const res = await fetch(
                      `/api/admin/stories/${story.id}/generate-versions`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          targetLengths: ["10min"],
                          genderVersions: ["default"],
                        }),
                      }
                    )
                    const data = await res.json()
                    if (res.ok) {
                      setVersionStatus((prev) => ({
                        ...prev,
                        fullText10Min: true,
                      }))
                      await showAlert(
                        `Successfully generated 10-minute default version!`
                      )
                      router.refresh()
                    } else {
                      await showAlert(
                        `Error: ${data.error || "Failed to generate version"}`
                      )
                    }
                  } catch (err) {
                    await showAlert(
                      `Error generating version: ${err instanceof Error ? err.message : "Unknown error"}`
                    )
                  } finally {
                    setGeneratingVersions(false)
                  }
                }}
                disabled={generatingVersions || !formData.fullText}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Generate 10-min (Default)
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!story?.id) return
                  setGeneratingVersions(true)
                  try {
                    const genderVersions: string[] = ["default"]
                    if (formData.boyStoryText) genderVersions.push("boy")
                    if (formData.girlStoryText) genderVersions.push("girl")

                    const res = await fetch(
                      `/api/admin/stories/${story.id}/generate-versions`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          targetLengths: ["5min", "10min"],
                          genderVersions,
                        }),
                      }
                    )
                    const data = await res.json()
                    if (res.ok) {
                      setVersionStatus({
                        fullText5Min: true,
                        fullText10Min: true,
                        boyStoryText5Min: formData.boyStoryText ? true : false,
                        boyStoryText10Min: formData.boyStoryText ? true : false,
                        girlStoryText5Min: formData.girlStoryText ? true : false,
                        girlStoryText10Min: formData.girlStoryText
                          ? true
                          : false,
                      })
                      await showAlert(
                        `Successfully generated ${data.generated.length} versions!`
                      )
                      router.refresh()
                    } else {
                      await showAlert(
                        `Error: ${data.error || "Failed to generate versions"}`
                      )
                    }
                  } catch (err) {
                    await showAlert(
                      `Error generating versions: ${err instanceof Error ? err.message : "Unknown error"}`
                    )
                  } finally {
                    setGeneratingVersions(false)
                  }
                }}
                disabled={generatingVersions || !formData.fullText}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {generatingVersions
                  ? "Generating..."
                  : "Generate All Versions"}
              </button>
            </div>

            {generatingVersions && (
              <p className="mt-2 text-sm text-foreground/70">
                Generating versions... This may take a minute.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Story Metadata */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border-color pb-2">
          Story Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Recommended Age Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.minAge}
                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
                placeholder="3"
                min="0"
                max="18"
              />
              <span className="text-foreground/60">to</span>
              <input
                type="number"
                value={formData.maxAge}
                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
                placeholder="8"
                min="0"
                max="18"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reading Time
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.estimatedReadTimeMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedReadTimeMinutes: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
                placeholder="5"
                min="1"
              />
              <span className="text-foreground/60 text-sm">minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Story Tags & Categories */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border-color pb-2">
          Tags & Categories
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Values & Themes
          </label>
          <p className="text-xs text-foreground/60 mb-3">
            What positive values or themes does this story teach?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMMON_VALUES.map((value) => (
              <label
                key={value}
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-background rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedValues.includes(value)}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      selectedValues: toggleArrayItem(formData.selectedValues, value),
                    })
                  }
                  className="w-4 h-4 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
                />
                <span className="text-sm text-foreground capitalize">{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Topics & Settings
          </label>
          <p className="text-xs text-foreground/60 mb-3">
            What topics, settings, or themes appear in this story?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMMON_TOPICS.map((topic) => (
              <label
                key={topic}
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-background rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedTopics.includes(topic)}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      selectedTopics: toggleArrayItem(formData.selectedTopics, topic),
                    })
                  }
                  className="w-4 h-4 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
                />
                <span className="text-sm text-foreground capitalize">{topic}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Cultural Background
          </label>
          <p className="text-xs text-foreground/60 mb-3">
            What cultural regions or backgrounds does this story represent?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CULTURE_REGIONS.map((culture) => (
              <label
                key={culture}
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-background rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedCultures.includes(culture)}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      selectedCultures: toggleArrayItem(formData.selectedCultures, culture),
                    })
                  }
                  className="w-4 h-4 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
                />
                <span className="text-sm text-foreground">{culture}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Languages
            </label>
            <p className="text-xs text-foreground/60 mb-3">
              What languages are used in this story?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {LANGUAGE_TAGS.map((lang) => (
                <label
                  key={lang}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-background rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedLanguages.includes(lang)}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        selectedLanguages: toggleArrayItem(formData.selectedLanguages, lang),
                      })
                    }
                    className="w-4 h-4 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
                  />
                  <span className="text-sm text-foreground uppercase">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Content Warnings
            </label>
            <p className="text-xs text-foreground/60 mb-3">
              Does this story contain any content that parents should be aware of?
            </p>
            <div className="space-y-2">
              {CONTENT_WARNINGS.map((warning) => (
                <label
                  key={warning}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-background rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedWarnings.includes(warning)}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        selectedWarnings: toggleArrayItem(formData.selectedWarnings, warning),
                      })
                    }
                    className="w-4 h-4 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
                  />
                  <span className="text-sm text-foreground">
                    {warning.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Character Representation
          </label>
          <p className="text-xs text-foreground/60 mb-2">
            Describe the characters in this story (e.g., "girl protagonist", "mixed-race family", "single parent")
          </p>
          <input
            type="text"
            value={formData.representationTags}
            onChange={(e) =>
              setFormData({ ...formData, representationTags: e.target.value })
            }
            className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
            placeholder="girl protagonist, mixed-race family"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Story Categories
          </label>
          <p className="text-xs text-foreground/60 mb-3">
            Categories are automatically created from your tags above. You can also manually assign additional categories here.
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-border-color rounded-md p-4 bg-background">
            {categories.length === 0 ? (
              <p className="text-sm text-foreground/60">No categories available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center space-x-2 cursor-pointer hover:text-accent-purple transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedCategoryIds.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            selectedCategoryIds: [...formData.selectedCategoryIds, cat.id],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            selectedCategoryIds: formData.selectedCategoryIds.filter(
                              (id) => id !== cat.id
                            ),
                          })
                        }
                      }}
                      className="w-4 h-4 text-accent-purple bg-background border-border-color rounded focus:ring-accent-purple"
                    />
                    <span className="text-sm text-foreground">{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-border-color">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-foreground bg-background border border-border-color rounded-lg hover:bg-card-bg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Saving..." : story ? "Save Changes" : "Create Story"}
        </button>
      </div>
      <AlertModal />
    </form>
  )
}

