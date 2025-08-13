import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email et code requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email déjà vérifié" },
        { status: 400 }
      );
    }

    // Vérifier si le code existe et n'a pas expiré
    if (!user.emailVerificationToken || !user.emailVerificationExpires) {
      return NextResponse.json(
        { error: "Code de vérification non trouvé. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    // Vérifier si le code n'a pas expiré
    const now = new Date();
    if (now > user.emailVerificationExpires) {
      return NextResponse.json(
        { error: "Code de vérification expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    // Vérifier si le code correspond
    if (user.emailVerificationToken !== code.toString()) {
      return NextResponse.json(
        { error: "Code de vérification invalide" },
        { status: 400 }
      );
    }

    // Marquer l'email comme vérifié et supprimer le token
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date(),
      }
    });

    // Vérifier si les statistiques utilisateur existent déjà, sinon les créer
    const existingStats = await prisma.userStats.findUnique({
      where: { userId: updatedUser.id }
    });

    if (!existingStats) {
      await prisma.userStats.create({
        data: {
          userId: updatedUser.id,
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
        }
      });
    }

    // Vérifier si les préférences utilisateur existent déjà, sinon les créer
    const existingPreferences = await prisma.userPreferences.findUnique({
      where: { userId: updatedUser.id }
    });

    if (!existingPreferences) {
      await prisma.userPreferences.create({
        data: {
          userId: updatedUser.id,
          arabicFontSize: 24,
          phoneticFontSize: 16,
          translationFontSize: 14,
          preferredLanguage: 'fr',
          preferredReciter: 'mishary',
          defaultPlaybackSpeed: 1.0,
          autoPlayNext: false,
          repeatCount: 1,
          defaultStudyMode: 'READING',
          showPhonetics: true,
          showTranslation: true,
          enableNotifications: true,
          dailyReadingGoal: 10,
          dailyMemorizationGoal: 3,
          weeklyStudyTimeGoal: 300,
          studyDaysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Tous les jours
        }
      });
    }

    return NextResponse.json(
      { 
        message: "Email vérifié avec succès",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          isEmailVerified: updatedUser.isEmailVerified,
          createdAt: updatedUser.createdAt,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}