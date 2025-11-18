"use client"

import { useState } from "react"
import { StoryObjectionReason } from "@prisma/client"
import { useAlertModal } from "./AlertModal"

type ObjectionModalProps = {
  storyId: string
  sentenceIndex: number
  textSpan: string
  onClose: () => void
}

const REASONS: { value: StoryObjectionReason; label: string }[] = [
  { value: "TOO_SCARY", label: "Too scary" },
  { value: "NOT_AGE_APPROPRIATE", label: "Not age appropriate" },
  { value: "CULTURAL_MISMATCH", label: "Cultural mismatch" },
  { value: "LANGUAGE_ISSUE", label: "Language issue" },
  { value: "OTHER", label: "Other" },
]

export function ObjectionModal({
  storyId,
  sentenceIndex,
  textSpan,
  onClose,
}: ObjectionModalProps) {
  const { AlertModal, showAlert } = useAlertModal()
  const [reason, setReason] = useState<StoryObjectionReason>("OTHER")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/objections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          sentenceIndex,
          textSpan,
          reason,
          comment: comment || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to submit feedback")
        setLoading(false)
        return
      }

      onClose()
      await showAlert("Thank you for your feedback!")
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-lg shadow-xl max-w-md w-full p-6 border border-border-color">
        <h2 className="text-xl font-bold mb-4 text-foreground">Report an issue</h2>
        <p className="text-foreground/70 mb-4 text-sm bg-card-bg/50 p-3 rounded border border-border-color">
          &ldquo;{textSpan}&rdquo;
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as StoryObjectionReason)}
              className="w-full px-3 py-2 border border-border-color bg-card-bg text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple"
              required
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Additional comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border-color bg-card-bg text-foreground rounded-md focus:outline-none focus:ring-accent-purple focus:border-accent-purple placeholder-gray-400"
              placeholder="Tell us more about the issue..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground/80 bg-card-bg border border-border-color rounded-lg hover:bg-card-bg/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <AlertModal />
    </div>
  )
}

