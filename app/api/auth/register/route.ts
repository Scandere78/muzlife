import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();
    if (!email || !name || !password) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Format email invalide" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        stats: {
          create: {
            totalQuizzes: 0,
            totalPoints: 0,
            averageScore: 0,
            streakRecord: 0,
          },
        },
      },
      include: { stats: true },
    });
    return NextResponse.json({
      message: "Compte créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2010"
    ) {
      return NextResponse.json({ message: "Erreur de connexion à la base de données", error: "Service temporairement indisponible" }, { status: 503 });
    }
    return NextResponse.json({
      message: "Erreur serveur",
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? (error as Error).message
          : "Erreur interne",
    }, { status: 500 });
  }
}
