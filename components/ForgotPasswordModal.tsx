"use client"

import { useState } from "react"
import { FaTimes } from "react-icons/fa"

type ForgotPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  onBackToLogin?: () => void
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setSuccess(true)
        setEmail("")
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = () => {
    setEmail("")
    setError("")
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card-bg rounded-lg shadow-xl max-w-md w-full p-6 border border-border-color">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Reset your password</h2>
          <button
            onClick={handleClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-900/50 border border-green-700/50 text-green-200 px-4 py-3 rounded">
              If an account with that email exists, a password reset link has been sent. Please check your email.
            </div>
            <div className="flex gap-3">
              {onBackToLogin && (
                <button
                  onClick={onBackToLogin}
                  className="flex-1 bg-accent-purple hover:bg-accent-purple-dark text-white px-4 py-3 rounded-md font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              )}
              <button
                onClick={handleClose}
                className="flex-1 bg-background border border-border-color hover:bg-background/80 text-foreground px-4 py-3 rounded-md font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-foreground/80 text-sm mb-4">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground/80 mb-2">
                Email address
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-3 border border-border-color bg-background placeholder-gray-400 text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-purple hover:bg-accent-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              {onBackToLogin && (
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="flex-1 bg-background border border-border-color hover:bg-background/80 text-foreground px-4 py-3 rounded-md font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

