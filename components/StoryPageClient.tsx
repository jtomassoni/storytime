"use client"

import { StoryReader } from "./StoryReader"
import { StoryAuthPrompt } from "./StoryAuthPrompt"
import { AdUnit } from "./AdUnit"
import { useAdAccess } from "./AdAccessChecker"
import { FaStar } from "react-icons/fa"
import Link from "next/link"

type StoryPageClientProps = {
  story: {
    id: string
    title: string
    shortDescription: string
    minAge: number | null
    maxAge: number | null
    estimatedReadTimeMinutes: number | null
    topicTags: string[]
    valuesTags: string[]
    fullText: string
    boyStoryText?: string | null
    girlStoryText?: string | null
    fullText5Min?: string | null
    fullText10Min?: string | null
    boyStoryText5Min?: string | null
    boyStoryText10Min?: string | null
    girlStoryText5Min?: string | null
    girlStoryText10Min?: string | null
    estimatedReadTimeMinutes5Min?: number | null
    estimatedReadTimeMinutes10Min?: number | null
  }
  user: {
    id: string
    isPaid: boolean
  } | null
  preferredGender: string | null
  isTodaysStory: boolean
}

export function StoryPageClient({ story, user, preferredGender, isTodaysStory }: StoryPageClientProps) {
  const hasAdAccess = useAdAccess(story.id)
  
  // Determine access:
  // - Paid users: full access to all stories
  // - Free users: full access to story of the day OR if they watched ads for this story today
  // - Non-authenticated: full access to story of the day OR if they watched ads for this story today
  const canReadFullStory = user?.isPaid || isTodaysStory || hasAdAccess
  const isPreview = !canReadFullStory

  return (
    <div className="space-y-6">
      <div className="bg-card-bg rounded-lg shadow-lg p-6 md:p-8 border border-border-color">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{story.title}</h1>
        <p className="text-xl text-foreground/80 mb-4">{story.shortDescription}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {story.minAge && story.maxAge && (
            <span className="bg-amber-900/50 text-amber-200 px-3 py-1 rounded-full text-sm border border-amber-700/50">
              Ages {story.minAge}-{story.maxAge}
            </span>
          )}
          {story.estimatedReadTimeMinutes && (
            <span className="bg-orange-900/50 text-orange-200 px-3 py-1 rounded-full text-sm border border-orange-700/50">
              {story.estimatedReadTimeMinutes} min read
            </span>
          )}
          {story.topicTags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-800/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-700/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {isPreview && !isTodaysStory && (
          <>
            {!user ? (
              <div className="space-y-4 mb-6">
                <StoryAuthPrompt storyId={story.id} />
                <div className="bg-purple-800/40 border border-purple-600/50 rounded-lg p-4">
                  <p className="text-foreground/90 mb-3">
                    Or watch ads to read this story for free today.
                  </p>
                  <Link
                    href={`/stories/${story.id}/watch-ads`}
                    className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all"
                  >
                    Watch Ads to Read Free
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-6">
                <p className="text-foreground/90 mb-3">
                  This is a preview. Upgrade to a paid account to read the full story and unlock unlimited access to our story library.
                </p>
                <Link
                  href={`/stories/${story.id}/watch-ads`}
                  className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all mt-2"
                >
                  Or Watch Ads to Read Free
                </Link>
              </div>
            )}
          </>
        )}
        
        {isTodaysStory && (
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-6">
            <p className="text-foreground/90 text-sm flex items-center gap-2">
              <FaStar className="text-green-400" />
              This is today&apos;s Story of the Day - read it free!
            </p>
          </div>
        )}

        {hasAdAccess && !isTodaysStory && (
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-6">
            <p className="text-foreground/90 text-sm flex items-center gap-2">
              <FaStar className="text-green-400" />
              You unlocked this story by watching ads! Access valid for today.
            </p>
          </div>
        )}

        {!user?.isPaid && <AdUnit className="my-6" />}

        <StoryReader story={story} user={user} preferredGender={preferredGender} showPreview={isPreview} />
      </div>

      {!user?.isPaid && <AdUnit className="my-8" />}
    </div>
  )
}

