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

    // Récupérer ou créer les statistiques utilisateur
    let userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!userStats) {
      userStats = await prisma.userStats.create({
        data: {
          userId,
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          totalVersesRead: 0,
          totalVersesMemorized: 0,
          readingStreak: 0,
          memorizationStreak: 0,
          dailyReadingGoal: 10,
          dailyMemorizationGoal: 3,
          totalStudyTime: 0,
          averageStudySession: 0,
        },
      });
    }

    // Dates pour les calculs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    // Exécuter toutes les requêtes en parallèle
    const [
      todayReadingProgress,
      weekReadingProgress,
      allVerseStates,
      favoriteSurahs,
      studySessions
    ] = await Promise.all([
      // Versets lus aujourd'hui
      prisma.readingProgress.count({
        where: { 
          userId, 
          readAt: { gte: today } 
        },
      }),
      
      // Versets lus cette semaine
      prisma.readingProgress.count({
        where: { 
          userId, 
          readAt: { gte: thisWeek } 
        },
      }),
      
      // Tous les états de versets de l'utilisateur
      prisma.verseState.findMany({
        where: { userId },
        select: {
          isRead: true,
          isMemorized: true,
          isFavorite: true,
          readCount: true,
          memorizationLevel: true,
          readingTime: true,
          memorizationTime: true,
          pronunciationTime: true,
          surahNumber: true,
          verseNumber: true,
        },
      }),
      
      // Sourates favorites
      prisma.favoriteSurah.findMany({
        where: { userId },
        orderBy: { addedAt: 'desc' },
        take: 10,
      }),
      
      // Sessions d'étude
      prisma.studySession.findMany({
        where: { userId },
        select: {
          duration: true,
          studyMode: true,
          completedVerses: true,
          startedAt: true,
          endedAt: true,
          totalVerses: true,
        },
      }),
    ]);

    // Calculer les statistiques à partir des données récupérées
    const readVerses = allVerseStates.filter(vs => vs.isRead).length;
    const memorizedVerses = allVerseStates.filter(vs => vs.isMemorized).length;
    const favoriteVersesCount = allVerseStates.filter(vs => vs.isFavorite).length;
    
    // Calculer les temps d'étude
    const totalReadingTime = allVerseStates.reduce((acc, vs) => acc + (vs.readingTime || 0), 0);
    const totalMemorizationTime = allVerseStates.reduce((acc, vs) => acc + (vs.memorizationTime || 0), 0);
    const totalPronunciationTime = allVerseStates.reduce((acc, vs) => acc + (vs.pronunciationTime || 0), 0);

    // Statistiques des sessions d'étude
    const completedSessions = studySessions.filter(s => s.endedAt !== null);
    const totalSessionDuration = completedSessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const averageSessionDuration = completedSessions.length > 0 ? totalSessionDuration / completedSessions.length : 0;

    // Top versets favoris (les plus lus)
    const topFavoriteVerses = allVerseStates
      .filter(vs => vs.isFavorite && vs.readCount > 0)
      .sort((a, b) => b.readCount - a.readCount)
      .slice(0, 5);

    // Noms des sourates (mapping basique - pourrait être externalisé)
    const getSurahName = (surahNumber: number): string => {
      const surahNames: Record<number, string> = {
        1: "Al-Fatiha", 2: "Al-Baqarah", 3: "Ali 'Imran", 4: "An-Nisa", 5: "Al-Ma'idah",
        6: "Al-An'am", 7: "Al-A'raf", 8: "Al-Anfal", 9: "At-Tawbah", 10: "Yunus",
        // Ajouter plus selon les besoins...
      };
      return surahNames[surahNumber] || `Sourate ${surahNumber}`;
    };

    // Calculer les achievements
    const achievements = [
      {
        id: 'first_verse',
        name: 'Premier Verset',
        description: 'Lire votre premier verset',
        icon: '📖',
        unlocked: readVerses >= 1,
      },
      {
        id: 'dedicated_reader',
        name: 'Lecteur Assidu',
        description: 'Lire 100 versets',
        icon: '🌟',
        unlocked: readVerses >= 100,
        progress: Math.min(readVerses, 100),
        maxProgress: 100,
      },
      {
        id: 'quran_explorer',
        name: 'Explorateur du Coran',
        description: 'Lire 1000 versets',
        icon: '🧭',
        unlocked: readVerses >= 1000,
        progress: Math.min(readVerses, 1000),
        maxProgress: 1000,
      },
      {
        id: 'memory_master',
        name: 'Maître de la Mémoire',
        description: 'Mémoriser 50 versets',
        icon: '🧠',
        unlocked: memorizedVerses >= 50,
        progress: Math.min(memorizedVerses, 50),
        maxProgress: 50,
      },
      {
        id: 'consistent_reader',
        name: 'Lecteur Régulier',
        description: 'Maintenir un streak de 7 jours',
        icon: '🔥',
        unlocked: userStats.readingStreak >= 7,
        progress: Math.min(userStats.readingStreak, 7),
        maxProgress: 7,
      },
      {
        id: 'study_enthusiast',
        name: 'Passionné d\'Étude',
        description: 'Compléter 25 sessions d\'étude',
        icon: '📚',
        unlocked: completedSessions.length >= 25,
        progress: Math.min(completedSessions.length, 25),
        maxProgress: 25,
      },
      {
        id: 'memorization_champion',
        name: 'Champion de Mémorisation',
        description: 'Mémoriser 200 versets',
        icon: '👑',
        unlocked: memorizedVerses >= 200,
        progress: Math.min(memorizedVerses, 200),
        maxProgress: 200,
      },
      {
        id: 'quran_lover',
        name: 'Amoureux du Coran',
        description: 'Avoir 20 versets favoris',
        icon: '❤️',
        unlocked: favoriteVersesCount >= 20,
        progress: Math.min(favoriteVersesCount, 20),
        maxProgress: 20,
      },
    ];

    // Construire la réponse
    const response = {
      // Statistiques de lecture
      totalVersesRead: readVerses,
      todayVersesRead: todayReadingProgress,
      weekVersesRead: weekReadingProgress,
      readingStreak: userStats.readingStreak || 0,
      readingGoal: userStats.dailyReadingGoal || 10,
      
      // Statistiques de mémorisation
      totalVersesMemorized: memorizedVerses,
      memorizationStreak: userStats.memorizationStreak || 0,
      lastMemorizedDate: userStats.lastMemorizedDate,
      memorizationLevel: allVerseStates.length > 0 
        ? Math.round(allVerseStates.reduce((acc, vs) => acc + (vs.memorizationLevel || 0), 0) / allVerseStates.length) 
        : 1,
      
      // Sourates favorites
      favoriteSurahs: favoriteSurahs.map(fs => ({
        id: fs.id,
        surahNumber: fs.surahNumber,
        surahName: fs.surahName || getSurahName(fs.surahNumber),
        addedAt: fs.addedAt,
      })),
      
      // Versets favoris (top 5 les plus lus)
      favoriteVerses: topFavoriteVerses.map(verse => ({
        surahNumber: verse.surahNumber,
        verseNumber: verse.verseNumber,
        surahName: getSurahName(verse.surahNumber),
        isFavorite: verse.isFavorite,
        readCount: verse.readCount,
      })),
      
      // Sessions d'étude
      studyStats: {
        totalSessions: studySessions.length,
        totalStudyTime: Math.round(totalSessionDuration / 60), // Convertir en minutes
        averageSessionTime: Math.round(averageSessionDuration / 60), // Convertir en minutes
        memorizationTime: Math.round(totalMemorizationTime / 60), // Convertir en minutes
        readingTime: Math.round(totalReadingTime / 60), // Convertir en minutes
      },
      
      // Progression globale dans le Coran
      globalProgress: {
        totalQuranVerses: 6236,
        readProgress: Math.min((readVerses / 6236) * 100, 100),
        memorizedProgress: Math.min((memorizedVerses / 6236) * 100, 100),
      },
      
      // Achievements/Réalisations
      achievements,
      
      // Temps total d'étude combiné
      totalStudyTimeMinutes: Math.round((totalReadingTime + totalMemorizationTime + totalPronunciationTime) / 60),
      
      // Statistiques supplémentaires
      favoriteVersesCount,
      completedSessionsCount: completedSessions.length,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur récupération statistiques gamifiées:', error);
    return NextResponse.json({ 
      message: 'Erreur interne du serveur',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}