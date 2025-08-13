import { redirect } from 'next/navigation';
import { slugToNumber } from '../../../lib/sourateSlugs';
import { Metadata } from 'next';

// Génération des métadonnées avant redirection
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const num = slugToNumber(slug);
  
  if (!num) {
    return {
      title: 'Sourate non trouvée - MuzLife',
      description: "La sourate demandée n'existe pas."
    };
  }

  // Récupérer les informations de base pour les métadonnées
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    const sourate = data?.data;
    
    return {
      title: `${sourate?.name || 'Sourate'} - Étude Interactive | MuzLife`,
      description: `Étudiez la sourate ${sourate?.englishName || ''} (${sourate?.name || ''}) avec audio, phonétique et traduction sur MuzLife.`,
    };
  } catch {
    return {
      title: 'Étude Interactive - MuzLife',
      description: 'Étude interactive du Coran avec progression personnalisée sur MuzLife.'
    };
  }
}

export default async function EcoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Redirection immédiate vers la page lecture unifiée
  redirect(`/lecture/${slug}`);
}