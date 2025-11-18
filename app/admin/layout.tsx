import { requireAdmin } from "@/lib/auth-helpers"
import Link from "next/link"
import { AdminBreadcrumbs } from "@/components/admin/Breadcrumbs"

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card-bg shadow-sm border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-accent-purple">
                Ecosystem Management
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin/stories"
                  className="text-foreground/80 hover:text-accent-purple px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Stories
                </Link>
                <Link
                  href="/admin/categories"
                  className="text-foreground/80 hover:text-accent-purple px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/story-of-the-day"
                  className="text-foreground/80 hover:text-accent-purple px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Story of the Day
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-foreground/80 hover:text-accent-purple px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminBreadcrumbs />
        {children}
      </main>
    </div>
  )
}

