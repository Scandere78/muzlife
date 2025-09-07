import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        userStats: true,
        quizResults: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        readingProgress: {
          orderBy: { lastRead: 'desc' },
          take: 5
        },
        studySessions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            quizResults: true,
            readingProgress: true,
            studySessions: true,
            favoriteSurahs: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, emailVerified } = await request.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        emailVerified
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}