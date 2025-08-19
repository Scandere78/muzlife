// Types pour React Navigation avec TypeScript strict

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  QuranReader: { 
    surahNumber: number; 
    surahName: string;
  };
  QuizScreen: { 
    categoryId: string; 
    categoryName: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  };
  Profile: undefined;
  Settings: undefined;
  PrayerTimes: {
    city?: string;
  };
  QiblaCompass: undefined;
  WuduGuide: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Quran: undefined;
  Prayer: undefined;
  Quiz: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EmailVerification: {
    email: string;
  };
};

export type QuranStackParamList = {
  SurahList: undefined;
  SurahReader: {
    surahNumber: number;
    surahName: string;
  };
  Favorites: undefined;
  ReadingStats: undefined;
};

export type QuizStackParamList = {
  Categories: undefined;
  QuizScreen: {
    categoryId: string;
    categoryName: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  };
  QuizResults: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  };
  QuizHistory: undefined;
};

export type PrayerStackParamList = {
  PrayerTimes: {
    city?: string;
  };
  QiblaCompass: undefined;
  PrayerSettings: undefined;
  WuduGuide: undefined;
};

// Déclaration globale pour le type checking
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}