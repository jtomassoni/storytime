"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthModal } from "@/components/AuthModal"
import { Layout } from "@/components/Layout"

function LoginContent() {
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

export default function LoginPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div></Layout>}>
      <LoginContent />
    </Suspense>
  )
}

