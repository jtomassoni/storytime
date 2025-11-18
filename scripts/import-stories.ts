import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface StoryJSON {
  title: string
  shortDescription: string
  longDescription?: string
  boyStoryText: string // Boy version of the story (required)
  girlStoryText: string // Girl version of the story (required)
  ageRange: {
    min: number
    max: number
  }
  values: string[]
  topics: string[]
  cultureRegions: string[]
  languageTags: string[]
  contentWarnings: string[]
  representation: {
    primaryChildGenders?: string[]
    otherCharacterTypes?: string[]
    diversityTags?: string[]
  }
  estimatedReadTimeMinutes: number
}

async function importStoriesFromFile(filePath: string) {
  console.log(`\n📖 Importing stories from ${path.basename(filePath)}...`)
  
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const stories: StoryJSON[] = JSON.parse(fileContent)

  let imported = 0
  let skipped = 0
  let errors = 0
  let merged = 0

  for (const storyData of stories) {
    try {
      // Build representation tags
      const representationTags: string[] = []
      if (storyData.representation.primaryChildGenders) {
        representationTags.push(...storyData.representation.primaryChildGenders.map(g => `${g} protagonist`))
      }
      if (storyData.representation.otherCharacterTypes) {
        representationTags.push(...storyData.representation.otherCharacterTypes)
      }
      if (storyData.representation.diversityTags) {
        representationTags.push(...storyData.representation.diversityTags)
      }

      // This is a base story - must have both boyStoryText and girlStoryText
      if (!storyData.boyStoryText || !storyData.girlStoryText) {
        console.log(`  ⚠️  Skipping "${storyData.title}" - missing boyStoryText or girlStoryText`)
        skipped++
        continue
      }

      const existing = await prisma.story.findFirst({
        where: { title: storyData.title },
      })

      if (existing) {
        console.log(`  ⏭️  Skipping "${storyData.title}" (already exists)`)
        skipped++
        continue
      }

      // Create the story with both gender versions
      // Use boyStoryText as fullText (default fallback)
      await prisma.story.create({
        data: {
          title: storyData.title,
          shortDescription: storyData.shortDescription,
          longDescription: storyData.longDescription || null,
          fullText: storyData.boyStoryText, // Use boy version as default fallback
          boyStoryText: storyData.boyStoryText,
          girlStoryText: storyData.girlStoryText,
          minAge: storyData.ageRange.min,
          maxAge: storyData.ageRange.max,
          estimatedReadTimeMinutes: storyData.estimatedReadTimeMinutes,
          valuesTags: storyData.values,
          topicTags: storyData.topics,
          cultureTags: storyData.cultureRegions,
          languageTags: storyData.languageTags,
          contentWarnings: storyData.contentWarnings,
          representationTags: representationTags,
          isActive: true,
        } as any,
      })

      console.log(`  ✅ Imported "${storyData.title}" with boy and girl versions`)
      imported++
    } catch (error) {
      console.error(`  ❌ Error importing "${storyData.title}":`, error)
      errors++
    }
  }

  console.log(`\n📊 Summary for ${path.basename(filePath)}:`)
  console.log(`   ✅ Imported: ${imported}`)
  console.log(`   🔗 Merged: ${merged}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)

  return { imported, skipped, errors, merged }
}

async function main() {
  const batchFiles = [
    'stories-batch-11-20.json',
    'stories-batch-21-30.json',
    'stories-batch-31-40.json',
    'stories-batch-41-50.json',
    'stories-batch-51-60.json',
    'stories-batch-61-70.json',
    'stories-batch-71-80.json',
    'stories-batch-81-90.json',
    'stories-batch-91-100.json',
  ]

  console.log('🚀 Starting story import...\n')

  let totalImported = 0
  let totalSkipped = 0
  let totalErrors = 0
  let totalMerged = 0

  for (const batchFile of batchFiles) {
    const filePath = path.join(process.cwd(), batchFile)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${batchFile}`)
      continue
    }

    const result = await importStoriesFromFile(filePath)
    totalImported += result.imported
    totalSkipped += result.skipped
    totalErrors += result.errors
    totalMerged += result.merged || 0
  }

  console.log('\n' + '='.repeat(50))
  console.log('📈 FINAL SUMMARY')
  console.log('='.repeat(50))
  console.log(`   ✅ Total Imported: ${totalImported}`)
  console.log(`   🔗 Total Merged: ${totalMerged}`)
  console.log(`   ⏭️  Total Skipped: ${totalSkipped}`)
  console.log(`   ❌ Total Errors: ${totalErrors}`)
  console.log('='.repeat(50))
}

main()
  .catch((e) => {
    console.error('Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

