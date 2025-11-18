import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"
import { getCurrentUser } from "@/lib/auth-helpers"
import { Story } from "@prisma/client"
import { StoriesPageClient } from "./StoriesPageClient"

export const dynamic = 'force-dynamic'

export default async function StoriesPage() {
  const user = await getCurrentUser()
  let stories: Story[] = []
  
  try {
    stories = await prisma.story.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Database error loading stories:", error)
  }

  return <StoriesPageClient initialStories={stories} user={user} />
}
