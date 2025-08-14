"use client";

import { hadithsEdifiants } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import Link from 'next/link';

export default function HadithsPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Grouper les hadiths par thème
  const themes = [...new Set(hadithsEdifiants.map(hadith => hadith.theme))];

  const filteredHadiths = selectedTheme 
    ? hadithsEdifiants.filter(hadith => hadith.theme === selectedTheme)
    : hadithsEdifiants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full mb-6 text-3xl">
            🕌
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hadiths Édifiants
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Paroles prophétiques inspirantes pour nourrir l&apos;âme et guider la conduite
          </p>
        </div>

        {/* Filtres par thème */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Choisir un thème :
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedTheme(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedTheme === null
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-600'
              }`}
            >
              Tous les hadiths ({hadithsEdifiants.length})
            </button>
            {themes.map((theme) => {
              const count = hadithsEdifiants.filter(h => h.theme === theme).length;
              return (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedTheme === theme
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {theme} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille de cartes pour sélectionner les hadiths */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredHadiths.map((hadith) => (
            <Link key={hadith.id} href={`/adoration/hadiths/${hadith.slug}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border-l-4 border-l-amber-500 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                    {hadith.titre}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
                      {hadith.theme}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hadith.degre_authenticite === 'sahih' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {hadith.degre_authenticite}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {hadith.lecon}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Par {hadith.narrateur}</span>
                    <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Lire →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredHadiths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun hadith trouvé pour ce thème.
            </p>
          </div>
        )}

        {/* Section éducative */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📚 Comprendre les Hadiths
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">Authentification</h4>
              <p className="text-sm">
                Chaque hadith est vérifié selon les critères rigoureux de la science du hadith.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Application pratique</h4>
              <p className="text-sm">
                Les enseignements prophétiques offrent des guidance concrètes pour notre quotidien.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
