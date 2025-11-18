import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { AdUnit } from "@/components/AdUnit"
import { getCurrentUser } from "@/lib/auth-helpers"

export const dynamic = 'force-dynamic'

type CategoryWithCount = {
  id: string
  name: string
  description: string | null
  minAge: number | null
  maxAge: number | null
  cultureTags: string[]
  _count: {
    stories: number
  }
}

export default async function CategoriesPage() {
  const user = await getCurrentUser()
  // Category model doesn't exist in schema - return empty array
  const categories: CategoryWithCount[] = []

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Categories</h1>
        {categories.length === 0 ? (
          <div className="bg-card-bg rounded-lg shadow-lg p-8 text-center border border-border-color">
            <p className="text-foreground/70">No categories available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="bg-card-bg rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border border-border-color hover:border-accent-purple/50 block"
                >
                  <h3 className="text-xl font-bold mb-2 text-foreground">{category.name}</h3>
                  {category.description && (
                    <p className="text-foreground/70 mb-4">{category.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {category.minAge && category.maxAge && (
                      <span className="bg-amber-900/50 text-amber-200 px-3 py-1 rounded-full text-sm border border-amber-700/50">
                        Ages {category.minAge}-{category.maxAge}
                      </span>
                    )}
                    <span className="text-foreground/60 text-sm">
                      {category._count?.stories || 0} {category._count?.stories === 1 ? 'story' : 'stories'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {!user?.isPaid && <AdUnit className="mt-8" />}
          </>
        )}
      </div>
    </Layout>
  )
}

