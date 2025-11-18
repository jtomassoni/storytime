import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Admin account
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10)
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        hashedPassword: hashedAdminPassword,
        role: UserRole.ADMIN,
      },
      create: {
        email: adminEmail,
        hashedPassword: hashedAdminPassword,
        role: UserRole.ADMIN,
        isPaid: false,
      },
    })
    console.log(`✓ Admin account created/updated: ${adminEmail}`)
  } else {
    console.log('⚠ ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin account')
  }

  // Test parent account
  const testParentEmail = process.env.TEST_PARENT_EMAIL
  const testParentPassword = process.env.TEST_PARENT_PASSWORD
  const testParentIsPaid = process.env.TEST_PARENT_IS_PAID === 'true'

  if (testParentEmail && testParentPassword) {
    const hashedTestPassword = await bcrypt.hash(testParentPassword, 10)
    const testParent = await prisma.user.upsert({
      where: { email: testParentEmail },
      update: {
        hashedPassword: hashedTestPassword,
        isPaid: testParentIsPaid,
      },
      create: {
        email: testParentEmail,
        hashedPassword: hashedTestPassword,
        role: UserRole.USER,
        isPaid: testParentIsPaid,
      },
    })
    console.log(`✓ Test parent account created/updated: ${testParentEmail} (isPaid: ${testParentIsPaid})`)

    // Create basic preferences for test parent
    await prisma.userPreferences.upsert({
      where: { userId: testParent.id },
      update: {},
      create: {
        userId: testParent.id,
        cultureRegion: 'Global',
        preferredValues: ['kindness', 'courage'],
        avoidTopics: [],
        languagePrefs: ['en'],
      },
    })
    console.log(`✓ Test parent preferences created`)
  } else {
    console.log('⚠ TEST_PARENT_EMAIL or TEST_PARENT_PASSWORD not set, skipping test parent account')
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

