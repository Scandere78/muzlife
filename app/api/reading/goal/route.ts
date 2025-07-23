import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// Mettre à jour l'objectif de lecture quotidien
export async function PUT(req: NextRequest) {
  try {
    const { dailyGoal } = await req.json();
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

    // Validation de l'objectif
    const goal = Number(dailyGoal);
    if (!goal || goal < 1 || goal > 100) {
      return NextResponse.json({ message: "L'objectif doit être entre 1 et 100 versets par jour" }, { status: 400 });
    }

    // Mettre à jour ou créer les statistiques utilisateur
    const userStats = await prisma.userStats.upsert({
      where: { userId: decoded.userId },
      update: { dailyGoal: goal },
      create: { userId: decoded.userId, dailyGoal: goal },
    });

    return NextResponse.json({
      message: 'Objectif mis à jour avec succès',
      userStats,
    });
  } catch {
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
