import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const { surahNumber, verseNumber, surahName, surahSlug } = await req.json();

    if (!surahNumber) {
      return NextResponse.json({ 
        error: 'Numéro de sourate requis' 
      }, { status: 400 });
    }

    // Si verseNumber n'est pas fourni, on traite cela comme un favori de sourate
    if (!verseNumber) {
      // Gérer les favoris de sourate complète
      const existingFavorite = await prisma.favoriteSurah.findUnique({
        where: {
          userId_surahNumber: {
            userId: decoded.userId,
            surahNumber: parseInt(surahNumber),
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
              userId: decoded.userId,
              surahNumber: parseInt(surahNumber),
            },
          },
        });
        isFavorite = false;
        message = 'Sourate supprimée des favoris';
      } else {
        // Ajouter aux favoris
        await prisma.favoriteSurah.create({
          data: {
            userId: decoded.userId,
            surahNumber: parseInt(surahNumber),
            surahName: surahName || `Sourate ${surahNumber}`,
            surahSlug: surahSlug || `sourate-${surahNumber}`,
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
    }

    // Logique existante pour les versets
    if (!verseNumber) {
      return NextResponse.json({ 
        error: 'Numéro de verset requis pour les favoris de verset' 
      }, { status: 400 });
    }

    // Rechercher ou créer l'état du verset
    const existingVerseState = await prisma.verseState.findUnique({
      where: {
        userId_surahNumber_verseNumber: {
          userId: decoded.userId,
          surahNumber: parseInt(surahNumber),
          verseNumber: parseInt(verseNumber),
        }
      }
    });

    let verseState;
    
    if (existingVerseState) {
      // Basculer le statut favori
      verseState = await prisma.verseState.update({
        where: {
          id: existingVerseState.id
        },
        data: {
          isFavorite: !existingVerseState.isFavorite,
          updatedAt: new Date(),
        }
      });
    } else {
      // Créer un nouvel état avec favori activé
      verseState = await prisma.verseState.create({
        data: {
          userId: decoded.userId,
          surahNumber: parseInt(surahNumber),
          verseNumber: parseInt(verseNumber),
          isFavorite: true,
        }
      });
    }

    return NextResponse.json({
      success: true,
      isFavorite: verseState.isFavorite,
      message: verseState.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris'
    });

  } catch (error) {
    console.error('Erreur toggle favoris:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}