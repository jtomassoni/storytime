"use client"

import { Layout } from "@/components/Layout"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"
import { Story } from "@prisma/client"
import { useState, useMemo } from "react"

type StoriesPageClientProps = {
  initialStories: Story[]
  user: {
    id: string
    isPaid: boolean
  } | null
}

export function StoriesPageClient({ initialStories, user }: StoriesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "readTime" | "shortest" | "longest">("newest")
  const [ageFilter, setAgeFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [valueFilter, setValueFilter] = useState<string>("all")
  const [lengthFilter, setLengthFilter] = useState<string>("all")

  // Get unique tags and values for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    initialStories.forEach((story) => {
      if (story.topicTags) {
        story.topicTags.forEach((tag) => tags.add(tag))
      }
      if ((story as any).cultureTags) {
        (story as any).cultureTags.forEach((tag: string) => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [initialStories])

  const allValues = useMemo(() => {
    const values = new Set<string>()
    initialStories.forEach((story) => {
      if (story.valuesTags) {
        story.valuesTags.forEach((value) => values.add(value))
      }
    })
    return Array.from(values).sort()
  }, [initialStories])

  const filteredAndSortedStories = useMemo(() => {
    let filtered = initialStories.filter((story) => {
      // Search filter
      const query = searchQuery.toLowerCase().trim()
      if (query) {
        const normalizedQuery = query === 'boys' ? 'boy' : query === 'girls' ? 'girl' : query
        
        const matchesSearch =
          story.title.toLowerCase().includes(query) ||
          story.shortDescription.toLowerCase().includes(query) ||
          ((story as any).longDescription && (story as any).longDescription.toLowerCase().includes(query)) ||
          (story.fullText && story.fullText.toLowerCase().includes(query)) ||
          (story.valuesTags && story.valuesTags.some((tag) => tag.toLowerCase().includes(query))) ||
          (story.topicTags && story.topicTags.some((tag) => tag.toLowerCase().includes(query))) ||
          ((story as any).representationTags && (story as any).representationTags.some((tag: string) => tag.toLowerCase().includes(normalizedQuery))) ||
          ((story as any).cultureTags && (story as any).cultureTags.some((tag: string) => tag.toLowerCase().includes(query)))
        if (!matchesSearch) return false
      }

      // Age filter
      if (ageFilter !== "all") {
        const [min, max] = ageFilter.split("-").map(Number)
        if (story.minAge === null || story.maxAge === null) return false
        if (story.minAge > max || story.maxAge < min) return false
      }

      // Tag filter (topic/culture tags)
      if (tagFilter !== "all") {
        const hasTag =
          (story.topicTags && story.topicTags.includes(tagFilter)) ||
          ((story as any).cultureTags && (story as any).cultureTags.includes(tagFilter))
        if (!hasTag) return false
      }

      // Value filter
      if (valueFilter !== "all") {
        if (!story.valuesTags || !story.valuesTags.includes(valueFilter)) return false
      }

      // Length filter - check if story has the requested length version available
      if (lengthFilter !== "all") {
        const storyAny = story as any
        if (lengthFilter === "5min") {
          // Check if story has any 5-minute version
          const has5Min =
            !!storyAny.fullText5Min ||
            !!storyAny.boyStoryText5Min ||
            !!storyAny.girlStoryText5Min
          if (!has5Min) return false
        } else if (lengthFilter === "10min") {
          // Check if story has any 10-minute version
          const has10Min =
            !!storyAny.fullText10Min ||
            !!storyAny.boyStoryText10Min ||
            !!storyAny.girlStoryText10Min
          if (!has10Min) return false
        } else if (lengthFilter === "full") {
          // Stories that don't have shorter versions (or have full version)
          // This includes all stories since fullText is always present
          // But we could filter to only show stories without shorter versions if desired
          // For now, "full" means all stories
        }
      }

      return true
    })

    // Sort stories
    filtered = [...filtered].sort((a, b) => {
      const aAny = a as any
      const bAny = b as any
      
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "readTime":
          return (a.estimatedReadTimeMinutes || 0) - (b.estimatedReadTimeMinutes || 0)
        case "shortest": {
          // Sort by shortest available version
          const aShortest =
            aAny.estimatedReadTimeMinutes5Min ||
            aAny.estimatedReadTimeMinutes10Min ||
            a.estimatedReadTimeMinutes ||
            999
          const bShortest =
            bAny.estimatedReadTimeMinutes5Min ||
            bAny.estimatedReadTimeMinutes10Min ||
            b.estimatedReadTimeMinutes ||
            999
          return aShortest - bShortest
        }
        case "longest": {
          // Sort by longest available version (full version)
          const aLongest = a.estimatedReadTimeMinutes || 0
          const bLongest = b.estimatedReadTimeMinutes || 0
          return bLongest - aLongest
        }
        default:
          return 0
      }
    })

    return filtered
  }, [initialStories, searchQuery, sortBy, ageFilter, tagFilter, valueFilter, lengthFilter])

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">All Stories</h1>
        </div>

        {/* Search, Sort, and Filter Controls */}
        <div className="bg-card-bg rounded-lg shadow-lg p-4 border border-border-color space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search stories by title, content, gender (boy/girl), or tags..."
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
                <option value="readTime">Read Time (Full)</option>
                <option value="shortest">Shortest Available</option>
                <option value="longest">Longest Available</option>
              </select>
            </div>

            {/* Length Filter */}
            <div>
              <select
                value={lengthFilter}
                onChange={(e) => setLengthFilter(e.target.value)}
                className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
              >
                <option value="all">All Lengths</option>
                <option value="5min">5 Minutes</option>
                <option value="10min">10 Minutes</option>
                <option value="full">Full Story</option>
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

            {/* Tag Filter */}
            <div>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
              >
                <option value="all">All Topics</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Filter */}
            <div>
              <select
                value={valueFilter}
                onChange={(e) => setValueFilter(e.target.value)}
                className="w-full bg-background border border-border-color rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple"
              >
                <option value="all">All Values</option>
                {allValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || ageFilter !== "all" || tagFilter !== "all" || valueFilter !== "all" || lengthFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("")
                setAgeFilter("all")
                setTagFilter("all")
                setValueFilter("all")
                setLengthFilter("all")
              }}
              className="text-sm text-accent-purple hover:text-accent-purple-dark transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {filteredAndSortedStories.length === 0 ? (
          <div className="bg-card-bg rounded-lg shadow-lg p-8 text-center border border-border-color">
            <p className="text-foreground/70">
              {searchQuery ? "No stories found matching your search." : "No stories available yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="text-sm text-foreground/70 mb-4">
              Showing {filteredAndSortedStories.length} {filteredAndSortedStories.length === 1 ? "story" : "stories"}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedStories.map((story, index) => (
                <div key={story.id}>
                  <StoryCard story={story} showPreview={!user?.isPaid} />
                  {!user?.isPaid && index === 2 && (
                    <div className="mt-4">
                      <AdUnit />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!user?.isPaid && <AdUnit className="mt-8" />}
          </>
        )}
      </div>
    </Layout>
  )
}

