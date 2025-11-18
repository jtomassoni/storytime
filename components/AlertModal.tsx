"use client"

import { useState, useEffect } from "react"

export type AlertModalType = "alert" | "confirm" | "prompt"

export type AlertModalOptions = {
  title?: string
  message: string
  type?: AlertModalType
  confirmText?: string
  cancelText?: string
  defaultValue?: string // For prompt type
  onConfirm?: (value?: string) => void
  onCancel?: () => void
}

type AlertModalProps = {
  isOpen: boolean
  options: AlertModalOptions
  onClose: () => void
}

export function AlertModal({ isOpen, options, onClose }: AlertModalProps) {
  const [inputValue, setInputValue] = useState(options.defaultValue || "")

  useEffect(() => {
    if (isOpen) {
      setInputValue(options.defaultValue || "")
    }
  }, [isOpen, options.defaultValue])

  if (!isOpen) return null

  const {
    title,
    message,
    type = "alert",
    confirmText = type === "prompt" ? "OK" : type === "confirm" ? "Confirm" : "OK",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  } = options

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(type === "prompt" ? inputValue : undefined)
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (type === "alert") {
        handleConfirm()
      } else {
        handleCancel()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card-bg rounded-lg shadow-xl max-w-md w-full p-6 border border-border-color">
        {title && (
          <h2 className="text-xl font-bold mb-4 text-foreground">{title}</h2>
        )}
        <p className="text-foreground/90 mb-6 whitespace-pre-wrap">{message}</p>

        {type === "prompt" && (
          <div className="mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm()
                } else if (e.key === "Escape") {
                  handleCancel()
                }
              }}
              className="w-full px-4 py-2 bg-background border border-border-color rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-accent-purple"
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {(type === "confirm" || type === "prompt") && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-foreground/80 bg-card-bg border border-border-color rounded-lg hover:bg-card-bg/80 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-dark transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for using the modal
export function useAlertModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AlertModalOptions>({ message: "" })

  const showAlert = (message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      setOptions({
        message,
        title,
        type: "alert",
        onConfirm: () => resolve(),
      })
      setIsOpen(true)
    })
  }

  const showConfirm = (
    message: string,
    title?: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        message,
        title,
        type: "confirm",
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        },
      })
      setIsOpen(true)
    })
  }

  const showPrompt = (
    message: string,
    defaultValue?: string,
    title?: string
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setOptions({
        message,
        title,
        type: "prompt",
        defaultValue,
        onConfirm: (value) => {
          resolve(value || null)
        },
        onCancel: () => {
          resolve(null)
        },
      })
      setIsOpen(true)
    })
  }

  const close = () => {
    setIsOpen(false)
    // Reset options after a brief delay to allow animations
    setTimeout(() => {
      setOptions({ message: "" })
    }, 200)
  }

  return {
    AlertModal: () => <AlertModal isOpen={isOpen} options={options} onClose={close} />,
    showAlert,
    showConfirm,
    showPrompt,
  }
}

