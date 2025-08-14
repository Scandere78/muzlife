'use client';

import React, { useState, useEffect } from 'react';
import PrayerProgressBar from '@/components/PrayerProgressBar';
import { useLocation } from '@/contexts/LocationContext';

// Interface pour les horaires de prière
interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

interface PrayerTimesData {
  timings: PrayerTimes;
  date: {
    readable: string;
    gregorian: {
      date: string;
      weekday: { en: string };
      month: { en: string };
      year: string;
    };
    hijri: {
      date: string;
      month: { en: string };
      year: string;
    };
  };
  meta: {
    timezone: string;
    method: { name: string };
  };
}

// Configuration des prières avec leurs noms et icônes
const prayerConfig = {
  Fajr: { name: 'Fajr', icon: '🌅', fullName: 'Fajr (Aube)' },
  Sunrise: { name: 'Sunrise', icon: '☀️', fullName: 'Lever du soleil' },
  Dhuhr: { name: 'Dhuhr', icon: '☀️', fullName: 'Dhuhr (Midi)' },
  Asr: { name: 'Asr', icon: '☀️', fullName: "Asr (Après-midi)" },
  Sunset: { name: 'Sunset', icon: '🌇', fullName: 'Coucher du soleil' },
  Maghrib: { name: 'Maghrib', icon: '🌆', fullName: 'Maghrib (Soir)' },
  Isha: { name: 'Isha', icon: '🌙', fullName: 'Isha (Nuit)' },
};

// Calcul du compte à rebours vers la prochaine prière (mise à jour par seconde)
function getTimeUntilNextPrayer(
  timings: PrayerTimes
): { nextPrayer: string; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const current = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const schedule = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Sunrise', time: timings.Sunrise },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  let nextName = '';
  let minDiff = Infinity;
  for (const item of schedule) {
    const [h, m] = item.time.split(':').map(Number);
    const target = h * 3600 + m * 60;
    let diff = target - current;
    if (diff < 0) diff += 24 * 3600; // lendemain
    if (diff < minDiff) {
      minDiff = diff;
      nextName = item.name;
    }
  }

  const hours = Math.floor(minDiff / 3600);
  const minutes = Math.floor((minDiff % 3600) / 60);
  const seconds = minDiff % 60;
  return { nextPrayer: nextName, hours, minutes, seconds };
}

