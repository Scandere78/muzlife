import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
}

interface FavoriteSurahData {
  surahNumber: number;
  surahName: string;
  surahSlug: string;
}

// GET - Récupérer toutes les sourates favorites de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Configuration serveur invalide' },
        { status: 500 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les sourates favorites
    const favoriteSurahs = await prisma.favoriteSurah.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      favorites: favoriteSurahs,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des sourates favorites:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// POST - Ajouter ou supprimer une sourate des favoris (toggle)
export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Configuration serveur invalide' },
        { status: 500 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les données du corps de la requête
    const body: FavoriteSurahData = await request.json();
    const { surahNumber, surahName, surahSlug } = body;

    if (!surahNumber || !surahName || !surahSlug) {
      return NextResponse.json(
        { error: 'Données de sourate incomplètes' },
        { status: 400 }
      );
    }

    // Vérifier si la sourate est déjà en favoris
    const existingFavorite = await prisma.favoriteSurah.findUnique({
      where: {
        userId_surahNumber: {
          userId: user.id,
          surahNumber: surahNumber,
        },
      },
    });

    let isFavorite = false;
    let message = '';

    if (existingFavorite) {
      // Supprimer des favoris
      await prisma.favoriteSurah.delete({
        where: {
          userId_surahNumber: {
            userId: user.id,
            surahNumber: surahNumber,
          },
        },
      });
      isFavorite = false;
      message = 'Sourate supprimée des favoris';
    } else {
      // Ajouter aux favoris
      await prisma.favoriteSurah.create({
        data: {
          userId: user.id,
          surahNumber: surahNumber,
          surahName: surahName,
          surahSlug: surahSlug,
        },
      });
      isFavorite = true;
      message = 'Sourate ajoutée aux favoris';
    }

    return NextResponse.json({
      success: true,
      isFavorite,
      message,
    });

  } catch (error) {
    console.error('Erreur lors du toggle favoris sourate:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une sourate des favoris
export async function DELETE(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Configuration serveur invalide' },
        { status: 500 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer le numéro de sourate depuis les query parameters
    const { searchParams } = new URL(request.url);
    const surahNumber = searchParams.get('surahNumber');

    if (!surahNumber) {
      return NextResponse.json(
        { error: 'Numéro de sourate manquant' },
        { status: 400 }
      );
    }

    const surahNum = parseInt(surahNumber);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return NextResponse.json(
        { error: 'Numéro de sourate invalide' },
        { status: 400 }
      );
    }

    // Supprimer la sourate des favoris
    const deletedFavorite = await prisma.favoriteSurah.deleteMany({
      where: {
        userId: user.id,
        surahNumber: surahNum,
      },
    });

    if (deletedFavorite.count === 0) {
      return NextResponse.json(
        { error: 'Sourate non trouvée dans les favoris' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sourate supprimée des favoris',
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la sourate favorite:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}