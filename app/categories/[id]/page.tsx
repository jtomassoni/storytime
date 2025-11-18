import { Layout } from "@/components/Layout"
import { prisma } from "@/lib/prisma"
import { StoryCard } from "@/components/StoryCard"
import { AdUnit } from "@/components/AdUnit"
import { getCurrentUser } from "@/lib/auth-helpers"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: { id: string }
}) {
  // Category model doesn't exist in schema - show not found
  notFound()
}

