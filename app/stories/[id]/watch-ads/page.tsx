"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Layout } from "@/components/Layout"
import { AdUnit } from "@/components/AdUnit"
import { FaArrowRight, FaCheck } from "react-icons/fa"

export default function WatchAdsPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.id as string
  const [adsViewed, setAdsViewed] = useState(0)
  const [completed, setCompleted] = useState(false)
  const totalAds = 3 // Number of ads user needs to view

  useEffect(() => {
    // Check if user has already completed watching ads today
    const adCompletionKey = `ad_completed_${storyId}_${new Date().toDateString()}`
    const completed = localStorage.getItem(adCompletionKey)
    if (completed === "true") {
      setCompleted(true)
      setAdsViewed(totalAds)
    }
  }, [storyId, totalAds])

  const handleAdViewed = () => {
    const newCount = adsViewed + 1
    setAdsViewed(newCount)
    
    if (newCount >= totalAds) {
      // Mark as completed for today
      const adCompletionKey = `ad_completed_${storyId}_${new Date().toDateString()}`
      localStorage.setItem(adCompletionKey, "true")
      setCompleted(true)
    }
  }

  const handleContinue = () => {
    // Redirect to story page - access is stored in localStorage
    router.push(`/stories/${storyId}`)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-2xl p-8 shadow-xl border border-purple-700/50 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Watch Ads to Read Full Story Free
          </h1>
          <p className="text-white/90 text-lg mb-6">
            Watch {totalAds} ads to unlock the full story for free. This access is valid for today only.
          </p>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">
                Ads viewed: {adsViewed} / {totalAds}
              </span>
              <span className="text-white/80 text-sm">
                {completed ? "✓ Complete" : `${totalAds - adsViewed} remaining`}
              </span>
            </div>
            <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${(adsViewed / totalAds) * 100}%` }}
              />
            </div>
          </div>

          {completed ? (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <FaCheck className="text-green-400 text-2xl" />
                <h2 className="text-xl font-bold text-white">All ads viewed!</h2>
              </div>
              <p className="text-white/90 mb-4">
                You can now read the full story for free. Click the button below to continue.
              </p>
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Read Full Story
                <FaArrowRight />
              </button>
            </div>
          ) : (
            <div className="bg-purple-800/30 border border-purple-600/50 rounded-xl p-4 mb-6">
              <p className="text-white/80 text-sm text-center">
                Please view the ads below. Scroll down to see all {totalAds} ads.
              </p>
            </div>
          )}
        </div>

        {/* Ad units */}
        <div className="space-y-8">
          {Array.from({ length: totalAds }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-card-bg rounded-xl p-6 border border-border-color">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Ad {index + 1} of {totalAds}
                  </h3>
                  {adsViewed > index && (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <FaCheck /> Viewed
                    </span>
                  )}
                </div>
                <div className="relative min-h-[300px] bg-gray-900/30 rounded-lg border border-border-color overflow-hidden">
                  <div className="w-full h-full">
                    <AdUnit className="w-full" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <button
                      onClick={() => {
                        // Find all ad links in this ad unit and open the first one in a new tab
                        const adContainer = document.querySelectorAll('.adsbygoogle')[index]
                        if (adContainer) {
                          const adLinks = adContainer.querySelectorAll('a[href]')
                          if (adLinks.length > 0) {
                            // Open the first ad link in a new tab
                            const adLink = adLinks[0] as HTMLAnchorElement
                            window.open(adLink.href, '_blank', 'noopener,noreferrer')
                            handleAdViewed()
                          } else {
                            // Wait a bit for ad to load, then try again
                            setTimeout(() => {
                              const retryLinks = adContainer.querySelectorAll('a[href]')
                              if (retryLinks.length > 0) {
                                const adLink = retryLinks[0] as HTMLAnchorElement
                                window.open(adLink.href, '_blank', 'noopener,noreferrer')
                                handleAdViewed()
                              } else {
                                // Mark as viewed anyway after user clicks
                                handleAdViewed()
                              }
                            }, 1000)
                          }
                        } else {
                          // Fallback: mark as viewed
                          handleAdViewed()
                        }
                      }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all text-lg z-10"
                    >
                      Click to Open Ad in New Tab
                    </button>
                  </div>
                  <p className="text-foreground/60 text-xs text-center mt-2 p-2">
                    Click the button to open the ad in a new tab. This ensures the ad is properly viewed.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completed && (
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all inline-flex items-center gap-2"
            >
              Read Full Story Now
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

