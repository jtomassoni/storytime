"use client"

import { useState } from "react"
import { FaSignInAlt, FaUserPlus } from "react-icons/fa"
import { AuthModal } from "./AuthModal"
import { useSession } from "next-auth/react"

type StoryAuthPromptProps = {
  storyId: string
}

export function StoryAuthPrompt({ storyId }: StoryAuthPromptProps) {
  const { data: session } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login")

  if (session?.user) {
    return null
  }

  return (
    <>
      <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-6">
        <p className="text-foreground/90 mb-3">
          Sign in to read the full story and unlock unlimited access to our story library.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setAuthModalMode("login")
              setIsAuthModalOpen(true)
            }}
            className="bg-accent-purple text-white px-6 py-2 rounded-lg font-medium hover:bg-accent-purple-dark transition-colors flex items-center gap-2"
          >
            <FaSignInAlt />
            Sign In to Read Full Story
          </button>
          <button
            onClick={() => {
              setAuthModalMode("register")
              setIsAuthModalOpen(true)
            }}
            className="bg-card-bg border border-border-color text-foreground px-6 py-2 rounded-lg font-medium hover:bg-card-bg/80 transition-colors flex items-center gap-2"
          >
            <FaUserPlus />
            Create Account
          </button>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        callbackUrl={`/stories/${storyId}`}
      />
    </>
  )
}

