import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../../lib/prisma';

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

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

    // Récupérer les sourates favorites
    const favoriteSurahs = await prisma.favoriteSurah.findMany({
      where: { userId: decoded.userId },
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