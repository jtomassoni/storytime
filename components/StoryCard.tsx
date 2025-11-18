import Link from "next/link"
import { Story } from "@prisma/client"

type StoryCardProps = {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      href={`/stories/${story.id}`}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow block"
    >
      <h3 className="text-xl font-bold mb-2">{story.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{story.shortDescription}</p>
      <div className="flex flex-wrap gap-2">
        {story.minAge && story.maxAge && (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Ages {story.minAge}-{story.maxAge}
          </span>
        )}
        {story.estimatedReadTimeMinutes && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {story.estimatedReadTimeMinutes} min
          </span>
        )}
        {story.valuesTags.length > 0 && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {story.valuesTags[0]}
          </span>
        )}
      </div>
    </Link>
  )
}

