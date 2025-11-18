"use client"

import { useEffect, useRef } from "react"

// Global flag to ensure adsbygoogle.push is only called once
let adsInitialized = false

type AdUnitProps = {
  slot?: string
  className?: string
  style?: React.CSSProperties
}

export function AdUnit({
  slot = "1367606929",
  className = "",
  style = {},
}: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!insRef.current) return

    // Check if the ins element already has ads initialized
    // AdSense adds this attribute when it initializes an ad
    if (insRef.current.hasAttribute('data-adsbygoogle-status')) {
      return
    }

    // Only initialize once globally to prevent multiple push calls
    if (adsInitialized) {
      return
    }

    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        adsInitialized = true
        // @ts-ignore
        window.adsbygoogle.push({})
      }
    } catch (e) {
      // Reset flag on error so it can retry
      adsInitialized = false
      // Silently handle the error - AdSense will log it if needed
      // This prevents the error from breaking the page
    }
  }, [])

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-3373780887120786"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

