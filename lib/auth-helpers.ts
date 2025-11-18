import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== UserRole.ADMIN) {
    redirect("/")
  }
  return user
}

