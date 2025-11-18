import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"
import { getCurrentUser } from "@/lib/auth-helpers"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser()
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      stories: {
        include: {
          story: true,
        },
      },
    },
  })

  if (!category) {
    notFound()
  }

  const stories = category.stories
    .map((sc) => sc.story)
    .filter((s) => s.isActive)

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{category.name}</h1>
          {category.description && (
            <p className="text-foreground/80 text-lg">{category.description}</p>
          )}
        </div>

        {stories.length === 0 ? (
          <div className="bg-card-bg rounded-lg shadow-lg p-8 text-center border border-border-color">
            <p className="text-foreground/70">No stories in this category yet.</p>
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

