# Story Generation Prompt for Bedtime Stories App

## Task
Generate 100 bedtime stories for children with complete metadata. Each story should be appropriate for bedtime reading, engaging, and suitable for the specified age ranges.

## Output Format
Generate stories as a JSON array. Each story should follow this exact structure:

```json
{
  "title": "Story Title",
  "shortDescription": "A brief one-sentence description (50-100 characters)",
  "longDescription": "One or two paragraphs describing the story, its tone, themes, and what makes it special (optional but recommended)",
  "storyText": "The complete story text. Should be multiple paragraphs, suitable for read-aloud. Aim for 500-1500 words depending on age range. Use clear paragraph breaks.",
  "ageRange": {
    "min": 3,
    "max": 8
  },
  "values": ["kindness", "courage", "friendship"],
  "topics": ["bedtime", "animals", "adventure"],
  "cultureRegions": ["Global", "European"],
  "languageTags": ["en"],
  "contentWarnings": [],
  "representation": {
    "primaryChildGenders": ["girl", "boy"],
    "otherCharacterTypes": ["parent", "animal"],
    "diversityTags": ["diverse characters"]
  },
  "estimatedReadTimeMinutes": 5
}
```

## Field Guidelines

### Required Fields

- **title**: Engaging, child-friendly title (5-10 words)
- **shortDescription**: One sentence summary (50-100 characters)
- **storyText**: Complete story content (500-1500 words, multiple paragraphs)
- **ageRange.min**: Minimum age (typically 3-6)
- **ageRange.max**: Maximum age (typically 6-12)
- **values**: Array of values taught (e.g., "kindness", "courage", "curiosity", "friendship", "honesty", "perseverance", "empathy", "gratitude", "respect", "cooperation")
- **topics**: Array of topics/themes (e.g., "bedtime", "animals", "forest", "magic", "siblings", "friendship", "adventure", "nature", "dreams", "family")
- **cultureRegions**: Array of cultural regions (e.g., "Global", "European", "Asian", "African", "Latin American", "Middle Eastern", "North American", "Indigenous")
- **languageTags**: Array, typically ["en"] for English
- **representation.primaryChildGenders**: Array of child protagonist genders (e.g., ["girl"], ["boy"], ["girl", "boy"], ["non-binary"])
- **representation.otherCharacterTypes**: Array of other characters (e.g., ["parent"], ["grandparent"], ["animal"], ["magical creature"], ["friend"])
- **representation.diversityTags**: Array of diversity indicators (e.g., ["diverse characters"], ["mixed-race family"], ["single parent"], ["extended family"], ["disabled character"], ["LGBTQ+ family"])

### Optional Fields

- **longDescription**: Extended description (1-2 paragraphs)
- **contentWarnings**: Array of warnings if needed (e.g., ["mild_scary"], ["separation_anxiety"], ["mild_conflict"]). Most stories should have empty array [].
- **estimatedReadTimeMinutes**: Estimated reading time (typically 3-10 minutes, calculate based on ~200 words per minute)

## Story Requirements

### Content Guidelines

1. **Age Appropriateness**:
   - Ages 3-5: Simple language, short sentences, repetitive elements, 300-600 words
   - Ages 5-7: More complex sentences, simple plots, 600-1000 words
   - Ages 7-10: More sophisticated vocabulary, longer narratives, 1000-1500 words
   - Ages 10-12: Complex themes, richer language, 1200-2000 words

2. **Bedtime Appropriate**:
   - Calming, soothing tone
   - Resolve conflicts peacefully
   - End with comfort, safety, or peaceful resolution
   - Avoid intense action, violence, or scary elements
   - Promote relaxation and sleep

3. **Diversity**:
   - Vary protagonist genders, ethnicities, family structures
   - Include diverse cultural backgrounds
   - Represent different abilities and family types
   - Mix traditional and modern settings

4. **Values & Themes**:
   - Each story should teach 2-4 positive values
   - Values should be naturally woven into the narrative
   - Avoid preachy or moralistic tone
   - Show values through actions and consequences

5. **Story Structure**:
   - Clear beginning, middle, end
   - Engaging opening that draws readers in
   - Age-appropriate conflict or challenge
   - Satisfying resolution
   - Comforting conclusion suitable for bedtime

### Topic Variety

Ensure variety across these themes:
- Animal adventures (20-25 stories)
- Magical/fantasy elements (15-20 stories)
- Nature and outdoor adventures (15-20 stories)
- Family and sibling stories (10-15 stories)
- Friendship stories (10-15 stories)
- Problem-solving adventures (10-15 stories)
- Cultural tales from different regions (10-15 stories)
- Dream and imagination stories (5-10 stories)

