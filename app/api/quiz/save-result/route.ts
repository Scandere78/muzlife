import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { score, category, difficulty, correctAnswers, totalQuestions, timeSpent, hintsUsed } = await req.json();
    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
    // Calculer le pourcentage
    const percentage = (correctAnswers / totalQuestions) * 100;
    // Enregistrer le résultat du quiz
    const result = await prisma.quizResult.create({
      data: {
        userId: decoded.userId,
        score,
        category,
        difficulty,
        correctAnswers,
        totalQuestions,
        percentage,
        timeSpent: timeSpent || 0,
        hintsUsed: hintsUsed || 0,
      },
    });
    // Mettre à jour les stats de l'utilisateur
    const userStats = await prisma.userStats.findUnique({ where: { userId: decoded.userId } });
    if (userStats) {
      const newTotalQuizzes = userStats.totalQuizzes + 1;
      const newTotalPoints = userStats.totalPoints + score;
      const newAverageScore = newTotalPoints / newTotalQuizzes;
      // Calculer la catégorie favorite
      const userResults = await prisma.quizResult.findMany({
        where: { userId: decoded.userId },
        select: { category: true },
      });
      const categoryCount: Record<string, number> = {};
      userResults.forEach((r: { category: string }) => {
        categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
      });
      const favoriteCategory = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      );
      await prisma.userStats.update({
        where: { userId: decoded.userId },
        data: {
          totalQuizzes: newTotalQuizzes,
          totalPoints: newTotalPoints,
          averageScore: newAverageScore,
          favoriteCategory,
          streakRecord: Math.max(userStats.streakRecord, correctAnswers),
        },
      });
    }
    return NextResponse.json({ message: 'Résultat enregistré avec succès', result });
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
