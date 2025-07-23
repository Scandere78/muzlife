"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3, Award, Star } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

interface QuizStatsData {
  totalQuizzes: number;
  totalPoints: number;
  averageScore: number;
  streakRecord: number;
  favoriteCategory?: string;
}

const QuizStats = () => {
  const { user, getDashboardStats } = useAuth();
  const [stats, setStats] = useState<QuizStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        const data = await getDashboardStats();
        if (data?.userStats) {
          setStats({
            totalQuizzes: data.userStats.totalQuizzes || 0,
            totalPoints: data.userStats.totalPoints || 0,
            averageScore: data.userStats.averageScore || 0,
            streakRecord: data.userStats.streakRecord || 0,
            favoriteCategory: data.userStats.favoriteCategory,
          });
        }
      }
      setLoading(false);
    };
    fetchStats();
  }, [user, getDashboardStats]);

  if (loading) {
    return <div className="text-white">Chargement des statistiques…</div>;
  }
  if (!user || !stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <BarChart3 className="mr-2 text-blue-400" /> Total de quiz réalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{stats.totalQuizzes}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Award className="mr-2 text-green-400" /> Total de points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{stats.totalPoints}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Star className="mr-2 text-yellow-400" /> Score moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">{stats.averageScore}%</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Award className="mr-2 text-orange-400" /> Meilleure série
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-400">{stats.streakRecord} quiz</div>
        </CardContent>
      </Card>
      {stats.favoriteCategory && (
        <Card className="bg-gray-800 border-gray-700 col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Star className="mr-2 text-pink-400" /> Catégorie favorite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg text-pink-300">{stats.favoriteCategory}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizStats;
