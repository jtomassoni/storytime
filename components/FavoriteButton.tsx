"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { AuthModal } from "./AuthModal"

type FavoriteButtonProps = {
  storyId: string
}

export function FavoriteButton({ storyId }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    if (session?.user) {
      checkFavorite()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, storyId])

  const checkFavorite = async () => {
    try {
      const res = await fetch(`/api/favorites/check?storyId=${storyId}`)
      if (res.ok) {
        const data = await res.json()
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error("Error checking favorite:", error)
    }
  }

  const handleToggle = async () => {
    if (!session?.user) {
      setIsAuthModalOpen(true)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      })

      if (res.ok) {
        const data = await res.json()
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors border flex items-center gap-2 ${
          isFavorited
            ? "bg-red-900/50 text-red-200 border-red-700/50 hover:bg-red-900/70"
            : "bg-card-bg text-foreground/80 border-border-color hover:bg-card-bg/80"
        } disabled:opacity-50`}
      >
        {isFavorited ? (
          <>
            <FaHeart className="text-red-400" />
            Favorited
          </>
        ) : (
          <>
            <FaRegHeart />
            Favorite
          </>
        )}
      </button>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </>
  )
}

