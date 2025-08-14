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
import GamifiedStats from "./GamifiedStats";
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
    <div className="container mx-auto max-w-6xl my-6 bg-black/50 text-white p-4 md:p-6 navbar-safe rounded-xl">
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
                <h1 className="text-3xl font-bold !text-white">
                  Bienvenue, {user.name} !
                </h1>
                <p className="text-gray-400">Tableau de bord de vos performances</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-full hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 border border-blue-400/40 hover:scale-105 flex items-center gap-2.5 backdrop-blur-sm overflow-hidden"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-2.5">
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide">Retour au site</span>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 border border-emerald-400/40 hover:scale-105 flex items-center gap-2.5 backdrop-blur-sm overflow-hidden"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-2.5">
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <User className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide">Mon Profil</span>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-full hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 border border-red-400/40 hover:scale-105 flex items-center gap-2.5 backdrop-blur-sm overflow-hidden"
              >
                {/* Effet de brillance animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Contenu du bouton */}
                <div className="relative flex items-center gap-2.5">
                  <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-semibold text-sm tracking-wide">Se déconnecter</span>
                </div>
                
                {/* Effet de pulsation en arrière-plan */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
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
                  <h1 className="text-xl font-bold !text-white">
                    Bienvenue, {user.name}!
                  </h1>
                  <p className="text-sm text-gray-400">Tableau de bord</p>
                </div>
              </div>
            </div>
            {/* Boutons mobiles en grille */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="group relative w-full px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-400 border border-blue-400/40 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm overflow-hidden"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-2">
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-semibold text-sm">Retour au site</span>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/15 to-blue-400/15 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="group relative w-full px-4 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-xl hover:shadow-xl hover:shadow-green-500/25 transition-all duration-400 border border-emerald-400/40 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm overflow-hidden"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-2">
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <User className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-semibold text-sm">Mon Profil</span>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/15 to-emerald-400/15 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="group relative w-full px-4 py-3 bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all duration-400 border border-red-400/40 hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm overflow-hidden"
              >
                {/* Effet de brillance animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out"></div>
                
                {/* Contenu du bouton */}
                <div className="relative flex items-center gap-2">
                  <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-semibold text-sm">Se déconnecter</span>
                </div>
                
                {/* Effet de pulsation en arrière-plan */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/15 to-red-400/15 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ...existing code for stats cards... */}
        </div>
        {/* Onglets pour Statistiques, Lecture et Quiz */}
        <Tabs defaultValue="gamified" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent backdrop-blur-lg rounded-xl p-1">
            <TabsTrigger value="gamified" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-700">
              🎮 Mes Statistiques
            </TabsTrigger>
            <TabsTrigger value="reading" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-700">
              📖 Lecture du Coran
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-700">
              🧠 Quiz & Tests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gamified" className="space-y-6">
            <GamifiedStats />
          </TabsContent>
          
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
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/70 to-green-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Background animation */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-10 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-600/30 z-10"
            >
              {/* Header avec icône */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Définir votre objectif quotidien
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300"
                >
                  Combien de versets souhaitez-vous lire par jour ?
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Nombre de versets par jour
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newGoal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-200"
                  />
                  
                  {/* Progression actuelle vers l'objectif */}
                  <div className="mt-4 p-4 bg-gray-700/30 rounded-xl backdrop-blur-sm">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span className="font-medium">Progression du jour</span>
                      <span className="font-semibold">
                        {(stats?.readingStats?.todayVerses ?? 0)} / {newGoal} versets
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, Math.round(((stats?.readingStats?.todayVerses ?? 0) / newGoal) * 100))} 
                      className="h-3 bg-gray-600" 
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white rounded-xl transition-all duration-300"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSetGoal}
                    className="group relative flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <span className="relative font-semibold">Confirmer</span>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}