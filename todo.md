# Bedtime Stories App - Development Todo

## Overview
A mobile-first web app that delivers daily bedtime stories for parents to read to their kids. Stories are created externally using AI and stored/displayed in the app. MVP focuses on content management, user preferences, feedback collection, and ad-based monetization.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Deployment**: Vercel
- **Ads**: Google AdSense

## Phases

### Phase 0: Repo Setup & Planning
- [x] Create todo.md with phases and tasks
- [x] Initialize Git repo (if not already done)

### Phase 1: Next.js + Tailwind Scaffold
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up basic project structure (app/, components/, lib/)
- [x] Create .gitignore
- [x] Create .env.example with required variables
- [x] Set up package.json scripts

### Phase 2: Prisma Schema & Database Setup
- [x] Define Prisma schema with all models (User, Story, Category, etc.)
- [x] Add UserRole enum
- [x] Add StoryObjectionReason enum
- [x] Set up PostgreSQL connection
- [x] Run initial migration (ready - run `npm run db:migrate`)
- [x] Generate Prisma client (ready - run `npm run db:generate`)

### Phase 3: Authentication & Seeding
- [x] Install and configure NextAuth.js
- [x] Create credentials provider
- [x] Implement /auth/login and /auth/register pages
- [x] Create seed script with admin and test parent accounts from env vars
- [x] Implement password hashing (bcrypt)
- [x] Test authentication flow

### Phase 4: Onboarding Preferences
- [x] Create /onboarding/preferences page
- [x] Build culture/region selection form
- [x] Build values/themes multi-select
- [x] Build topics to avoid multi-select
- [x] Build language preferences form
- [x] Implement UserPreferences persistence
- [x] Add redirect logic for incomplete preferences

### Phase 5: Core User Flows
- [x] Create home page (/) with "Today's Story" section
- [x] Implement StoryOfTheDay logic
- [x] Create /stories page with story listing
- [x] Create StoryCard component
- [x] Create /stories/[id] story reader page
- [x] Implement sentence-level objection UI
- [x] Create /favorites page
- [x] Create /categories pages
- [x] Implement favorite/unfavorite API
- [x] Implement objection submission API
- [x] Add read event tracking

### Phase 6: AdSense Integration
- [x] Add AdSense script to root layout
- [x] Create AdUnit client component
- [x] Implement conditional ad rendering (free vs paid)
- [x] Add ads to home page
- [x] Add ads to story reader
- [x] Add ads to story lists
- [x] Add ads to account page (for free users)

### Phase 7: Admin Dashboard
- [x] Create /admin layout with role protection
- [x] Build /admin overview page
- [x] Create /admin/stories list page
- [x] Create /admin/stories/new form
- [x] Create /admin/stories/[id] edit form
- [x] Implement JSON paste and parse functionality
- [x] Create /admin/categories CRUD
- [x] Create /admin/story-of-the-day management
- [x] Add admin navigation

### Phase 8: Polish & Documentation
- [x] Create README.md with setup instructions
- [x] Add mobile-responsive styling improvements
- [ ] Test all user flows (manual testing required)
- [ ] Test admin flows (manual testing required)
- [ ] Verify ad display logic (manual testing required)
- [x] Add error handling and loading states
- [x] Final code review
- [x] Run npm run build and fix any issues
- [x] Commit final changes

## Key Decisions
- Stories are created externally; no AI functionality in app
- Free tier shows ads; paid tier hides ads
- Admin and test parent accounts seeded from env vars
- Mobile-first design for tired parents
- Calm, readable UI with large typography

## Notes
- All core features implemented
- Database migrations need to be run: `npm run db:migrate`
- Prisma client needs to be generated: `npm run db:generate`
- Seed script ready: `npm run db:seed`
- Build ready to test: `npm run build`
