
"use client";
import React from 'react';
import PrayerTimes from '@/components/PrayerTimes';
import PrayerTimer from '@/components/PrayerTimer';



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
    <div className="min-h-screen w-full flex flex-col items-center justify-center" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in duration-700">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg tracking-tight">Horaires de Prière</h1>
            <p className="text-lg text-foreground max-w-xl mx-auto mb-2">Consultez les horaires de prière pour votre ville avec précision. Trouvez facilement les temps de Fajr, Dhuhr, Asr, Maghrib et Isha.</p>
          </div>
        </div>
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          <PrayerTimer />
          <PrayerTimes />
        </div>
        <div className="mt-10 animate-in fade-in duration-700">
          <div className="bg-gradient-to-br from-indigo-100 via-white to-yellow-100 rounded-2xl shadow-2xl border border-indigo-200 p-8 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">À propos des horaires</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>Les horaires sont calculés selon la méthode de l&apos;Université Musulmane d&apos;Umm Al-Qura (Makkah) qui est largement utilisée dans le monde musulman.</p>
                  <p>Les calculs prennent en compte la position géographique, la latitude, la longitude et les ajustements saisonniers.</p>
                  <p>Les horaires sont mis à jour automatiquement et sont précis pour la plupart des villes du monde.</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Les cinq prières</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between items-center rounded-xl bg-blue-50 px-3 py-2 shadow-sm border border-blue-200 mb-2">
                    <span className="font-semibold text-blue-700">Fajr</span>
                    <span className="text-blue-500">Avant le lever du soleil</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-yellow-50 px-3 py-2 shadow-sm border border-yellow-200 mb-2">
                    <span className="font-semibold text-yellow-700">Dhuhr</span>
                    <span className="text-yellow-500">Après le zénith</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-orange-50 px-3 py-2 shadow-sm border border-orange-200 mb-2">
                    <span className="font-semibold text-orange-700">Asr</span>
                    <span className="text-orange-500">Mi-après-midi</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-purple-50 px-3 py-2 shadow-sm border border-purple-200 mb-2">
                    <span className="font-semibold text-purple-700">Maghrib</span>
                    <span className="text-purple-500">Après le coucher du soleil</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-indigo-50 px-3 py-2 shadow-sm border border-indigo-200 mb-2">
                    <span className="font-semibold text-indigo-700">Isha</span>
                    <span className="text-indigo-500">Après la disparition du crépuscule</span>
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