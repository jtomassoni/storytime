import { prisma } from "@/lib/prisma"
import { StoriesAdminClient } from "./StoriesAdminClient"

export const dynamic = 'force-dynamic'

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      isActive: true,
      minAge: true,
      maxAge: true,
      createdAt: true,
      valuesTags: true,
      topicTags: true,
      estimatedReadTimeMinutes: true,
      boyStoryText: true,
      girlStoryText: true,
    },
  })

  return <StoriesAdminClient initialStories={stories} />
}

