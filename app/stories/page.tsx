import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"
import { getCurrentUser } from "@/lib/auth-helpers"

export default async function StoriesPage() {
  const user = await getCurrentUser()
  const stories = await prisma.story.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">All Stories</h1>
        {stories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No stories available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <div key={story.id}>
                  <StoryCard story={story} />
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

