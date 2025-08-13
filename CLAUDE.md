  # CLAUDE.md

  This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

  ## Development Commands

  **Start development server:**
  ```bash
  pnpm run dev
  ```
  Uses Next.js with Turbopack for faster development builds.

  **Build for production:**
  ```bash
  pnpm run build
  ```
  Generates optimized production build and sitemap.

  **Lint code:**
  ```bash
  pnpm run lint
  ```
  Runs Next.js ESLint configuration. Note: ESLint is disabled during builds (`ignoreDuringBuilds: true`).

  **Database operations:**
  ```bash
  npx prisma generate  # Generate Prisma client
  npx prisma db push   # Push schema changes
  npx prisma studio    # Open database GUI
  ```
  Database client is auto-generated on `npm install` via postinstall hook.

  ## Project Architecture

  This is a **Next.js 15** application using the **App Router** architecture with the following key technologies:

  ### Core Stack
  - **Framework:** Next.js 15 with App Router
  - **Database:** MongoDB with Prisma ORM
  - **Authentication:** JWT tokens with localStorage persistence
  - **Styling:** TailwindCSS 4.x with dark mode support
  - **UI Components:** Radix UI primitives + custom components
  - **Icons:** Lucide React + React Icons
  - **Animations:** Framer Motion + Lottie animations

  ### Application Structure

  **Islamic App Features:**
  - **Prayer Times:** City-based prayer schedules with Qibla compass
  - **Quran Reading:** Surah navigation with reading progress tracking
  - **Audio Recitation:** Multiple reciter support with audio controls
  - **Islamic Quiz:** Category-based questions with scoring system
  - **User Dashboard:** Reading stats, quiz results, and streaks
  - **Wudu Tutorial:** Step-by-step ablution guide

  **Data Models (Prisma):**
  - `User` - Authentication and profile data
  - `UserStats` - Reading/quiz statistics and streaks
  - `QuizResult` - Quiz scores and performance
  - `ReadingProgress` - Verse-level reading tracking
  - `Question` - Quiz questions with categories
  - `Category` - Quiz categories organization

  **Authentication System:**
  - Custom JWT implementation (not NextAuth)
  - Context-based state management (`AuthContext`)
  - Token validation with automatic logout on 401/404
  - Profile management and password updates

  ### Key Directories

  **`/app`** - Next.js App Router pages and API routes
  - `/api/auth` - Login/register endpoints
  - `/api/quiz` - Quiz questions and results
  - `/api/reading` - Reading progress tracking
  - `/api/prayer-times` - Prayer schedule API

  **`/components`** - Reusable UI components
  - `/ui` - Base UI components (buttons, cards, inputs)
  - `/auth` - Authentication modals and forms
  - `/dashboard` - Stats and progress components

  **`/contexts`** - React Context providers
  - `AuthContext` - User authentication and API methods

  **`/hooks`** - Custom React hooks
  - `useCompass` - Geolocation and heading detection
  - `useReadingTracker` - Reading progress management

  **`/lib`** - Utility functions and data
  - `prisma.ts` - Database client configuration
  - `citations.ts` - Islamic quotes and sayings
  - `quranSurahUtils.ts` - Surah metadata and utilities

  ### Theme and Styling

  - **Dark/Light Mode:** Class-based (`class` strategy) stored in cookies
  - **Arabic Font:** Amiri font family for Arabic text
  - **Background:** Islamic calligraphy background image
  - **Responsive:** Mobile-first design with custom breakpoints

  ### API Patterns

  All authenticated endpoints expect:
  ```typescript
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
  ```

  Error handling follows consistent pattern:
  - 401/404 triggers automatic logout
  - All API calls use `authenticatedFetch` wrapper

  ### Development Notes

  - ESLint is disabled during builds to prevent deployment issues
  - Prisma client auto-generates on package installation
  - Vercel Analytics is ready but commented out in layout
  - MongoDB ObjectId used for all database records
  - Reading progress tracks verse-level completion
  - Quiz system supports multiple categories and difficulties