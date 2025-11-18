# Bedtime Stories App - Project Context & Living TODO

> **For AI Assistants**: When starting a new chat session, please read this file first to understand the project context, architecture, and conventions. Check the TODO section below for active tasks.

## 🎯 Active TODO - Story Length Versions Feature

### Overview
Generate 5-minute and 10-minute condensed versions for all existing stories (including gender-specific versions). This is a **one-time content generation task** - generate the versions, store them in the database, done.

**Status**: Infrastructure ready ✅ | Content generation: In progress (see `todo.md`)

### Quick Start
1. Add `OPENAI_API_KEY` to `.env`
2. Run: `npm run generate:versions`
3. Track progress in `todo.md`

### Task Breakdown

#### Phase 1: Database Schema Updates ✅ COMPLETE
- [x] **1.1** Update Prisma schema to add length-specific text fields ✅
  - [x] Add `fullText5Min` and `fullText10Min` fields (default versions)
  - [x] Add `boyStoryText5Min`, `boyStoryText10Min` fields (boy versions)
  - [x] Add `girlStoryText5Min`, `girlStoryText10Min` fields (girl versions)
  - [x] Add `estimatedReadTimeMinutes5Min` and `estimatedReadTimeMinutes10Min` fields
  - [x] All new fields are optional (`String?` or `Int?`)
  - [x] File: `prisma/schema.prisma`
- [x] **1.2** Generate and run Prisma migration ✅
  - [x] Run `npm run db:push` - completed successfully
  - [x] Schema changes verified in database

#### Phase 2: Story Generation Infrastructure ✅ COMPLETE
- [x] **2.1** Create API route for generating shorter story versions ✅
  - [x] Create `app/api/admin/stories/[id]/generate-versions/route.ts`
  - [x] Endpoint: `POST /api/admin/stories/[id]/generate-versions`
  - [x] Accept `targetLengths` parameter: `["5min", "10min"]` array
  - [x] Accept `genderVersions` parameter: `["default", "boy", "girl"]` array
  - [x] Uses OpenAI API for AI-powered condensation (requires OPENAI_API_KEY)
  - [x] Preserves story essence, themes, and key plot points
  - [x] Updates database with generated versions
  - [x] Returns success/error status with details
- [x] **2.2** Create helper function for story condensation ✅
  - [x] Create `lib/story-helpers.ts`
  - [x] Function: `generateShortVersion(originalText: string, targetMinutes: number): Promise<string>`
  - [x] Uses OpenAI API to intelligently condense while maintaining story quality
  - [x] Ensures bedtime-appropriate tone is preserved
  - [x] Handles both default and gender-specific versions
  - [x] Includes `generateStoryVersions()` for batch processing

#### Phase 3: Admin UI for Version Generation ✅ COMPLETE
- [x] **3.1** Add version generation controls to admin story edit page ✅
  - [x] Add section in `components/admin/StoryForm.tsx`
  - [x] Buttons: "Generate 5-min version", "Generate 10-min version", "Generate both"
  - [x] Options: Generate for default, boy, girl, or all versions
  - [x] Show loading state during generation
  - [x] Display success/error messages
  - [x] Show which versions already exist
- [ ] **3.2** Add bulk generation page for all stories
  - [ ] Create `app/admin/stories/generate-versions/page.tsx`
  - [ ] List all stories with current version status
  - [ ] Bulk actions: Generate missing versions for all stories
  - [ ] Progress indicator for bulk operations
  - [ ] Filter by story ID range or batch

#### Phase 4: Story Display Updates ✅ COMPLETE
- [x] **4.1** Update StoryReader component to support length selection ✅
  - [x] Add length selector dropdown: "5 min", "10 min", "Full"
  - [x] Update `getStoryText()` to consider selected length
  - [x] Fallback logic: if requested length not available, use closest available
  - [x] Update `estimatedReadTimeMinutes` display based on selected version
  - [x] File: `components/StoryReader.tsx`
- [x] **4.2** Update story page to pass length preference ✅
  - [x] Story page automatically loads all fields (Prisma default behavior)
  - [x] StoryReader receives all length fields automatically
  - [x] File: `app/stories/[id]/page.tsx`

