"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Category = {
  id: string
  name: string
  description: string | null
  minAge: number | null
  maxAge: number | null
  cultureTags: string[]
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minAge: "",
    maxAge: "",
    cultureTags: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          minAge: formData.minAge ? parseInt(formData.minAge) : null,
          maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
          cultureTags: formData.cultureTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      if (res.ok) {
        setFormData({ name: "", description: "", minAge: "", maxAge: "", cultureTags: "" })
        setShowForm(false)
        fetchCategories()
      }
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          {showForm ? "Cancel" : "+ New Category"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Age
              </label>
              <input
                type="number"
                value={formData.minAge}
                onChange={(e) =>
                  setFormData({ ...formData, minAge: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, maxAge: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Culture Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.cultureTags}
              onChange={(e) =>
                setFormData({ ...formData, cultureTags: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Age Range
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {cat.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {cat.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cat.minAge && cat.maxAge ? `${cat.minAge}-${cat.maxAge}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

