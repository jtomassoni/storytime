"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { AuthModal } from "@/components/AuthModal"
import { Layout } from "@/components/Layout"

export default function RegisterPage() {
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

