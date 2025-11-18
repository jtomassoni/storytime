import { prisma } from "@/lib/prisma"

export default async function AdminPage() {
  const storyCount = await prisma.story.count()
  const activeStoryCount = await prisma.story.count({
    where: { isActive: true },
  })
  const categoryCount = await prisma.category.count()
  const userCount = await prisma.user.count()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Stories</h3>
          <p className="text-3xl font-bold mt-2">{storyCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Stories</h3>
          <p className="text-3xl font-bold mt-2">{activeStoryCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-3xl font-bold mt-2">{categoryCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Users</h3>
          <p className="text-3xl font-bold mt-2">{userCount}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a
            href="/admin/stories/new"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            + Create New Story
          </a>
          <a
            href="/admin/categories"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            Manage Categories
          </a>
          <a
            href="/admin/story-of-the-day"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            Set Story of the Day
          </a>
        </div>
      </div>
    </div>
  )
}

