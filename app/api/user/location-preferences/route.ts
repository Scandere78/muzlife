import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

// Interface pour le payload JWT
interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Interface pour les préférences de localisation
interface LocationPreferences {
  country: {
    name: string;
    code: string;
    flag: string;
  };
  city: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    displayName: string;
  };
}

// Fonction pour extraire et valider le token JWT
async function validateToken(request: NextRequest) {
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.split(" ")[1];
  
  try {
    const payload = verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return payload;
  } catch {
    return null;
  }
}

// GET - Récupérer les préférences de localisation
export async function GET(request: NextRequest) {
  try {
    const payload = await validateToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Token invalide ou manquant" },
        { status: 401 }
      );
    }

    // Récupérer les préférences depuis la base de données
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: payload.userId },
    });

    if (!userPreferences) {
      // Retourner les valeurs par défaut si aucune préférence n'existe
      return NextResponse.json({
        country: { name: "France", code: "FR", flag: "🇫🇷" },
        city: {
          name: "Paris",
          country: "France",
          latitude: 48.8566,
          longitude: 2.3522,
          displayName: "Paris, France"
        }
      });
    }

    // Convertir les préférences stockées en format attendu
    const locationPreferences = {
      country: {
        name: userPreferences.preferredCountry || "France",
        code: userPreferences.preferredCountryCode || "FR",
        flag: userPreferences.preferredCountryFlag || "🇫🇷"
      },
      city: {
        name: userPreferences.preferredCity || "Paris",
        country: userPreferences.preferredCityCountry || "France",
        latitude: userPreferences.preferredCityLatitude || 48.8566,
        longitude: userPreferences.preferredCityLongitude || 2.3522,
        displayName: userPreferences.preferredCityDisplay || "Paris, France"
      }
    };

    return NextResponse.json(locationPreferences);
  } catch (error) {
    console.error("Erreur GET location-preferences:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les préférences de localisation
export async function PUT(request: NextRequest) {
  try {
    const payload = await validateToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Token invalide ou manquant" },
        { status: 401 }
      );
    }

    const body: LocationPreferences = await request.json();

    if (!body.country || !body.city) {
      return NextResponse.json(
        { error: "Données de localisation invalides" },
        { status: 400 }
      );
    }

    // Mettre à jour ou créer les préférences utilisateur
    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId: payload.userId },
      create: {
        userId: payload.userId,
        // Préférences de localisation
        preferredCountry: body.country.name,
        preferredCountryCode: body.country.code,
        preferredCountryFlag: body.country.flag,
        preferredCity: body.city.name,
        preferredCityCountry: body.city.country,
        preferredCityLatitude: body.city.latitude,
        preferredCityLongitude: body.city.longitude,
        preferredCityDisplay: body.city.displayName,
      },
      update: {
        // Préférences de localisation
        preferredCountry: body.country.name,
        preferredCountryCode: body.country.code,
        preferredCountryFlag: body.country.flag,
        preferredCity: body.city.name,
        preferredCityCountry: body.city.country,
        preferredCityLatitude: body.city.latitude,
        preferredCityLongitude: body.city.longitude,
        preferredCityDisplay: body.city.displayName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Préférences de localisation mises à jour"
    });
  } catch (error) {
    console.error("Erreur PUT location-preferences:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}