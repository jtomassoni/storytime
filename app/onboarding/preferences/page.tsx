"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"

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

export default function PreferencesPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    age: "",
    gender: "",
    values: []
  })
  const [loading, setLoading] = useState(false)

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
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const ageRange = answers.age ? answers.age.split("-") : null
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childAge: ageRange ? parseInt(ageRange[0]) : null,
          preferredGender: answers.gender === "No preference" ? null : (answers.gender as string)?.toLowerCase() || null,
          preferredValues: answers.values || [],
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save preferences")
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Error saving preferences:", err)
      setLoading(false)
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-600 mt-1.5">
            {currentStep + 1} of {STEPS.length}
          </p>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4 flex flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {currentStepData.question}
            </h1>
            {currentStepData.subtitle && (
              <p className="text-gray-600 mb-5 text-sm">
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
                        : "bg-white text-gray-800 border-gray-200 hover:border-amber-300 hover:shadow-md"
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
              <p className="text-xs text-gray-500 mt-3 text-center">
                Selected: {(selectedValue as string[]).join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 text-gray-700 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-sm"
          >
            <FaArrowLeft />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm"
          >
            {loading ? (
              "Saving..."
            ) : currentStep === STEPS.length - 1 ? (
              <>
                Get Started
                <FaArrowRight />
              </>
            ) : (
              <>
                Next
                <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
