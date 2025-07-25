import { slugToNumber } from '../../../lib/sourateSlugs';
import { Metadata } from 'next';
import SourateDetail from '../../../components/SourateDetail';

// Typage pour Next.js App Router
interface PageParams {
  params: Promise<{ slug: string }>
}

// Fonction pour récupérer les données de la sourate
async function fetchSourateData(num: number) {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`, {
      next: { revalidate: 3600 } // Cache 1 heure
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération de la sourate');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

// Fonction pour récupérer la traduction
async function fetchTranslation(num: number) {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${num}/fr.hamidullah`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération de la traduction');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

// Génération des métadonnées
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const num = slugToNumber(slug);
  
  if (!num) {
    return {
      title: 'Sourate non trouvée - MuzLife',
      description: 'La sourate demandée n\'existe pas.'
    };
  }

  const sourateData = await fetchSourateData(num);
  const sourate = sourateData?.data;

  return {
    title: `${sourate?.name || 'Sourate'} - MuzLife`,
    description: `Écoutez la récitation de ${sourate?.name || 'cette sourate'} par Sheikh Alafasy sur MuzLife.`,
  };
}

export default async function SouratePage({ params }: PageParams) {
  const { slug } = await params;
  const num = slugToNumber(slug);
  
  if (!num) {
    return (
      <main className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-6">
          <a href="/ecoute" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-medium transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </a>
        </div>
        <div className="text-red-500 text-lg font-semibold">Sourate inconnue.</div>
      </main>
    );
  }

  const [sourateData, translationData] = await Promise.all([
    fetchSourateData(num),
    fetchTranslation(num)
  ]);

  const sourate = sourateData?.data;
  const translation = translationData?.data;

  if (!sourate) {
    return (
      <main className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-6">
          <a href="/ecoute" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-muted)] hover:scale-105 text-white font-medium transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="var(--color-muted)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </a>
        </div>
        <div className="text-red-500 text-lg font-semibold">Erreur lors du chargement de la sourate.</div>
      </main>
    );
  }

  return <SourateDetail sourate={sourate} translation={translation} />;
}