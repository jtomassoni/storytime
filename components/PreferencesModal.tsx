"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { FaArrowRight, FaArrowLeft, FaTimes, FaAd, FaCrown } from "react-icons/fa"
import { StoryReader } from "./StoryReader"
import { AuthModal } from "./AuthModal"

const GENDERS = ["Boy", "Girl", "No preference"]
const AGES = ["3-4", "5-6", "7-8", "9-10"]
const VALUES = ["Kindness", "Courage", "Adventure", "Friendship", "Creativity", "Curiosity"]

interface OnboardingStep {
  question: string
  subtitle?: string
  options: string[]
  key: string
}

const STEPS: OnboardingStep[] = [
  {
    question: "What's your child's age?",
    subtitle: "We'll pick age-appropriate stories",
    options: AGES,
    key: "age"
  },
  {
    question: "Character preference?",
    subtitle: "We can personalize stories",
    options: GENDERS,
    key: "gender"
  },
  {
    question: "What values matter most?",
    subtitle: "Pick 1-2 (or skip)",
    options: VALUES,
    key: "values"
  }
]

type PreferencesModalProps = {
  isOpen: boolean
  onClose: () => void
}

type PreviewStory = {
  id: string
  title: string
  shortDescription: string
  minAge: number | null
  maxAge: number | null
  valuesTags: string[]
  fullText10Min: string | null
  boyStoryText10Min: string | null
  girlStoryText10Min: string | null
  boyStoryText: string | null
  girlStoryText: string | null
  fullText: string
  estimatedReadTimeMinutes10Min: number | null
  preferredGender: string | null
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    age: "",
    gender: "",
    values: []
  })
  const [loading, setLoading] = useState(false)
  const [previewStory, setPreviewStory] = useState<PreviewStory | null>(null)
  const [showSignup, setShowSignup] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [preferencesSaved, setPreferencesSaved] = useState(false)

  // Auto-save preferences when user becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user && previewStory && !preferencesSaved) {
      handleAuthSuccess()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, previewStory, preferencesSaved])

  const currentStepData = STEPS[currentStep]
  const isMultiSelect = currentStepData.key === "values"
  const selectedValue = answers[currentStepData.key]

  const handleSelect = (option: string) => {
    if (isMultiSelect) {
      const currentValues = (selectedValue as string[]) || []
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option]
      setAnswers({ ...answers, [currentStepData.key]: newValues })
    } else {
      setAnswers({ ...answers, [currentStepData.key]: option })
      // Auto-advance to next step when age or gender is selected
      if ((currentStepData.key === "age" || currentStepData.key === "gender") && currentStep < STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1)
        }, 200) // Small delay for visual feedback
      }
    }
  }

  const canProceed = () => {
    if (isMultiSelect) {
      return true // Values are optional
    }
    return !!selectedValue
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleGetPreviewStory()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGetPreviewStory = async () => {
    setLoading(true)
    try {
      const ageRange = answers.age && typeof answers.age === 'string' ? answers.age.split("-") : null
      const res = await fetch("/api/preferences/preview-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childAge: ageRange ? parseInt(ageRange[0]) : null,
          preferredGender: answers.gender === "No preference" ? null : (answers.gender as string)?.toLowerCase() || null,
          preferredValues: (answers.values as string[])?.map((v: string) => v.toLowerCase()) || [],
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to get preview story")
      }

      const data = await res.json()
      setPreviewStory(data.story)
      setLoading(false)
    } catch (err) {
      console.error("Error getting preview story:", err)
      setLoading(false)
    }
  }

  const handleSignupClick = () => {
    setShowSignup(false)
    setIsAuthModalOpen(true)
  }

  const handleSubscribe = async () => {
    // If user is not authenticated, show auth modal first
    if (!session?.user) {
      setIsAuthModalOpen(true)
      return
    }

    // User is authenticated, proceed to checkout
    try {
      const res = await fetch("/api/subscribe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "yearly" }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout")
      }

      // Redirect to checkout
      if (data.url) {
        window.location.href = data.url
      } else if (data.mock) {
        router.push(data.url || "/subscribe/success")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Something went wrong. Please try again.")
    }
  }

  const handleAuthSuccess = async () => {
    // Save preferences after successful auth
    if (preferencesSaved) return
    
    try {
      const ageRange = answers.age && typeof answers.age === 'string' ? answers.age.split("-") : null
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childAge: ageRange ? parseInt(ageRange[0]) : null,
          preferredGender: answers.gender === "No preference" ? null : (answers.gender as string)?.toLowerCase() || null,
          preferredValues: (answers.values as string[])?.map((v: string) => v.toLowerCase()) || [],
        }),
      })

      if (res.ok) {
        setPreferencesSaved(true)
        handleModalClose()
        router.refresh()
      }
    } catch (err) {
      console.error("Error saving preferences:", err)
    }
  }

  const handleClose = () => {
    // Always close the modal when X is clicked
    handleModalClose()
  }

  // Reset state when modal closes
  const handleModalClose = () => {
    setCurrentStep(0)
    setAnswers({ age: "", gender: "", values: [] })
    setLoading(false)
    setPreviewStory(null)
    setShowSignup(false)
    setPreferencesSaved(false)
    onClose()
  }

  const progress = previewStory ? 100 : ((currentStep + 1) / STEPS.length) * 100
  const showStoryPreview = !!previewStory && !showSignup

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && currentStep === 0) {
          handleModalClose()
        }
      }}
    >
      <div className={`${showStoryPreview ? 'bg-gradient-to-b from-purple-900/95 to-purple-950/95' : 'bg-gradient-to-b from-purple-900/95 to-purple-950/95'} rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border ${showStoryPreview ? 'border-purple-700/50' : 'border-purple-700/50'}`}>
        {/* Header */}
        <div className={`sticky top-0 ${showStoryPreview ? 'bg-purple-900/95 border-purple-700/50' : 'bg-purple-900/95 border-purple-700/50'} border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10`}>
          <h2 className={`text-lg font-semibold ${showStoryPreview ? 'text-white' : 'text-white'}`}>
            {showStoryPreview ? "Your Free Story Preview" : "Get Started"}
          </h2>
          <button
            onClick={handleClose}
            className={`${showStoryPreview ? 'text-white/70 hover:text-white' : 'text-white/70 hover:text-white'} transition-colors`}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 ${showStoryPreview ? 'bg-gradient-to-b from-purple-900/50 to-purple-950/50' : 'bg-gradient-to-b from-purple-900/50 to-purple-950/50'}`}>
          {showStoryPreview ? (
            /* Story Preview */
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-3">
                  {previewStory.title}
                </h1>
                <p className="text-white/90 text-lg mb-4 leading-relaxed">{previewStory.shortDescription}</p>
                {previewStory.minAge && previewStory.maxAge && (
                  <span className="inline-block bg-gradient-to-br from-amber-400 to-orange-400 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                    Ages {previewStory.minAge}-{previewStory.maxAge}
                  </span>
                )}
              </div>
              <div className="max-h-[50vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                <StoryReader
                  story={{
                    ...previewStory,
                    estimatedReadTimeMinutes: previewStory.estimatedReadTimeMinutes10Min || null,
                    estimatedReadTimeMinutes5Min: null,
                    estimatedReadTimeMinutes10Min: previewStory.estimatedReadTimeMinutes10Min,
                    fullText5Min: null,
                    fullText10Min: previewStory.fullText10Min,
                    categories: [],
                  } as any}
                  user={null}
                  preferredGender={previewStory.preferredGender}
                  showPreview={true}
                />
              </div>
              <div className="border-t-2 border-purple-600/70 pt-8 mt-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Continue reading
                  </h3>
                  <p className="text-white/80 text-base">
                    Choose how you&apos;d like to access the full story
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Watch Ad Option */}
                  <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-xl p-6 border-2 border-purple-600/50 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-amber-500/20 rounded-lg p-2">
                        <FaAd className="text-amber-400 text-xl" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Watch an Ad</h4>
                    </div>
                    <p className="text-white/90 text-sm mb-4">
                      Watch a short ad to read the rest of this story for free.
                    </p>
                    <button
                      onClick={() => {
                        if (previewStory?.id) {
                          router.push(`/stories/${previewStory.id}/watch-ads`)
                          handleModalClose()
                        }
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <FaAd />
                      Watch Ad to Continue
                    </button>
                  </div>

                  {/* Subscribe Option */}
                  <div className="bg-gradient-to-br from-amber-500/90 to-orange-500/90 rounded-xl p-6 border-2 border-amber-400/50 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-white/20 rounded-lg p-2">
                        <FaCrown className="text-white text-xl" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Get Membership</h4>
                    </div>
                    <p className="text-white/95 text-sm mb-4">
                      Subscribe for unlimited access to a new story every day, plus our entire library.
                    </p>
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-white text-amber-600 px-4 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <FaCrown />
                      Subscribe Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Preferences Form */
            <>
              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1 bg-purple-800/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-xs text-white/80 mt-1.5">
                  {currentStep + 1} of {STEPS.length}
                </p>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">
                  {currentStepData.question}
                </h1>
                {currentStepData.subtitle && (
                  <p className="text-white/80 mb-5 text-sm">
                    {currentStepData.subtitle}
                  </p>
                )}

                <div className="space-y-2">
                  {currentStepData.options.map((option) => {
                    const isSelected = isMultiSelect
                      ? (selectedValue as string[])?.includes(option)
                      : selectedValue === option

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(option)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg transform scale-[1.02]"
                            : "bg-purple-800/40 text-white border-purple-600/50 hover:border-amber-400/50 hover:bg-purple-800/60 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium">{option}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                              <FaArrowRight className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {isMultiSelect && (selectedValue as string[])?.length > 0 && (
                  <p className="text-xs text-white/70 mt-3 text-center">
                    Selected: {(selectedValue as string[]).join(", ")}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-800/40 rounded-xl border-2 border-purple-600/50 text-white font-medium hover:bg-purple-800/60 transition-all text-sm"
                  >
                    <FaArrowLeft />
                    Back
                  </button>
                )}
                {/* Only show Next/Submit button on the last step (values) */}
                {currentStep === STEPS.length - 1 && (
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm ${currentStep > 0 ? 'flex-1' : 'w-full'}`}
                  >
                    {loading ? (
                      "Loading story..."
                    ) : (
                      <>
                        Get one free story
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false)
          // Preferences will be saved automatically via useEffect when auth status changes
        }}
        initialMode="register"
        callbackUrl={previewStory ? `/stories/${previewStory.id}` : undefined}
      />
    </div>
  )
}

