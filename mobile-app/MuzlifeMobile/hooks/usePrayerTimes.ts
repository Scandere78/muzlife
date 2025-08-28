import { useState, useEffect, useMemo } from 'react';
import { PrayerTimes } from '../types/api';
import { muzlifeApi } from '../services/muzlifeApi';

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimes | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  nextPrayer: string | null;
}

export function usePrayerTimes(city: string): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = async (cityToFetch?: string) => {
    // Utiliser la ville passée en paramètre ou celle du hook
    const targetCity = cityToFetch || city;
    
    if (!targetCity.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const times = await muzlifeApi.getPrayerTimes(targetCity);
      setPrayerTimes(times);
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des horaires');
    } finally {
      setLoading(false);
    }
  };

  const getNextPrayer = (): string | null => {
    if (!prayerTimes) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'fajr', time: prayerTimes.fajr },
      { name: 'sunrise', time: prayerTimes.sunrise },
      { name: 'dhuhr', time: prayerTimes.dhuhr },
      { name: 'asr', time: prayerTimes.asr },
      { name: 'maghrib', time: prayerTimes.maghrib },
      { name: 'isha', time: prayerTimes.isha },
    ];

    // Convertir les heures en minutes depuis minuit
    const prayerMinutes = prayers.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return {
        ...prayer,
        minutes: hours * 60 + minutes
      };
    });

    // Trouver la prochaine prière
    const nextPrayer = prayerMinutes.find(prayer => prayer.minutes > currentTime);
    
    // Si aucune prière trouvée aujourd'hui, retourner Fajr de demain
    return nextPrayer ? nextPrayer.name : 'fajr';
  };

  useEffect(() => {
    // Recharger les horaires quand la ville change
    fetchPrayerTimes(city);
  }, [city]);

  // Mémoriser le calcul de la prochaine prière
  const nextPrayer = useMemo(() => {
    return getNextPrayer();
  }, [prayerTimes]);

  return {
    prayerTimes,
    loading,
    error,
    refetch: fetchPrayerTimes,
    nextPrayer,
  };
}