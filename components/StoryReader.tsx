"use client"

import { useState, useEffect } from "react"
import { Story } from "@prisma/client"
import { useSession } from "next-auth/react"
import { FavoriteButton } from "./FavoriteButton"
import { ObjectionModal } from "./ObjectionModal"

type StoryReaderProps = {
  story: Story & {
    categories: Array<{
      category: {
        name: string
      }
    }>
  }
  user: {
    id: string
    isPaid: boolean
  } | null
}

export function StoryReader({ story, user }: StoryReaderProps) {
  const { data: session } = useSession()
  const [sentences, setSentences] = useState<string[]>([])
  const [objectionModalOpen, setObjectionModalOpen] = useState(false)
  const [selectedSentence, setSelectedSentence] = useState<{
    index: number
    text: string
  } | null>(null)

  useEffect(() => {
    // Split story text into sentences
    const text = story.fullText
    const split = text.split(/([.!?]+[\s\n]+)/).filter((s) => s.trim())
    const sentences: string[] = []
    for (let i = 0; i < split.length; i += 2) {
      if (split[i]) {
        sentences.push(split[i] + (split[i + 1] || ""))
      }
    }
    setSentences(sentences)
  }, [story.fullText])

  const handleObjection = (index: number, text: string) => {
    if (!user) {
      alert("Please sign in to provide feedback")
      return
    }
    setSelectedSentence({ index, text })
    setObjectionModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        {user && <FavoriteButton storyId={story.id} />}
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="text-lg leading-relaxed space-y-4">
          {sentences.map((sentence, index) => (
            <div key={index} className="flex items-start gap-2 group">
              <p className="flex-1">{sentence.trim()}</p>
              {user && (
                <button
                  onClick={() => handleObjection(index, sentence.trim())}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded transition-opacity"
                  title="Report an issue with this sentence"
                >
                  !
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {story.valuesTags.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Themes</h3>
          <div className="flex flex-wrap gap-2">
            {story.valuesTags.map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {objectionModalOpen && selectedSentence && (
        <ObjectionModal
          storyId={story.id}
          sentenceIndex={selectedSentence.index}
          textSpan={selectedSentence.text}
          onClose={() => {
            setObjectionModalOpen(false)
            setSelectedSentence(null)
          }}
        />
      )}
    </div>
  )
}

