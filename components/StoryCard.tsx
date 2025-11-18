import Link from "next/link"
import { Story } from "@prisma/client"
import { FaArrowRight, FaSignInAlt } from "react-icons/fa"

type StoryCardProps = {
  story: Story & {
    fullText5Min?: string | null
    fullText10Min?: string | null
    boyStoryText5Min?: string | null
    boyStoryText10Min?: string | null
    girlStoryText5Min?: string | null
    girlStoryText10Min?: string | null
  }
  showPreview?: boolean
}

export function StoryCard({ story, showPreview = false }: StoryCardProps) {
  // Get preview text (first ~200 characters of full text)
  const previewText = showPreview && story.fullText 
    ? story.fullText.substring(0, 200).trim() + (story.fullText.length > 200 ? "..." : "")
    : null

  // Check available length versions
  const has5Min = !!(
    story.fullText5Min ||
    story.boyStoryText5Min ||
    story.girlStoryText5Min
  )
  const has10Min = !!(
    story.fullText10Min ||
    story.boyStoryText10Min ||
    story.girlStoryText10Min
  )

  return (
    <Link
      href={`/stories/${story.id}`}
      className="bg-card-bg rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-all border border-border-color hover:border-accent-purple/50 block"
    >
      <h3 className="text-lg font-bold mb-2 text-foreground">{story.title}</h3>
      {showPreview && previewText ? (
        <p className="text-foreground/70 mb-3 text-sm line-clamp-3">{previewText}</p>
      ) : (
        <p className="text-foreground/70 mb-3 text-sm line-clamp-2">{story.shortDescription}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {story.minAge && story.maxAge && (
          <span className="bg-amber-900/50 text-amber-200 px-2 py-1 rounded-full text-xs border border-amber-700/50">
            Ages {story.minAge}-{story.maxAge}
          </span>
        )}
        {story.estimatedReadTimeMinutes && (
          <span className="bg-orange-900/50 text-orange-200 px-2 py-1 rounded-full text-xs border border-orange-700/50">
            {story.estimatedReadTimeMinutes} min
          </span>
        )}
        {(has5Min || has10Min) && (
          <div className="flex gap-1">
            {has5Min && (
              <span className="bg-orange-900/50 text-orange-200 px-2 py-1 rounded-full text-xs border border-orange-700/50">
                5min
              </span>
            )}
            {has10Min && (
              <span className="bg-yellow-900/50 text-yellow-200 px-2 py-1 rounded-full text-xs border border-yellow-700/50">
                10min
              </span>
            )}
          </div>
        )}
        {story.valuesTags.length > 0 && (
          <span className="bg-green-900/50 text-green-200 px-2 py-1 rounded-full text-xs border border-green-700/50">
            {story.valuesTags[0]}
          </span>
        )}
      </div>
      {showPreview && (
        <div className="mt-3 pt-3 border-t border-border-color">
          <span className="text-xs text-accent-purple font-medium flex items-center gap-1">
            <FaSignInAlt />
            Sign in to read full story
            <FaArrowRight />
          </span>
        </div>
      )}
    </Link>
  )
}

