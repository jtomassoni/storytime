import { requireAdmin } from "@/lib/auth-helpers"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-purple-600">
                Admin Dashboard
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin/stories"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Stories
                </Link>
                <Link
                  href="/admin/categories"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/story-of-the-day"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Story of the Day
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

