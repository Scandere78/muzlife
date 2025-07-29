import type { Metadata } from 'next';
import PrayerTimes from '@/components/PrayerTimes';

// Métadonnées pour le SEO
export const metadata: Metadata = {
  title: 'Horaires de Prière - MuzLife',
  description: 'Consultez les horaires de prière pour votre ville. Horaires précis pour Fajr, Dhuhr, Asr, Maghrib et Isha avec calcul automatique de la prochaine prière.',
  keywords: 'horaires prière, salat, fajr, dhuhr, asr, maghrib, isha, temps prière, islam',
  openGraph: {
    title: 'Horaires de Prière - MuzLife',
    description: 'Consultez les horaires de prière pour votre ville avec précision.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horaires de Prière - MuzLife',
    description: 'Consultez les horaires de prière pour votre ville avec précision.',
  },
};

/**
 * Page des horaires de prière
 * 
 * Cette page permet aux utilisateurs de :
 * - Rechercher les horaires de prière pour une ville spécifique
 * - Voir les horaires de toutes les prières (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * - Identifier la prochaine prière avec le temps restant
 * - Consulter les informations complémentaires (Imsak, minuit, etc.)
 * - Voir la date grégorienne et hijri
 * 
 * Fonctionnalités principales :
 * - Interface moderne et responsive
 * - Calcul automatique de la prochaine prière
 * - Mise à jour en temps réel du temps restant
 * - Support de nombreuses villes dans le monde
 * - Affichage des dates grégorienne et hijri
 */
export default function HorairesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* En-tête de la page */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Horaires de Prière
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Consultez les horaires de prière pour votre ville avec précision. 
              Trouvez facilement les temps de Fajr, Dhuhr, Asr, Maghrib et Isha.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-8">
        <PrayerTimes />
      </div>

      {/* Section d'informations */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                À propos des horaires
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Les horaires sont calculés selon la méthode de l'Université Musulmane d'Umm Al-Qura 
                  (Makkah) qui est largement utilisée dans le monde musulman.
                </p>
                <p>
                  Les calculs prennent en compte la position géographique, la latitude, 
                  la longitude et les ajustements saisonniers.
                </p>
                <p>
                  Les horaires sont mis à jour automatiquement et sont précis pour la plupart 
                  des villes du monde.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Les cinq prières
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span><strong>Fajr :</strong> Prière de l'aube</span>
                  <span className="text-blue-600">Avant le lever du soleil</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Dhuhr :</strong> Prière de midi</span>
                  <span className="text-yellow-600">Après le zénith</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Asr :</strong> Prière de l'après-midi</span>
                  <span className="text-orange-600">Mi-après-midi</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Maghrib :</strong> Prière du soir</span>
                  <span className="text-purple-600">Après le coucher du soleil</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Isha :</strong> Prière de la nuit</span>
                  <span className="text-indigo-600">Après la disparition du crépuscule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
