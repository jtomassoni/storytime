import { Layout } from "@/components/Layout"
import { requireAuth } from "@/lib/auth-helpers"
import { AdUnit } from "@/components/AdUnit"
import Link from "next/link"

export default async function AccountPage() {
  const user = await requireAuth()

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Account</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <p className="mt-1 text-lg">
              {user.isPaid ? (
                <span className="text-green-600 font-semibold">Paid (No Ads)</span>
              ) : (
                <span className="text-gray-600">Free (With Ads)</span>
              )}
            </p>
          </div>

          <div>
            <Link
              href="/onboarding/preferences"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Edit Preferences →
            </Link>
          </div>

          {!user.isPaid && (
            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold mb-2">Upgrade to Premium</h2>
              <p className="text-gray-600 mb-4">
                Remove ads and enjoy an uninterrupted reading experience.
              </p>
              <button
                disabled
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upgrade (Coming Soon)
              </button>
            </div>
          )}

          {!user.isPaid && <AdUnit className="mt-6" />}
        </div>
      </div>
    </Layout>
  )
}

