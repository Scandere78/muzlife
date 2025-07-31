'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import '../styles/globals.css';

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

// Configuration des prières avec leurs noms
const prayerConfig = {
  Fajr: { name: 'Fajr (Aube)', icon: '🌅' },
  Sunrise: { name: 'Lever du soleil', icon: '☀️' },
  Dhuhr: { name: 'Dhuhr (Midi)', icon: '☀️' },
  Asr: { name: 'Asr (Après-midi)', icon: '☀️' },
  Sunset: { name: 'Coucher du soleil', icon: '🌇' },
  Maghrib: { name: 'Maghrib (Soir)', icon: '🌆' },
  Isha: { name: 'Isha (Nuit)', icon: '🌙' },
};

// Fonction pour calculer le temps restant jusqu'à la prochaine prière
function getTimeUntilNextPrayer(timings: PrayerTimes): { nextPrayer: string; timeRemaining: string } {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
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
    const prayerMinutes = hours * 60 + minutes;
    let diff = prayerMinutes - currentTime;
    
    // Si la prière est déjà passée aujourd'hui, on passe à la suivante
    if (diff < 0) {
      diff += 24 * 60; // Ajouter 24 heures
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      nextPrayer = prayer.name;
    }
  }
  
  const hours = Math.floor(minDiff / 60);
  const minutes = minDiff % 60;
  const timeRemaining = `${hours}h ${minutes}m`;
  
  return { nextPrayer, timeRemaining };
}

export default function NextPrayer() {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<{ nextPrayer: string; timeRemaining: string } | null>(null);

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

  // Mettre à jour le temps restant toutes les minutes
  useEffect(() => {
    if (prayerData) {
      const updateTimeUntilNext = () => {
        const result = getTimeUntilNextPrayer(prayerData.timings);
        setTimeUntilNext(result);
      };
      
      updateTimeUntilNext();
      const interval = setInterval(updateTimeUntilNext, 60000); // Mise à jour toutes les minutes
      
      return () => clearInterval(interval);
    }
  }, [prayerData]);

  // Charger les horaires au montage du composant
  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  if (loading) {
    return (
      <Card className="border-primary/20 bg-[var(--color-muted)]/60 text-[var(--color-foreground)]">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement des horaires...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!timeUntilNext || !prayerData) {
    return null;
  }

  const nextPrayerConfig = prayerConfig[timeUntilNext.nextPrayer as keyof typeof prayerConfig];

  return (
    <Card className="border-primary/20 bg-[var(--color-muted)]/60 text-[var(--color-foreground)]">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-[var(--color-accent)]" />
            <h3 className="text-lg font-semibold">Prochaine Prière</h3>
          </div>
          <div className="text-2xl font-bold text-[var(--color-accent)] mb-2">
            {nextPrayerConfig?.icon} {nextPrayerConfig?.name}
          </div>
          {/* <div className="text-sm text-[var(--color-foreground)] font-bold">
            Dans {timeUntilNext.timeRemaining}
          </div> */}
          <div className="text-xs text-[var(--color-foreground)] font-bold mt-2">
            {prayerData.date.gregorian.weekday.en}, {prayerData.date.gregorian.date}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 