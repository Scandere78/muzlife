"use client";
import React from 'react';
import type { Metadata } from 'next';
import PrayerTimes from '@/components/PrayerTimes';


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
  // Horloge analogique décorative
  function AnalogClock() {
    const [date, setDate] = React.useState(new Date());
    React.useEffect(() => {
      const timer = setInterval(() => setDate(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const hourDeg = (hours + minutes / 60) * 30;
    const minDeg = minutes * 6;
    const secDeg = seconds * 6;
    return (
      <div className="mx-auto mb-6 flex justify-center">
        <div
          className="relative rounded-full shadow-xl p-6 flex flex-col items-center w-56 h-56 bg-white/80"
          style={{
            backgroundImage: 'url(/caligraphie.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span
              className="font-extrabold text-3xl drop-shadow-lg text-center px-4 py-2 rounded-full bg-white/90 border border-indigo-200 shadow"
            >
              <span style={{ color: '#A3B18A' }}>{date.getHours().toString().padStart(2, '0')}</span>
              <span className="mx-1" style={{ color: '#E9C46A' }}>:</span>
              <span style={{ color: '#E9C46A' }}>{date.getMinutes().toString().padStart(2, '0')}</span>
              <span className="mx-1" style={{ color: '#90AFC5' }}>:</span>
              <span style={{ color: '#90AFC5' }}>{date.getSeconds().toString().padStart(2, '0')}</span>
            </span>
          </div>
          <div className="absolute bottom-4 left-1/2 z-30" style={{ transform: 'translateX(-50%)' }}>
            <span className="text-sm text-indigo-600 font-semibold tracking-wide bg-white/80 px-2 rounded shadow">Heure locale</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in duration-700">
          <AnalogClock />
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 drop-shadow-lg tracking-tight">Horaires de Prière</h1>
            <p className="text-lg text-gray-700 max-w-xl mx-auto mb-2">Consultez les horaires de prière pour votre ville avec précision. Trouvez facilement les temps de Fajr, Dhuhr, Asr, Maghrib et Isha.</p>
          </div>
        </div>
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          <PrayerTimes />
        </div>
        <div className="mt-10 animate-in fade-in duration-700">
          <div className="bg-gradient-to-br from-indigo-100 via-white to-yellow-100 rounded-2xl shadow-2xl border border-indigo-200 p-8 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">À propos des horaires</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>Les horaires sont calculés selon la méthode de l'Université Musulmane d'Umm Al-Qura (Makkah) qui est largement utilisée dans le monde musulman.</p>
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
