"use client"

import { useState } from "react"
import { LoginModal } from "./LoginModal"
import { RegisterModal } from "./RegisterModal"

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "register"
  callbackUrl?: string
  plan?: string
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = "login",
  callbackUrl,
  plan 
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)

  const handleClose = () => {
    setMode(initialMode) // Reset to initial mode when closing
    onClose()
  }

  if (!isOpen) return null

  if (mode === "login") {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={handleClose}
        onSwitchToRegister={() => setMode("register")}
        callbackUrl={callbackUrl}
      />
    )
  }

  return (
    <RegisterModal
      isOpen={isOpen}
      onClose={handleClose}
      onSwitchToLogin={() => setMode("login")}
      plan={plan}
    />
  )
}

