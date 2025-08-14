import { NextResponse } from 'next/server';
import { getAllInvocations, getAllThemes, getInvocationsByTheme } from '@/lib/invocations';

// GET /api/invocations - Récupère toutes les invocations ou par thème
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    const list = searchParams.get('list');

    if (list === 'themes') {
      // Retourne la liste des thèmes
      const themes = getAllThemes();
      return NextResponse.json({
        success: true,
        data: themes,
        count: themes.length
      });
    }

    if (theme) {
      // Retourne les invocations d'un thème spécifique
      const themeData = getInvocationsByTheme(theme);
      
      if (!themeData) {
        return NextResponse.json({
          success: false,
          error: 'Thème introuvable'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: themeData
      });
    }

    // Retourne toutes les invocations
    const invocations = getAllInvocations();
    return NextResponse.json({
      success: true,
      data: invocations,
      count: invocations.length
    });

  } catch (error) {
    console.error('Erreur API invocations:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
