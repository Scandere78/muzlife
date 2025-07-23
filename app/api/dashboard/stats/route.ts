import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: { userId: string };
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      decoded = payload as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
    const userId = decoded.userId;

    // Récupérer l'utilisateur avec ses stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stats: true,
        quizResults: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }
    // Créer les UserStats si elles n'existent pas
    let stats = user.stats;
    if (!stats) {
      stats = await prisma.userStats.create({
        data: {
          userId,
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          totalVersesRead: 0,
          readingStreak: 0,
          dailyGoal: 10,
        },
      });
    }
    // Récupérer les données de lecture séparément
    let recentReadingProgress = [];
    try {
      recentReadingProgress = await prisma.readingProgress.findMany({
        where: { userId },
        orderBy: { readAt: 'desc' },
        take: 20,
      });
    } catch {}
    // Calculer les stats par catégorie
    const allResults = await prisma.quizResult.findMany({ where: { userId } });
    type CategoryStats = {
      total: number;
      correct: number;
      average: number;
      totalScore: number;
    };
    const categoryStats: Record<string, CategoryStats> = {};
    allResults.forEach((result: {
      category: string;
      correctAnswers: number;
      score: number;
    }) => {
      if (!categoryStats[result.category]) {
        categoryStats[result.category] = {
          total: 0,
          correct: 0,
          average: 0,
          totalScore: 0,
        };
      }
      categoryStats[result.category].total++;
      categoryStats[result.category].correct += result.correctAnswers;
      categoryStats[result.category].totalScore += result.score;
      categoryStats[result.category].average = (categoryStats[result.category].correct / (categoryStats[result.category].total * 4)) * 100;
    });
    // Calculer les stats de lecture
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayProgress = 0;
    let weekProgress = 0;
    try {
      todayProgress = await prisma.readingProgress.count({
        where: { userId, readAt: { gte: today } },
      });
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      weekProgress = await prisma.readingProgress.count({
        where: { userId, readAt: { gte: thisWeek } },
      });
    } catch {}
    // Chercher la dernière lecture du jour
    const lastTodayReading = await prisma.readingProgress.findFirst({
      where: { userId, readAt: { gte: today } },
      orderBy: { readAt: 'desc' }
    });
    const currentPosition = lastTodayReading
      ? { surah: lastTodayReading.surahNumber, verse: lastTodayReading.verseNumber }
      : null;

    const readingStats = {
      todayVerses: todayProgress,
      weekVerses: weekProgress,
      totalVerses: stats?.totalVersesRead || 0,
      currentPosition,
      streak: stats?.readingStreak || 0,
      dailyGoal: stats?.dailyGoal || 10,
      goalProgress: Math.min((todayProgress / (stats?.dailyGoal || 10)) * 100, 100),
    };
    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      stats,
      recentResults: user.quizResults,
      categoryStats,
      readingStats,
      recentReadingProgress,
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
