import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"
import { StoryPageClient } from "@/components/StoryPageClient"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function StoryPage({
  params,
}: {
  params: { id: string }
}) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
  })

  if (!story || !story.isActive) {
    notFound()
  }

  const user = await getCurrentUser()
  
  // Fetch user preferences for gender preference
  let preferredGender: string | null = null
  if (user) {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
      select: { preferredGender: true },
    })
    preferredGender = preferences?.preferredGender || null
  }
  
  // Check if this is today's story of the day
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const storyOfTheDay = await prisma.storyOfTheDay.findUnique({
    where: { date: today },
  })
  const isTodaysStory = storyOfTheDay?.storyId === story.id

  return (
    <Layout>
      <StoryPageClient 
        story={story}
        user={user}
        preferredGender={preferredGender}
        isTodaysStory={isTodaysStory}
      />
    </Layout>
  )
}

