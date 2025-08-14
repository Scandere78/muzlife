"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';

interface GamifiedStatsData {
  // Statistiques de lecture
  totalVersesRead: number;
  todayVersesRead: number;
  weekVersesRead: number;
  readingStreak: number;
  readingGoal: number;
  
  // Statistiques de mémorisation
  totalVersesMemorized: number;
  memorizationStreak: number;
  lastMemorizedDate: Date | string | null;
  memorizationLevel: number;
  
  // Sourates favorites
  favoriteSurahs: Array<{
    id: string;
    surahNumber: number;
    surahName: string;
    addedAt: Date | string;
  }>;
  
  // Versets favoris (top 5)
  favoriteVerses: Array<{
    surahNumber: number;
    verseNumber: number;
    surahName: string;
    isFavorite: boolean;
    readCount: number;
  }>;
  
  // Sessions d'étude
  studyStats: {
    totalSessions: number;
    totalStudyTime: number; // en minutes
    averageSessionTime: number;
    memorizationTime: number;
    readingTime: number;
  };
  
  // Progression globale
  globalProgress: {
    totalQuranVerses: number;
    readProgress: number; // pourcentage
    memorizedProgress: number; // pourcentage
  };
  
  // Badges/Achievements
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
  }>;
  
  // Statistiques supplémentaires de l'API
  totalStudyTimeMinutes: number;
  favoriteVersesCount: number;
  completedSessionsCount: number;
}

