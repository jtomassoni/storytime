import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Replaces em dashes (—) with regular dashes with spaces ( - )
 * This makes the text look more natural and less AI-generated
 */
function cleanEmDashes(text: string | null | undefined): string | null {
  if (!text) return null
  // Replace em dash (—) with regular dash with spaces
  return text.replace(/—/g, ' - ')
}

async function cleanAllStories() {
  console.log('🧹 Starting em dash cleanup...\n')

  try {
    // Fetch all stories
    const stories = await prisma.story.findMany({
      select: {
        id: true,
        title: true,
        shortDescription: true,
        fullText: true,
        boyStoryText: true,
        girlStoryText: true,
      },
    })

    console.log(`📚 Found ${stories.length} stories to check\n`)

    let updated = 0
    let totalReplacements = 0

    for (const story of stories) {
      let needsUpdate = false
      const updates: {
        title?: string
        shortDescription?: string
        fullText?: string
        boyStoryText?: string | null
        girlStoryText?: string | null
      } = {}

      // Check and clean title
      if (story.title.includes('—')) {
        const cleaned = cleanEmDashes(story.title)
        updates.title = cleaned!
        needsUpdate = true
        const count = (story.title.match(/—/g) || []).length
        totalReplacements += count
        console.log(`  📝 "${story.title}" - title has ${count} em dash(es)`)
      }

      // Check and clean shortDescription
      if (story.shortDescription.includes('—')) {
        const cleaned = cleanEmDashes(story.shortDescription)
        updates.shortDescription = cleaned!
        needsUpdate = true
        const count = (story.shortDescription.match(/—/g) || []).length
        totalReplacements += count
        console.log(`  📝 "${story.title}" - shortDescription has ${count} em dash(es)`)
      }

      // Check and clean fullText
      if (story.fullText.includes('—')) {
        const cleaned = cleanEmDashes(story.fullText)
        updates.fullText = cleaned!
        needsUpdate = true
        const count = (story.fullText.match(/—/g) || []).length
        totalReplacements += count
        console.log(`  📝 "${story.title}" - fullText has ${count} em dash(es)`)
      }

      // Check and clean boyStoryText
      if (story.boyStoryText && story.boyStoryText.includes('—')) {
        const cleaned = cleanEmDashes(story.boyStoryText)
        updates.boyStoryText = cleaned
        needsUpdate = true
        const count = (story.boyStoryText.match(/—/g) || []).length
        totalReplacements += count
        console.log(`  📝 "${story.title}" - boyStoryText has ${count} em dash(es)`)
      }

      // Check and clean girlStoryText
      if (story.girlStoryText && story.girlStoryText.includes('—')) {
        const cleaned = cleanEmDashes(story.girlStoryText)
        updates.girlStoryText = cleaned
        needsUpdate = true
        const count = (story.girlStoryText.match(/—/g) || []).length
        totalReplacements += count
        console.log(`  📝 "${story.title}" - girlStoryText has ${count} em dash(es)`)
      }

      // Update the story if needed
      if (needsUpdate) {
        await prisma.story.update({
          where: { id: story.id },
          data: updates,
        })
        updated++
        console.log(`  ✅ Updated "${story.title}"\n`)
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 CLEANUP SUMMARY')
    console.log('='.repeat(50))
    console.log(`   📚 Stories checked: ${stories.length}`)
    console.log(`   ✅ Stories updated: ${updated}`)
    console.log(`   🔄 Total em dashes replaced: ${totalReplacements}`)
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  }
}

cleanAllStories()
  .catch((e) => {
    console.error('Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

