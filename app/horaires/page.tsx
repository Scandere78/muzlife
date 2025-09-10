
"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PrayerTimes from '@/components/PrayerTimes';
import PrayerTimer from '@/components/PrayerTimer';

// Interface pour les résultats de ville
interface CityResult {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;  
  displayName: string;
}

/**
 * Page des horaires de prière
 * 
 * Cette page permet aux utilisateurs de :
 * - Rechercher les horaires de prière pour une ville spécifique
 * - Voir les horaires de toutes les prières (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * - Identifier la prochaine prière avec le temps restant
 * - Consulter les informations complémentaires (Imsak, minuit, etc.)
 * - Voir la date grégorienne et hijri
 * - L'URL se met à jour automatiquement avec la ville sélectionnée
 * 
 * Fonctionnalités principales :
 * - Interface moderne et responsive
 * - Calcul automatique de la prochaine prière
 * - Mise à jour en temps réel du temps restant
 * - Support de nombreuses villes dans le monde
 * - Affichage des dates grégorienne et hijri
 * - URL partageable avec la ville sélectionnée
 */
function HorairesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [cityName, setCityName] = useState('');

  // Lire la ville depuis l'URL au chargement et rechercher automatiquement ses coordonnées
  useEffect(() => {
    const cityParam = searchParams.get('city');
    
    if (cityParam) {
      // Convertir le format URL (corbeil-cerf ou paris-20e-arrondissement) en nom normal
      const formattedCity = cityParam
        .replace(/-/g, ' ') // Remplacer les tirets par des espaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitaliser chaque mot
      
      setCityName(formattedCity);
      
      // Rechercher automatiquement la ville pour obtenir ses coordonnées
      const searchCity = async () => {
        try {
          const response = await fetch(`/api/cities/search?q=${encodeURIComponent(formattedCity)}&country=France`);
          if (response.ok) {
            const data = await response.json();
            if (data.cities && data.cities.length > 0) {
              // Prendre la première ville correspondante
              const city = data.cities[0];
              setSelectedCity({
                name: city.name,
                country: city.country || 'France',
                latitude: city.latitude,
                longitude: city.longitude,
                displayName: city.displayName || city.name
              });
            }
          }
        } catch (error) {
          console.error('Erreur lors de la recherche automatique de la ville:', error);
        }
      };
      
      searchCity();
    }
  }, [searchParams]);

  // Fonction appelée quand une ville valide est sélectionnée dans l'autocomplete
  const handleCitySelect = (city: CityResult) => {
    setSelectedCity(city);
    setCityName(city.name);
    
    // Mettre à jour l'URL avec SEULEMENT le nom de la ville
    // Format simplifié: /horaires?city=paris ou /horaires?city=corbeil-cerf
    const urlCityName = city.name
      .toLowerCase()
      .normalize("NFD") // Décomposer les accents
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces, tirets
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Éviter les tirets multiples
      .trim();
    
    const params = new URLSearchParams();
    params.set('city', urlCityName);
    
    // Utiliser replace au lieu de push pour éviter l'accumulation dans l'historique
    router.replace(`/horaires?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in duration-700">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold !text-black dark:!text-white mb-2 drop-shadow-lg tracking-tight">
              Horaires de Prière
              {cityName && (
                <span className="block text-2xl text-green-600 dark:text-green-400 mt-2">
                  📍 {cityName}
                </span>
              )}
            </h1>
            <p className="text-lg !text-black dark:!text-white max-w-xl mx-auto mb-2">
              {cityName 
                ? `Horaires précis pour ${cityName}. Temps de Fajr, Dhuhr, Asr, Maghrib et Isha.`
                : 'Consultez les horaires de prière pour votre ville avec précision. Trouvez facilement les temps de Fajr, Dhuhr, Asr, Maghrib et Isha.'
              }
            </p>
          </div>
        </div>
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          <PrayerTimer selectedCity={selectedCity} />
          <PrayerTimes 
            onCitySelect={handleCitySelect} 
            selectedCity={selectedCity}
          />
        </div>
        <div className="mt-10 animate-in fade-in duration-700">
          <div className="bg-gradient-to-br from-indigo-100 via-white to-yellow-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl shadow-2xl border border-indigo-200 dark:border-gray-600 p-8 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-white">À propos des horaires</h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <p>Les horaires sont calculés selon la méthode de l&apos;Université Musulmane d&apos;Umm Al-Qura (Makkah) qui est largement utilisée dans le monde musulman.</p>
                  <p>Les calculs prennent en compte la position géographique, la latitude, la longitude et les ajustements saisonniers.</p>
                  <p>Les horaires sont mis à jour automatiquement et sont précis pour la plupart des villes du monde.</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-white">Les cinq prières</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between items-center rounded-xl bg-blue-50 dark:bg-blue-900/30 px-3 py-2 shadow-sm border border-blue-200 dark:border-blue-700 mb-2">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Fajr</span>
                    <span className="text-blue-500 dark:text-blue-400">Avant le lever du soleil</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 shadow-sm border border-yellow-200 dark:border-yellow-700 mb-2">
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">Dhuhr</span>
                    <span className="text-yellow-500 dark:text-yellow-400">Après le zénith</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-orange-50 dark:bg-orange-900/30 px-3 py-2 shadow-sm border border-orange-200 dark:border-orange-700 mb-2">
                    <span className="font-semibold text-orange-700 dark:text-orange-300">Asr</span>
                    <span className="text-orange-500 dark:text-orange-400">Mi-après-midi</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-purple-50 dark:bg-purple-900/30 px-3 py-2 shadow-sm border border-purple-200 dark:border-purple-700 mb-2">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">Maghrib</span>
                    <span className="text-purple-500 dark:text-purple-400">Après le coucher du soleil</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 shadow-sm border border-indigo-200 dark:border-indigo-700 mb-2">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-300">Isha</span>
                    <span className="text-indigo-500 dark:text-indigo-400">Après la disparition du crépuscule</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper avec Suspense pour useSearchParams
export default function HorairesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg !text-black dark:!text-white">Chargement des horaires...</p>
        </div>
      </div>
    }>
      <HorairesContent />
    </Suspense>
  );
}