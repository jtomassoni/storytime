/**
 * Simple batch script to generate 5-min and 10-min versions for all stories.
 * 
 * Usage: tsx scripts/generate-story-versions.ts [--batch-start=101] [--batch-end=110] [--dry-run]
 * 
 * This processes stories and updates the database. Can be run in chunks to avoid rate limits.
 */

import { prisma } from "../lib/prisma"
import { generateStoryVersions } from "../lib/story-helpers"

async function main() {
  const args = process.argv.slice(2)
  const batchStart = parseInt(args.find(a => a.startsWith('--batch-start='))?.split('=')[1] || '101')
  const batchEnd = parseInt(args.find(a => a.startsWith('--batch-end='))?.split('=')[1] || '260')
  const dryRun = args.includes('--dry-run')

  console.log(`\n📚 Story Version Generator`)
  console.log(`Batch range: ${batchStart}-${batchEnd}`)
  console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}\n`)

  // Get all stories
  const stories = await prisma.story.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      title: true,
      fullText: true,
      boyStoryText: true,
      girlStoryText: true,
    },
  })

  console.log(`Found ${stories.length} active stories\n`)

  let processed = 0
  let success = 0
  let errors = 0

  for (const story of stories) {
    processed++
    
    // Determine which versions to generate
    const genderVersions: ("default" | "boy" | "girl")[] = ["default"]
    if (story.boyStoryText) genderVersions.push("boy")
    if (story.girlStoryText) genderVersions.push("girl")

    console.log(`[${processed}/${stories.length}] Processing: "${story.title}"`)
    console.log(`  Versions to generate: ${genderVersions.join(", ")}`)

    if (dryRun) {
      console.log(`  [DRY RUN] Would generate 5min and 10min versions\n`)
      continue
    }

    try {
      const result = await generateStoryVersions(story.id, {
        targetLengths: ["5min", "10min"],
        genderVersions,
      })

      if (result.errors.length > 0) {
        console.log(`  ⚠️  Generated ${result.generated.length} versions with ${result.errors.length} errors:`)
        result.errors.forEach(err => {
          console.log(`     - ${err.version}: ${err.error}`)
        })
        errors++
      } else {
        console.log(`  ✅ Generated ${result.generated.length} versions`)
        success++
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
      errors++
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Processed: ${processed}`)
  console.log(`   Success: ${success}`)
  console.log(`   Errors: ${errors}`)
}

main()
  .catch((e) => {
    console.error("Fatal error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

