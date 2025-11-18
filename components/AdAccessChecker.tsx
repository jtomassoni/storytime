"use client"

import { useEffect, useState } from "react"

export function useAdAccess(storyId: string): boolean {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Check if user has watched ads for this story today
    const today = new Date().toDateString()
    const adCompletionKey = `ad_completed_${storyId}_${today}`
    const completed = localStorage.getItem(adCompletionKey)
    setHasAccess(completed === "true")
  }, [storyId])

  return hasAccess
}

