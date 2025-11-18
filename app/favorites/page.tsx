import { Layout } from "@/components/Layout"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"

export default async function FavoritesPage() {
  const user = await requireAuth()

  const favorites = await prisma.favoriteStory.findMany({
    where: { userId: user.id },
    include: {
      story: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Favorites</h1>
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">You haven&apos;t favorited any stories yet.</p>
            <a
              href="/stories"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Browse stories →
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => (
                <StoryCard key={fav.id} story={fav.story} />
              ))}
            </div>
            {!user.isPaid && <AdUnit className="mt-8" />}
          </>
        )}
      </div>
    </Layout>
  )
}

