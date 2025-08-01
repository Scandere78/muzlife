'use client';

import React, { useEffect, useState } from 'react';
import LottieAnimation from './LottieAnimation';
import walkingPersonAnimation from '../public/animations/walking_person.json';
import dogWalkingAnimation from '../public/animations/dog_walking.json';

// Interface pour les horaires de prière
interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABELS: Record<string, string> = {
  Fajr: 'Fajr',
  Sunrise: 'Lever',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};
const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌅',
  Sunrise: '☀️',
  Dhuhr: '🏙️',
  Asr: '🌇',
  Maghrib: '🌆',
  Isha: '🌙',
};

// Utilitaire pour convertir HH:MM en secondes depuis minuit
function timeToSeconds(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 3600 + m * 60;
}

// Récupère les horaires de prière pour Paris (comme PrayerTimer)
async function fetchPrayerTimes(): Promise<PrayerTimes | null> {
  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=Paris&country=France&method=2`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      Fajr: data.data.timings.Fajr,
      Sunrise: data.data.timings.Sunrise,
      Dhuhr: data.data.timings.Dhuhr,
      Asr: data.data.timings.Asr,
      Maghrib: data.data.timings.Maghrib,
      Isha: data.data.timings.Isha,
    };
  } catch {
    return null;
  }
}

export default function PrayerProgressBar() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [now, setNow] = useState(new Date());

  // Récupérer les horaires au chargement
  useEffect(() => {
    fetchPrayerTimes().then(setPrayerTimes);
  }, []);

  // Mettre à jour l'heure locale chaque seconde
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!prayerTimes) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="text-[var(--color-accent)]">Chargement...</div>
      </div>
    );
  }

  // Calculer la position du bonhomme
  // 1. Convertir chaque horaire de prière en secondes depuis minuit
  const checkpoints = PRAYER_ORDER.map((prayer) => ({
    name: prayer,
    seconds: timeToSeconds(prayerTimes[prayer as keyof PrayerTimes]),
  }));

  // 2. Heure actuelle en secondes depuis minuit
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // 3. Trouver le segment courant (entre quelles prières on est)
  let segmentStart = checkpoints[0].seconds;
  let segmentEnd = checkpoints[checkpoints.length - 1].seconds;
  let segmentIdx = 0;
  
  // Vérifier si on est après la dernière prière (Isha) - réinitialiser pour le lendemain
  const isAfterLastPrayer = nowSeconds >= checkpoints[checkpoints.length - 1].seconds;
  
  if (isAfterLastPrayer) {
    // Réinitialiser pour le lendemain - commencer depuis le début
    segmentStart = 0;
    segmentEnd = checkpoints[0].seconds;
    segmentIdx = -1; // Indique qu'on est avant la première prière
  } else {
    // Chercher le segment courant normalement
    for (let i = 0; i < checkpoints.length - 1; i++) {
      if (nowSeconds >= checkpoints[i].seconds && nowSeconds < checkpoints[i + 1].seconds) {
        segmentStart = checkpoints[i].seconds;
        segmentEnd = checkpoints[i + 1].seconds;
        segmentIdx = i;
        break;
      }
    }
  }

  // 4. Calculer la position du bonhomme (en pourcentage de la barre)
  let progress = 0;
  
  if (isAfterLastPrayer) {
    // Après la dernière prière, réinitialiser à 0% pour le lendemain
    progress = 0;
  } else if (nowSeconds <= checkpoints[0].seconds) {
    // Avant la première prière
    progress = 0;
  } else {
    // Position entre les checkpoints
    const segmentProgress = (nowSeconds - segmentStart) / (segmentEnd - segmentStart);
    progress = ((segmentIdx + segmentProgress) / (checkpoints.length - 1)) * 100;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="relative h-16 flex items-center">
        {/* Barre de fond (vide) */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 bg-gray-200/30 rounded-full backdrop-blur-sm" />
        
        {/* Liquide lumineux vert qui remplit jusqu'au bonhomme */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
          }}
        >
        </div>

        {/* Checkpoints avec effet de brillance */}
        {checkpoints.map((cp, idx) => {
          // Déterminer si cette prière est passée
          const prayerSeconds = timeToSeconds(prayerTimes[cp.name as keyof PrayerTimes]);
          let isPassed = nowSeconds >= prayerSeconds;
          
          // Si on est après la dernière prière, réinitialiser (aucune prière n'est "passée")
          if (isAfterLastPrayer) {
            isPassed = false;
          }
          
          return (
            <div
              key={cp.name}
              className="absolute top-1/2 -translate-y-1/2 z-10"
              style={{ left: `${(idx / (checkpoints.length - 1)) * 100}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span 
                    className={`text-2xl drop-shadow-lg transition-all duration-500 ${
                      isPassed ? 'opacity-70 grayscale' : 'opacity-100'
                    }`}
                  >
                    {PRAYER_ICONS[cp.name]}
                  </span>
                  {/* Effet de brillance sur l'icône seulement si pas passée */}
                  {!isPassed && (
                    <div 
                      className="absolute inset-0 text-2xl opacity-50"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {PRAYER_ICONS[cp.name]}
                    </div>
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 font-semibold drop-shadow-sm transition-all duration-500 ${
                    isPassed 
                      ? 'text-gray-400 opacity-50' 
                      : 'text-[var(--color-foreground)]'
                  }`}
                >
                  {PRAYER_LABELS[cp.name]}
                </span>
              </div>
            </div>
          );
        })}

        {/* Animation Lottie du chien qui marche sur la barre */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-out"
          style={{ left: `calc(${progress}% - 24px)` }}
        >
          <div className="relative">
            <LottieAnimation 
              animationData={dogWalkingAnimation}
              width={48}
              height={48}
              loop={true}
              autoplay={true}
              className="drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
                transform: 'translateY(-6px)' // Ajuster pour centrer sur la barre
              }}
            />
            {/* Effet de lueur autour de l'animation */}
            <div 
              className="absolute inset-0 opacity-30 blur-sm"
              style={{
                filter: 'blur(4px)',
                transform: 'translateY(-6px)' // Ajuster pour centrer sur la barre
              }}
            >
              <LottieAnimation 
                animationData={dogWalkingAnimation}
                width={48}
                height={48}
                loop={true}
                autoplay={true}
                style={{
                  opacity: 0.3
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        /* Animations supprimées pour éviter les effets de zoom */
      `}</style>
    </div>
  );
}