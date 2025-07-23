import { prisma } from '@/lib/prisma';

/**
 * Met à jour les statistiques de lecture de l'utilisateur (total, position, streak, etc.)
 */
export async function updateUserReadingStats(userId: string, surahNumber: number, verseNumber: number): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let userStats = await prisma.userStats.findUnique({ where: { userId } });
    if (!userStats) {
      userStats = await prisma.userStats.create({
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

    // Compter les versets lus aujourd'hui (non utilisé ici, mais utile pour la logique de streak)
    // const versesToday = await prisma.readingProgress.count({
    //   where: {
    //     userId,
    //     readAt: { gte: today },
    //   },
    // });

    // Calculer la série de lecture
    let readingStreak = userStats.readingStreak;
    const lastReadDate = userStats.lastReadDate;
    if (lastReadDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      if (lastReadDate >= yesterday && lastReadDate < today) {
        readingStreak += 1;
      } else if (lastReadDate < yesterday) {
        readingStreak = 1;
      }
    } else {
      readingStreak = 1;
    }

    await prisma.userStats.update({
      where: { userId },
      data: {
        totalVersesRead: { increment: 1 },
        currentSurah: surahNumber,
        currentVerse: verseNumber,
        readingStreak,
        lastReadDate: new Date(),
      },
    });
  } catch {
    // Erreur silencieuse (logging optionnel)
  }
}
