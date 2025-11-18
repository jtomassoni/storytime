import { Layout } from "@/components/Layout"
import { getCurrentUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { AdUnit } from "@/components/AdUnit"
import { redirect } from "next/navigation"

async function getTodaysStory() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const storyOfTheDay = await prisma.storyOfTheDay.findUnique({
    where: {
      date: today,
    },
    include: {
      story: true,
    },
  })

  if (storyOfTheDay) {
    return storyOfTheDay.story
  }

  // Fallback: get a random active story
  const stories = await prisma.story.findMany({
    where: { isActive: true },
    take: 1,
  })

  return stories[0] || null
}

export default async function Home() {
  const user = await getCurrentUser()
  const todaysStory = await getTodaysStory()

  // Check if user needs onboarding
  if (user) {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
    })
    if (!preferences) {
      redirect("/onboarding/preferences")
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🌙 Bedtime Stories
          </h1>
          <p className="text-xl text-gray-600">
            Daily stories for parents to read to their kids
          </p>
        </div>

        {!user ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              Sign up to get personalized bedtime stories delivered daily.
            </p>
            <div className="space-x-4">
              <Link
                href="/auth/register"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {todaysStory ? (
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">Today&apos;s Story</h2>
                <h3 className="text-xl font-semibold mb-2">{todaysStory.title}</h3>
                <p className="text-gray-600 mb-4">{todaysStory.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {todaysStory.minAge && todaysStory.maxAge && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      Ages {todaysStory.minAge}-{todaysStory.maxAge}
                    </span>
                  )}
                  {todaysStory.estimatedReadTimeMinutes && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {todaysStory.estimatedReadTimeMinutes} min read
                    </span>
                  )}
                </div>
                <Link
                  href={`/stories/${todaysStory.id}`}
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
                >
                  Read Today&apos;s Story
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No story available today.</p>
                <Link
                  href="/stories"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
                >
                  Browse All Stories
                </Link>
              </div>
            )}

            {!user.isPaid && <AdUnit className="my-8" />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Link
                href="/stories"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">📚 Browse Stories</h3>
                <p className="text-gray-600">Explore our collection</p>
              </Link>
              <Link
                href="/favorites"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">❤️ Favorites</h3>
                <p className="text-gray-600">Your saved stories</p>
              </Link>
              <Link
                href="/categories"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">🏷️ Categories</h3>
                <p className="text-gray-600">Find by theme</p>
              </Link>
            </div>
          </>
        )}

        {!user && <AdUnit className="my-8" />}
      </div>
    </Layout>
  )
}
