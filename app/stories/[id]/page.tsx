import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, requireAuth } from "@/lib/auth-helpers"
import { AdUnit } from "@/components/AdUnit"
import { StoryReader } from "@/components/StoryReader"
import { notFound } from "next/navigation"

export default async function StoryPage({
  params,
}: {
  params: { id: string }
}) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  })

  if (!story || !story.isActive) {
    notFound()
  }

  const user = await getCurrentUser()

  // Track read event start
  if (user) {
    await prisma.storyReadEvent.create({
      data: {
        userId: user.id,
        storyId: story.id,
        deviceType: "web",
      },
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{story.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{story.shortDescription}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {story.minAge && story.maxAge && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Ages {story.minAge}-{story.maxAge}
              </span>
            )}
            {story.estimatedReadTimeMinutes && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {story.estimatedReadTimeMinutes} min read
              </span>
            )}
            {story.categories.map((sc) => (
              <span
                key={sc.categoryId}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {sc.category.name}
              </span>
            ))}
          </div>

          {!user?.isPaid && <AdUnit className="my-6" />}

          <StoryReader story={story} user={user} />
        </div>

        {!user?.isPaid && <AdUnit className="my-8" />}
      </div>
    </Layout>
  )
}

