"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthModal } from "@/components/AuthModal"
import { Layout } from "@/components/Layout"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || undefined

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <AuthModal
          isOpen={true}
          onClose={() => {
            router.push("/")
          }}
          initialMode="register"
          plan={plan}
        />
      </div>
    </Layout>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div></Layout>}>
      <RegisterContent />
    </Suspense>
  )
}

