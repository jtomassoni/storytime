import { Layout } from "@/components/Layout"
import { requireAuth } from "@/lib/auth-helpers"
import { AdUnit } from "@/components/AdUnit"
import { SubscribeButton } from "@/components/SubscribeButton"
import Link from "next/link"
import { formatYearlyPrice } from "@/lib/formatPrice"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const sessionUser = await requireAuth()
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      isPaid: true,
      subscriptionEndsAt: true,
    },
  })

  if (!user) {
    return <Layout><div>User not found</div></Layout>
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Account</h1>
        <div className="bg-card-bg rounded-lg shadow-lg p-6 md:p-8 space-y-6 border border-border-color">
          <div>
            <label className="block text-sm font-medium text-foreground/80">Email</label>
            <p className="mt-1 text-lg text-foreground">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80">Plan</label>
            <p className="mt-1 text-lg">
              {user.isPaid ? (
                <span className="text-green-400 font-semibold">Paid (No Ads)</span>
              ) : (
                <span className="text-foreground/70">Free (With Ads)</span>
              )}
            </p>
          </div>

          <div>
            <Link
              href="/onboarding/preferences"
              className="text-accent-purple hover:text-accent-purple-dark font-medium transition-colors"
            >
              Edit Preferences →
            </Link>
          </div>

          {!user.isPaid ? (
            <div className="pt-6 border-t border-border-color">
              <h2 className="text-xl font-bold mb-2 text-foreground">Subscribe for Daily Stories</h2>
              <p className="text-foreground/70 mb-4">
                Get a new bedtime story every day, personalized to your child. Starting at {formatYearlyPrice()}/year.
              </p>
              <SubscribeButton />
            </div>
          ) : (
            <div className="pt-6 border-t border-border-color">
              <h2 className="text-xl font-bold mb-2 text-foreground">Subscription Active</h2>
              <p className="text-foreground/70 mb-2">
                You&apos;re all set! Enjoy ad-free daily stories.
              </p>
              {user.subscriptionEndsAt && (
                <p className="text-sm text-foreground/60">
                  Renews: {new Date(user.subscriptionEndsAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {!user.isPaid && <AdUnit className="mt-6" />}
        </div>
      </div>
    </Layout>
  )
}