export default function PrayerTimer() {
  const { preferences, loading: locationLoading } = useLocation();
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ nextPrayer: string; hours: number; minutes: number; seconds: number } | null>(null);
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(false);

  // Récupérer les horaires selon les préférences de l'utilisateur
  const fetchPrayerTimes = async () => {
    if (!preferences.city || locationLoading) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(preferences.city.name)}&country=${encodeURIComponent(preferences.city.country)}&method=2`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).data || 'Erreur lors de la récupération des horaires');
      }
      const data = await response.json();
      setPrayerData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Charger quand les préférences changent
  useEffect(() => {
    fetchPrayerTimes();
  }, [preferences.city, locationLoading]);

  // Tickers temps réel
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!prayerData) return;
    const update = () => setCountdown(getTimeUntilNextPrayer(prayerData.timings));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [prayerData]);

  // Bloquer le scroll quand la modale est ouverte
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflowY = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.isolation = 'isolate';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.documentElement.style.overflow = '';
      document.body.style.isolation = '';
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Etats d'attente / erreur
  if (loading) {
    return (
      <div className="mx-auto mb-8 flex justify-center">
        <div className="relative rounded-full shadow-xl p-1 flex flex-col items-center w-64 h-64 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      </div>
    );
  }

  if (error || !prayerData || !countdown) {
    return (
      <div className="mx-auto mb-8 flex justify-center">
        <div className="relative rounded-full shadow-xl p-1 flex flex-col items-center w-64 h-64 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-red-600 bg-white/90 px-3 py-1 rounded-full border">Erreur de chargement</span>
          </div>
        </div>
      </div>
    );
  }

  const nextCfg = prayerConfig[countdown.nextPrayer as keyof typeof prayerConfig];

  // Angles des aiguilles pour l'horloge analogique (référence page Horaires)
  const hoursAngle = ((now.getHours() % 12) * 30 + now.getMinutes() * 0.5);
  const minutesAngle = now.getMinutes() * 6;

  return (
    <>
      <div className="mx-auto mb-8 flex justify-center">
        <div
          className="relative rounded-full shadow-xl p-1 flex flex-col items-center w-64 h-64 bg-gradient-to-br from-indigo-50 via-white to-purple-50 cursor-pointer hover:scale-105 transition-all duration-500 group"
          style={{ boxShadow: '0 10px 40px -10px rgba(79, 70, 229, 0.4), inset 0 0 0 1px rgba(79, 70, 229, 0.1)' }}
          onClick={() => setOpen(true)}
        >
          {/* Contour décoratif externe */}
          <div className="absolute inset-1 rounded-full border-2 border-indigo-100/50"></div>

          {/* Fond calligraphique avec overlay */}
          <div className="absolute inset-3 rounded-full overflow-hidden z-10">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'url(/caligraphie.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'contrast(1.2) saturate(1.5)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>

          {/* Marques des heures */}
          <div className="absolute inset-3 rounded-full z-10">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const x = 50 + 45 * Math.sin(angle);
              const y = 50 - 45 * Math.cos(angle);
              return (
                <div
                  key={i}
                  className="absolute w-1.5 h-4 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full shadow-sm"
                  style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${i * 30}deg)` }}
                />
              );
            })}
            {[...Array(60)].map((_, i) => {
              if (i % 5 === 0) return null;
              const angle = (i * 6) * (Math.PI / 180);
              const x = 50 + 45 * Math.sin(angle);
              const y = 50 - 45 * Math.cos(angle);
              return (
                <div
                  key={`m-${i}`}
                  className="absolute w-0.5 h-1.5 bg-indigo-200 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                />
              );
            })}
          </div>

          {/* Cadran central */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-40 h-40 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-indigo-100 shadow-inner">
              <div className="text-center font-mono relative p-6">
                <div className="absolute inset-0 rounded-full bg-indigo-100/50 blur-xl"></div>
                <div className="relative z-10 flex flex-col gap-1">
                  {/* Compte à rebours HH:MM:SS */}
                  <div className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    {countdown.hours.toString().padStart(2, '0')}
                    <span className="animate-pulse text-indigo-500 mx-1">:</span>
                    {countdown.minutes.toString().padStart(2, '0')}
                    <span className="animate-pulse text-indigo-500 mx-1">:</span>
                    {countdown.seconds.toString().padStart(2, '0')}
                  </div>
                  {/* Prochaine prière */}
                  <div className="text-xs sm:text-sm font-semibold text-indigo-500 flex items-center justify-center gap-1">
                    <span>{nextCfg?.icon}</span>
                    <span>{nextCfg?.fullName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aiguilles */}
          <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
            <div className="relative w-full h-full">
              {/* Heures */}
              <div
                className="absolute top-1/2 left-1/2 origin-center w-1 h-14 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-full shadow-md z-10"
                style={{ transform: `translate(-50%, 0) rotate(${hoursAngle}deg)`, transformOrigin: 'bottom center' }}
              >
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-sm"></div>
              </div>
              {/* Minutes */}
              <div
                className="absolute top-1/2 left-1/2 origin-center w-0.5 h-20 bg-gradient-to-t from-purple-700 to-purple-400 rounded-full shadow-md z-20"
                style={{ transform: `translate(-50%, 0) rotate(${minutesAngle}deg)`, transformOrigin: 'bottom center' }}
              >
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-sm"></div>
              </div>
              {/* Centre */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-800 rounded-full z-30 shadow-md"></div>
            </div>
          </div>

          {/* Etiquette */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-4 py-1 rounded-full shadow-lg z-40">
            Voir progression
          </div>

          {/* Effet halo */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </div>
      </div>

      {/* Modale améliorée - réutilise le style de la page Horaires */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-0"
          onClick={() => setOpen(false)}
        >
          {/* Pattern décoratif */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
          </div>

          <div
            className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative animate-modalIn"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.4)' }}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>

            {/* En-tête */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-5 sm:p-6 rounded-t-3xl shadow-lg z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/30 to-purple-300/30"></div>
                    <span className="text-2xl sm:text-3xl">🕌</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Progression Spirituelle</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-indigo-100 text-xs sm:text-sm font-medium">Suivi en temps réel de votre parcours</p>
                    </div>
                  </div>
                </div>
                <button
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-5 sm:p-8 relative bg-gradient-to-b from-white to-indigo-50/70 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234f46e5' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                  }}
                />
              </div>
              <div className="relative z-10">
                <PrayerProgressBar />
              </div>
              <div className="mt-6 text-center">
                <div className="inline-block px-4 py-2 bg-indigo-50 rounded-full text-xs text-indigo-700 font-medium shadow-inner border border-indigo-100">
                  Actualisé en temps réel • Basé sur votre position géographique
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations locales */}
      <style jsx>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-modalIn { animation: modalIn 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}