"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Story = {
  id: string
  title: string
}

type StoryOfTheDay = {
  id: string
  date: string
  story: Story
}

export default function StoryOfTheDayPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [assignments, setAssignments] = useState<StoryOfTheDay[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedStoryId, setSelectedStoryId] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStories()
    fetchAssignments()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/admin/stories")
      if (res.ok) {
        const data = await res.json()
        setStories(data.filter((s: Story & { isActive: boolean }) => s.isActive))
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
    }
  }

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/admin/story-of-the-day")
      if (res.ok) {
        const data = await res.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error("Error fetching assignments:", error)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedStoryId) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/story-of-the-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          storyId: selectedStoryId,
        }),
      })

      if (res.ok) {
        setSelectedDate("")
        setSelectedStoryId("")
        fetchAssignments()
      }
    } catch (error) {
      console.error("Error assigning story:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Story of the Day</h1>

      <form
        onSubmit={handleAssign}
        className="bg-white rounded-lg shadow-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story *
            </label>
            <select
              value={selectedStoryId}
              onChange={(e) => setSelectedStoryId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a story</option>
              {stories.map((story) => (
                <option key={story.id} value={story.id}>
                  {story.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Story"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b">Upcoming Assignments</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Story
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(assignment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {assignment.story.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

