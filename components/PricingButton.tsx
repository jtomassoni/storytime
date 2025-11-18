"use client"

import { useState } from "react"
import { AuthModal } from "./AuthModal"

type PricingButtonProps = {
  plan?: string
  className?: string
  children: React.ReactNode
}

export function PricingButton({ plan, className, children }: PricingButtonProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className={className}
      >
        {children}
      </button>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
        plan={plan}
      />
    </>
  )
}

