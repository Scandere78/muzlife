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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Récupérer les versets favoris avec les détails
    const favoriteVerses = await prisma.verseState.findMany({
      where: {
        userId: decoded.userId,
        isFavorite: true,
      },
      orderBy: [
        { readCount: 'desc' }, // Les plus lus en premier
        { updatedAt: 'desc' }
      ],
      take: limit,
    });

    // Enrichir avec les noms des sourates (vous pourriez avoir une table/constante avec ces infos)
    const surahNames: Record<number, string> = {
      1: "Al-Fatiha",
      2: "Al-Baqarah",
      3: "Ali 'Imran",
      4: "An-Nisa",
      5: "Al-Ma'idah",
      // ... ajouter tous les noms de sourates
      114: "An-Nas",
    };

    const enrichedFavoriteVerses = favoriteVerses.map(verse => ({
      id: verse.id,
      surahNumber: verse.surahNumber,
      verseNumber: verse.verseNumber,
      surahName: surahNames[verse.surahNumber] || `Sourate ${verse.surahNumber}`,
      isFavorite: verse.isFavorite,
      readCount: verse.readCount,
      isMemorized: verse.isMemorized,
      memorizationLevel: verse.memorizationLevel,
      lastReadAt: verse.lastReadAt,
      lastMemorizedAt: verse.lastMemorizedAt,
      readingTime: verse.readingTime,
      memorizationTime: verse.memorizationTime,
      pronunciationTime: verse.pronunciationTime,
    }));

    return NextResponse.json({
      favoriteVerses: enrichedFavoriteVerses,
      total: favoriteVerses.length,
    });

  } catch (error) {
    console.error('Erreur récupération versets favoris:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}