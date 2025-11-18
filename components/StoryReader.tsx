"use client"

import { useState, useEffect } from "react"
import { Story } from "@prisma/client"
import { useSession } from "next-auth/react"
import { FavoriteButton } from "./FavoriteButton"
import { ObjectionModal } from "./ObjectionModal"
import { useAlertModal } from "./AlertModal"

type StoryReaderProps = {
  story: Story & {
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
  preferredGender?: string | null // 'boy', 'girl', or null
  showPreview?: boolean
}

type GenderVersion = 'default' | 'boy' | 'girl'
type LengthVersion = 'full' | '5min' | '10min'

// Deterministic randomization based on date (same day = same gender)
function getDateBasedGender(): 'boy' | 'girl' {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  // Simple hash of date string to get consistent result per day
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  // Use hash to determine gender (consistent for the same day)
  return Math.abs(hash) % 2 === 0 ? 'boy' : 'girl'
}

export function StoryReader({ story, user, preferredGender, showPreview = false }: StoryReaderProps) {
  const { data: session } = useSession()
  const { AlertModal, showAlert } = useAlertModal()
  const [sentences, setSentences] = useState<string[]>([])
  const [objectionModalOpen, setObjectionModalOpen] = useState(false)
  const [selectedSentence, setSelectedSentence] = useState<{
    index: number
    text: string
  } | null>(null)
  
  // Determine default version based on user preference or date-based randomization
  const getDefaultVersion = (): GenderVersion => {
    // If user has a preference, use it
    if (preferredGender === 'boy' && story.boyStoryText) {
      return 'boy'
    }
    if (preferredGender === 'girl' && story.girlStoryText) {
      return 'girl'
    }
    
    // For non-authenticated users or users with no preference, use date-based randomization
    if (!user || !preferredGender) {
      const dateBasedGender = getDateBasedGender()
      if (dateBasedGender === 'boy' && story.boyStoryText) {
        return 'boy'
      }
      if (dateBasedGender === 'girl' && story.girlStoryText) {
        return 'girl'
      }
    }
    
    // Fallback: use available versions
    if (story.boyStoryText) return 'boy'
    if (story.girlStoryText) return 'girl'
    return 'default'
  }

  const [genderVersion, setGenderVersion] = useState<GenderVersion>(getDefaultVersion())
  // Default to 10min version if available and user is not authenticated (preview mode)
  const getDefaultLengthVersion = (): LengthVersion => {
    if (showPreview) return '10min'
    if (!user && (story.fullText10Min || story.boyStoryText10Min || story.girlStoryText10Min)) {
      return '10min'
    }
    return 'full'
  }
  const [lengthVersion, setLengthVersion] = useState<LengthVersion>(getDefaultLengthVersion())

  // Update gender version when preferredGender changes
  useEffect(() => {
    const newDefault = getDefaultVersion()
    setGenderVersion(newDefault)
    // Set length version based on showPreview prop or if user is not authenticated
    const newLengthVersion = getDefaultLengthVersion()
    setLengthVersion(newLengthVersion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredGender, user, story.boyStoryText, story.girlStoryText, story.fullText10Min, story.boyStoryText10Min, story.girlStoryText10Min, showPreview])

  // Determine which text to use based on selected gender and length versions
  const getStoryText = (): string => {
    // Try to get the requested length version, fallback to closest available
    if (lengthVersion === '5min') {
      if (genderVersion === 'boy' && story.boyStoryText5Min) {
        return story.boyStoryText5Min
      }
      if (genderVersion === 'girl' && story.girlStoryText5Min) {
        return story.girlStoryText5Min
      }
      if (story.fullText5Min) {
        return story.fullText5Min
      }
      // Fallback to 10min or full if 5min not available
      if (genderVersion === 'boy' && story.boyStoryText10Min) {
        return story.boyStoryText10Min
      }
      if (genderVersion === 'girl' && story.girlStoryText10Min) {
        return story.girlStoryText10Min
      }
      if (story.fullText10Min) {
        return story.fullText10Min
      }
    }
    
    if (lengthVersion === '10min') {
      if (genderVersion === 'boy' && story.boyStoryText10Min) {
        return story.boyStoryText10Min
      }
      if (genderVersion === 'girl' && story.girlStoryText10Min) {
        return story.girlStoryText10Min
      }
      if (story.fullText10Min) {
        return story.fullText10Min
      }
      // Fallback to full if 10min not available
    }

    // Full version (or fallback)
    if (genderVersion === 'boy' && story.boyStoryText) {
      return story.boyStoryText
    }
    if (genderVersion === 'girl' && story.girlStoryText) {
      return story.girlStoryText
    }
    return story.fullText
  }

  // Get estimated read time for current version
  const getEstimatedReadTime = (): number | null => {
    if (lengthVersion === '5min' && story.estimatedReadTimeMinutes5Min) {
      return story.estimatedReadTimeMinutes5Min
    }
    if (lengthVersion === '10min' && story.estimatedReadTimeMinutes10Min) {
      return story.estimatedReadTimeMinutes10Min
    }
    return story.estimatedReadTimeMinutes || null
  }

  const hasGenderVersions = !!(story.boyStoryText || story.girlStoryText)
  const hasLengthVersions = !!(
    story.fullText5Min ||
    story.fullText10Min ||
    story.boyStoryText5Min ||
    story.boyStoryText10Min ||
    story.girlStoryText5Min ||
    story.girlStoryText10Min
  )

  useEffect(() => {
    // Split story text into sentences
    const text = getStoryText()
    // Show more content in preview - approximately 2-3 paragraphs or 1500 characters
    const previewText = showPreview ? text.substring(0, 1500) : text
    const split = previewText.split(/([.!?]+[\s\n]+)/).filter((s) => s.trim())
    const sentences: string[] = []
    for (let i = 0; i < split.length; i += 2) {
      if (split[i]) {
        sentences.push(split[i] + (split[i + 1] || ""))
      }
    }
    setSentences(sentences)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.fullText, story.boyStoryText, story.girlStoryText, story.fullText5Min, story.fullText10Min, story.boyStoryText5Min, story.boyStoryText10Min, story.girlStoryText5Min, story.girlStoryText10Min, genderVersion, lengthVersion, showPreview])

  const handleObjection = async (index: number, text: string) => {
    if (!user) {
      await showAlert("Please sign in to provide feedback")
      return
    }
    setSelectedSentence({ index, text })
    setObjectionModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {hasGenderVersions && (
            <div className="flex items-center gap-2">
              <label className={`text-sm ${showPreview ? 'text-white/80' : 'text-foreground/70'}`}>Character:</label>
              <select
                value={genderVersion}
                onChange={(e) => setGenderVersion(e.target.value as GenderVersion)}
                className={`${showPreview ? 'bg-purple-800/50 border-purple-600/50 text-white' : 'bg-card-bg border-border-color text-foreground'} border px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple`}
              >
                <option value="default">Default</option>
                {story.boyStoryText && <option value="boy">Boy</option>}
                {story.girlStoryText && <option value="girl">Girl</option>}
              </select>
            </div>
          )}
          {hasLengthVersions && (
            <div className="flex items-center gap-2">
              <label className={`text-sm ${showPreview ? 'text-white/80' : 'text-foreground/70'}`}>Length:</label>
              <select
                value={lengthVersion}
                onChange={(e) => setLengthVersion(e.target.value as LengthVersion)}
                className={`${showPreview ? 'bg-purple-800/50 border-purple-600/50 text-white' : 'bg-card-bg border-border-color text-foreground'} border px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple`}
              >
                <option value="full">Full Story</option>
                {(story.fullText10Min || story.boyStoryText10Min || story.girlStoryText10Min) && (
                  <option value="10min">10 Minutes</option>
                )}
                {(story.fullText5Min || story.boyStoryText5Min || story.girlStoryText5Min) && (
                  <option value="5min">5 Minutes</option>
                )}
              </select>
            </div>
          )}
          {getEstimatedReadTime() && (
            <div className="text-sm">
              <span className={`${showPreview ? 'bg-gradient-to-br from-amber-500/80 to-orange-500/80 text-white border-amber-400/50' : 'bg-orange-900/50 text-orange-200 border-orange-700/50'} px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm`}>
                ~{getEstimatedReadTime()} min read
              </span>
            </div>
          )}
        </div>
        {user && <FavoriteButton storyId={story.id} />}
      </div>

      <div className="prose prose-lg max-w-none">
        <div className={`text-xl leading-relaxed space-y-2 ${showPreview ? 'text-white/95' : 'text-foreground/95'}`}>
          {sentences.map((sentence, index) => (
            <div key={index} className="flex items-start gap-2 group">
              <p className={`flex-1 font-serif ${showPreview ? 'text-white/95' : ''}`}>{sentence.trim()}</p>
              {user && (
                <button
                  onClick={() => handleObjection(index, sentence.trim())}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded transition-opacity"
                  title="Report an issue with this sentence"
                >
                  !
                </button>
              )}
            </div>
          ))}
          {showPreview && (
            <div className="mt-4 pt-3">
              <p className="text-white/50 text-xs text-center">
                Preview • Continue reading below
              </p>
            </div>
          )}
        </div>
      </div>

      {story.valuesTags.length > 0 && (
        <div className={`mt-8 pt-6 border-t ${showPreview ? 'border-purple-700/50' : 'border-border-color'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${showPreview ? 'text-white' : 'text-foreground/80'}`}>Themes</h3>
          <div className="flex flex-wrap gap-2">
            {story.valuesTags.map((tag) => (
              <span
                key={tag}
                className={`${showPreview ? 'bg-gradient-to-br from-amber-600/80 to-orange-600/80 text-white border-amber-500/50' : 'bg-amber-900/50 text-amber-200 border-amber-700/50'} px-4 py-2 rounded-full text-sm font-medium border shadow-sm`}
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
      <AlertModal />
    </div>
  )
}

