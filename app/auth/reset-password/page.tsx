"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Layout } from "@/components/Layout"
import { FaTimes, FaCheck } from "react-icons/fa"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to reset password")
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card-bg rounded-lg shadow-xl max-w-md w-full p-6 border border-border-color">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Reset your password</h2>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-900/50 border border-green-700/50 text-green-200 px-4 py-3 rounded flex items-center gap-2">
                <FaCheck />
                <span>Password has been reset successfully. Redirecting to login...</span>
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-accent-purple hover:bg-accent-purple-dark text-white px-4 py-3 rounded-md font-medium transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {!token && (
                <div className="bg-yellow-900/50 border border-yellow-700/50 text-yellow-200 px-4 py-3 rounded">
                  No reset token found. Please use the link from your email or request a new password reset.
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={!token || loading}
                  className="w-full px-3 py-3 border border-border-color bg-background placeholder-gray-400 text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple sm:text-sm disabled:opacity-50"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="mt-1 text-xs text-foreground/60">Must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground/80 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={!token || loading}
                  className="w-full px-3 py-3 border border-border-color bg-background placeholder-gray-400 text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple sm:text-sm disabled:opacity-50"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!token || loading || password.length < 6 || password !== confirmPassword}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-purple hover:bg-accent-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple disabled:opacity-50 transition-colors"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="text-accent-purple hover:text-accent-purple-dark text-sm transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-screen flex items-center justify-center p-4"><div className="text-lg">Loading...</div></div></Layout>}>
      <ResetPasswordContent />
    </Suspense>
  )
}

