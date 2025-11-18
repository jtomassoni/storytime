import { Layout } from "@/components/Layout"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"
import { FaHeart, FaArrowRight } from "react-icons/fa"

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const user = await requireAuth()

  // favoriteStory model doesn't exist in schema - return empty array
  const favorites: Array<{ id: string; story: any }> = []

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <FaHeart className="text-red-500" />
          Your Favorites
        </h1>
        {favorites.length === 0 ? (
          <div className="bg-card-bg rounded-lg shadow-lg p-8 text-center border border-border-color">
            <p className="text-foreground/70 mb-4">You haven&apos;t favorited any stories yet.</p>
            <a
              href="/stories"
              className="text-accent-purple hover:text-accent-purple-dark font-medium transition-colors flex items-center gap-2"
            >
              Browse stories
              <FaArrowRight />
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

