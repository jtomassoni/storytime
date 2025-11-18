# Story JSON Format

## Required Format

Each story in the JSON files should have **both** `boyStoryText` and `girlStoryText` fields. The generation script will then create 5-minute and 10-minute versions of each.

## Example Structure

```json
{
  "title": "The Discovery of Carbon Nanotubes",
  "shortDescription": "A story about how scientists discovered carbon nanotubes.",
  "longDescription": "Full description...",
  "boyStoryText": "Little Alex was learning about strong materials. 'What's the strongest material?' he asked...",
  "girlStoryText": "Little Maya was learning about strong materials. 'What's the strongest material?' she asked...",
  "ageRange": {
    "min": 6,
    "max": 9
  },
  "values": ["curiosity", "scientific discovery"],
  "topics": ["science", "history", "technology"],
  "cultureRegions": ["Global"],
  "languageTags": ["en"],
  "contentWarnings": [],
  "representation": {
    "primaryChildGenders": ["boy", "girl"],
    "otherCharacterTypes": ["teacher"],
    "diversityTags": []
  },
  "estimatedReadTimeMinutes": 5
}
```

## Field Descriptions

- **`boyStoryText`** (required): The story version with a boy protagonist
- **`girlStoryText`** (required): The story version with a girl protagonist
- **`fullText`**: Automatically set to `boyStoryText` in database (used as fallback)

## After Import

Once imported, the generation script (`npm run generate:versions`) will create:
- `fullText5Min` and `fullText10Min` (from `fullText`)
- `boyStoryText5Min` and `boyStoryText10Min` (from `boyStoryText`)
- `girlStoryText5Min` and `girlStoryText10Min` (from `girlStoryText`)

## Current Issue

The existing JSON files (like `stories-batch-181-190.json`) only have `storyText` with a single gender version. They need to be updated to include both `boyStoryText` and `girlStoryText` fields.

