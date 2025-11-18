"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { AuthModal } from "@/components/AuthModal"
import { Layout } from "@/components/Layout"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || undefined
  const registered = searchParams.get("registered") === "true"

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <AuthModal
          isOpen={true}
          onClose={() => {
            if (callbackUrl) {
              router.push(callbackUrl)
            } else {
              router.push("/")
            }
          }}
          initialMode={registered ? "register" : "login"}
          callbackUrl={callbackUrl}
        />
      </div>
    </Layout>
  )
}

