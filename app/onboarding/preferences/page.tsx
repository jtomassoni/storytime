"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const CULTURE_REGIONS = [
  "No preference",
  "Latin American",
  "East Asian",
  "South Asian",
  "African / Pan-African",
  "European",
  "Middle Eastern",
  "Indigenous",
  "Other",
]

const VALUES = [
  "Kindness",
  "Courage",
  "Curiosity",
  "Family",
  "Friendship",
  "Environmental Care",
  "Perseverance",
  "Honesty",
  "Empathy",
  "Creativity",
]

const TOPICS_TO_AVOID = [
  "Mild scary moments",
  "Supernatural themes",
  "Strong conflict",
  "Death/loss topics",
  "None",
]

const LANGUAGE_PREFS = [
  "English only",
  "English with some other-language phrases",
  "Bilingual where available",
]

export default function PreferencesPage() {
  const router = useRouter()
  const [cultureRegion, setCultureRegion] = useState("")
  const [preferredValues, setPreferredValues] = useState<string[]>([])
  const [avoidTopics, setAvoidTopics] = useState<string[]>([])
  const [languagePrefs, setLanguagePrefs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleValue = (value: string) => {
    setPreferredValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const toggleAvoidTopic = (topic: string) => {
    if (topic === "None") {
      setAvoidTopics([])
      return
    }
    setAvoidTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    )
  }

  const toggleLanguagePref = (pref: string) => {
    setLanguagePrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [pref]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cultureRegion: cultureRegion === "No preference" ? null : cultureRegion,
          preferredValues,
          avoidTopics: avoidTopics.filter((t) => t !== "None"),
          languagePrefs,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save preferences")
        setLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Tell us about your preferences</h1>
        <p className="text-gray-600 mb-8">
          Help us personalize your bedtime story experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Culture/Region focus
            </label>
            <select
              value={cultureRegion}
              onChange={(e) => setCultureRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select an option</option>
              {CULTURE_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Values & themes (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VALUES.map((value) => (
                <label
                  key={value}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-purple-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={preferredValues.includes(value)}
                    onChange={() => toggleValue(value)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics to avoid (select all that apply)
            </label>
            <div className="space-y-2">
              {TOPICS_TO_AVOID.map((topic) => (
                <label
                  key={topic}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-purple-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={avoidTopics.includes(topic)}
                    onChange={() => toggleAvoidTopic(topic)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language preferences
            </label>
            <div className="space-y-2">
              {LANGUAGE_PREFS.map((pref) => (
                <label
                  key={pref}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-purple-50 rounded"
                >
                  <input
                    type="radio"
                    name="languagePref"
                    checked={languagePrefs.includes(pref)}
                    onChange={() => toggleLanguagePref(pref)}
                    className="border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={loading || !cultureRegion || languagePrefs.length === 0}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