### Age Range Distribution

- Ages 3-5: ~25 stories
- Ages 4-7: ~30 stories
- Ages 6-9: ~25 stories
- Ages 8-12: ~20 stories

## Example Story

```json
{
  "title": "The Moonlit Forest Adventure",
  "shortDescription": "Two siblings follow fireflies to a magical clearing where they learn about kindness.",
  "longDescription": "A gentle bedtime tale that follows Maya and Leo as they discover a hidden world of fireflies in their backyard forest. The story emphasizes the importance of kindness, curiosity, and the wonder of nature. Perfect for winding down before sleep with its soothing imagery and peaceful resolution.",
  "storyText": "Maya and Leo sat by their bedroom window, watching the stars twinkle in the night sky. 'Look!' Maya whispered, pointing to tiny lights dancing in the forest behind their house.\n\n'Fireflies!' Leo exclaimed, his eyes wide with wonder.\n\nThe two siblings tiptoed downstairs, careful not to wake their parents. They slipped out the back door and followed the glowing lights into the forest.\n\nThe fireflies led them deeper and deeper, until they reached a clearing bathed in moonlight. In the center stood an ancient oak tree, its branches reaching toward the stars.\n\n'Hello, little ones,' a gentle voice said. A wise old owl perched on a low branch, her golden eyes kind and warm.\n\n'We followed the fireflies,' Maya explained.\n\nThe owl smiled. 'They brought you here because you have kind hearts. Would you like to hear a secret?'\n\nMaya and Leo nodded eagerly.\n\n'The forest remembers every act of kindness,' the owl said. 'When you help a friend, plant a seed, or care for an animal, the forest grows stronger. And tonight, you showed kindness by following the fireflies gently, without trying to catch them.'\n\nLeo looked at his hands. 'I wanted to catch one, but I didn't.'\n\n'That was very kind of you,' the owl said. 'Now, close your eyes and listen.'\n\nThe children closed their eyes. They heard the gentle rustle of leaves, the soft chirping of crickets, and the whisper of the wind. It was like a lullaby.\n\nWhen they opened their eyes, the owl was gone, but the fireflies danced around them in a beautiful circle, their lights pulsing like tiny stars.\n\n'It's time to go home,' Maya said softly.\n\nThe fireflies led them back to their house, lighting the way. As Maya and Leo climbed back into bed, they could still see the gentle glow of the fireflies through their window.\n\n'Goodnight, forest,' Leo whispered.\n\n'Goodnight, fireflies,' Maya added.\n\nAnd as they drifted off to sleep, they dreamed of magical forests and kind hearts, knowing that kindness always finds its way home.",
  "ageRange": {
    "min": 4,
    "max": 7
  },
  "values": ["kindness", "curiosity", "respect for nature"],
  "topics": ["bedtime", "siblings", "forest", "magic", "animals"],
  "cultureRegions": ["Global"],
  "languageTags": ["en"],
  "contentWarnings": [],
  "representation": {
    "primaryChildGenders": ["girl", "boy"],
    "otherCharacterTypes": ["parent", "animal"],
    "diversityTags": ["siblings"]
  },
  "estimatedReadTimeMinutes": 5
}
```

## Output Instructions

1. Generate exactly 100 unique stories
2. Ensure variety in:
   - Age ranges
   - Protagonist types
   - Cultural backgrounds
   - Themes and topics
   - Story lengths
   - Values taught
3. Output as a JSON array: `[{story1}, {story2}, ..., {story100}]`
4. Each story must be complete and ready to use
5. Ensure all stories are appropriate for bedtime (calming, peaceful endings)
6. Vary the complexity based on age range
7. Include diverse representation across all stories

## Quality Checklist

Before finalizing, ensure each story:
- ✅ Has a clear, engaging title
- ✅ Includes complete storyText (500-1500 words)
- ✅ Has appropriate age range
- ✅ Teaches 2-4 positive values
- ✅ Has calming, bedtime-appropriate tone
- ✅ Ends with peaceful, comforting resolution
- ✅ Includes diverse representation
- ✅ Has accurate estimatedReadTimeMinutes
- ✅ Uses appropriate language for age range
- ✅ Is unique and different from other stories

## Notes

- Stories will be read aloud to children at bedtime
- Content should promote positive values and emotional well-being
- Avoid scary elements, violence, or intense conflict
- Focus on wonder, kindness, friendship, and gentle adventures
- Cultural stories should be respectful and authentic
- Representation matters - ensure diverse characters across all stories

---

**Generate 100 stories following these guidelines and output as a JSON array.**

