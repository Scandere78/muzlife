import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, category = 'general' } = body;

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Récupération des informations de la requête
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Vérifier si l'utilisateur existe (par email)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    // Créer le ticket
    const ticket = await prisma.ticket.create({
      data: {
        userId: existingUser?.id || null,
        name,
        email,
        subject,
        message,
        category,
        priority: 'medium',
        status: 'open',
        ipAddress,
        userAgent
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès',
      ticketId: ticket.id
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}