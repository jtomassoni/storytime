import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // System Health Metrics
  const [
    storyCount,
    activeStoryCount,
    inactiveStoryCount,
    categoryCount,
    userCount,
    paidUserCount,
    freeUserCount,
    usersWithPreferences,
    totalReads,
    totalFavorites,
    totalObjections,
    recentSignups,
    recentReads,
    storiesWithObjections,
    mostFavoritedStories,
    mostReadStories,
    storyOfTheDayCount,
    upcomingStoryOfTheDay,
  ] = await Promise.all([
    prisma.story.count(),
    prisma.story.count({ where: { isActive: true } }),
    prisma.story.count({ where: { isActive: false } }),
    prisma.category.count(),
    prisma.user.count(),
    prisma.user.count({ where: { isPaid: true } }),
    prisma.user.count({ where: { isPaid: false } }),
    prisma.userPreferences.count(),
    prisma.storyReadEvent.count(),
    prisma.favoriteStory.count(),
    prisma.storyObjection.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { email: true, createdAt: true, isPaid: true },
    }),
    prisma.storyReadEvent.findMany({
      orderBy: { startedAt: "desc" },
      take: 5,
      include: {
        story: { select: { title: true } },
        user: { select: { email: true } },
      },
    }),
    prisma.story.findMany({
      where: {
        objections: { some: {} },
      },
      include: {
        _count: { select: { objections: true } },
      },
      take: 5,
      orderBy: {
        objections: { _count: "desc" },
      },
    }),
    prisma.story.findMany({
      include: {
        _count: { select: { favorites: true } },
      },
      orderBy: {
        favorites: { _count: "desc" },
      },
      take: 5,
    }),
    prisma.story.findMany({
      include: {
        _count: { select: { readEvents: true } },
      },
      orderBy: {
        readEvents: { _count: "desc" },
      },
      take: 5,
    }),
    prisma.storyOfTheDay.count(),
    prisma.storyOfTheDay.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 7,
      include: {
        story: { select: { title: true } },
      },
    }),
  ]).catch(() => [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], [], [], [], [], 0, [],
  ])

  const paidPercentage = userCount > 0 ? Math.round((paidUserCount / userCount) * 100) : 0
  const activePercentage = storyCount > 0 ? Math.round((activeStoryCount / storyCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ecosystem Management</h1>
          <p className="text-foreground/70 mt-1">System health, engagement metrics, and content insights</p>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="bg-card-bg rounded-lg shadow-lg p-6 border border-border-color">
        <h2 className="text-xl font-bold mb-4 text-foreground">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-background/50 rounded-lg p-4 border border-border-color">
            <h3 className="text-sm font-medium text-foreground/70">Total Users</h3>
            <p className="text-3xl font-bold mt-2 text-foreground">{userCount}</p>
            <div className="mt-2 text-xs text-foreground/60">
              {paidUserCount} paid ({paidPercentage}%) • {freeUserCount} free
            </div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-border-color">
            <h3 className="text-sm font-medium text-foreground/70">Content Library</h3>
            <p className="text-3xl font-bold mt-2 text-foreground">{storyCount}</p>
            <div className="mt-2 text-xs text-foreground/60">
              {activeStoryCount} active ({activePercentage}%) • {inactiveStoryCount} inactive
            </div>
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-border-color">
            <h3 className="text-sm font-medium text-foreground/70">Categories</h3>
            <p className="text-3xl font-bold mt-2 text-foreground">{categoryCount}</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-border-color">
            <h3 className="text-sm font-medium text-foreground/70">User Engagement</h3>
            <p className="text-3xl font-bold mt-2 text-foreground">{totalReads}</p>
            <div className="mt-2 text-xs text-foreground/60">
              {totalFavorites} favorites • {totalObjections} objections
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 border border-border-color">
          <h2 className="text-xl font-bold mb-4 text-foreground">Content Performance</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Most Read Stories</h3>
              <div className="space-y-2">
                {mostReadStories.length > 0 ? (
                  mostReadStories.map((story) => (
                    <div key={story.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground/90 truncate">{story.title}</span>
                      <span className="text-foreground/60 ml-2">{story._count.readEvents} reads</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60">No read data yet</p>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-border-color">
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Most Favorited Stories</h3>
              <div className="space-y-2">
                {mostFavoritedStories.length > 0 ? (
                  mostFavoritedStories.map((story) => (
                    <div key={story.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground/90 truncate">{story.title}</span>
                      <span className="text-foreground/60 ml-2">{story._count.favorites} favorites</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60">No favorites yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Health */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 border border-border-color">
          <h2 className="text-xl font-bold mb-4 text-foreground">Content Health</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Stories with Objections</h3>
              <div className="space-y-2">
                {storiesWithObjections.length > 0 ? (
                  storiesWithObjections.map((story) => (
                    <Link
                      key={story.id}
                      href={`/admin/stories/${story.id}`}
                      className="flex justify-between items-center text-sm hover:text-accent-purple transition-colors"
                    >
                      <span className="text-foreground/90 truncate">{story.title}</span>
                      <span className="text-red-400 ml-2">{story._count.objections} issues</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60">No objections reported</p>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-border-color">
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Story of the Day Coverage</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground/70">Total assignments</span>
                  <span className="text-foreground/90 font-semibold">{storyOfTheDayCount}</span>
                </div>
                {upcomingStoryOfTheDay.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-foreground/60 mb-1">Upcoming (next 7 days):</p>
                    {upcomingStoryOfTheDay.map((entry) => (
                      <div key={entry.id} className="text-xs text-foreground/70">
                        {new Date(entry.date).toLocaleDateString()}: {entry.story.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 border border-border-color">
          <h2 className="text-xl font-bold mb-4 text-foreground">Recent Activity</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Recent Signups</h3>
              <div className="space-y-2">
                {recentSignups.length > 0 ? (
                  recentSignups.map((user) => (
                    <div key={user.email} className="flex justify-between items-center text-sm">
                      <span className="text-foreground/90">{user.email}</span>
                      <div className="flex items-center gap-2">
                        {user.isPaid && (
                          <span className="text-xs bg-green-900/50 text-green-200 px-2 py-0.5 rounded border border-green-700/50">
                            Paid
                          </span>
                        )}
                        <span className="text-foreground/60 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60">No recent signups</p>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-border-color">
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Recent Reads</h3>
              <div className="space-y-2">
                {recentReads.length > 0 ? (
                  recentReads.map((read) => (
                    <div key={read.id} className="text-sm">
                      <span className="text-foreground/90">{read.story.title}</span>
                      {read.user && (
                        <span className="text-foreground/60 ml-2">by {read.user.email}</span>
                      )}
                      <span className="text-foreground/60 ml-2 text-xs">
                        {new Date(read.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60">No recent reads</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 border border-border-color">
          <h2 className="text-xl font-bold mb-4 text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/stories/new"
              className="block bg-accent-purple text-white px-4 py-3 rounded-lg hover:bg-accent-purple-dark transition-colors text-center font-medium"
            >
              + Create New Story
            </Link>
            <Link
              href="/admin/stories"
              className="block bg-card-bg border border-border-color text-foreground px-4 py-3 rounded-lg hover:bg-card-bg/80 transition-colors text-center font-medium"
            >
              Manage Stories
            </Link>
            <Link
              href="/admin/categories"
              className="block bg-card-bg border border-border-color text-foreground px-4 py-3 rounded-lg hover:bg-card-bg/80 transition-colors text-center font-medium"
            >
              Manage Categories
            </Link>
            <Link
              href="/admin/story-of-the-day"
              className="block bg-card-bg border border-border-color text-foreground px-4 py-3 rounded-lg hover:bg-card-bg/80 transition-colors text-center font-medium"
            >
              Set Story of the Day
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-border-color">
            <h3 className="text-sm font-medium text-foreground/80 mb-2">User Insights</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Users with preferences</span>
                <span className="text-foreground/90 font-semibold">{usersWithPreferences}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Completion rate</span>
                <span className="text-foreground/90 font-semibold">
                  {userCount > 0 ? Math.round((usersWithPreferences / userCount) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

