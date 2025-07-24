



import Link from "next/link";
import type { Metadata } from "next";


type ApiAyah = {
  text: string;
  numberInSurah: number;
  translation: string;
};

type ApiSourate = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  ayahs: ApiAyah[];
};

// Récupère le texte arabe et la traduction française d'une sourate via l'API alquran.cloud
async function fetchSourateWithTranslation(id: string): Promise<ApiSourate | null> {
  const num = Number(id);
  if (isNaN(num) || num < 1 || num > 114) return null;
  // API Quran.com (texte arabe)
  const resAr = await fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`, { next: { revalidate: 3600 } });
  // API Quran.com (traduction française)
  const resFr = await fetch(`https://api.alquran.cloud/v1/surah/${num}/fr.hamidullah`, { next: { revalidate: 3600 } });
  if (!resAr.ok || !resFr.ok) return null;
  const dataAr = await resAr.json();
  const dataFr = await resFr.json();
  // Fusionne arabe + traduction
  type AyahApiResponse = { text: string; numberInSurah: number };
  const ayahs: ApiAyah[] = (dataAr.data.ayahs as AyahApiResponse[]).map((ayah, idx) => ({
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
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


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const sourate = await fetchSourateWithTranslation(params.id);
  return {
    title: sourate ? `${sourate.englishName} - Sourate ${sourate.number} | MuzLife` : "Sourate inconnue | MuzLife",
    description: sourate ? `Détail de la sourate ${sourate.englishName} (${sourate.name})` : "Détail d'une sourate du Coran sur MuzLife."
  };
}



// Correction du typage pour Next.js 15+ (App Router)
interface PageParams {
  params: { id: string }
}

export default async function SouratePage({ params }: PageParams) {
  const sourate = await fetchSourateWithTranslation(params.id);
  if (!sourate) {
    return (
      <main className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-6">
          <Link href="/lecture" className="inline-flex items-center px-4 py-2 rounded-full bg-green-700 hover:bg-green-600 text-white font-medium text-base transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </Link>
        </div>
        <div className="text-red-500 text-lg font-semibold">Impossible de charger la sourate. Veuillez réessayer plus tard.</div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/lecture" className="inline-flex items-center px-4 py-2 rounded-full bg-green-700 hover:bg-green-600 text-white font-medium text-base transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-green-600 mb-2">{sourate.name}</h1>
      <div className="text-gray-400 mb-4">Sourate n°{sourate.number} • {sourate.englishName} • {sourate.englishNameTranslation}</div>
      <div className="bg-black/30 rounded-xl p-6 text-gray-100 text-2xl leading-loose text-right font-quran mb-6">
        {sourate.ayahs.map((ayah) => (
          <div key={ayah.numberInSurah} className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className="block text-2xl md:text-3xl text-right font-quran">{ayah.text}</span>
              <span className="text-green-400 text-lg align-super ml-2">({ayah.numberInSurah})</span>
            </div>
            <div className="text-base text-left text-green-200 mt-2 font-sans">{ayah.translation}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
