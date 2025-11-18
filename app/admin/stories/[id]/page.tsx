import { prisma } from "@/lib/prisma"
import { StoryForm } from "@/components/admin/StoryForm"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditStoryPage({
  params,
}: {
  params: { id: string }
}) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
  })

  if (!story) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Story</h1>
      <StoryForm story={story} />
    </div>
  )
}

