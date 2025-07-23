import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { updateUserReadingStats } from '@/lib/updateUserReadingStats';

// Enregistrer le progrès de lecture
export async function POST(req: NextRequest) {
  try {
    const { surahNumber, verseNumber, surahName, readingTime } = await req.json();
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

    // Vérifier si ce verset a déjà été lu aujourd'hui
    const existingProgress = await prisma.readingProgress.findUnique({
      where: {
        userId_surahNumber_verseNumber: {
          userId: decoded.userId,
          surahNumber: Number(surahNumber),
          verseNumber: Number(verseNumber),
        },
      },
    });

    let progress;
    if (existingProgress) {
      progress = await prisma.readingProgress.update({
        where: { id: existingProgress.id },
        data: {
          readAt: new Date(),
          readingTime: readingTime || existingProgress.readingTime,
        },
      });
    } else {
      progress = await prisma.readingProgress.create({
        data: {
          userId: decoded.userId,
          surahNumber: Number(surahNumber),
          verseNumber: Number(verseNumber),
          surahName,
          readingTime: readingTime || 0,
        },
      });
    }

    // Mettre à jour les statistiques utilisateur
    await updateUserReadingStats(decoded.userId, Number(surahNumber), Number(verseNumber));

    return NextResponse.json({
      message: 'Progrès enregistré avec succès',
      progress,
    });
  } catch {
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Récupérer le progrès de lecture d'un utilisateur
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

    // Récupérer les statistiques de l'utilisateur
    let userStats = await prisma.userStats.findUnique({ where: { userId: decoded.userId } });
    if (!userStats) {
      userStats = await prisma.userStats.create({ data: { userId: decoded.userId } });
    }

    // Récupérer les progrès récents (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProgress = await prisma.readingProgress.findMany({
      where: {
        userId: decoded.userId,
        readAt: { gte: thirtyDaysAgo },
      },
      orderBy: { readAt: 'desc' },
      take: 50,
    });

    // Calculer les statistiques quotidiennes
    const dailyStats: Record<string, number> = {};
    recentProgress.forEach((progress: { readAt: Date }) => {
      const date = progress.readAt.toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    return NextResponse.json({
      userStats,
      recentProgress,
      dailyStats,
    });
  } catch {
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
