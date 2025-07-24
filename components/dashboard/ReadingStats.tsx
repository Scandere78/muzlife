// Types stricts pour les stats quiz
type CategoryStat = {
  average: number;
  total: number;
};
type QuizResult = {
  id: string | number;
  category: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  percentage: number;
};
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Target, Calendar, Flame, Clock, BarChart3, Award, Star } from 'lucide-react';

export interface ReadingStatsType {
  todayVerses: number;
  weekVerses: number;
  streak: number;
  totalVerses: number;
  dailyGoal: number;
  goalProgress: number;
  currentPosition: { surah: number; verse: number };
  categoryStats?: Record<string, { average: number; total: number }>;
  recentResults?: Array<{ id: number; category: string; correctAnswers: number; totalQuestions: number; score: number; percentage: number }>;
}


export interface RecentProgressEntry {
  surahName: string;
  verseNumber: number;
  readAt: string;
}

interface ReadingStatsProps {
  readingStats: ReadingStatsType | null;
  recentProgress: RecentProgressEntry[];
  onSetGoalAction: () => void;
}

export default function ReadingStats({ readingStats, recentProgress, onSetGoalAction }: ReadingStatsProps) {
  // Si pas de données, afficher un état vide avec encouragement
  if (!readingStats) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <BookOpen className="h-16 w-16 text-green-400 opacity-50" />
                <h3 className="text-xl font-bold text-white">Commencez votre parcours de lecture</h3>
                <p className="text-gray-400 max-w-md">
                  Utilisez le bouton de suivi sur les pages de sourates pour enregistrer votre progression et voir vos statistiques ici.
                </p>
                <Button 
                  onClick={onSetGoalAction}
                  className="bg-green-600 hover:bg-green-700 mt-4"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Définir mon objectif quotidien
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const getSurahName = (surahNumber: number) => {
    // Liste des noms de sourates (simplifié)
    const surahNames: Record<number, string> = {
      1: "Al-Fâtiha",
      2: "Al-Baqara", 
      3: "Âl-Imrân",
      4: "An-Nisâ'",
      5: "Al-Mâ'ida",
      // ... vous pouvez ajouter tous les noms de sourates
    };
    return surahNames[surahNumber] || `Sourate ${surahNumber}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

// Helpers pour la performance quiz
const getGradeColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-400';
  if (percentage >= 80) return 'text-blue-400';
  if (percentage >= 70) return 'text-yellow-400';
  if (percentage >= 60) return 'text-orange-400';
  return 'text-red-400';
};
const getGradeLetter = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'D';
};

  // Sécurité : fallback si currentPosition est absent ou mal formé

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Statistiques principales */}
      <div className="lg:col-span-2 space-y-6">
        {/* Cards des stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Aujourd'hui */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Aujourd&apos;hui
                </CardTitle>
                <BookOpen className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {readingStats.todayVerses || 0}
                </div>
                <p className="text-xs text-gray-500">
                  versets lus aujourd&apos;hui
                </p>
                {readingStats.dailyGoal && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((readingStats.todayVerses / readingStats.dailyGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {/* Cette semaine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Cette semaine
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {readingStats.weekVerses}
                </div>
                <p className="text-xs text-gray-500">
                  versets cette semaine
                </p>
              </CardContent>
            </Card>
          </motion.div>
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Série
                </CardTitle>
                <Flame className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {readingStats.streak}
                </div>
                <p className="text-xs text-gray-500">
                  jours consécutifs
                </p>
              </CardContent>
            </Card>
          </motion.div>
          {/* Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total
                </CardTitle>
                <Target className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {readingStats.totalVerses}
                </div>
                <p className="text-xs text-gray-500">
                  versets au total
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Position actuelle de lecture */}
        {readingStats.currentPosition && (readingStats.currentPosition.surah > 1 || readingStats.currentPosition.verse > 1) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                  Position actuelle de lecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {getSurahName(readingStats.currentPosition.surah)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Verset {readingStats.currentPosition.verse}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {readingStats.currentPosition.surah}:{readingStats.currentPosition.verse}
                    </div>
                    <div className="text-xs text-gray-500">
                      Marque-page
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Objectif quotidien */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className={`border-gray-700 ${
            readingStats.todayVerses >= readingStats.dailyGoal
              ? 'bg-gradient-to-r from-green-800 to-green-900 border-green-600'
              : 'bg-gray-800'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    {readingStats.todayVerses >= readingStats.dailyGoal ? (
                      <>
                        <div className="h-5 w-5 mr-2 text-green-400">🎯</div>
                        Objectif atteint !
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 mr-2 text-green-400" />
                        Objectif quotidien
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className={
                    readingStats.todayVerses >= readingStats.dailyGoal
                      ? 'text-green-300'
                      : 'text-gray-400'
                  }>
                    {readingStats.todayVerses} / {readingStats.dailyGoal} versets
                    {readingStats.todayVerses >= readingStats.dailyGoal && (
                      <span className="ml-2 text-yellow-400">🎉</span>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSetGoalAction}
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  Modifier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress
                  value={Math.min(readingStats.goalProgress, 100)}
                  className="h-3"
                />
                <div className="flex justify-between text-sm">
                  <span className={
                    readingStats.todayVerses >= readingStats.dailyGoal
                      ? 'text-green-300'
                      : 'text-gray-400'
                  }>
                    {Math.round(Math.min(readingStats.goalProgress, 100))}% complété
                  </span>
                  <span className={
                    readingStats.todayVerses >= readingStats.dailyGoal
                      ? 'text-green-300 font-semibold'
                      : 'text-gray-400'
                  }>
                    {readingStats.dailyGoal - readingStats.todayVerses > 0
                      ? `${readingStats.dailyGoal - readingStats.todayVerses} versets restants`
                      : 'Félicitations ! Objectif atteint ! 🎉'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Activité récente */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentProgress && recentProgress.length > 0 ? (
                recentProgress.slice(0, 10).map((progress, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {progress.surahName}
                      </div>
                      <div className="text-xs text-gray-400">
                        Verset {progress.verseNumber}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(progress.readAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune lecture récente</p>
                  <p className="text-xs mt-1">Commencez à lire pour voir votre progrès ici</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Ajout de la section quiz dans ReadingStats */}
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <BarChart3 className="mr-2" />
                Performance par Catégorie
              </CardTitle>
              <CardDescription className="text-gray-400">
                Vos résultats dans chaque thème
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
          {readingStats && readingStats.categoryStats &&
            Object.entries(readingStats.categoryStats as Record<string, CategoryStat>).map(
              ([category, data]: [string, CategoryStat]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <span className={`text-sm font-bold ${getGradeColor(data.average)}`}>
                      {getGradeLetter(data.average)} ({Math.round(data.average)}%)
                    </span>
                  </div>
                  <Progress value={data.average} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {data.total} quiz terminés
                  </div>
                </div>
              )
            )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <Clock className="mr-2" />
                Résultats Récents
              </CardTitle>
              <CardDescription className="text-gray-400">
                Vos 10 derniers quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
          {readingStats && Array.isArray(readingStats.recentResults) &&
            (readingStats.recentResults as QuizResult[]).slice(0, 5).map((result: QuizResult) => (
              <div key={String(result.id)} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    result.percentage >= 80 ? 'bg-green-600' :
                    result.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {result.percentage >= 80 ? <Award className="h-4 w-4" /> :
                      result.percentage >= 60 ? <Star className="h-4 w-4" /> :
                      <Target className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium">{result.category}</div>
                    <div className="text-sm text-gray-400">
                      {result.correctAnswers}/{result.totalQuestions} correct
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">{result.score}pts</div>
                  <div className={`text-sm ${getGradeColor(result.percentage)}`}>
                    {Math.round(result.percentage)}%
                  </div>
                </div>
              </div>
            ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