export default function GamifiedStats() {
  const { authenticatedFetch } = useAuth();
  const [stats, setStats] = useState<GamifiedStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamifiedStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser la nouvelle API optimisée
      const response = await authenticatedFetch('/api/dashboard/gamified-stats');
      
      if (!response) {
        throw new Error('Erreur de connexion');
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Vérifier si la réponse contient un message d'erreur
      if (data.message && !data.totalVersesRead && data.message !== 'Success') {
        throw new Error(data.message);
      }
      
      // Les données sont déjà au bon format
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      
      // Données par défaut pour éviter un écran vide
      setStats({
        totalVersesRead: 0,
        todayVersesRead: 0,
        weekVersesRead: 0,
        readingStreak: 0,
        readingGoal: 10,
        totalVersesMemorized: 0,
        memorizationStreak: 0,
        lastMemorizedDate: null,
        memorizationLevel: 1,
        favoriteSurahs: [],
        favoriteVerses: [],
        studyStats: {
          totalSessions: 0,
          totalStudyTime: 0,
          averageSessionTime: 0,
          memorizationTime: 0,
          readingTime: 0,
        },
        globalProgress: {
          totalQuranVerses: 6236,
          readProgress: 0,
          memorizedProgress: 0,
        },
        achievements: [
          {
            id: 'first_verse',
            name: 'Premier Verset',
            description: 'Lire votre premier verset',
            icon: '📖',
            unlocked: false,
          },
        ],
        totalStudyTimeMinutes: 0,
        favoriteVersesCount: 0,
        completedSessionsCount: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    fetchGamifiedStats();
  }, [fetchGamifiedStats]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-blue-500 to-blue-600';
    if (percentage >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-800/50 animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-gray-800/50">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Erreur lors du chargement des statistiques</p>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
          <button 
            onClick={fetchGamifiedStats}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Message d'erreur si présent */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-100 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Données chargées par défaut. {error}</span>
          </div>
        </motion.div>
      )}

      {/* Message d'encouragement pour nouveaux utilisateurs */}
      {stats.totalVersesRead === 0 && stats.totalVersesMemorized === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 text-green-100 px-6 py-4 rounded-xl"
        >
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-lg">Bienvenue dans votre parcours coranique ! 🌟</p>
              <p className="text-sm text-green-200 mt-1">
                Commencez à lire vos premiers versets pour débloquer des achievements et suivre votre progression.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progression Globale du Coran */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-gray-800/20 via-gray-700/30 to-gray-800/20 backdrop-blur-lg border border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold !text-white flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              Progression dans le Coran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Progression Lecture */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Versets Lus</span>
                  <span className="text-white font-bold">
                    {stats.totalVersesRead.toLocaleString()} / 6,236
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={stats.globalProgress.readProgress} 
                    className="h-4 bg-gray-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${getProgressColor(stats.globalProgress.readProgress)} rounded-full transition-all duration-500`} 
                       style={{ width: `${stats.globalProgress.readProgress}%` }}></div>
                </div>
                <p className="text-sm text-gray-400">
                  {stats.globalProgress.readProgress.toFixed(1)}% du Coran exploré
                </p>
              </div>

              {/* Progression Mémorisation */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Versets Mémorisés</span>
                  <span className="text-white font-bold">
                    {stats.totalVersesMemorized.toLocaleString()} / 6,236
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={stats.globalProgress.memorizedProgress} 
                    className="h-4 bg-gray-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500`} 
                       style={{ width: `${stats.globalProgress.memorizedProgress}%` }}></div>
                </div>
                <p className="text-sm text-gray-400">
                  {stats.globalProgress.memorizedProgress.toFixed(1)}% du Coran mémorisé
                </p>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 pt-4 border-t border-gray-600/30">
              <div className="text-center p-3 sm:p-4 bg-gray-700/20 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.todayVersesRead}</div>
                <p className="text-xs sm:text-sm text-gray-400">Aujourd'hui</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-700/20 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.weekVersesRead}</div>
                <p className="text-xs sm:text-sm text-gray-400">Cette semaine</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-700/20 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-orange-400">{stats.readingStreak}</div>
                <p className="text-xs sm:text-sm text-gray-400">Jours consécutifs</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-700/20 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">{stats.memorizationStreak}</div>
                <p className="text-xs sm:text-sm text-gray-400">Streak mémorisation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-gray-800/20 via-gray-700/30 to-gray-800/20 backdrop-blur-lg border border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold !text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {stats.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                      : 'bg-gray-700/30 border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className={`text-sm sm:text-base font-semibold !text-white ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    )}
                  </div>
                  
                  {achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progression</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress! / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sessions d'Étude */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-gray-800/20 via-gray-700/30 to-gray-800/20 backdrop-blur-lg border border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold !text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              Sessions d'Étude
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-5 bg-gray-700/30 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">
                  {stats.studyStats.totalSessions}
                </div>
                <p className="text-sm sm:text-base text-gray-300 font-medium">Sessions Totales</p>
                <p className="text-xs text-gray-500 mt-1">Depuis le début</p>
              </div>

              <div className="text-center p-4 sm:p-5 bg-gray-700/30 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                  {formatTime(stats.studyStats.totalStudyTime)}
                </div>
                <p className="text-sm sm:text-base text-gray-300 font-medium">Temps Total</p>
                <p className="text-xs text-gray-500 mt-1">D'étude</p>
              </div>

              <div className="text-center p-4 sm:p-5 bg-gray-700/30 rounded-xl col-span-1 sm:col-span-2 lg:col-span-1">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
                  {formatTime(stats.studyStats.averageSessionTime)}
                </div>
                <p className="text-sm sm:text-base text-gray-300 font-medium">Moyenne/Session</p>
                <p className="text-xs text-gray-500 mt-1">Par session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sourates Favorites */}
      {stats.favoriteSurahs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-gray-800/20 via-gray-700/30 to-gray-800/20 backdrop-blur-lg border border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-bold !text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-600 to-pink-700 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                Sourates Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.favoriteSurahs.slice(0, 6).map((surah) => (
                  <div
                    key={surah.id}
                    className="p-3 bg-gray-700/40 rounded-lg border border-gray-600/30 hover:border-red-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {surah.surahNumber}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{surah.surahName}</p>
                        <p className="text-gray-400 text-xs">
                          Ajoutée {new Date(surah.addedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Versets Favoris */}
      {stats.favoriteVerses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-gray-800/20 via-gray-700/30 to-gray-800/20 backdrop-blur-lg border border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-bold !text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </div>
                Versets Favoris les Plus Lus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.favoriteVerses.map((verse, index) => (
                  <div
                    key={`${verse.surahNumber}-${verse.verseNumber}`}
                    className="p-3 bg-gray-700/40 rounded-lg border border-gray-600/30 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {verse.surahName} - Verset {verse.verseNumber}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Lu {verse.readCount} fois
                          </p>
                        </div>
                      </div>
                      <div className="text-purple-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}