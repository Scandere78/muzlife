import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { StudyMode } from '@prisma/client';

// Récupérer les préférences utilisateur
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

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: decoded.userId },
    });

    // Créer des préférences par défaut si elles n'existent pas
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: { userId: decoded.userId },
      });
    }

    return NextResponse.json({ preferences });

  } catch (error) {
    console.error('Erreur récupération préférences:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Mettre à jour les préférences utilisateur
export async function PUT(req: NextRequest) {
  try {
    const updateData = await req.json();
    
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

    // Valider les données
    const validatedData: any = { updatedAt: new Date() };

    // Préférences d'affichage
    if (updateData.arabicFontSize && updateData.arabicFontSize >= 16 && updateData.arabicFontSize <= 48) {
      validatedData.arabicFontSize = updateData.arabicFontSize;
    }
    if (updateData.phoneticFontSize && updateData.phoneticFontSize >= 12 && updateData.phoneticFontSize <= 24) {
      validatedData.phoneticFontSize = updateData.phoneticFontSize;
    }
    if (updateData.translationFontSize && updateData.translationFontSize >= 10 && updateData.translationFontSize <= 20) {
      validatedData.translationFontSize = updateData.translationFontSize;
    }
    if (updateData.preferredLanguage && ['fr', 'en', 'ar'].includes(updateData.preferredLanguage)) {
      validatedData.preferredLanguage = updateData.preferredLanguage;
    }

    // Préférences audio
    if (updateData.preferredReciter) {
      validatedData.preferredReciter = updateData.preferredReciter;
    }
    if (updateData.defaultPlaybackSpeed && updateData.defaultPlaybackSpeed >= 0.5 && updateData.defaultPlaybackSpeed <= 2.0) {
      validatedData.defaultPlaybackSpeed = updateData.defaultPlaybackSpeed;
    }
    if (typeof updateData.autoPlayNext === 'boolean') {
      validatedData.autoPlayNext = updateData.autoPlayNext;
    }
    if (updateData.repeatCount && updateData.repeatCount >= 1 && updateData.repeatCount <= 10) {
      validatedData.repeatCount = updateData.repeatCount;
    }

    // Préférences d'étude
    if (updateData.defaultStudyMode && Object.values(StudyMode).includes(updateData.defaultStudyMode)) {
      validatedData.defaultStudyMode = updateData.defaultStudyMode;
    }
    if (typeof updateData.showPhonetics === 'boolean') {
      validatedData.showPhonetics = updateData.showPhonetics;
    }
    if (typeof updateData.showTranslation === 'boolean') {
      validatedData.showTranslation = updateData.showTranslation;
    }
    if (typeof updateData.enableNotifications === 'boolean') {
      validatedData.enableNotifications = updateData.enableNotifications;
    }

    // Objectifs personnalisés
    if (updateData.dailyReadingGoal && updateData.dailyReadingGoal >= 1 && updateData.dailyReadingGoal <= 100) {
      validatedData.dailyReadingGoal = updateData.dailyReadingGoal;
    }
    if (updateData.dailyMemorizationGoal && updateData.dailyMemorizationGoal >= 1 && updateData.dailyMemorizationGoal <= 20) {
      validatedData.dailyMemorizationGoal = updateData.dailyMemorizationGoal;
    }
    if (updateData.weeklyStudyTimeGoal && updateData.weeklyStudyTimeGoal >= 30 && updateData.weeklyStudyTimeGoal <= 2000) {
      validatedData.weeklyStudyTimeGoal = updateData.weeklyStudyTimeGoal;
    }

    // Paramètres de rappel
    if (updateData.reminderTime && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updateData.reminderTime)) {
      validatedData.reminderTime = updateData.reminderTime;
    }
    if (updateData.studyDaysOfWeek && Array.isArray(updateData.studyDaysOfWeek)) {
      const validDays = updateData.studyDaysOfWeek.filter((day: number) => day >= 0 && day <= 6);
      if (validDays.length > 0) {
        validatedData.studyDaysOfWeek = validDays;
      }
    }

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: decoded.userId },
      update: validatedData,
      create: { userId: decoded.userId, ...validatedData },
    });

    return NextResponse.json({
      message: 'Préférences mises à jour',
      preferences,
    });

  } catch (error) {
    console.error('Erreur mise à jour préférences:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Réinitialiser les préférences aux valeurs par défaut
export async function DELETE(req: NextRequest) {
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

    // Supprimer les préférences existantes et en créer de nouvelles avec les valeurs par défaut
    await prisma.userPreferences.deleteMany({
      where: { userId: decoded.userId },
    });

    const preferences = await prisma.userPreferences.create({
      data: { userId: decoded.userId },
    });

    return NextResponse.json({
      message: 'Préférences réinitialisées',
      preferences,
    });

  } catch (error) {
    console.error('Erreur réinitialisation préférences:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}