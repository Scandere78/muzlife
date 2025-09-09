import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Simuler l'ajout de la réponse en base de données
    const newResponse = {
      id: Date.now().toString(),
      message: body.message,
      isAdminResponse: body.isAdminResponse || true,
      authorName: body.authorName || 'Équipe MuzLife',
      createdAt: new Date().toISOString()
    };
    
    console.log(`Ajout de réponse au ticket ${id}:`, newResponse);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(newResponse, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réponse:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la réponse' },
      { status: 500 }
    );
  }
}