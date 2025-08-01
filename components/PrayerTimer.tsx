'use client';

import React, { useState, useEffect } from 'react';

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
      weekday: {
        en: string;
      };
      month: {
        en: string;
      };
      year: string;
    };
    hijri: {
      date: string;
      month: {
        en: string;
      };
      year: string;
    };
  };
  meta: {
    timezone: string;
    method: {
      name: string;
    };
  };
}

// Configuration des prières avec leurs noms et icônes
const prayerConfig = {
  Fajr: { name: 'Fajr', icon: '🌅', fullName: 'Fajr (Aube)' },
  Sunrise: { name: 'Sunrise', icon: '☀️', fullName: 'Lever du soleil' },
  Dhuhr: { name: 'Dhuhr', icon: '☀️', fullName: 'Dhuhr (Midi)' },
  Asr: { name: 'Asr', icon: '☀️', fullName: 'Asr (Après-midi)' },
  Sunset: { name: 'Sunset', icon: '🌇', fullName: 'Coucher du soleil' },
  Maghrib: { name: 'Maghrib', icon: '🌆', fullName: 'Maghrib (Soir)' },
  Isha: { name: 'Isha', icon: '🌙', fullName: 'Isha (Nuit)' },
};

// Fonction pour calculer le temps restant jusqu'à la prochaine prière
function getTimeUntilNextPrayer(timings: PrayerTimes): { nextPrayer: string; timeRemaining: string; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  
  const prayerTimes = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Sunrise', time: timings.Sunrise },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];
  
  let nextPrayer = '';
  let minDiff = Infinity;
  
  for (const prayer of prayerTimes) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTimeInSeconds = hours * 3600 + minutes * 60;
    let diff = prayerTimeInSeconds - currentTimeInSeconds;
    
    // Si la prière est déjà passée aujourd'hui, on passe à la suivante
    if (diff < 0) {
      diff += 24 * 3600; // Ajouter 24 heures en secondes
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      nextPrayer = prayer.name;
    }
  }
  
  const hours = Math.floor(minDiff / 3600);
  const minutes = Math.floor((minDiff % 3600) / 60);
  const seconds = minDiff % 60;
  
  return { 
    nextPrayer, 
    timeRemaining: `${hours}h ${minutes}m ${seconds}s`,
    hours,
    minutes,
    seconds
  };
}

export default function PrayerTimer() {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<{ nextPrayer: string; timeRemaining: string; hours: number; minutes: number; seconds: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fonction pour récupérer les horaires de prière depuis l'API Aladhan
  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Utiliser Paris par défaut
      const url = `https://api.aladhan.com/v1/timingsByCity?city=Paris&country=France&method=2`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.data || 'Erreur lors de la récupération des horaires');
      }
      const data = await response.json();
      setPrayerData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le temps restant toutes les secondes
  useEffect(() => {
    if (prayerData) {
      const updateTimeUntilNext = () => {
        const result = getTimeUntilNextPrayer(prayerData.timings);
        setTimeUntilNext(result);
        setCurrentTime(new Date());
      };
      
      updateTimeUntilNext();
      const interval = setInterval(updateTimeUntilNext, 1000); // Mise à jour toutes les secondes
      
      return () => clearInterval(interval);
    }
  }, [prayerData]);

  // Charger les horaires au montage du composant
  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto mb-6 flex justify-center">
        <div
          className="relative rounded-full shadow-xl p-6 flex flex-col items-center w-70 h-70 bg-white/80"
          style={{
            backgroundImage: 'url(/cadrant_horloge_vert.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <span className="text-sm text-white font-semibold">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !timeUntilNext || !prayerData) {
    return (
      <div className="mx-auto mb-6 flex justify-center">
        <div
          className="relative rounded-full shadow-xl p-6 flex flex-col items-center w-70 h-70 bg-white/80"
          style={{
            backgroundImage: 'url(/cadrant_horloge_vert.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-center px-4 py-2 rounded-full bg-white/90 border border-indigo-200 shadow">
              <span className="text-sm text-red-600">Erreur de chargement</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const nextPrayerConfig = prayerConfig[timeUntilNext.nextPrayer as keyof typeof prayerConfig];

  return (
    <div className="mx-auto mb-6 flex justify-center">
      <div
        className="relative rounded-full shadow-xl p-6 flex flex-col items-center w-70 h-70 bg-white/80"
        style={{
          backgroundImage: 'url(/cadrant_horloge_vert.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            {/* Timer principal */}
            <div className="font-extrabold text-xl drop-shadow-lg text-center px-4 py-2 rounded-full bg-white/90 border border-indigo-200 shadow mb-2">
              <span style={{ color: 'var(--color-foreground)' }}>
                {timeUntilNext.hours.toString().padStart(2, '0')}
              </span>
              <span className="mx-1" style={{ color: 'var(--color-foreground)' }}>:</span>
              <span style={{ color: 'var(--color-foreground)' }}>
                {timeUntilNext.minutes.toString().padStart(2, '0')}
              </span>
              <span className="mx-1" style={{ color: 'var(--color-foreground)' }}>:</span>
              <span style={{ color: 'var(--color-foreground)' }}>
                {timeUntilNext.seconds.toString().padStart(2, '0')}
              </span>
            </div>
            
            {/* Nom de la prochaine prière */}
            <div className="text-sm font-semibold text-white px-2 rounded shadow bg-black/50">
              {nextPrayerConfig?.icon} {nextPrayerConfig?.fullName}
            </div>
          </div>
        </div>
        
        {/* Label en bas */}
        
      </div>
    </div>
  );
} 