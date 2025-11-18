"use client"

import { useEffect } from "react"

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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error("AdSense error", e)
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-3373780887120786"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

