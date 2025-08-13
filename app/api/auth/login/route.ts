import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET non défini");
      return NextResponse.json({ message: "Configuration serveur manquante" }, { status: 500 });
    }
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { stats: true },
    });
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 });
    }

    // Vérifier si l'email est vérifié
    if (!user.isEmailVerified) {
      return NextResponse.json({ 
        message: "Email non vérifié", 
        requiresVerification: true,
        email: user.email 
      }, { status: 403 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);
    return NextResponse.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2010"
    ) {
      return NextResponse.json(
        { message: "Erreur de connexion à la base de données", error: "Service temporairement indisponible" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        message: "Erreur serveur",
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? (error as Error).message
            : "Erreur interne",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await prisma.$connect();
    const result = await prisma.$runCommandRaw({ ping: 1 });
    return NextResponse.json({
      message: "API login opérationnelle",
      database: "Connecté",
      ping: result,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      {
        message: "Erreur de connexion à la base de données",
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? (error as Error).message
            : "Erreur interne",
      },
      { status: 503 }
    );
  }
}
