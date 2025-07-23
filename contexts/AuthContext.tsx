"use client";

import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string | Date;
}

interface QuizResult {
  score: number;
  category: string;
  difficulty: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  timeSpent?: number;
  hintsUsed?: number;
}

export interface ReadingProgress {
  id: string;
  userId: string;
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  readingTime: number;
  readAt: string | Date;
}

interface UserStats {
  totalQuizzes: number;
  totalPoints: number;
  averageScore: number;
  totalVersesRead: number;
  readingStreak: number;
  dailyGoal: number;
  streakRecord?: number;
  favoriteCategory?: string;
}

export interface DashboardStats {
  userStats: UserStats;
  recentProgress: ReadingProgress[];
  dailyStats: Record<string, number>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedUser: User) => void;
  saveQuizResult: (result: QuizResult) => Promise<boolean>;
  getDashboardStats: () => Promise<DashboardStats | null>;
  recordReadingProgress: (surahNumber: number, verseNumber: number, surahName: string, readingTime?: number) => Promise<ReadingProgress | null>;
  getReadingProgress: () => Promise<DashboardStats | null>;
  updateReadingGoal: (dailyGoal: number) => Promise<UserStats | null>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        const isValid = await checkTokenValidity();
        if (isValid) {
          setUser(JSON.parse(userData));
        }
      }
      setLoading(false);
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch {
      return { success: false, error: "Erreur de connexion" };
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch {
      return { success: false, error: "Erreur d'inscription" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const checkTokenValidity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 404 || response.status === 401) {
        logout();
        return false;
      }
      return response.ok;
    } catch {
      return false;
    }
  };

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
      if (response.status === 404 || response.status === 401) {
        logout();
        return null;
      }
      return response;
    } catch {
      return null;
    }
  };

  const saveQuizResult = async (result: QuizResult) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/quiz/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const updateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const getDashboardStats = async (): Promise<DashboardStats | null> => {
    try {
      const response = await authenticatedFetch("/api/user/profile");
      if (response && response.ok) {
        // Le backend renvoie tout le user (profil, stats, quizResults, readingProgress)
        const userData = await response.json();
        // Pour compatibilité avec Dashboard, on adapte le format attendu
        return {
          userStats: userData.stats,
          recentProgress: userData.readingProgress,
          dailyStats: userData.dailyStats || {},
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const recordReadingProgress = async (
    surahNumber: number,
    verseNumber: number,
    surahName: string,
    readingTime = 0
  ): Promise<ReadingProgress | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/reading/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ surahNumber, verseNumber, surahName, readingTime }),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  };

  const getReadingProgress = async (): Promise<DashboardStats | null> => {
    try {
      const response = await authenticatedFetch("/api/reading/progress");
      if (response && response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  };

  const updateReadingGoal = async (dailyGoal: number): Promise<UserStats | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/reading/goal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dailyGoal }),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    saveQuizResult,
    getDashboardStats,
    recordReadingProgress,
    getReadingProgress,
    updateReadingGoal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
