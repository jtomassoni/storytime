"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Story, Category } from "@prisma/client"

type StoryWithCategories = Story & {
  categories: Array<{
    category: Category
  }>
}

type StoryFormProps = {
  story?: StoryWithCategories
}

export function StoryForm({ story }: StoryFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [jsonInput, setJsonInput] = useState("")

  const [formData, setFormData] = useState({
    title: story?.title || "",
    shortDescription: story?.shortDescription || "",
    longDescription: story?.longDescription || "",
    fullText: story?.fullText || "",
    minAge: story?.minAge?.toString() || "",
    maxAge: story?.maxAge?.toString() || "",
    estimatedReadTimeMinutes: story?.estimatedReadTimeMinutes?.toString() || "",
    isActive: story?.isActive ?? true,
    selectedCategoryIds: story?.categories.map((sc) => sc.category.id) || [],
    valuesTags: story?.valuesTags.join(", ") || "",
    topicTags: story?.topicTags.join(", ") || "",
    cultureTags: story?.cultureTags.join(", ") || "",
    languageTags: story?.languageTags.join(", ") || "",
    contentWarnings: story?.contentWarnings.join(", ") || "",
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

  const parseJSON = () => {
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
        valuesTags: parsed.values?.join(", ") || formData.valuesTags,
        topicTags: parsed.topics?.join(", ") || formData.topicTags,
        cultureTags: parsed.cultureRegions?.join(", ") || formData.cultureTags,
        languageTags: parsed.languageTags?.join(", ") || formData.languageTags,
        contentWarnings: parsed.contentWarnings?.join(", ") || formData.contentWarnings,
        representationTags: [
          ...(parsed.representation?.primaryChildGenders || []),
          ...(parsed.representation?.otherCharacterTypes || []),
          ...(parsed.representation?.diversityTags || []),
        ].join(", ") || formData.representationTags,
      })
      alert("JSON parsed successfully!")
    } catch (error) {
      alert("Invalid JSON format")
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
        valuesTags: formData.valuesTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        topicTags: formData.topicTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        cultureTags: formData.cultureTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        languageTags: formData.languageTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        contentWarnings: formData.contentWarnings
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste JSON (optional)
        </label>
        <div className="flex gap-2">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={5}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
            placeholder='{"title": "...", "storyText": "...", ...}'
          />
          <button
            type="button"
            onClick={parseJSON}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Parse JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active
          </label>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          required
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Long Description
        </label>
        <textarea
          value={formData.longDescription}
          onChange={(e) =>
            setFormData({ ...formData, longDescription: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Story Text *
        </label>
        <textarea
          value={formData.fullText}
          onChange={(e) => setFormData({ ...formData, fullText: e.target.value })}
          required
          rows={15}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Age
          </label>
          <input
            type="number"
            value={formData.minAge}
            onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Age
          </label>
          <input
            type="number"
            value={formData.maxAge}
            onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Read Time (minutes)
          </label>
          <input
            type="number"
            value={formData.estimatedReadTimeMinutes}
            onChange={(e) =>
              setFormData({ ...formData, estimatedReadTimeMinutes: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center space-x-2">
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
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Values Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.valuesTags}
            onChange={(e) => setFormData({ ...formData, valuesTags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="kindness, courage, curiosity"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.topicTags}
            onChange={(e) => setFormData({ ...formData, topicTags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="bedtime, forest, magic"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Culture Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.cultureTags}
            onChange={(e) => setFormData({ ...formData, cultureTags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="European, Global"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.languageTags}
            onChange={(e) =>
              setFormData({ ...formData, languageTags: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="en"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Warnings (comma-separated)
          </label>
          <input
            type="text"
            value={formData.contentWarnings}
            onChange={(e) =>
              setFormData({ ...formData, contentWarnings: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="mild_scary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Representation Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.representationTags}
            onChange={(e) =>
              setFormData({ ...formData, representationTags: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="girl protagonist, mixed-race family"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : story ? "Update Story" : "Create Story"}
        </button>
      </div>
    </form>
  )
}

