'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Calendar, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import CityAutocomplete from './CityAutocomplete';
import CountrySelector from './CountrySelector';
import LocationGPS from './LocationGPS';
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

// Interface pour les résultats de ville
interface CityResult {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  displayName: string;
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

// Configuration des 5 prières obligatoires avec leurs icônes et couleurs
const prayerConfig = {
  Fajr: { name: 'Fajr', icon: Sunrise, color: 'bg-black/70', textColor: 'text-black/80', description: 'Prière de l\'aube' },
  Dhuhr: { name: 'Dhuhr', icon: Sun, color: 'bg-black/70', textColor: 'text-black/80', description: 'Prière de midi' },
  Asr: { name: 'Asr', icon: Sun, color: 'bg-black/70', textColor: 'text-black/80', description: 'Prière de l\'après-midi' },
  Maghrib: { name: 'Maghrib', icon: Sunset, color: 'bg-black/70', textColor: 'text-black/80', description: 'Prière du coucher' },
  Isha: { name: 'Isha', icon: Moon, color: 'bg-black/70', textColor: 'text-black/80', description: 'Prière de la nuit' },
};

// Fonction pour formater l'heure
function formatTime(time: string): string {
  return time.substring(0, 5); // Retourne HH:MM
}

// Fonction pour calculer le temps restant jusqu'à la prochaine prière (seulement les 5 obligatoires)
function getTimeUntilNextPrayer(timings: PrayerTimes): { nextPrayer: string; timeRemaining: string } {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayerTimes = [
    { name: 'Fajr', time: timings.Fajr },
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

export default function PrayerTimes() {
  const { preferences, countries, loading: locationLoading, setCountry, setCity } = useLocation();
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<{ nextPrayer: string; timeRemaining: string } | null>(null);
  const [cityInputValue, setCityInputValue] = useState(preferences.city.name);

  // Fonction pour récupérer les horaires de prière depuis l'API Aladhan
  const fetchPrayerTimes = async () => {
    if (!preferences.city || locationLoading) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(preferences.city.name)}&country=${encodeURIComponent(preferences.city.country)}&method=2`;
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

  // Charger les horaires quand les préférences changent
  useEffect(() => {
    fetchPrayerTimes();
  }, [preferences.city, locationLoading]);

  // Gérer la sélection d'une ville
  const handleCitySelect = (selectedCityData: CityResult) => {
    const cityData = {
      name: selectedCityData.name,
      country: selectedCityData.country,
      latitude: selectedCityData.latitude,
      longitude: selectedCityData.longitude,
      displayName: selectedCityData.displayName
    };
    setCityInputValue(selectedCityData.name);
    setCity(cityData);
  };

  // Synchroniser la valeur d'entrée avec les préférences
  useEffect(() => {
    setCityInputValue(preferences.city.name);
  }, [preferences.city.name]);

  const handleCountrySelect = (selectedCountry: any) => {
    setCountry(selectedCountry);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête avec recherche améliorée */}

     {/* Informations de la ville et de la date - Design amélioré */}
      {prayerData && (
        <Card className="backdrop-blur-sm bg-white/30 dark:from-gray-800 dark:bg-white/20 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full  text-black dark:text-white bg-white/60 dark:!bg-gray-800/70">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-800 dark:text-white">
                    📍 {preferences.city.displayName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    🌍 Fuseau horaire: {prayerData.meta.timezone}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full  text-black dark:text-white bg-white/60 dark:!bg-gray-800/70">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg text-gray-800 dark:text-white">
                    📅 {prayerData.date.gregorian.weekday.en}, {prayerData.date.gregorian.date}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    🌙 {prayerData.date.hijri.date} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year} AH
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="backdrop-blur-sm bg-white/30 dark:!bg-white/30 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-full  text-black dark:text-white bg-white/60 dark:!bg-gray-800/70">
              <Clock className="h-6 w-6" />
            </div>
            <span className="bg-clip-text dark:text-white">
              Horaires de Prière
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  🌍 Pays
                </label>
                <CountrySelector
                  countries={countries}
                  selectedCountry={preferences.country}
                  onCountrySelect={handleCountrySelect}
                  className="w-full !bg-white/10 dark:!bg-gray-800/80"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 !!bg-red-600 text-gray-700 dark:text-gray-300">
                  🏙️ Ville
                </label>
                <CityAutocomplete
                  value={cityInputValue}
                  onChange={setCityInputValue}
                  onCitySelect={handleCitySelect}
                  countryFilter={preferences.country.name}
                  placeholder={`🔍 Recherchez une ville`}
                  className="w-full h-12 text-lg bg-white/50 dark:bg-gray-800/80"
                />
              </div>
            </div>
            
            {/* Bouton GPS */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                📍 Ou utilisez votre position GPS pour une localisation précise
              </p>
              <LocationGPS className="max-w-md mx-auto" />
            </div>
          </div>
          </CardContent>
      </Card>

      {/* Affichage des erreurs - Design amélioré */}
      {error && (
        <Card className="border-0 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white mb-4">
                ⚠️
              </div>
              <p className="text-red-700 dark:text-red-300 font-medium text-lg">{error}</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">Veuillez vérifier le nom de la ville et réessayer</p>
            </div>
          </CardContent>
        </Card>
      )}

     

   

      {/* Grille des horaires de prière - Design amélioré */}
      {prayerData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(prayerConfig).map(([key, config]) => {
            const Icon = config.icon;
            const time = prayerData.timings[key as keyof PrayerTimes];
            const isNextPrayer = timeUntilNext?.nextPrayer === key;
            
            return (
              <Card 
                key={key} 
                className={`group bg-white/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 overflow-hidden ${
                  isNextPrayer ? 'ring-4 ring-blue-500/50 shadow-2xl shadow-blue-500/25' : 'shadow-lg'
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-gray-800 dark:text-white">
                      {config.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {config.description}
                    </div>
                    <div className={`text-3xl font-bold ${config.textColor} transition-colors duration-200`}>
                      {formatTime(time)}
                    </div>
                    {isNextPrayer && (
                      <div className="inline-flex  bg-green-500 text-white px-3 py-2 rounded-full text-sm font-medium">
                        ⏰ Prochaine
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}