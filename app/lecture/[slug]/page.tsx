import type { Metadata } from "next";
import { Suspense } from "react";
import { slugToNumber } from "../../../lib/sourateSlugs";
import StudyPageWithAuth from "../../../components/study/StudyPageWithAuth";

// Récupère le texte arabe, la translittération (lecture phonétique) et la traduction française d'une sourate via l'API alquran.cloud
async function fetchSourateWithTranslation(id: string): Promise<any | null> {
  const num = Number(id);
  if (isNaN(num) || num < 1 || num > 114) return null;
  const [resAr, resFr, resTr] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`, { next: { revalidate: 3600 } }),
    fetch(`https://api.alquran.cloud/v1/surah/${num}/fr.hamidullah`, { next: { revalidate: 3600 } }),
    // Translittération en alphabet latin pour faciliter la prononciation
    fetch(`https://api.alquran.cloud/v1/surah/${num}/en.transliteration`, { next: { revalidate: 3600 } })
  ]);
  if (!resAr.ok || !resFr.ok) return null;
  const [dataAr, dataFr, dataTr] = await Promise.all([
    resAr.json(),
    resFr.json(),
    resTr.ok ? resTr.json() : Promise.resolve(null)
  ]);
  const ayahs = (dataAr.data.ayahs).map((ayah: any, idx: number) => ({
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    transliteration: dataTr?.data?.ayahs?.[idx]?.text || undefined,
    translation: dataFr.data.ayahs[idx]?.text || ""
  }));
  return {
    number: dataAr.data.number,
    name: dataAr.data.name,
    englishName: dataAr.data.englishName,
    englishNameTranslation: dataAr.data.englishNameTranslation,
    ayahs
  };
}

// Fonction pour récupérer les métadonnées côté serveur
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const num = slugToNumber(slug);
  const sourate = num ? await fetchSourateWithTranslation(num.toString()) : null;
  return {
    title: sourate ? `${sourate.englishName} - Sourate ${sourate.number} | MuzLife` : "Sourate inconnue | MuzLife",
    description: sourate ? `Étude interactive de la sourate ${sourate.englishName} (${sourate.name}) avec progression personnalisée` : "Étude interactive du Coran sur MuzLife."
  };
}

interface PageParams {
  params: Promise<{ slug: string }>
}

// Composant skeleton pour le chargement
function SouratePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* Controls skeleton */}
        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
        </div>

        {/* Verses skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-4/5 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function SourateContent({ slug }: { slug: string }) {
  const num = slugToNumber(slug);
  const sourate = num ? await fetchSourateWithTranslation(num.toString()) : null;
  return <StudyPageWithAuth sourate={sourate} surahNumber={num || 0} />;
}

export default async function SouratePage({ params }: PageParams) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<SouratePageSkeleton />}>
      <SourateContent slug={slug} />
    </Suspense>
  );
} 