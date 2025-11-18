# Bedtime Stories App

A mobile-first web application that delivers daily bedtime stories for parents to read to their kids. Stories are created externally using AI and stored/displayed in the app.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Deployment**: Vercel
- **Ads**: Google AdSense

## Features

### MVP (Phase 1)

- Story storage and display with structured metadata
- Admin dashboard for manual story and metadata management
- User authentication and preferences
- Onboarding survey for culture, values, and language preferences
- Favorites system
- Story objection/feedback system
- Google AdSense integration (free tier shows ads, paid tier hides ads)
- Story of the Day feature
- Category-based browsing

### Future (Phase 2+)

- AI-generated stories driven by history, preferences, and age progression
- Advanced memberships and personalizations
- Billing integration for paid tier

## Setup Guide

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google AdSense account (for ads)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd bedtimestories
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A random secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000` for local dev)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: Admin account credentials (will be seeded)
- `TEST_PARENT_EMAIL`, `TEST_PARENT_PASSWORD`, `TEST_PARENT_IS_PAID`: Test parent account

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed admin and test parent accounts
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Admin Account

The admin account is seeded from environment variables:
- Email: Set via `ADMIN_EMAIL`
- Password: Set via `ADMIN_PASSWORD`
- Role: ADMIN
- Default `isPaid`: false

Log in at `/auth/login` to access the admin dashboard at `/admin`.

## Test Parent Account

A test parent account is seeded for quick testing:
- Email: Set via `TEST_PARENT_EMAIL`
- Password: Set via `TEST_PARENT_PASSWORD`
- Role: USER
- `isPaid`: Set via `TEST_PARENT_IS_PAID` (default: false)

Use this account to test:
- User features (favorites, objections, preferences)
- Ad display behavior (free vs paid)

## Onboarding Flow

After signup, new users are redirected to `/onboarding/preferences` to complete:
- Culture/Region focus
- Values & themes preferences
- Topics to avoid
- Language preferences

These preferences influence story recommendations and filtering.

## Story Metadata Model

Stories include comprehensive metadata for targeting and filtering:

- **Basic Info**: title, shortDescription, longDescription, fullText
- **Age Range**: minAge, maxAge
- **Read Time**: estimatedReadTimeMinutes
- **Tags**: valuesTags, topicTags, cultureTags, languageTags
- **Content Warnings**: contentWarnings array
- **Representation**: representationTags array
- **Categories**: Multiple category associations

### Example JSON for External AI Output

When generating stories externally, use this structure:

```json
{
  "title": "The Moonlit Forest Adventure",
  "shortDescription": "A gentle bedtime tale about two siblings who follow fireflies to a magical clearing.",
  "longDescription": "One or two paragraphs describing the story, tone, and themes.",
  "storyText": "Full story text here. Multiple paragraphs for read-aloud.",
  "ageRange": {
    "min": 4,
    "max": 7
  },
  "values": ["kindness", "courage", "curiosity"],
  "topics": ["bedtime", "siblings", "forest", "magic"],
  "cultureRegions": ["European", "Global"],
  "settings": ["forest", "small village"],
  "languageTags": ["en"],
  "contentWarnings": ["mild_scary"],
  "representation": {
    "primaryChildGenders": ["girl", "boy"],
    "otherCharacterTypes": ["parent", "magical creature"],
    "diversityTags": ["mixed-race family"]
  }
}
```

The admin dashboard supports pasting this JSON and parsing it to prefill form fields.

## Ad Behavior

### Free Tier (Default)
- Shows Google AdSense ads on:
  - Home page (after Today's Story section, near bottom)
  - Story reader pages (under title, near bottom)
  - Story lists (after 3-4 story cards, at bottom)
  - Account page (beneath membership explanation)
- Anonymous users are treated as free tier

### Paid Tier
- No ads displayed
- Controlled via `User.isPaid` boolean
- Billing integration is future work

## Admin Dashboard

Access at `/admin` (requires ADMIN role):

- **Stories**: Create, edit, and manage stories
  - Supports JSON paste and parse
  - Full metadata editing
  - Category assignment
- **Categories**: CRUD for story categories
- **Story of the Day**: Assign stories to specific dates

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/preferences` - Save user preferences
- `POST /api/favorites/toggle` - Toggle favorite status
- `GET /api/favorites/check` - Check if story is favorited
- `POST /api/objections` - Submit story objection/feedback
- Admin routes under `/api/admin/*` (require ADMIN role)

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:seed       # Seed database
```

## Project Structure

```
app/
  admin/          # Admin dashboard pages
  api/            # API routes
  auth/           # Authentication pages
  onboarding/    # Onboarding flow
  stories/        # Story pages
  categories/     # Category pages
components/       # React components
lib/              # Utilities and helpers
prisma/           # Prisma schema and migrations
```

## License

Private project - All rights reserved

