import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { StudyMode } from '@prisma/client';

// Démarrer ou mettre à jour une session d'étude
export async function POST(req: NextRequest) {
  try {
    const { surahNumber, studyMode, action, sessionData } = await req.json();
    
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

    if (action === 'start') {
      // Démarrer une nouvelle session
      const session = await prisma.studySession.create({
        data: {
          userId: decoded.userId,
          surahNumber: Number(surahNumber),
          studyMode: studyMode as StudyMode,
          totalVerses: sessionData?.totalVerses || 0,
        },
      });
      
      return NextResponse.json({
        message: 'Session d\'étude démarrée',
        session,
      });
    } 
    
    if (action === 'update') {
      // Mettre à jour une session existante
      const { sessionId, versesStudied, versesCompleted, focusTime } = sessionData;
      
      const updatedSession = await prisma.studySession.update({
        where: { id: sessionId },
        data: {
          versesStudied: versesStudied || [],
          versesCompleted: versesCompleted || [],
          completedVerses: versesCompleted?.length || 0,
          focusTime: focusTime || 0,
        },
      });
      
      return NextResponse.json({
        message: 'Session mise à jour',
        session: updatedSession,
      });
    }
    
    if (action === 'end') {
      // Terminer une session
      const { sessionId, duration, accuracy } = sessionData;
      
      const session = await prisma.studySession.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          duration: duration,
          accuracy: accuracy,
          averageTimePerVerse: duration && sessionData.totalVerses 
            ? Math.round(duration / sessionData.totalVerses) 
            : null,
        },
      });
      
      // Mettre à jour les statistiques utilisateur
      await updateUserStudyStats(decoded.userId, session);
      
      return NextResponse.json({
        message: 'Session terminée',
        session,
      });
    }

    return NextResponse.json({ message: 'Action non reconnue' }, { status: 400 });
    
  } catch (error) {
    console.error('Erreur session d\'étude:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Récupérer l'historique des sessions
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const surahNumber = searchParams.get('surahNumber');
    const studyMode = searchParams.get('studyMode');

    const whereClause: any = { userId: decoded.userId };
    if (surahNumber) whereClause.surahNumber = parseInt(surahNumber);
    if (studyMode) whereClause.studyMode = studyMode;

    const sessions = await prisma.studySession.findMany({
      where: whereClause,
      orderBy: { startedAt: 'desc' },
      take: limit,
    });

    // Calculer les statistiques de base
    const totalSessions = sessions.length;
    const totalStudyTime = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const averageSessionTime = totalSessions > 0 ? totalStudyTime / totalSessions : 0;

    return NextResponse.json({
      sessions,
      stats: {
        totalSessions,
        totalStudyTime,
        averageSessionTime,
      },
    });
    
  } catch (error) {
    console.error('Erreur récupération sessions:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Fonction utilitaire pour mettre à jour les stats utilisateur
async function updateUserStudyStats(userId: string, session: any) {
  try {
    let userStats = await prisma.userStats.findUnique({ where: { userId } });
    if (!userStats) {
      userStats = await prisma.userStats.create({ data: { userId } });
    }

    const updateData: any = {
      totalStudyTime: { increment: Math.round((session.duration || 0) / 60) }, // Convertir en minutes
    };

    // Mettre à jour selon le mode d'étude
    if (session.studyMode === 'MEMORIZATION' && session.completedVerses > 0) {
      updateData.totalVersesMemorized = { increment: session.completedVerses };
      updateData.lastMemorizedDate = new Date();
      
      // Calculer le streak de mémorisation
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      if (userStats.lastMemorizedDate && userStats.lastMemorizedDate >= yesterday) {
        updateData.memorizationStreak = { increment: 1 };
      } else {
        updateData.memorizationStreak = 1;
      }
    }

    // Calculer la moyenne des sessions
    const totalSessions = await prisma.studySession.count({ where: { userId } });
    updateData.averageStudySession = Math.round(updateData.totalStudyTime.increment / totalSessions);

    await prisma.userStats.update({
      where: { userId },
      data: updateData,
    });
  } catch (error) {
    console.error('Erreur mise à jour stats utilisateur:', error);
  }
}