#### Phase 5: Filtering and Sorting by Length ✅ COMPLETE
- [x] **5.1** Add length filter to stories list page ✅
  - [x] Add filter dropdown: "All lengths", "5 min", "10 min", "Full"
  - [x] Filter based on available versions (not just estimatedReadTimeMinutes)
  - [x] File: `app/stories/StoriesPageClient.tsx`
- [x] **5.2** Enhance sorting by read time ✅
  - [x] Sort by available shortest version
  - [x] Sort by available longest version
  - [x] Update sort dropdown options
  - [x] File: `app/stories/StoriesPageClient.tsx`
- [x] **5.3** Update StoryCard to show available lengths ✅
  - [x] Display badges: "5 min", "10 min" based on available versions
  - [x] File: `components/StoryCard.tsx`

#### Phase 6: Batch Generation Script ✅ COMPLETE
- [x] **6.1** Create batch generation script ✅
  - [x] Created `scripts/generate-story-versions.ts`
  - [x] Processes all active stories automatically
  - [x] Generates 5min/10min versions for default/boy/girl (as available)
  - [x] Updates database automatically
  - [x] Shows progress and handles errors
  - [x] Supports dry-run mode for testing
  - [x] Can process in chunks to avoid rate limits
- [ ] **6.2** Run generation (Content Generation Phase)
  - [ ] Add `OPENAI_API_KEY` to `.env`
  - [ ] Run `npm run generate:versions`
  - [ ] Track progress in `todo.md`
  - [ ] Verify quality of generated versions

#### Phase 7: User Preferences
- [ ] **7.1** Add preferred story length to user preferences
  - [ ] Add `preferredStoryLength` field to `UserPreferences` model
  - [ ] Values: `"5min" | "10min" | "full" | null`
  - [ ] Update onboarding preferences page
  - [ ] Update preferences API route
- [ ] **7.2** Apply user preference in story display
  - [ ] Default to user's preferred length when available
  - [ ] Fallback to full version if preferred not available

### Implementation Notes
- **Simple Approach**: One-time content generation - run the script, store results, done
- **Preserve Quality**: Shorter versions maintain story essence, themes, and bedtime-appropriate tone
- **Backward Compatible**: Existing stories without length versions still work (fallback to full text)
- **Progressive Enhancement**: Features work even if some stories don't have all versions yet
- **Track Progress**: Use `todo.md` to mark batches as complete across multiple chat sessions

### Current Status
- **Phase**: Infrastructure Complete ✅ | Content Generation: Ready to Start
- **Completed**: 
  - ✅ Database schema with length-specific fields
  - ✅ AI generation helpers (`lib/story-helpers.ts`)
  - ✅ Batch generation script (`scripts/generate-story-versions.ts`)
  - ✅ Story display with length selection (`components/StoryReader.tsx`)
  - ✅ Filtering/sorting by length (`app/stories/StoriesPageClient.tsx`)
