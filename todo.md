# Story Generation TODO

## Overview
Generate 5-minute and 10-minute versions for all existing stories. This is a one-time content generation task.

**Important**: Stories need both `boyStoryText` and `girlStoryText` in the JSON files. The generation script will then create 5min/10min versions of each.

## Current Issue
The existing JSON files only have `storyText` (single version). They need to be updated to include both `boyStoryText` and `girlStoryText` fields before generation can happen.

See `story-json-format.md` for the expected format.

## Current Status
- **Total Stories**: 91 active stories (found in database)
- **Versions Needed**: Up to 6 versions per story (5min/10min × default/boy/girl)
- **Total Versions**: ~546 versions to generate (91 stories × ~6 versions)
- **Script Status**: ✅ Ready to run (tested with dry-run)

## Progress Tracking

- [ ] **All Stories** (91 stories total)
  - Run: `npm run generate:versions`
  - Or process in chunks if needed
  - Mark complete when done: `[x]`

### Batch Status (Optional - for tracking by JSON file batches)
- [ ] Batch 101-110 (stories-batch-101-110.json)
- [ ] Batch 111-120 (stories-batch-111-120.json)
- [ ] Batch 121-130 (stories-batch-121-130.json)
- [ ] Batch 131-140 (stories-batch-131-140.json)
- [ ] Batch 141-150 (stories-batch-141-150.json)
- [ ] Batch 151-160 (stories-batch-151-160.json)
- [ ] Batch 161-170 (stories-batch-161-170.json)
- [ ] Batch 171-180 (stories-batch-171-180.json)
- [ ] Batch 181-190 (stories-batch-181-190.json)
- [ ] Batch 191-200 (stories-batch-191-200.json)
- [ ] Batch 201-210 (stories-batch-201-210.json)
- [ ] Batch 211-220 (stories-batch-211-220.json)
- [ ] Batch 221-230 (stories-batch-221-230.json)
- [ ] Batch 231-240 (stories-batch-231-240.json)
- [ ] Batch 241-250 (stories-batch-241-250.json)
- [ ] Batch 251-260 (stories-batch-251-260.json)

## Generation Strategy

### Approach
1. Process stories in batches of 10 (one JSON file at a time)
2. For each story:
   - Generate 5-min version of `fullText` (if exists)
   - Generate 10-min version of `fullText` (if exists)
   - Generate 5-min version of `boyStoryText` (if exists)
   - Generate 10-min version of `boyStoryText` (if exists)
   - Generate 5-min version of `girlStoryText` (if exists)
   - Generate 10-min version of `girlStoryText` (if exists)
3. Update database with generated versions
4. Mark batch as complete in this file

### Cost Optimization
- Use GPT-4o-mini (cheapest model)
- Process in batches to avoid rate limits
- Can pause/resume between batches

## How to Generate Versions

### Simple Batch Script (Recommended)
```bash
# Generate all versions for all stories
npm run generate:versions

# Or process specific batches (to avoid rate limits)
npm run generate:versions -- --batch-start=101 --batch-end=110

# Dry run to see what would be generated
npm run generate:versions -- --dry-run
```

The script will:
- Process all active stories
- Generate 5min and 10min versions for default/boy/girl (as available)
- Update the database automatically
- Show progress and errors

### Alternative: Use Admin UI (One Story at a Time)
If you prefer to do it manually, go to `/admin/stories/[id]` and click "Generate All Versions"

## Notes
- All infrastructure is ready (API route, helpers, database schema)
- Requires `OPENAI_API_KEY` in `.env`
- Can work on this across multiple chat sessions - just check this file for progress
