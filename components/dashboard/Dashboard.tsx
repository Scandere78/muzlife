"use client";

import type { DashboardStats as AuthDashboardStats, ReadingProgress } from "../../contexts/AuthContext";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { Star, Home, User } from "lucide-react";
import ReadingStats from "./ReadingStats";
import ReadingTracker from "./ReadingTracker";
import { Progress } from "../ui/progress";

interface DashboardStats {
  stats: {
    totalQuizzes: number;
    totalPoints: number;
    averageScore: number;
    streakRecord: number;
    favoriteCategory?: string;
  };
  readingStats?: import("./ReadingStats").ReadingStatsType;
  recentReadingProgress?: import("./ReadingStats").RecentProgressEntry[];
  categoryStats?: Record<string, { average: number; total: number }>;
  recentResults?: Array<{
    id: string;
    category: string;
    correctAnswers: number;
    totalQuestions: number;
    score: number;
    percentage: number;
  }>;
}

export default function Dashboard() {
  const { user, getDashboardStats, updateReadingGoal } = useAuth();
  // Correction: utiliser le hook useRouter de Next.js
  // const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<number>(10);

  // Helper to adapt AuthContext DashboardStats to local DashboardStats
  // Correction du typage ESLint : on utilise ReadingProgress pour le mapping
  const adaptDashboardStats = (data: AuthDashboardStats | null): DashboardStats => {
    if (!data) return {
      stats: { totalQuizzes: 0, totalPoints: 0, averageScore: 0, streakRecord: 0 },
      readingStats: undefined,
      recentReadingProgress: [],
      categoryStats: {},
      recentResults: [],
    };
    return {
      stats: {
        totalQuizzes: data.userStats?.totalQuizzes ?? 0,
        totalPoints: data.userStats?.totalPoints ?? 0,
        averageScore: data.userStats?.averageScore ?? 0,
        streakRecord: data.userStats?.streakRecord ?? 0,
        favoriteCategory: data.userStats?.favoriteCategory,
      },
      readingStats: undefined, // Adapt if needed
      recentReadingProgress: (data.recentProgress ?? []).map((entry: ReadingProgress) => ({
        surahName: entry.surahName,
        verseNumber: entry.verseNumber,
        readAt: typeof entry.readAt === "string" ? entry.readAt : (entry.readAt instanceof Date ? entry.readAt.toISOString() : String(entry.readAt)),
      })),
      categoryStats: {}, // Adapt if needed
      recentResults: [], // Adapt if needed
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        const data = await getDashboardStats();
        setStats(adaptDashboardStats(data));
      }
      setLoading(false);
    };
    fetchStats();
  }, [user, getDashboardStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Vous devez être connecté pour accéder au dashboard</div>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleSetGoal = async () => {
    if (newGoal && newGoal >= 1 && newGoal <= 100) {
      const result = await updateReadingGoal(newGoal);
      if (result) {
        setShowGoalModal(false);
        const updatedStats = await getDashboardStats();
        setStats(adaptDashboardStats(updatedStats));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 navbar-safe">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Version Desktop */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-green-600 text-white text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-green-400">
                  Bienvenue, {user.name}!
                </h1>
                <p className="text-gray-400">Tableau de bord de vos performances</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mon Profil
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
          {/* Version Mobile */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-green-600 text-white text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-green-400">
                    Bienvenue, {user.name}!
                  </h1>
                  <p className="text-sm text-gray-400">Tableau de bord</p>
                </div>
              </div>
            </div>
            {/* Boutons mobiles en grille */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mon Profil
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ...existing code for stats cards... */}
        </div>
        {/* Onglets pour Quiz et Lecture */}
        <Tabs defaultValue="reading" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="reading" className="text-white data-[state=active]:bg-green-600">
              📖 Lecture du Coran
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-blue-600">
              🧠 Quiz & Tests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reading" className="space-y-6">
            <ReadingStats
              readingStats={stats?.readingStats ?? null}
              recentProgress={stats?.recentReadingProgress ?? []}
              onSetGoalAction={() => setShowGoalModal(true)}
            />
            <ReadingTracker
              surahNumber={1}
              surahName="Al-Fatiha"
              onVerseRead={async () => {
                const updatedStats = await getDashboardStats();
                setStats(adaptDashboardStats(updatedStats));
              }}
            />
          </TabsContent>
          <TabsContent value="quiz" className="space-y-6">
            {/* ...existing code for quiz performance... */}
          </TabsContent>
        </Tabs>
        {/* Catégorie Favorite */}
        {stats?.stats?.favoriteCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2" />
                  Catégorie Favorite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.stats.favoriteCategory}
                </div>
                <p className="text-green-100">
                  Votre thème de prédilection basé sur vos performances
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Modal pour définir l'objectif */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">Définir votre objectif quotidien</h3>
              <p className="text-gray-400 mb-6">
                Combien de versets souhaitez-vous lire par jour ?
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de versets par jour
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newGoal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {/* Progression actuelle vers l'objectif */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progression</span>
                      <span>
                        {(stats?.readingStats?.todayVerses ?? 0)} / {newGoal} versets
                      </span>
                    </div>
                    <Progress value={Math.min(100, Math.round(((stats?.readingStats?.todayVerses ?? 0) / newGoal) * 100))} className="h-2" />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSetGoal}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}