import fs from 'fs'
import path from 'path'

/**
 * Replaces em dashes (—) with regular dashes with spaces ( - )
 */
function cleanEmDashes(text: string | null | undefined): string | null {
  if (!text) return text
  return text.replace(/—/g, ' - ')
}

/**
 * Recursively clean em dashes from an object
 */
function cleanObject(obj: any): any {
  if (typeof obj === 'string') {
    return cleanEmDashes(obj)
  } else if (Array.isArray(obj)) {
    return obj.map(cleanObject)
  } else if (obj && typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanObject(value)
    }
    return cleaned
  }
  return obj
}

async function cleanJsonFile(filePath: string) {
  console.log(`\n📖 Cleaning ${path.basename(filePath)}...`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`)
    return { cleaned: 0, replaced: 0 }
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const stories = JSON.parse(content)
  
  let totalReplacements = 0
  let storiesCleaned = 0

  // Count em dashes before cleaning
  const beforeCount = (content.match(/—/g) || []).length

  // Clean the stories
  const cleanedStories = cleanObject(stories)

  // Count em dashes after cleaning
  const afterContent = JSON.stringify(cleanedStories, null, 2)
  const afterCount = (afterContent.match(/—/g) || []).length

  if (beforeCount > 0) {
    // Write back the cleaned content
    fs.writeFileSync(filePath, afterContent, 'utf-8')
    storiesCleaned = Array.isArray(cleanedStories) ? cleanedStories.length : 1
    totalReplacements = beforeCount
    console.log(`  ✅ Cleaned ${beforeCount} em dash(es) from ${storiesCleaned} story/stories`)
  } else {
    console.log(`  ✓ No em dashes found`)
  }

  return { cleaned: storiesCleaned, replaced: totalReplacements }
}

async function main() {
  console.log('🧹 Starting JSON file em dash cleanup...\n')

  // Find all story batch JSON files
  const batchFiles = fs.readdirSync(process.cwd())
    .filter(file => file.startsWith('stories-batch-') && file.endsWith('.json'))
    .sort()

  if (batchFiles.length === 0) {
    console.log('⚠️  No story batch JSON files found')
    return
  }

  console.log(`📚 Found ${batchFiles.length} JSON file(s) to check\n`)

  let totalCleaned = 0
  let totalReplaced = 0

  for (const batchFile of batchFiles) {
    const filePath = path.join(process.cwd(), batchFile)
    const result = await cleanJsonFile(filePath)
    totalCleaned += result.cleaned
    totalReplaced += result.replaced
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 JSON CLEANUP SUMMARY')
  console.log('='.repeat(50))
  console.log(`   📁 Files checked: ${batchFiles.length}`)
  console.log(`   ✅ Stories cleaned: ${totalCleaned}`)
  console.log(`   🔄 Total em dashes replaced: ${totalReplaced}`)
  console.log('='.repeat(50))
}

main().catch((e) => {
  console.error('Cleanup failed:', e)
  process.exit(1)
})

