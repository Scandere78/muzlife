import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Ajouter vérification d'authentification admin ici
    
    const { status } = await request.json();
    
    // Mettre à jour également isRead et isResolved selon le status
    const updateData: any = { status };
    
    if (status === 'read' || status === 'replied' || status === 'closed') {
      updateData.isRead = true;
    }
    
    if (status === 'closed') {
      updateData.isResolved = true;
    }
    
    const updatedSubmission = await prisma.contactMessage.update({
      where: {
        id: params.id
      },
      data: updateData
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Ajouter vérification d'authentification admin ici
    
    await prisma.contactMessage.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}