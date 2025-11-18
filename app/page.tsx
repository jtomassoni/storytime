import { Layout } from "@/components/Layout"
import { getCurrentUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { StoryCard } from "@/components/StoryCard"
import { FaMoon, FaStar, FaBookOpen, FaArrowRight, FaCheck, FaHeart, FaMagic, FaFlask } from "react-icons/fa"
import { SubscribeButton } from "@/components/SubscribeButton"
import { HeroSection } from "@/components/HeroSection"
import { PricingButton } from "@/components/PricingButton"
import { PRICING, getYearlySavings } from "@/lib/pricing"
import { formatMonthlyPrice, formatYearlyPrice, formatFoundersPrice } from "@/lib/formatPrice"

export const dynamic = 'force-dynamic'

async function getTodaysStory() {
  try {
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
  } catch (error) {
    console.error("Database error in getTodaysStory:", error)
    return null
  }
}

async function getUserSafely() {
  try {
    return await getCurrentUser()
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

function MarketingLandingPage() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works */}
        <section id="how-it-works" className="py-8 bg-gradient-to-b from-purple-900/40 via-purple-800/30 to-purple-900/40 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="flex flex-col items-start">
                <div className="bg-gradient-to-br from-amber-800/90 to-orange-900/90 rounded-2xl p-6 mb-4 shadow-xl border border-amber-700/50">
                  <span className="text-5xl font-bold text-amber-300">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Quick Setup</h3>
                <p className="text-white/90 text-base leading-relaxed">
                  Answer 3 simple questions about your child&apos;s age and preferences. Takes less than a minute.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <div className="bg-gradient-to-br from-amber-800/90 to-orange-900/90 rounded-2xl p-8 mb-6 shadow-xl border border-amber-700/50">
                  <span className="text-6xl font-bold text-amber-300">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Subscribe</h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  Just {formatYearlyPrice()} per year - that&apos;s less than $2/month for unlimited personalized bedtime stories.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <div className="bg-gradient-to-br from-amber-800/90 to-orange-900/90 rounded-2xl p-8 mb-6 shadow-xl border border-amber-700/50">
                  <span className="text-6xl font-bold text-amber-300">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Enjoy Daily Stories</h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  Get a new personalized story every day, perfect for bedtime reading with your child.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-8 bg-gradient-to-b from-purple-900/40 via-purple-800/30 to-purple-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">
              Simple, Honest Pricing
            </h2>
            <p className="text-center text-white/90 mb-8 text-base">
              Choose your plan. No hidden fees. Cancel anytime.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-4">
              {/* Monthly Plan */}
              <div className="bg-card-bg rounded-2xl p-6 border-2 border-border-color shadow-xl flex flex-col h-full">
                <div className="text-center mb-6">
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                    {formatMonthlyPrice()}
                  </div>
                  <div className="text-lg text-foreground/70">per month</div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-foreground/80">Unlimited personalized bedtime stories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-foreground/80">New stories delivered daily</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-foreground/80">Age-appropriate content</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-foreground/80">No ads, ever</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-foreground/80">Cancel anytime</span>
                  </li>
                </ul>
                <PricingButton
                  plan="monthly"
                  className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Sign Up
                </PricingButton>
              </div>

              {/* Yearly Plan - Most Popular */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl relative flex flex-col h-full border-2 border-amber-400">
                <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Most Popular
                </div>
                <div className="text-center mb-6 pt-2">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {formatYearlyPrice()}
                  </div>
                  <div className="text-lg opacity-90">per year</div>
                  <div className="text-sm opacity-90 mt-2 bg-white/20 px-3 py-1 rounded-full inline-block">
                    Save {getYearlySavings()}% with the yearly plan
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-300 flex-shrink-0" />
                    <span>Unlimited personalized bedtime stories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-300 flex-shrink-0" />
                    <span>New stories delivered daily</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-300 flex-shrink-0" />
                    <span>Age-appropriate content</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-300 flex-shrink-0" />
                    <span>No ads, ever</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-green-300 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <PricingButton
                  plan="yearly"
                  className="block w-full text-center bg-white text-amber-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Sign Up
                </PricingButton>
              </div>
            </div>

            {/* Founders Plan - Conditional */}
            {PRICING.foundersPlanEnabled && (
              <div className="max-w-md mx-auto mt-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-8 text-white shadow-xl border-2 border-purple-400">
                  <div className="text-center mb-6">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {formatFoundersPrice()}
                    </div>
                    <div className="text-lg opacity-90">Founders Lifetime Access</div>
                    <div className="text-sm opacity-75 mt-2">
                      Limited to first 100 families
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <FaCheck className="text-green-300 flex-shrink-0" />
                      <span>Everything in yearly plan</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheck className="text-green-300 flex-shrink-0" />
                      <span>Lifetime access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheck className="text-green-300 flex-shrink-0" />
                      <span>Never pay again</span>
                    </li>
                  </ul>
                  <PricingButton
                    plan="founders"
                    className="block w-full text-center bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Get Founders Access
                  </PricingButton>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="pt-8 pb-0 bg-gradient-to-b from-purple-900/50 via-purple-800/40 to-purple-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
              Why Parents Love Us
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-2xl p-6 shadow-xl border border-purple-700/50">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-3 shadow-lg flex-shrink-0">
                    <FaMagic className="text-2xl text-yellow-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Personalized Stories</h3>
                    <p className="text-white/90 text-base leading-relaxed">
                      Stories tailored to your child&apos;s age, gender preference, and the values that matter to your family.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-2xl p-8 shadow-xl border border-purple-700/50">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 shadow-lg flex-shrink-0">
                    <FaBookOpen className="text-3xl text-orange-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Daily Delivery</h3>
                    <p className="text-white/90 text-lg leading-relaxed">
                      A fresh story every single day. Never run out of bedtime reading material.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-2xl p-8 shadow-xl border border-purple-700/50">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 shadow-lg flex-shrink-0">
                    <FaMoon className="text-3xl text-yellow-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Bedtime Perfect</h3>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Calming, gentle stories designed specifically for bedtime. No scary moments, just peaceful adventures.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-2xl p-8 shadow-xl border border-purple-700/50">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-4 shadow-lg flex-shrink-0">
                    <FaHeart className="text-3xl text-red-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">One-Handed Setup</h3>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Designed for busy parents. Complete setup in under a minute, even with a baby in your arms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default async function Home() {
  // Always show marketing site if database/auth fails
  let user = null
  let todaysStory = null
  let databaseAvailable = false

  try {
    user = await getUserSafely()
    
    // Only try database operations if we have a user
    if (user) {
      try {
        const preferences = await prisma.userPreferences.findUnique({
          where: { userId: user.id },
        })
        if (!preferences) {
          redirect("/onboarding/preferences")
        }
        databaseAvailable = true
      } catch (error: any) {
        // Next.js redirect throws an error - this is expected behavior
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
          throw error
        }
        console.error("Database error checking preferences:", error)
        // Database unavailable, show marketing site
        return <MarketingLandingPage />
      }
    }
  } catch (error: any) {
    // If redirect error, rethrow it
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    // Any other error - show marketing site
    console.error("Error in Home page:", error)
    return <MarketingLandingPage />
  }

  // If we have a user and database is available, try to get today's story
  if (user && databaseAvailable) {
    try {
      todaysStory = await getTodaysStory()
    } catch (error) {
      console.error("Error getting today's story:", error)
      // Continue without story
    }
  }

  const isMockMode = !process.env.STRIPE_SECRET_KEY || process.env.USE_MOCK_STRIPE === 'true'

  // If user is authenticated and has preferences, show app dashboard
  if (user && databaseAvailable) {
    return (
      <Layout>
        <div className="py-8">
          {/* Mock Mode Indicator - Only show for non-paid users */}
          {isMockMode && !user.isPaid && (
            <div className="max-w-2xl mx-auto mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm text-center flex items-center justify-center gap-2">
              <FaFlask className="text-yellow-800" />
              <strong>Test Mode:</strong> Subscriptions are activated instantly (no payment required)
            </div>
          )}
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaMoon className="text-5xl text-accent-purple" />
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Bedtime Stories
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-foreground/80 mb-6 max-w-2xl mx-auto">
              A new story every day, personalized for your child
            </p>
            {!user.isPaid ? (
              <div className="max-w-md mx-auto">
                <p className="text-lg text-foreground/70 mb-4">
                  Subscribe starting at <span className="font-bold text-accent-purple">{formatMonthlyPrice()}/month</span> or <span className="font-bold text-accent-purple">{formatYearlyPrice()}/year</span> to unlock daily stories
                </p>
                <SubscribeButton />
              </div>
            ) : (
              <Link
                href="/stories"
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-lg"
              >
                View Today&apos;s Story
              </Link>
            )}
          </div>

          {/* Today's Story - Only show if user is subscribed */}
          {user.isPaid && todaysStory && (
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-amber-200">
                <div className="flex items-center gap-2 mb-4">
                  <FaStar className="text-accent-purple text-xl" />
                  <span className="text-sm font-bold text-accent-purple uppercase tracking-wide">
                    Today&apos;s Story
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-foreground">
                  {todaysStory.title}
                </h2>
                <p className="text-lg text-foreground/80 mb-6">
                  {todaysStory.shortDescription}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {todaysStory.minAge && todaysStory.maxAge && (
                    <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                      Ages {todaysStory.minAge}-{todaysStory.maxAge}
                    </span>
                  )}
                  {todaysStory.estimatedReadTimeMinutes && (
                    <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                      {todaysStory.estimatedReadTimeMinutes} min read
                    </span>
                  )}
                </div>
                <Link
                  href={`/stories/${todaysStory.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <FaBookOpen />
                  Read Now
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  // Marketing landing page for unauthenticated users or if database fails
  return <MarketingLandingPage />
}
