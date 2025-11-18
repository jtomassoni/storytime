"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type FavoriteButtonProps = {
  storyId: string
}

export function FavoriteButton({ storyId }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

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
      router.push("/auth/login")
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

  if (!session?.user) {
    return null
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isFavorited
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {isFavorited ? "❤️ Favorited" : "🤍 Favorite"}
    </button>
  )
}