- **Next Steps**: 
  1. Add `OPENAI_API_KEY` to `.env` (get from https://platform.openai.com/api-keys)
  2. Run `npm run generate:versions` to generate all story versions
  3. Track progress in `todo.md` (mark batches as complete)
- **Estimated Stories**: ~160 stories × up to 6 versions = ~960 versions to generate
- **Cost**: Using GPT-4o-mini, roughly a few cents per story (very affordable for one-time generation)

### Simple Usage
```bash
# Generate all versions
npm run generate:versions

# Or process in chunks
npm run generate:versions -- --batch-start=101 --batch-end=110

# Test first
npm run generate:versions -- --dry-run
```

---

## Project Overview

A mobile-first Next.js web application that delivers daily bedtime stories for parents to read to their kids. Stories are created externally using AI and stored/displayed in the app. The MVP focuses on content management, user preferences, feedback collection, and ad-based monetization.

**Key Philosophy**: Stories are created externally (no AI functionality in the app itself). The app is a content delivery and management platform.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (mobile-first design)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js (JWT strategy, credentials provider)
- **Deployment**: Vercel
- **Ads**: Google AdSense (conditional display based on `User.isPaid`)

## Project Structure

```
app/
  admin/              # Admin dashboard (requires ADMIN role)
    categories/       # Category CRUD
    stories/         # Story management (list, create, edit)
    story-of-the-day/ # Story of the Day assignment
  api/               # API routes
    admin/           # Admin-only API routes
    auth/            # Authentication routes
    favorites/       # Favorite story management
    objections/      # Story objection/feedback
    preferences/     # User preferences
  auth/              # Login/register pages
  onboarding/        # User onboarding flow
  stories/           # Public story pages
  categories/        # Category browsing
  favorites/         # User favorites page
components/          # React components
lib/                 # Utilities and helpers
prisma/              # Prisma schema and migrations
scripts/             # Utility scripts (e.g., import-stories.ts)
```

## Database Schema (Prisma)

### Core Models

- **User**: Authentication and user data (`role: USER | ADMIN`, `isPaid: boolean`)
- **Story**: Story content with metadata (tags, age ranges, gender-specific versions)
- **Category**: Story categories (can be auto-generated from tags)
- **UserPreferences**: User onboarding preferences (culture, values, topics to avoid, language)
- **FavoriteStory**: User favorites (many-to-many)
- **StoryObjection**: User feedback/objections on stories
- **StoryOfTheDay**: Daily story assignments
- **StoryReadEvent**: Analytics tracking

### Key Schema Features

- Stories support gender-specific versions: `fullText` (default), `boyStoryText`, `girlStoryText`
- Stories have extensive metadata: `valuesTags`, `topicTags`, `cultureTags`, `languageTags`, `contentWarnings`, `representationTags`
- Categories can be auto-generated (`isAutoGenerated: boolean`, `sourceTag: string`)
- Many-to-many relationships: Story ↔ Category, User ↔ Story (favorites)

## Authentication & Authorization

### NextAuth Configuration
- **Location**: `lib/auth.ts`
- **Strategy**: JWT (no database sessions)
- **Provider**: Credentials (email/password)
- **Session includes**: `id`, `email`, `name`, `role`, `isPaid`

### Auth Helpers
- **`requireAuth()`**: Returns authenticated user or throws (for API routes)
- **`requireAdmin()`**: Requires ADMIN role or throws
- **Location**: `lib/auth-helpers.ts`

### Protected Routes
- Admin routes: Check `user.role === "ADMIN"` in layout/page
- User routes: Check `session` exists
- API routes: Use `requireAuth()` or `requireAdmin()` helpers

## API Route Patterns

### Standard Pattern
```typescript
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth() // or requireAdmin()
    const body = await request.json()
    
    // Validation
    if (!body.requiredField) {
      return NextResponse.json(
        { error: "Required field missing" },
        { status: 400 }
      )
    }
    
    // Database operation
    const result = await prisma.model.create({ data: {...} })
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Operation error:", error)
    return NextResponse.json(
      { error: "Operation failed" },
      { status: 500 }
    )
  }
}
```

### Common Patterns
- Always use `export const dynamic = 'force-dynamic'` for API routes
- Use `requireAuth()` or `requireAdmin()` for auth checks
- Return JSON with `NextResponse.json()`
- Handle errors with try/catch and appropriate status codes
- Use Prisma for all database operations

## Component Patterns

### Client vs Server Components
- **Server Components** (default): Use for data fetching, no interactivity
- **Client Components**: Mark with `"use client"` for hooks, state, interactivity

### Common Components
- **`Layout`**: Main app layout with navigation (client component)
- **`StoryCard`**: Story preview card
- **`StoryReader`**: Story reading interface with objection UI
- **`AdUnit`**: Conditional AdSense ad display (checks `user.isPaid`)
- **`FavoriteButton`**: Toggle favorite status
- **`ObjectionModal`**: Submit story objections
- **`AlertModal`**: Reusable alert/modal component
- **`StoryForm`**: Admin story creation/editing form (supports JSON paste)

## Styling Conventions

### Tailwind CSS
- Mobile-first responsive design
- Custom color scheme defined in `tailwind.config.ts`:
  - `background`, `foreground`, `card-bg`, `border-color`
  - `accent-purple`, `accent-purple-dark`
- Large, readable typography for tired parents
- Calm, bedtime-appropriate color palette

### Common Classes
- Containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Cards: `bg-card-bg border border-border-color rounded-lg p-6`
- Buttons: `bg-accent-purple text-white px-4 py-2 rounded-md hover:bg-accent-purple-dark`

## Ad Display Logic

### Free Tier (Default)
- Shows Google AdSense ads when `user.isPaid === false` or user is anonymous
- Ad locations:
  - Home page (after Today's Story section, near bottom)
  - Story reader pages (under title, near bottom)
  - Story lists (after 3-4 story cards, at bottom)
  - Account page (beneath membership explanation)

### Paid Tier
- No ads displayed when `user.isPaid === true`
- Controlled via `User.isPaid` boolean (billing integration is future work)

### Implementation
- `AdUnit` component checks `session?.user?.isPaid` to conditionally render
- AdSense script loaded in root layout (`app/layout.tsx`)

## Story Management

### Story Creation Flow
1. Admin pastes JSON from external AI generation
2. `StoryForm` parses JSON and prefills form fields
3. Admin can edit/refine metadata
4. Story saved with category assignments
5. Auto-category assignment runs based on tags (`lib/category-helpers.ts`)

### Story Metadata
- **Basic**: `title`, `shortDescription`, `longDescription`, `fullText`
- **Gender Versions**: `boyStoryText`, `girlStoryText` (optional)
- **Age**: `minAge`, `maxAge`, `estimatedReadTimeMinutes`
- **Tags**: `valuesTags`, `topicTags`, `cultureTags`, `languageTags`, `contentWarnings`, `representationTags`
- **Status**: `isActive` (controls visibility)

### Story Display
- Story reader shows appropriate version based on `UserPreferences.preferredGender`
- Falls back to `fullText` if gender-specific version not available
- Supports sentence-level objection UI

## Category System

### Category Types
- **Manual**: Created by admin
- **Auto-generated**: Created automatically from story tags (`isAutoGenerated: true`)

### Auto-Category Generation
- Location: `lib/category-helpers.ts`
- Function: `assignStoryToAutoCategories(storyId)`
- Creates categories from `valuesTags`, `topicTags`, `cultureTags`, `ageRange`
- Uses `sourceTag` to track origin (e.g., `"value:kindness"`, `"topic:adventure"`)

### Category Regeneration
- Admin can regenerate auto-categories via `/admin/categories/regenerate`
- Rebuilds all auto-categories from existing story tags

## User Preferences & Onboarding

### Onboarding Flow
1. User registers → redirected to `/onboarding/preferences`
2. Completes preferences form:
   - Culture/Region focus
   - Preferred values/themes (multi-select)
   - Topics to avoid (multi-select)
   - Language preferences
   - Preferred gender (for story version selection)
3. Preferences saved to `UserPreferences` model
4. Redirected to home page

### Preference Usage
- Influences story recommendations (future work)
- Determines which gender version of story to show
- Used for filtering stories (future work)

## Environment Variables

Required in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: App URL (e.g., `http://localhost:3000`)
- `ADMIN_EMAIL`: Admin account email (seeded)
- `ADMIN_PASSWORD`: Admin account password (seeded)
- `TEST_PARENT_EMAIL`: Test parent account email (seeded)
- `TEST_PARENT_PASSWORD`: Test parent account password (seeded)
- `TEST_PARENT_IS_PAID`: Test parent paid status (default: `false`)
- `OPENAI_API_KEY`: OpenAI API key for story version generation (optional but required for AI features)
  - Get it at: https://platform.openai.com/api-keys
  - Note: ChatGPT Plus subscription is separate from API access. You need to create an API key and may need to add billing credits.

## Common Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:seed          # Seed database (admin + test parent)
npm run import:stories   # Import stories from JSON files
```

## Key Files Reference

### Configuration
- `prisma/schema.prisma`: Database schema
- `tailwind.config.ts`: Tailwind configuration
- `next.config.js`: Next.js configuration
- `package.json`: Dependencies and scripts

### Core Logic
- `lib/auth.ts`: NextAuth configuration
- `lib/auth-helpers.ts`: Auth helper functions
- `lib/prisma.ts`: Prisma client instance
- `lib/category-helpers.ts`: Category auto-assignment logic

### Important Components
- `components/Layout.tsx`: Main app layout
- `components/StoryReader.tsx`: Story reading interface
- `components/admin/StoryForm.tsx`: Admin story form (supports JSON paste)
- `components/AdUnit.tsx`: Conditional ad display

### Important Pages
- `app/page.tsx`: Home page with Story of the Day
- `app/admin/stories/page.tsx`: Admin story list
- `app/stories/[id]/page.tsx`: Story reader page
- `app/onboarding/preferences/page.tsx`: User onboarding

## Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` → `npm run db:push` or `npm run db:migrate`
2. **New API Route**: Create route file in `app/api/` → Use standard pattern with `requireAuth()` or `requireAdmin()`
3. **New Component**: Create in `components/` → Use `"use client"` if needed for interactivity
4. **New Page**: Create in `app/` → Use server components for data fetching when possible

## Common Patterns to Follow

1. **Error Handling**: Always wrap API routes in try/catch, return appropriate status codes
2. **Auth Checks**: Use `requireAuth()` or `requireAdmin()` helpers, don't manually check sessions
3. **Database Queries**: Use Prisma, include necessary relations with `include` or `select`
4. **Type Safety**: Use TypeScript types from Prisma (`Prisma.StoryCreateInput`, etc.)
5. **Mobile-First**: Design for mobile, enhance for desktop
6. **Ad Logic**: Always check `user.isPaid` before showing ads
7. **Story Versions**: Check `preferredGender` preference when displaying stories

## Historical STEM Stories Generation

### Current Status
- **Completed**: Batches 101-260 (160 stories)
- **Remaining**: Batches 261-465 (205 stories needed to reach 365 total)
- **Total Goal**: 365 historical STEM-focused bedtime stories (one for each day of the year)

### Story Format
All stories follow the standard JSON format used by existing batches:
- Located in `stories-batch-XXX-YYY.json` files (10 stories per batch)
- Each story includes: `title`, `shortDescription`, `longDescription`, `storyText`, `ageRange`, `values`, `topics`, `cultureRegions`, `languageTags`, `contentWarnings`, `representation`, `estimatedReadTimeMinutes`
- Stories are STEM-focused: history, science, technology, engineering, mathematics, innovators, discoveries
- Stories are bedtime-appropriate: calming, not scary, suitable for ages 4-9
- Stories are date-based: each story corresponds to a historical event from a specific date

### Topics Covered So Far
- Historical scientists and inventors (Marie Curie, Thomas Edison, Galileo, Newton, Ada Lovelace, etc.)
- Space exploration (moon landing, planets, satellites, black holes, etc.)
- Medical advances (vaccines, antibiotics, organ transplants, etc.)
- Technology (computers, internet, transistors, etc.)
- Material science (crystals, DNA, proteins, etc.)
- Earth science (plate tectonics, atmosphere, oceans, etc.)
- Biology (cells, organs, systems, evolution, etc.)

### To Continue Generation
1. Continue creating batches 261-465 (10 stories per batch)
2. Each batch should cover diverse STEM topics and historical events
3. Stories should be tied to specific dates throughout the year
4. Maintain the same JSON format and quality standards
5. Focus on historical events, not current events
6. Emphasize STEM: science, technology, engineering, mathematics, innovators, discoveries

### Importing Stories
Use the existing import script:
```bash
npm run import:stories
```
This imports stories from all `stories-batch-*.json` files in the root directory.

## Notes for Future Development

- Billing integration is future work (currently `isPaid` is manual)
- AI story generation is external (not in app)
- Story recommendations based on preferences are future work
- Advanced filtering/search is future work
- Child profiles exist in schema but not fully implemented in UI

## When Starting a New Chat Session

1. Read this `CONTEXT.md` file first
2. Review the `README.md` for setup instructions
3. Check `todo.md` for current task status
4. Review relevant files before making changes
5. Follow existing patterns and conventions
6. Test changes thoroughly, especially auth and ad display logic
7. **If continuing story generation**: See "Historical STEM Stories Generation" section above

---

**Last Updated**: Story generation paused at batch 260 (160/365 stories completed)
**Project Status**: MVP Phase 1 complete, ready for testing and refinement

