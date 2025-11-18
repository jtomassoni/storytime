"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FaTimes } from "react-icons/fa"

type RegisterModalProps = {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
  plan?: string
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin, plan }: RegisterModalProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      setLoading(false)

      if (result?.error) {
        // Registration succeeded but sign in failed - redirect to login
        setError("Account created! Please sign in.")
        setTimeout(() => {
          handleClose()
          if (onSwitchToLogin) {
            onSwitchToLogin()
          }
        }, 2000)
        return
      }

      // Success - reset form and close
      setName("")
      setEmail("")
      setPassword("")
      setError("")
      onClose()

      // Navigate based on plan or default to home
      if (plan) {
        router.push(`/subscribe/checkout?plan=${plan}`)
      } else {
        router.push("/")
      }
      router.refresh()
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = () => {
    setName("")
    setEmail("")
    setPassword("")
    setError("")
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
          <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
          <button
            onClick={handleClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
              Name (optional)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-3 py-3 border border-border-color bg-background placeholder-gray-400 text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple sm:text-sm"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
              Email address
            </label>
            <input
              id="email"
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-3 py-3 border border-border-color bg-background placeholder-gray-400 text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple sm:text-sm"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-purple hover:bg-accent-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          {onSwitchToLogin && (
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-accent-purple hover:text-accent-purple-dark text-sm transition-colors"
              >
                Already have an account? Sign in
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

