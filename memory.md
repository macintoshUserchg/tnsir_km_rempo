# Dr. Kirodi Lal Meena Constituency Website - Project Memory

## Project Overview
A full-stack Next.js 16+ constituency website for Dr. Kirodi Lal Meena (Rajasthan-10 Constituency, Rajya Sabha MP).

**Tech Stack:**
- Next.js 16.1.6 (App Router, Turbopack)
- TypeScript
- Prisma 7.3.0 + PostgreSQL
- NextAuth.js v5 (Credentials)
- next-intl (Hindi-first i18n)
- shadcn/ui components
- Tailwind CSS

## Database Connection
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/km_db
```

## Admin Credentials
- **Email:** `admin@drkiodilal.in`
- **Password:** `admin123`

## Phase Completion Status

### ✅ Phase 1: Project Setup
- Next.js 14+ with TypeScript, Tailwind, App Router
- PostgreSQL via Docker
- Prisma ORM initialized
- next-intl for Hindi/English localization
- shadcn/ui component library

### ✅ Phase 2: Database Modeling
- Models: User, Vidhansabha, WorkType, CitizenApp, ActivityLog, PressRelease, BlogPost, TimelineEvent
- Seed script with sample data
- Prisma 7 adapter pattern for PostgreSQL

### ✅ Phase 3: Public Interface
- Homepage with hero, quick links
- Biography page with timeline
- Contact page with form
- Press Release list/detail with pagination
- Blog list/detail with pagination

### ✅ Phase 4: Visitor Application System
- Application form (Citizen/Representative toggle)
- Zod validation with Hindi error messages
- Server actions for submission
- CNumber generation (YYYYMMDD-RANDOM format)

### ✅ Phase 5: Admin Panel
- NextAuth.js v5 credentials authentication
- Dashboard with stats cards
- Applications list with filters + detail view
- Status update with activity logging
- Press Releases CMS
- Blogs CMS
- Reports page with analytics

### ✅ Phase 6: Advanced Features
- Analytics dashboard with Recharts (Bar, Pie, Line charts)
- Excel export functionality for filtered lists
- WhatsApp/SMS integration (placeholder)

### ✅ Phase 7: Admin-Only Application System
- Shifted application submission to admin-only workflow
- Added `Document` model for file uploads
- File upload API for PDFs and Images
- New "New Application" page for admins
- Updated public `/apply` page to informational only

### ✅ Phase 8: Admin Dashboard UI Enhancement
- **Dashboard:** Gradient stat cards, quick stats row, improved list visuals
- **Applications:** Card-based list layout, status color bars, enhanced filters
- **Details:** Section headers, document previews, timeline activity log
- **CMS Pages:** Consistent card-based design for Press Releases & Blogs
- **Reports:** Improved chart visualizations and quick stats
- **Settings:** New settings page with profile and system info

### ✅ Phase 9: Code Refactoring and Optimization
- **Component Modularity:** Refactored `AdminApplicationForm.tsx` into smaller, reusable components: `ApplicationFormFields.tsx` and `DocumentUploadSection.tsx`.
- **Reusable Components:** Extracted `ApplicationStatusBadge.tsx` for consistent status display across the dashboard and application list/detail pages.
- **Server Actions Optimization:** Consolidated application submission logic into a shared private function `createApplicationRecord` to reduce duplication.
- **Database Performance:** Optimized dashboard and application list queries using Prisma's `groupBy` for status counting, significantly reducing the number of database calls.
- **Type Safety:** Enhanced validation schemas using Zod in `src/lib/validations/application.ts`.

### ✅ Phase 10: UX Refinements & Search
- **Hindi Transliteration:** Integrated `react-transliterate` into `ApplicationFormFields.tsx` for enhanced Hindi typing support on Name, Father's Name, and Address fields.
- **Unified Search & Filter:** 
  - Created `ApplicationSearch.tsx` client component.
  - Implemented real-time search with **Hindi transliteration support**.
  - Replaced pill filters with a consolidated **Status Dropdown** that displays application counts per status.
  - Added debounce logic (750ms) to search input to optimize performance.
- **Enhanced Validation Feedback:** 
  - Restored robust `ZodError` handling in `application.ts` server actions.
  - Integrated `sonner` toast notifications for immediate success/error feedback on form submission.
- **Performance Fixes:** resolved infinite loop issues in search component by optimizing `useEffect` dependency tracking.

## Key Files Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                    # Homepage
│   │   ├── (public)/
│   │   │   ├── biography/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── press-release/
│   │   │   ├── blog/
│   │   │   └── apply/page.tsx
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       └── (dashboard)/
│   │           ├── dashboard/page.tsx
│   │           ├── applications/
│   │           │   ├── page.tsx
│   │           │   ├── [id]/page.tsx
│   │           │   └── new/page.tsx     # New App Form
│   │           ├── press-releases/
│   │           ├── blogs/
│   │           ├── reports/page.tsx
│   │           └── settings/page.tsx    # New Settings Page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── export/applications/route.ts
│   │   │   └── upload/route.ts
│   └── actions/
│       ├── application.ts
│       ├── admin.ts
│       └── cms.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   │   └── ApplicationForm.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminApplicationForm.tsx
│   │   ├── ApplicationFormFields.tsx    # [NEW] Application fields
│   │   ├── DocumentUploadSection.tsx    # [NEW] File upload logic
│   │   ├── ApplicationStatusBadge.tsx   # [NEW] Reusable status badge
│   │   ├── StatusUpdateForm.tsx
│   │   └── charts/                     # Recharts components
│   └── ui/                             # shadcn components
├── lib/
│   ├── auth.ts                         # NextAuth config
│   ├── db.ts                           # Prisma client
│   └── validations/application.ts       # Zod schemas
├── i18n/
│   ├── routing.ts
│   ├── navigation.ts
│   └── request.ts
└── types/
    └── next-auth.d.ts
```

## Prisma Schema Models
- User (SUPER_ADMIN, ADMIN roles)
- Vidhansabha (constituency mapping)
- WorkType (application categories)
- CitizenApp (citizen applications)
- Document (file uploads)
- ActivityLog (status change history)
- PressRelease (CMS)
- BlogPost (CMS)
- TimelineEvent (biography timeline)

## URLs
- **Public:** http://localhost:3000/hi
- **Admin Login:** http://localhost:3000/hi/admin/login
- **Dashboard:** http://localhost:3000/hi/admin/dashboard

## Build Status
✅ **Project Stable**
- Admin UI fully enhanced with modern design
- All pages verified and building successfully
- Server Actions use `'use server'` to ensure Prisma compatibility

## Best Practices
- **Localization:** Always use `isHindi` logic from `locale` for bilingual support.
- **Database:** Use `groupBy` for status counting to minimize database calls.
- **Components:** Extract complex form logic into smaller files (e.g., `AdminApplicationForm`).
