"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

type Story = {
  id: string
  title: string
  shortDescription: string
  isActive: boolean
  minAge: number | null
  maxAge: number | null
  createdAt: Date
  valuesTags: string[]
  topicTags: string[]
  cultureTags: string[]
  representationTags: string[]
  estimatedReadTimeMinutes: number | null
  boyStoryText: string | null
  girlStoryText: string | null
  categories: Array<{
    category: {
      name: string
    }
  }>
}

type StoriesAdminClientProps = {
  initialStories: Story[]
}

export function StoriesAdminClient({ initialStories }: StoriesAdminClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "readTime">("newest")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [ageFilter, setAgeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")

  // Get unique categories and tags for filters
  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    initialStories.forEach((story) => {
      story.categories.forEach((sc) => cats.add(sc.category.name))
    })
    return Array.from(cats).sort()
  }, [initialStories])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    initialStories.forEach((story) => {
      story.valuesTags.forEach((tag) => tags.add(tag))
      story.topicTags.forEach((tag) => tags.add(tag))
      story.cultureTags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [initialStories])

  const filteredAndSortedStories = useMemo(() => {
    let filtered = initialStories.filter((story) => {
      // Search filter
      const query = searchQuery.toLowerCase().trim()
      if (query) {
        const matchesSearch =
          story.title.toLowerCase().includes(query) ||
          story.shortDescription.toLowerCase().includes(query) ||
          story.valuesTags.some((tag) => tag.toLowerCase().includes(query)) ||
          story.topicTags.some((tag) => tag.toLowerCase().includes(query)) ||
          story.cultureTags.some((tag) => tag.toLowerCase().includes(query)) ||
          story.categories.some((sc) => sc.category.name.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter === "active" && !story.isActive) return false
      if (statusFilter === "inactive" && story.isActive) return false

      // Age filter
      if (ageFilter !== "all") {
        const [min, max] = ageFilter.split("-").map(Number)
        if (story.minAge === null || story.maxAge === null) return false
        if (story.minAge > max || story.maxAge < min) return false
      }

      // Category filter
      if (categoryFilter !== "all") {
        if (!story.categories.some((sc) => sc.category.name === categoryFilter)) return false
      }

      // Tag filter
      if (tagFilter !== "all") {
        const hasTag =
          story.valuesTags.includes(tagFilter) ||
          story.topicTags.includes(tagFilter) ||
          story.cultureTags.includes(tagFilter)
        if (!hasTag) return false
      }

      return true
    })

    // Sort stories
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "readTime":
          return (a.estimatedReadTimeMinutes || 0) - (b.estimatedReadTimeMinutes || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [initialStories, searchQuery, sortBy, statusFilter, ageFilter, categoryFilter, tagFilter])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Stories</h1>
        <Link
          href="/admin/stories/new"
          className="bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple-dark transition-colors flex items-center gap-2"
        >
          <span>+</span> New Story
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-card-bg rounded-lg shadow-lg p-4 border border-border-color space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search by title, description, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent-purple"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="readTime">Read Time</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Age Filter */}
          <div>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="all">All Ages</option>
              <option value="3-5">Ages 3-5</option>
              <option value="4-7">Ages 4-7</option>
              <option value="6-9">Ages 6-9</option>
              <option value="8-12">Ages 8-12</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || statusFilter !== "all" || ageFilter !== "all" || categoryFilter !== "all" || tagFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
              setAgeFilter("all")
              setCategoryFilter("all")
              setTagFilter("all")
            }}
            className="text-sm text-accent-purple hover:text-accent-purple-dark transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-foreground/70">
        Showing {filteredAndSortedStories.length} of {initialStories.length} stories
      </div>

      {/* Stories Table */}
      <div className="bg-card-bg rounded-lg shadow-lg overflow-hidden border border-border-color">
        <table className="min-w-full divide-y divide-border-color">
          <thead className="bg-card-bg">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Age Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Gendered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card-bg divide-y divide-border-color">
            {filteredAndSortedStories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-foreground/70">
                  No stories found matching your filters.
                </td>
              </tr>
            ) : (
              filteredAndSortedStories.map((story) => {
                const hasGenderedVersions = !!(story.boyStoryText || story.girlStoryText)
                return (
                  <tr key={story.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {story.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          story.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {story.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                      {story.minAge && story.maxAge
                        ? `${story.minAge}-${story.maxAge}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hasGenderedVersions
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {hasGenderedVersions ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {story.categories.map((sc) => sc.category.name).join(", ") ||
                        "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/stories/${story.id}`}
                        className="text-accent-purple hover:text-accent-purple-dark transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

