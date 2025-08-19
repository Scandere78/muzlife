// Types API pour l'application mobile Muzlife
// Réutilise les modèles Prisma de l'API Next.js existante

export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  preferredReciter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  id: string;
  userId: string;
  consecutiveReadingDays: number;
  totalReadingSessions: number;
  totalReadingTime: number;
  averageReadingTime: number;
  totalVersesRead: number;
  uniqueVersesRead: number;
  totalSurahsStarted: number;
  totalSurahsCompleted: number;
  currentReadingStreak: number;
  longestReadingStreak: number;
  lastReadingDate?: string;
  readingGoalDailyMinutes: number;
  readingGoalWeeklyDays: number;
  quizTotalQuestions: number;
  quizCorrectAnswers: number;
  quizCurrentStreak: number;
  quizLongestStreak: number;
  lastQuizDate?: string;
  memorizationTotalVerses: number;
  memorizationCurrentStreak: number;
  memorizationLongestStreak: number;
  lastMemorizationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  hintsUsed: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  completedAt: string;
  createdAt: string;
}

export interface ReadingProgress {
  id: string;
  userId: string;
  surahNumber: number;
  verseNumber: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerseState {
  id: string;
  userId: string;
  surahNumber: number;
  verseNumber: number;
  isRead: boolean;
  isMemorized: boolean;
  isFavorite: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  surahNumber: number;
  mode: 'READING' | 'MEMORIZATION' | 'PRONUNCIATION' | 'REVIEW';
  startTime: string;
  endTime?: string;
  duration?: number;
  versesStudied: number;
  completionRate: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  reciter: string;
  audioSpeed: number;
  autoPlay: boolean;
  repeatMode: boolean;
  showTranslation: boolean;
  showTajweed: boolean;
  arabicFont: string;
  arabicFontSize: number;
  themePreference: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  prayerReminders: boolean;
  studyReminders: boolean;
  reminderTimes: string[];
  language: string;
  location?: string;
  longitude?: number;
  latitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteSurah {
  id: string;
  userId: string;
  surahNumber: number;
  surahName: string;
  addedAt: string;
}

export interface Question {
  id: string;
  categoryId: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  explanation?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

// Types pour les requêtes API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// Types pour les heures de prière
export interface PrayerTimes {
  city: string;
  country: string;
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Types pour les sourates
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Verse {
  number: number;
  text: string;
  translation?: string;
  transliteration?: string;
}