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
  Generates optimized production build and sitemap via `next-sitemap` postbuild hook.

  **Lint code:**
  ```bash
  pnpm run lint
  ```
  Runs Next.js ESLint configuration. Note: ESLint is disabled during builds (`ignoreDuringBuilds: true`) to prevent deployment issues.

  **Database operations:**
  ```bash
  npx prisma generate  # Generate Prisma client
  npx prisma db push   # Push schema changes
  npx prisma studio    # Open database GUI
  ```
  Database client is auto-generated on `pnpm install` via postinstall hook.

  ## Project Architecture

  This is a **Next.js 15** application using the **App Router** architecture with the following key technologies:

  ### Core Stack
  - **Framework:** Next.js 15 with App Router
  - **Database:** MongoDB with Prisma ORM
  - **Authentication:** Custom JWT implementation using `jose` library (not NextAuth)
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
  - `User` - Authentication, profile, and email verification
  - `UserStats` - Comprehensive statistics (reading/quiz/memorization streaks)
  - `QuizResult` - Quiz performance with time tracking and hints
  - `ReadingProgress` - Basic verse-level reading tracking
  - `VerseState` - Detailed per-verse state (read/memorized/favorite)
  - `StudySession` - Detailed study sessions with modes and metrics
  - `UserPreferences` - Audio, display, and study preferences
  - `FavoriteSurah` - User's favorite surahs
  - `Question` - Quiz questions with difficulty levels
  - `Category` - Quiz categories with metadata

  **Authentication System:**
  - Custom JWT implementation using `jose` library (not NextAuth)
  - Context-based state management (`AuthContext`)
  - Token validation with automatic logout on 401/404
  - Email verification system with token-based validation
  - Profile management and password updates
  - `authenticatedFetch` wrapper for all authenticated API calls

  ### Key Directories

  **`/app`** - Next.js App Router pages and API routes
  - `/api/auth` - Login/register/email verification endpoints
  - `/api/quiz` - Quiz questions, categories, and results
  - `/api/reading` - Reading progress tracking and goals
  - `/api/prayer-times` - Prayer schedule API
  - `/api/favorites` - Verse and surah favorites
  - `/api/study` - Study sessions and preferences
  - `/api/user` - Profile and dashboard stats

  **`/components`** - Reusable UI components
  - `/ui` - Base UI components (buttons, cards, inputs, progress bars)
  - `/auth` - Authentication modals and forms
  - `/dashboard` - Stats displays and gamified progress
  - `/study` - Verse cards, audio controls, study settings

  **`/contexts`** - React Context providers
  - `AuthContext` - User authentication, API methods, and state management

  **`/hooks`** - Custom React hooks
  - `useCompass` - Geolocation and Qibla direction
  - `useReadingTracker` - Reading progress management
  - `useAudioManager` - Audio playback controls
  - `useStudySession` - Study session tracking
  - `useUserPreferences` - User settings and preferences
  - `useFavoriteSurahs` - Favorite surahs management
  - `useVerseProgress` - Individual verse progress tracking

  **`/lib`** - Utility functions and data
  - `prisma.ts` - Database client configuration
  - `citations.ts` - Islamic quotes and daily citations
  - `quranSurahUtils.ts` - Surah metadata and verse counting
  - `quizzquestions.ts` - Quiz questions database
  - `utils.ts` - Common utility functions

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
  - 401/404 responses trigger automatic logout via `AuthContext`
  - All authenticated API calls use `authenticatedFetch` wrapper method
  - Email verification required for login (403 status with `requiresVerification`)

  ### Development Notes

  **Build and Deployment:**
  - ESLint is disabled during builds (`ignoreDuringBuilds: true`) to prevent deployment issues
  - Prisma client auto-generates on package installation via postinstall hook
  - Sitemap generation included in build process via `next-sitemap` postbuild hook
  - Multi-platform Prisma binaries configured (native, linux-musl, windows, darwin-arm64)
  - Vercel Analytics is ready but commented out in layout

  **Database and State Management:**
  - MongoDB with ObjectId used for all database records
  - Complex reading tracking system with multiple progress models
  - Study modes: READING, MEMORIZATION, PRONUNCIATION, REVIEW
  - Comprehensive user preferences system for customization

  **Authentication Flow:**
  - JWT tokens stored in localStorage with automatic validation
  - Email verification system with token expiration
  - Automatic logout on token expiry or invalid responses
  - Context-based authentication state across the app

  **Audio System:**
  - Multiple reciter support with playback controls
  - Audio preferences stored per user (speed, auto-play, repeat)
  - Integration with study sessions for pronunciation practice