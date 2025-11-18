import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

// Create sample stories for testing
const SAMPLE_STORIES = [
  {
    title: "The Moonlit Forest Adventure",
    shortDescription: "A gentle bedtime tale about two siblings who follow fireflies to a magical clearing.",
    fullText: `Once upon a time, in a small village nestled at the edge of a great forest, lived two siblings named Emma and Leo. Every evening, as the sun dipped below the horizon, they would sit by their window and watch the forest come alive with twinkling lights.

One special night, the fireflies seemed to dance in a pattern, forming a glowing path into the forest. Emma, who was seven, turned to her five-year-old brother Leo and whispered, "Should we follow them?"

Their parents were reading downstairs, and the children knew they should stay in bed. But the fireflies' dance was so beautiful, so inviting, that they couldn't resist.

Quietly, they slipped out of their room and tiptoed down the stairs. The front door creaked softly as they opened it, and they stepped into the warm summer night.

The fireflies led them deeper into the forest than they had ever been before. The path glowed softly, and the night air was filled with the gentle sounds of crickets and rustling leaves.

After walking for what felt like both moments and forever, they arrived at a clearing. In the center stood an ancient oak tree, its branches reaching toward the starry sky. The fireflies gathered around the tree, creating a soft, golden light.

As Emma and Leo approached, they noticed something magical: the tree seemed to hum with a gentle melody. They sat beneath its branches, feeling safe and peaceful.

"Look," Leo whispered, pointing upward. The stars seemed to twinkle brighter, and Emma realized they were forming patterns - constellations that told stories of friendship, courage, and wonder.

They sat there for a long time, listening to the tree's gentle song and watching the stars dance. Eventually, they felt their eyelids grow heavy, and they knew it was time to return home.

The fireflies led them back, lighting their way through the forest. When they reached their house, they slipped back inside and climbed into bed, their hearts full of the magic they had witnessed.

The next morning, their parents asked about their dreams. Emma and Leo smiled, knowing that some adventures were meant to be shared only in whispers, remembered in the quiet moments before sleep.

And every night after that, they would look out their window, knowing that the forest held magic for those brave enough to follow the light.`,
    minAge: 4,
    maxAge: 8,
    estimatedReadTimeMinutes: 5,
    valuesTags: ["kindness", "curiosity", "adventure"],
    topicTags: ["bedtime", "forest", "siblings", "magic"],
    isActive: true,
  },
  {
    title: "The Kindness Garden",
    shortDescription: "A story about a little girl who plants seeds of kindness that grow into something beautiful.",
    fullText: `In a small town where everyone knew everyone, there lived a little girl named Maya. Maya loved to help others, but she often wondered if her small acts of kindness really mattered.

One spring morning, Maya's grandmother gave her a special packet of seeds. "These are kindness seeds," her grandmother explained. "Plant them with love, and watch what happens."

Maya wasn't sure what kindness seeds were, but she trusted her grandmother. She found a small patch of earth in her backyard and carefully planted the seeds, watering them every day and talking to them about all the kind things she hoped to do.

Weeks passed, and nothing seemed to grow. Maya felt disappointed, but her grandmother encouraged her to keep trying. "Kindness takes time," she said.

One day, Maya noticed a tiny green sprout pushing through the soil. As the days went by, more sprouts appeared, and soon the patch was filled with beautiful flowers of every color imaginable.

But the real magic happened when Maya shared the flowers with her neighbors. Each person who received a flower seemed to smile brighter, and soon, acts of kindness began spreading throughout the town.

The baker started giving extra cookies to children. The mail carrier helped elderly neighbors with their groceries. Children started sharing their toys more freely.

Maya realized that her small garden had grown into something much bigger - a garden of kindness that spread throughout her entire community. The flowers in her garden multiplied, and she found that the more she gave, the more she had to give.

Her grandmother smiled knowingly. "You see, Maya," she said, "kindness is like a seed. When you plant it with love, it grows and spreads, touching everyone around you."

Maya learned that day that no act of kindness is ever too small. Every smile, every helping hand, every kind word plants a seed that can grow into something beautiful.

And as she fell asleep that night, surrounded by the gentle fragrance of her kindness garden, Maya knew that she would continue planting seeds of kindness wherever she went.`,
    minAge: 5,
    maxAge: 9,
    estimatedReadTimeMinutes: 6,
    valuesTags: ["kindness", "empathy", "community"],
    topicTags: ["garden", "grandmother", "sharing"],
    isActive: true,
  },
  {
    title: "The Brave Little Star",
    shortDescription: "A story about a star who learns that being brave doesn't mean never being afraid.",
    fullText: `High up in the night sky, among millions of other stars, lived a little star named Sparkle. Sparkle was smaller than the other stars, and she often felt afraid of the dark space around her.

While the other stars twinkled confidently, Sparkle would hide behind clouds, too scared to shine her light. "What if I'm not bright enough?" she would whisper to herself.

One night, a shooting star passed by and noticed Sparkle hiding. "Why are you hiding?" the shooting star asked gently.

"I'm afraid," Sparkle admitted. "I'm small, and the darkness is so big. What if I get lost?"

The shooting star smiled. "Being brave doesn't mean never being afraid," it said. "Being brave means shining your light even when you're scared."

That night, Sparkle took a deep breath and peeked out from behind the cloud. She began to shine, tentatively at first, then brighter and brighter.

As she shone, she noticed something wonderful: her light helped other stars find their way. A lost constellation used her light to navigate. A sleepy moon smiled at her brightness. Even the darkness seemed less scary when she faced it with her own light.

Sparkle learned that her small light mattered more than she ever imagined. She wasn't the biggest or brightest star, but she was brave, and that made all the difference.

From that night on, Sparkle shone proudly, knowing that being brave meant being herself, even when it was scary. And every night, she would remind herself: "I am small, but I am brave, and my light matters."

The other stars began to notice Sparkle's courage, and they started calling her "The Brave Little Star." Sparkle learned that courage wasn't about being fearless - it was about shining your light even when you're afraid.

And as she twinkled in the night sky, she knew that her small, brave light was making the world a little brighter, one night at a time.`,
    minAge: 4,
    maxAge: 8,
    estimatedReadTimeMinutes: 5,
    valuesTags: ["courage", "bravery", "self-confidence"],
    topicTags: ["stars", "night", "fear", "bedtime"],
    isActive: true,
  },
]

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const created = []
    for (const story of SAMPLE_STORIES) {
      const existing = await prisma.story.findFirst({
        where: { title: story.title },
      })

      if (!existing) {
        const newStory = await prisma.story.create({
          data: story,
        })
        created.push(newStory.title)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} sample stories`,
      created,
    })
  } catch (error) {
    console.error("Error creating sample stories:", error)
    return NextResponse.json(
      { error: "Failed to create sample stories" },
      { status: 500 }
    )
  }
}

