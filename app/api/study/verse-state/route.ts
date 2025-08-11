import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

// Mettre à jour l'état d'un verset (lu, mémorisé, favori)
export async function POST(req: NextRequest) {
  try {
    const { surahNumber, verseNumber, action, data } = await req.json();
    
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

    const uniqueKey = {
      userId: decoded.userId,
      surahNumber: Number(surahNumber),
      verseNumber: Number(verseNumber),
    };

    let verseState = await prisma.verseState.findUnique({
      where: { userId_surahNumber_verseNumber: uniqueKey },
    });

    // Créer l'état du verset s'il n'existe pas
    if (!verseState) {
      verseState = await prisma.verseState.create({
        data: uniqueKey,
      });
    }

    const updateData: any = { updatedAt: new Date() };

    switch (action) {
      case 'mark_read':
        updateData.isRead = true;
        updateData.readCount = { increment: 1 };
        updateData.lastReadAt = new Date();
        updateData.readingTime = { increment: data?.timeSpent || 0 };
        break;

      case 'mark_memorized':
        updateData.isMemorized = true;
        updateData.lastMemorizedAt = new Date();
        updateData.memorizationLevel = Math.min((verseState.memorizationLevel || 0) + 1, 5);
        updateData.memorizationTime = { increment: data?.timeSpent || 0 };
        break;

      case 'toggle_favorite':
        updateData.isFavorite = !verseState.isFavorite;
        break;

      case 'update_pronunciation_time':
        updateData.pronunciationTime = { increment: data?.timeSpent || 0 };
        break;

      case 'reset_memorization':
        updateData.isMemorized = false;
        updateData.memorizationLevel = Math.max((verseState.memorizationLevel || 1) - 1, 0);
        break;

      default:
        return NextResponse.json({ message: 'Action non reconnue' }, { status: 400 });
    }

    const updatedVerseState = await prisma.verseState.update({
      where: { id: verseState.id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'État du verset mis à jour',
      verseState: updatedVerseState,
    });

  } catch (error) {
    console.error('Erreur mise à jour état verset:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Récupérer les états des versets d'une sourate
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

    const { searchParams } = new URL(req.url);
    const surahNumber = searchParams.get('surahNumber');
    
    if (!surahNumber) {
      return NextResponse.json({ message: 'Numéro de sourate requis' }, { status: 400 });
    }

    const verseStates = await prisma.verseState.findMany({
      where: {
        userId: decoded.userId,
        surahNumber: parseInt(surahNumber),
      },
      orderBy: { verseNumber: 'asc' },
    });

    // Calculer les statistiques de la sourate
    const totalVerses = verseStates.length;
    const readVerses = verseStates.filter(vs => vs.isRead).length;
    const memorizedVerses = verseStates.filter(vs => vs.isMemorized).length;
    const favoriteVerses = verseStates.filter(vs => vs.isFavorite).length;
    
    const totalReadingTime = verseStates.reduce((acc, vs) => acc + vs.readingTime, 0);
    const totalMemorizationTime = verseStates.reduce((acc, vs) => acc + vs.memorizationTime, 0);
    const totalPronunciationTime = verseStates.reduce((acc, vs) => acc + vs.pronunciationTime, 0);

    return NextResponse.json({
      verseStates,
      surahStats: {
        totalVerses,
        readVerses,
        memorizedVerses,
        favoriteVerses,
        readingProgress: totalVerses > 0 ? (readVerses / totalVerses) * 100 : 0,
        memorizationProgress: totalVerses > 0 ? (memorizedVerses / totalVerses) * 100 : 0,
        totalStudyTime: totalReadingTime + totalMemorizationTime + totalPronunciationTime,
        timeBreakdown: {
          reading: totalReadingTime,
          memorization: totalMemorizationTime,
          pronunciation: totalPronunciationTime,
        },
      },
    });

  } catch (error) {
    console.error('Erreur récupération états versets:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}