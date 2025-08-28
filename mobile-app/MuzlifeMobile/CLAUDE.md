# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
cd MuzlifeMobile
pnpm start
```
Launches Expo development server for testing on physical devices or simulators.

**Platform-specific development:**
```bash
pnpm run android  # Android emulator/device
pnpm run ios      # iOS simulator (macOS only)
pnpm run web      # Web browser (quick testing)
```

**Build for production:**
```bash
eas build --platform ios      # iOS build
eas build --platform android  # Android build
```

## Project Architecture

This is a **React Native** mobile application using **Expo SDK 53+** that connects to an existing **Next.js 15** backend API.

### Core Stack
- **Framework:** React Native with Expo SDK 53+
- **Navigation:** React Navigation 7 (Stack + Bottom Tabs)
- **State Management:** Zustand stores
- **API Client:** Custom service connecting to Next.js backend
- **Authentication:** JWT tokens with expo-secure-store
- **TypeScript:** Strict typing with shared Prisma models
- **UI Components:** Custom React Native components with StyleSheet API

### Application Structure

**Islamic App Features:**
- **Authentication:** Login/Register with email verification
- **Dashboard:** User statistics and daily citations
- **Quran Reading:** Surah list and reader with audio support
- **Prayer Times:** City-based schedules with Qibla compass
- **Islamic Quiz:** Category-based questions with scoring
- **User Profile:** Settings and preferences management

**Key Directories:**
- `/MuzlifeMobile` - React Native app root
  - `/screens` - App screens organized by feature (Auth, Quran, Prayer, Quiz)
  - `/navigation` - React Navigation setup and type definitions
  - `/services` - API service layer (muzlifeApi.ts)
  - `/store` - Zustand state management (auth, quran, user)
  - `/types` - TypeScript types (mirrors Prisma models)
  - `/components` - Reusable UI components

### Navigation Architecture

**Stack-based navigation with bottom tabs:**
- `AppNavigator` - Root navigation container
- `AuthNavigator` - Authentication flow (Login/Register/Welcome)
- `QuranNavigator` - Quran section (SurahList/Reader/Favorites)
- `PrayerNavigator` - Prayer features (Times/Qibla/Settings)
- `QuizNavigator` - Quiz flow (Categories/Questions/Results)

### API Integration

All API calls go through `services/muzlifeApi.ts`:
- Base URL: `EXPO_PUBLIC_API_URL` environment variable
- JWT authentication with automatic token management
- Error handling with custom ApiError class
- Endpoints mirror Next.js API routes exactly:
  - `/api/auth/*` - Authentication
  - `/api/user/*` - User profile and preferences
  - `/api/dashboard/*` - Statistics
  - `/api/reading/*` - Quran reading progress
  - `/api/quiz/*` - Quiz system
  - `/api/prayer-times` - Prayer schedules

### State Management

**Zustand stores:**
- `authStore` - User authentication, login/logout, session management
- `quranStore` - Surah data, reading progress, favorites
- `userStore` - User statistics and preferences

### Development Notes

**Environment Setup:**
- Development: `EXPO_PUBLIC_API_URL=http://localhost:3000`
- Physical device: Use your machine's IP address instead of localhost
- Example: `EXPO_PUBLIC_API_URL=http://192.168.1.35:3000`

**Current Status:**
- Architecture complete with navigation and stores configured
- Placeholder screens created for all features
- API service fully connected to Next.js backend
- Authentication temporarily bypassed for development (see AppNavigator.tsx lines 114-128)

**React Native vs Next.js Equivalents:**
- `<div>` → `<View>`
- `<p>/<span>` → `<Text>`
- `<button>` → `<TouchableOpacity>`
- `<input>` → `<TextInput>`
- `<img>` → `<Image>`
- `className` → `style={styles.name}`
- TailwindCSS → StyleSheet.create()

**Testing:**
- Use Expo Go app for quick testing on physical devices
- iOS Simulator requires macOS with Xcode
- Android Emulator works on all platforms
- Web testing available but limited (mobile-first design)