import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { AdUnit } from "@/components/AdUnit"
import { getCurrentUser } from "@/lib/auth-helpers"

export default async function CategoriesPage() {
  const user = await getCurrentUser()
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No categories available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow block"
                >
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 mb-4">{category.description}</p>
                  )}
                  {category.minAge && category.maxAge && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      Ages {category.minAge}-{category.maxAge}
                    </span>
                  )}
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

